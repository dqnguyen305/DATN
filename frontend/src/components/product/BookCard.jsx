import { useNavigate } from "react-router-dom";

function BookCard({ book }) {

  const navigate = useNavigate();

  return (

    <div className="card h-100 shadow-sm">

      <img
        src={book.imageUrl}
        className="card-img-top"
        alt={book.title}
        style={{
          height: "300px",
          objectFit: "cover"
        }}
      />

      <div className="card-body d-flex flex-column">

        <h5 className="card-title">
          {book.title}
        </h5>

        <p className="text-muted">
          {book.authorName}
        </p>

        <h6 className="text-danger mb-3">
          {Number(book.price).toLocaleString()} đ
        </h6>

        <button
          className="btn btn-primary mt-auto"
          onClick={() => navigate(`/books/${book.bookId}`)}
        >
          Xem chi tiết
        </button>

      </div>

    </div>
  );
}

export default BookCard;