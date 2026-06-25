import {
  Link,
  useNavigate
} from "react-router-dom";

function Header() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky-top">

      <div className="container">

        <div
          className="
            d-flex
            justify-content-between
            align-items-center
            py-3
          "
        >

          <Link
            to="/"
            className="
              text-dark
              fw-bold
              fs-3
            "
            style={{
              textDecoration: "none"
            }}
          >
            📚 BookStore
          </Link>

          <div
            className="
              d-flex
              align-items-center
              gap-3
            "
          >

            <Link
              to="/"
              className="
                text-dark
                fw-medium
              "
              style={{
                textDecoration: "none"
              }}
            >
              Trang chủ
            </Link>

            <Link
              to="/cart"
              className="btn btn-dark"
            >
              🛒 Giỏ hàng
            </Link>

            <Link
              to="/orders"
              className="orders-btn"
            >
              📦 Đơn hàng
            </Link>

            <button
              onClick={handleLogout}
              className="
                btn
                btn-outline-dark
              "
            >
              Đăng xuất
            </button>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;