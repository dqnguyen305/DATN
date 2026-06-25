import pandas as pd
import requests
from sklearn.neighbors import NearestNeighbors

BEHAVIOR_URL = "http://localhost:8080/api/behaviors/export"


def load_data():
    try:
        response = requests.get(BEHAVIOR_URL, timeout=5)
        response.raise_for_status()
        return pd.DataFrame(response.json())
    except Exception as e:
        print(f"Lỗi khi tải dữ liệu: {e}")
        return pd.DataFrame()


def add_score(df):
    scores = {"VIEW": 1, "CART": 3, "BUY": 5}
    # Sử dụng .map() kết hợp với .fillna(0) sẽ nhanh hơn .apply()
    df["score"] = df["action"].map(scores).fillna(0)
    return df


def build_rating(df):
    return df.groupby(["userId", "bookId"])["score"].sum().reset_index()


def build_matrix(rating_df):
    return rating_df.pivot_table(
        index="userId", columns="bookId", values="score", fill_value=0
    )


def recommend(user_id):
    df = load_data()
    if df.empty or "action" not in df.columns:
        return []

    df = add_score(df)
    rating = build_rating(df)
    matrix = build_matrix(rating)

    if user_id not in matrix.index:
        return []

    # Cấu hình KNN Model
    n_neighbors = min(4, len(matrix))
    model = NearestNeighbors(n_neighbors=n_neighbors, metric="cosine")
    model.fit(matrix)

    # Lấy vector hành vi của user hiện tại
    user_vector = matrix.loc[[user_id]]  # Giữ nguyên định dạng DataFrame 2D
    distances, indices = model.kneighbors(user_vector)

    # Sách user hiện tại đã tương tác (score > 0)
    user_books = set(matrix.columns[matrix.loc[user_id] > 0])

    recommendations = {}

    # Duyệt qua danh sách các user tương đồng tìm được từ KNN
    for distance, idx in zip(distances[0], indices[0]):
        similar_user_id = matrix.index[idx]

        # Bỏ qua chính user đang cần gợi ý
        if similar_user_id == user_id:
            continue

        # Độ tương đồng = 1 - Khoảng cách Cosine
        similarity = 1 - distance
        similar_user_series = matrix.loc[similar_user_id]

        # Chỉ lọc những sách mà user tương đồng có tương tác (>0)
        interacted_books = similar_user_series[similar_user_series > 0]

        for book_id, score in interacted_books.items():
            if book_id in user_books:
                continue

            # Tính điểm gợi ý cộng dồn dựa trên độ tương đồng
            recommendations[book_id] = (
                recommendations.get(book_id, 0) + score * similarity
            )

    # Sắp xếp danh sách gợi ý giảm dần theo điểm số
    sorted_recommendations = sorted(
        recommendations.items(), key=lambda x: x[1], reverse=True
    )

    # Trả về top 10 ID sách gợi ý
    return [int(book_id) for book_id, _ in sorted_recommendations[:10]]


if __name__ == "__main__":
    print(recommend(4))