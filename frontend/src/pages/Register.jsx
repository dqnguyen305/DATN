import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import authApi from "../api/authApi";

function Register() {
  const navigate = useNavigate(); // Khởi tạo điều hướng
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.register(form);
      console.log(res.data);
      alert("Đăng ký thành công! Đang chuyển hướng sang trang đăng nhập...");
      
      // Chuyển hướng sang trang login sau khi đăng ký thành công
      navigate("/login"); 
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "650px", borderRadius: "12px" }}>
        <h2 className="text-center mb-4 fw-bold text-success">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold text-muted">Username</label>
              <input className="form-control" name="username" placeholder="Username" onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold text-muted">Mật khẩu</label>
              <input className="form-control" type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold text-muted">Email</label>
              <input className="form-control" type="email" name="email" placeholder="example@gmail.com" onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold text-muted">Họ tên</label>
              <input className="form-control" name="fullName" placeholder="Nguyễn Văn A" onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Số điện thoại</label>
            <input className="form-control" name="phone" placeholder="0912xxxxxx" onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Địa chỉ</label>
            <textarea className="form-control" name="address" rows="2" placeholder="Địa chỉ hiện tại..." onChange={handleChange} />
          </div>

          <button className="btn btn-success w-100 py-2 fw-bold mb-3" type="submit">
            Đăng ký ngay
          </button>

          <div className="text-center">
            <span className="text-muted small">Đã có tài khoản? </span>
            <button type="button" className="btn btn-link p-0 small fw-bold text-success" onClick={() => navigate("/login")}>
              Đăng nhập tại đây
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;