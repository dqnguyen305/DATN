import { useEffect, useState } from "react";
import bookApi from "../../../api/bookApi";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 5;

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res = await bookApi.getAll({
        page: currentPage,
        size: PAGE_SIZE,
        sort: "latest"
      });

      setBooks(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (error) {
      console.log(error);
      alert("Không thể tải danh sách sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn chắc chắn muốn xoá sách này?");
    if (!confirmDelete) return;

    try {
      await bookApi.deleteBook(id);
      alert("Xoá thành công");

      // Nếu xóa cuốn cuối của trang hiện tại thì quay về trang trước
      if (books.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchBooks();
      }
    } catch (error) {
      console.log(error);
      alert("Xoá thất bại");
    }
  };

  const getPageNumbers = () => {
    const pages = [];

    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản lý sách</h2>
          <p className="text-muted mb-0">
            Tổng cộng: <b>{totalElements}</b> sách
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/books/add")}
        >
          + Thêm sách
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm align-middle">
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
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  Chưa có sách nào.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.bookId} className="align-middle">
                  <td>{book.bookId}</td>

                  <td>
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      width="60"
                      height="80"
                      style={{
                        objectFit: "cover",
                        borderRadius: "6px"
                      }}
                    />
                  </td>

                  <td className="fw-semibold">{book.title}</td>

                  <td>{book.authorName || "-"}</td>

                  <td className="text-danger fw-bold">
                    {Number(book.price).toLocaleString("vi-VN")} đ
                  </td>

                  <td>{book.stockQuantity}</td>

                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          navigate(`/admin/books/edit/${book.bookId}`)
                        }
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <span className="text-muted">
            Trang <b>{currentPage + 1}</b> / <b>{totalPages}</b>
          </span>

          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                <button
                  type="button"
                  className="page-link"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  «
                </button>
              </li>

              {getPageNumbers().map((page) => (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages - 1 ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  »
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default AdminBooks;