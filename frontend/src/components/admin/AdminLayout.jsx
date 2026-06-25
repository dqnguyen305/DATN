import { Outlet, Link } from "react-router-dom";

function AdminLayout() {

  return (

    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        background: "#f4f6f9"
      }}
    >

      {/* SIDEBAR */}

      <div
        className="bg-dark text-white"
        style={{
          width: "260px",
          minHeight: "100vh"
        }}
      >

        <div className="p-4 border-bottom">

          <h3 className="fw-bold">
            📚 BookStore
          </h3>

          <small>
            Quản trị hệ thống
          </small>

        </div>

        <div className="p-3">

          <Link
            to="/admin"
            className="nav-link text-white py-2"
          >
            📊 Dashboard
          </Link>

          <Link
            to="/admin/books"
            className="nav-link text-white py-2"
          >
            📚 Quản lý sách
          </Link>

          <Link
            to="/admin/categories"
            className="nav-link text-white py-2"
          >
            📂 Danh mục
          </Link>

          <Link
            to="/admin/authors"
            className="nav-link text-white py-2"
          >
            ✍️ Tác giả
          </Link>

          <Link
            to="/admin/orders"
            className="nav-link text-white py-2"
          >
            📦 Đơn hàng
          </Link>

          <Link
            to="/admin/users"
            className="nav-link text-white py-2"
          >
            👥 Người dùng
          </Link>

        </div>

      </div>

      {/* CONTENT */}

      <div className="flex-grow-1">

        <div
          className="
            bg-white
            shadow-sm
            p-3
            d-flex
            justify-content-between
            align-items-center
          "
        >

          <h4 className="mb-0">
            Dashboard Quản Trị
          </h4>

          <button
            className="btn btn-danger"
            onClick={() => {

              localStorage.removeItem("token");

              window.location.href = "/login";

            }}
          >
            Đăng xuất
          </button>

        </div>

        <div className="p-4">

          <Outlet />

        </div>

      </div>

    </div>

  );
}

export default AdminLayout;