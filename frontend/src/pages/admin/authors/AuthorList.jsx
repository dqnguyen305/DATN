import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authorApi from "../../../api/authorApi";

function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAuthors = async () => {
    try {
      setLoading(true);

      const res = await authorApi.getAll({
        page: page,
        size: 5
      });

      setAuthors(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.error("Lỗi tải tác giả:", error);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tác giả này không?")) {
      return;
    }

    try {
      await authorApi.delete(id);

      // Nếu xóa tác giả cuối cùng ở trang hiện tại thì quay về trang trước
      if (authors.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchAuthors();
      }

      alert("Xóa tác giả thành công");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Không thể xóa tác giả");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quản lý tác giả</h2>
          <p className="text-muted mb-0">
            Danh sách tác giả
          </p>
        </div>

        <Link to="/admin/authors/add" className="btn btn-primary">
          + Thêm tác giả
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th style={{ width: "120px" }}>ID</th>
                <th>Tên tác giả</th>
                <th style={{ width: "200px" }}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Đang tải...
                  </td>
                </tr>
              ) : authors.length > 0 ? (
                authors.map((author) => (
                  <tr key={author.authorId}>
                    <td>#{author.authorId}</td>

                    <td className="fw-semibold">
                      {author.name}
                    </td>

                    <td>
                      <Link
                        to={`/admin/authors/edit/${author.authorId}`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Sửa
                      </Link>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(author.authorId)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    Chưa có tác giả nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center py-3 border-top">
            <ul className="pagination mb-0">
              <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  ‹
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${page === index ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(index)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  page === totalPages - 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages - 1}
                >
                  ›
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorList;