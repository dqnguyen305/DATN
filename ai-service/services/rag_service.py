import os

from dotenv import load_dotenv
from google import genai

from services.vector_service import search_books

load_dotenv()

client = genai.Client(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)


def rewrite_question(
        history: list,
        question: str
):

    if not history:

        return question

    history_text = ""

    for item in history:

        history_text += (
            f"{item.role}: "
            f"{item.content}\n"
        )

    prompt = f"""
Lịch sử hội thoại:

{history_text}

Câu hỏi mới:

{question}

Nếu câu hỏi mới chứa các từ:

- sách này
- cuốn này
- tác phẩm này
- quyển này
- nó
- cuốn đó
- tác phẩm đó

thì hãy thay thế bằng tên sách hoặc tác giả
được nhắc tới gần nhất trong hội thoại.

Nếu câu hỏi đã đầy đủ nghĩa
thì giữ nguyên.

Chỉ trả về câu hỏi đã được viết lại.
"""

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text.strip()

    except Exception:

        return question


def ask(
        history: list,
        question: str
):

    rewritten_question = rewrite_question(
        history,
        question
    )

    print("\nQUESTION:")
    print(question)

    print("\nREWRITTEN:")
    print(rewritten_question)

    books = search_books(
        rewritten_question
    )

    filtered_books = []

    for book in books:

        # bỏ các kết quả quá xa
        if book["score"] <= 0.65:

            filtered_books.append(
                book
            )

    if not filtered_books:

        return (
            "Tôi chưa tìm thấy thông tin "
            "phù hợp trong hệ thống."
        )

    context = ""

    for book in filtered_books:

        context += f"""
Tên sách: {book['title']}

Tác giả: {book['authorName']}

Thể loại: {book['categoryName']}

Giá: {book['price']} VNĐ

Tồn kho: {book['stockQuantity']} cuốn

Mô tả:
{book['description']}

--------------------
"""

    history_text = ""

    for item in history:

        history_text += (
            f"{item.role}: "
            f"{item.content}\n"
        )

    prompt = f"""
Bạn là chatbot tư vấn sách của BookStore.

Quy tắc:

- Chỉ sử dụng dữ liệu được cung cấp.
- Có thể tư vấn theo tác giả.
- Có thể tư vấn theo thể loại.
- Có thể tư vấn theo giá tiền.
- Có thể thông báo còn hàng hay hết hàng.
- Không được bịa thêm sách ngoài dữ liệu.
- Nếu không có thông tin thì trả lời:
"Tôi chưa tìm thấy thông tin phù hợp trong hệ thống."

Lịch sử hội thoại:

{history_text}

Dữ liệu:

{context}

Câu hỏi:

{question}
"""

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:

        print("Gemini Error:")
        print(e)

        return (
            "AI hiện đang quá tải. "
            "Vui lòng thử lại sau."
        )