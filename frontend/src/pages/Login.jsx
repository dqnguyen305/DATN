import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom"; // Import useNavigate
import authApi from "../api/authApi";
import { getUserRole } from "../utils/auth";

function Login() {
  const token =
    localStorage.getItem("token");

  if (token) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }
  const navigate = useNavigate(); // Khởi tạo điều hướng
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res =
        await authApi.login(form);

      if (res.data.token) {

        localStorage.setItem(
          "token",
          res.data.token
        );

        alert("Đăng nhập thành công!");

        const role = getUserRole();

        if (role === "ADMIN") {

            navigate("/admin");

        } else {

            navigate("/");
        }

      } else {

        alert(res.data.message);
      }

    } catch (error) {

      console.error(error);

      alert("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Tên tài khoản</label>
            <input
              className="form-control py-2"
              name="username"
              placeholder="Nhập username..."
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Mật khẩu</label>
            <input
              className="form-control py-2"
              type="password"
              name="password"
              placeholder="Nhập password..."
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold mb-3" type="submit">
            Đăng nhập
          </button>

          <div className="text-center">
            <span className="text-muted small">Chưa có tài khoản? </span>
            <button type="button" className="btn btn-link p-0 small fw-bold" onClick={() => navigate("/register")}>
              Đăng ký tài khoản mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;