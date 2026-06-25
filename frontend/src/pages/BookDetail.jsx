import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import bookApi from "../api/bookApi";
import cartApi from "../api/cartApi";
import reviewApi from "../api/reviewApi";

function BookDetail() {

  const { id } = useParams();

  const [book, setBook] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [averageRating, setAverageRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);

  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {

    fetchBook();

    fetchReviews();

    fetchAverageRating();

  }, [id]);

  const fetchBook = async () => {

    try {

      const res =
        await bookApi.getById(id);

      setBook(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchReviews = async () => {

    try {

      const res =
        await reviewApi.getBookReviews(id);

      setReviews(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchAverageRating = async () => {

    try {

      const res =
        await reviewApi.getAverageRating(id);

      setAverageRating(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const handleReview = async (rating) => {

    const token =
      localStorage.getItem("token");

    if (!token) {

      alert("Vui lòng đăng nhập");

      return;

    }

    try {

      await reviewApi.createReview({

        bookId: Number(id),

        rating

      });

      alert("Đánh giá thành công");

      setSelectedRating(rating);

      fetchReviews();

      fetchAverageRating();

    } catch (error) {

      console.log(error);

      alert("Đánh giá thất bại");

    }

  };

  const handleAddToCart = async () => {

    try {

      await cartApi.addToCart({

        bookId: book.bookId,

        quantity: 1

      });

      alert("Đã thêm vào giỏ hàng");

    } catch (error) {

      console.log(error);

      alert("Thêm thất bại");

    }

  };

  if (!book) {

    return (

      <div className="container mt-5">

        Loading...

      </div>

    );

  }

  return (

    <div className="container py-5">

      <div className="card border-0 shadow-lg">

        <div className="row g-0">

          <div className="col-md-5">

            <img
              src={book.imageUrl}
              alt={book.title}
              className="img-fluid h-100"
              style={{
                objectFit: "cover",
                minHeight: "550px"
              }}
            />

          </div>

          <div className="col-md-7">

            <div className="card-body p-5">

              <span className="badge bg-primary mb-3">

                {book.categoryName}

              </span>

              <h1 className="fw-bold">

                {book.title}

              </h1>

              <h5 className="text-secondary mb-3">

                ✍️ {book.authorName}

              </h5>

              <div className="mb-4">

                <span
                  className="
                    badge
                    bg-warning
                    text-dark
                    fs-6
                    px-3
                    py-2
                  "
                >
                  ⭐ {Number(averageRating).toFixed(1)} / 5
                </span>

                <span className="ms-3 text-muted">

                  ({reviews.length} đánh giá)

                </span>

              </div>

              <h2 className="text-danger fw-bold">

                {Number(book.price)
                  .toLocaleString()} đ

              </h2>

              <hr />

              <p
                className="text-muted"
                style={{
                  lineHeight: "1.8"
                }}
              >

                {book.description}

              </p>

              <div
                className="
                  bg-light
                  p-3
                  rounded
                  mt-4
                "
              >

                📦 Còn lại:

                <b>
                  {" "}
                  {book.stockQuantity}
                </b>

                {" "}sản phẩm

              </div>

              <button
                className="
                  btn
                  btn-primary
                  btn-lg
                  mt-4
                  px-5
                "
                onClick={handleAddToCart}
              >

                🛒 Thêm vào giỏ hàng

              </button>

            </div>

          </div>

        </div>

      </div>

      <div
        className="
          card
          border-0
          shadow-lg
          mt-4
        "
      >

        <div className="card-body p-4">

          <h3 className="fw-bold mb-4">

            ⭐ Đánh giá sản phẩm

          </h3>

          {localStorage.getItem("token") ? (

            <div className="mb-4">

              <p className="fw-semibold">

                Chọn số sao:

              </p>

              {[1, 2, 3, 4, 5].map((star) => (

                <span
                  key={star}
                  style={{
                    cursor: "pointer",
                    fontSize: "42px",
                    transition: "0.2s"
                  }}
                  onMouseEnter={() =>
                    setHoverRating(star)
                  }
                  onMouseLeave={() =>
                    setHoverRating(0)
                  }
                  onClick={() =>
                    handleReview(star)
                  }
                >

                  <span
                    style={{
                      color:
                        star <=
                        (hoverRating || selectedRating)
                          ? "#ffc107"
                          : "#d6d6d6"
                    }}
                  >
                    ★
                  </span>

                </span>

              ))}

            </div>

          ) : (

            <div className="alert alert-info">

              Vui lòng đăng nhập để đánh giá sản phẩm

            </div>

          )}

          <hr />

          <h5 className="mb-3">

            Tất cả đánh giá

          </h5>

          {reviews.length === 0 ? (

            <div className="text-muted">

              Chưa có đánh giá nào

            </div>

          ) : (

            reviews.map((review) => (

              <div
                key={review.reviewId}
                className="
                  border-bottom
                  pb-3
                  mb-3
                "
              >

                <div className="fw-bold">

                  {review.username}

                </div>

                <div
                  style={{
                    color: "#ffc107",
                    fontSize: "20px"
                  }}
                >

                  {"★".repeat(review.rating)}

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>

  );

}

export default BookDetail;