import requests
import numpy as np
import faiss
import pickle

from services.embedding_service import create_embedding

BACKEND_URL = "http://localhost:8080/api/books/export"


def build_vectors():

    print("Loading books from backend...")

    books = requests.get(
        BACKEND_URL
    ).json()

    if not books:
        print("No books found")
        return

    vectors = []
    metadata = []

    print(f"Found {len(books)} books")

    for book in books:

        text = f"""
            Tên sách: {book['title']}

            Tác giả: {book['authorName']}
            Tác giả: {book['authorName']}
            Tác giả: {book['authorName']}

            Thể loại: {book['categoryName']}

            Giá: {book['price']} VNĐ

            Tồn kho: {book['stockQuantity']} cuốn

            Mô tả:
            {book['description']}
            """

        embedding = create_embedding(text)

        vectors.append(embedding)
        metadata.append(book)

        print(f"Embedded: {book['title']}")

    vectors_np = np.array(
        vectors,
        dtype=np.float32
    )

    # normalize để dùng cosine similarity
    faiss.normalize_L2(vectors_np)

    dimension = vectors_np.shape[1]

    print(
        f"Embedding dimension: {dimension}"
    )

    index = faiss.IndexFlatIP(
        dimension
    )

    index.add(vectors_np)

    faiss.write_index(
        index,
        "vectors/faiss.index"
    )

    with open(
            "vectors/metadata.pkl",
            "wb"
    ) as f:

        pickle.dump(
            metadata,
            f
        )

    print(
        f"Saved {len(metadata)} books"
    )

    print(
        "Vector database created successfully"
    )


def load_index():

    index = faiss.read_index(
        "vectors/faiss.index"
    )

    with open(
            "vectors/metadata.pkl",
            "rb"
    ) as f:

        metadata = pickle.load(f)

    return index, metadata


def search_books(question: str, k: int = 5):

    index, metadata = load_index()

    question_embedding = create_embedding(
        question
    )

    if question_embedding is None:
        return []

    query = np.array(
        [question_embedding],
        dtype=np.float32
    )

    faiss.normalize_L2(query)

    scores, ids = index.search(
        query,
        k
    )

    results = []

    for score, idx in zip(
            scores[0],
            ids[0]
    ):
        print(
            "SCORE:",
            float(score),
            "TITLE:",
            metadata[idx]["title"],
            "AUTHOR:",
            metadata[idx]["authorName"]
        )
        if idx < 0:
            continue

        results.append({
            "score": float(score),
            "bookId": metadata[idx]["bookId"],
            "title": metadata[idx]["title"],
            "description": metadata[idx]["description"],
            "authorName": metadata[idx]["authorName"],
            "categoryName": metadata[idx]["categoryName"],
            "price": metadata[idx]["price"],
            "stockQuantity": metadata[idx]["stockQuantity"]
        })

    return results