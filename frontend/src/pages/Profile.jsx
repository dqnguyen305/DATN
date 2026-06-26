import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import "./Profile.css";

function Profile() {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userApi.getMyProfile();

        setForm({
          username: response.data.username || "",
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || ""
        });
      } catch (error) {
        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Không thể tải thông tin tài khoản"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage({
      type: "",
      text: ""
    });

    try {
      const response = await userApi.updateMyProfile({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address
      });

      setForm({
        username: response.data.username || form.username,
        fullName: response.data.fullName || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        address: response.data.address || ""
      });

      setMessage({
        type: "success",
        text: "Cập nhật thông tin tài khoản thành công"
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Không thể cập nhật thông tin tài khoản"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Đang tải thông tin tài khoản...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {(form.username || "U").charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>Thông tin tài khoản</h2>
            <p>Cập nhật thông tin cá nhân của bạn</p>
          </div>
        </div>

        {message.text && (
          <div
            className={
              message.type === "success"
                ? "profile-alert success-alert"
                : "profile-alert error-alert"
            }
          >
            {message.type === "success" ? "✓" : "!"} {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="profile-form-grid">
            <div className="profile-form-group">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                value={form.username}
                disabled
              />
              <small>Tên đăng nhập không thể thay đổi</small>
            </div>

            <div className="profile-form-group">
              <label>Họ và tên <span>*</span></label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div className="profile-form-group">
              <label>Email <span>*</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="profile-form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="profile-form-group profile-address-group">
              <label>Địa chỉ</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
                rows="4"
              />
            </div>
          </div>

          <div className="profile-actions">
            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;