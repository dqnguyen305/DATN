import { useEffect, useState } from "react";
import bookApi from "../../../api/bookApi";
import { useNavigate } from "react-router-dom";

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await bookApi.getAll({
        page: 0,
        size: 100,
      });
      setBooks(res.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn chắc chắn muốn xoá?");
    if (!confirmDelete) return;

    try {
      await bookApi.deleteBook(id);
      alert("Xoá thành công");
      fetchBooks();
    } catch (error) {
      console.log(error);
      alert("Xoá thất bại");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Quản lý sách</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/books/add")}
        >
          + Thêm sách
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Giá</th>
              <th>Kho</th>
              <th width="180">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookId} className="align-middle">
                <td>{book.bookId}</td>
                <td>
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    width="70"
                    height="90"
                    style={{ objectFit: "cover" }}
                  />
                </td>
                <td>{book.title}</td>
                <td>{book.authorName}</td>
                <td className="text-danger fw-bold">
                  {Number(book.price).toLocaleString()} đ
                </td>
                <td>{book.stockQuantity}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate(`/admin/books/edit/${book.bookId}`)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(book.bookId)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBooks;