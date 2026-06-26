import { useEffect, useState } from "react";
import bookApi from "../api/bookApi";
import categoryApi from "../api/categoryApi";
import recommendationApi from "../api/recommendationApi";
import BookCard from "../components/product/BookCard";

function Home() {
  const [books, setBooks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // FETCH RECOMMENDATIONS
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchRecommendations = async () => {
      try {
        const res = await recommendationApi.getAll();
        setRecommendations(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecommendations();
  }, []);

  // FETCH BOOKS
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await bookApi.getAll({
          page,
          size: 8,
          keyword,
          categoryId
        });
        setBooks(res.data.content);
        setTotalPages(res.data.totalPages);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, [page, keyword, categoryId]);

  return (
    /* Giảm padding-top xuống pt-3 để kéo Hero lên sát Navbar hơn */
    <div className="container pt-3 pb-5">
      
      {/* HERO SECTION - Giảm margin-bottom xuống mb-3 để ép sát với Book Collection */}
      <div
        className="rounded-4 p-5 mb-3 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #1e1b18 0%, #3a312c 100%)" }}
      >
        <div className="row align-items-center">
          <div className="col-lg-7">
            <h1 className="display-4 fw-bold">
              Khám Phá Cuốn Sách Yêu Thích Của Bạn
            </h1>
            <p className="mt-3 fs-5 text-light mb-0">
              Khám phá hàng ngàn cuốn sách từ lập trình, AI, kinh doanh, tiểu thuyết và hơn thế nữa.
            </p>
          </div>
        </div>
      </div>

      {/* TOP BAR SEARCH & FILTER */}
      <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <h3 className="fw-bold mb-1">Book Collection</h3>
            <p className="text-muted mb-0">Tìm sách yêu thích của bạn</p>
          </div>

          <div className="d-flex flex-column flex-md-row gap-3" style={{ width: "100%", maxWidth: "650px" }}>
            <input
              type="text"
              className="form-control shadow-sm border-0 bg-light"
              placeholder="Tìm kiếm sách..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
            />

            <select
              className="form-select shadow-sm border-0 bg-light"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(0);
              }}
              style={{ maxWidth: "220px" }}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <div className="mb-5">
          <h3 className="fw-bold mb-4" style={{ color: "#e79796" }}>
            📚 Dành cho bạn
          </h3>
          <div className="row">
            {recommendations.map((book) => (
              <div className="col-xl-3 col-lg-4 col-md-6 mb-4" key={book.bookId}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL BOOKS */}
      <h3 className="fw-bold mb-4 text-dark">📖 Tất cả sách</h3>
      <div className="row">
        {books && books.length > 0 ? (
          books.map((book) => (
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4" key={book.bookId}>
              <BookCard book={book} />
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <h4 className="text-muted">Không tìm thấy sách 😢</h4>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <nav>
            <ul className="pagination shadow-sm">
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${page === index ? "active" : ""}`}>
                  <button
                    className="page-link px-4 py-2 fw-semibold"
                    onClick={() => setPage(index)}
                    style={{
                      backgroundColor: page === index ? "#e79796" : "#fff",
                      borderColor: page === index ? "#e79796" : "#dee2e6",
                      color: page === index ? "#fff" : "#5c4d42"
                    }}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Home;