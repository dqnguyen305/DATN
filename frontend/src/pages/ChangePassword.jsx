import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import "./Profile.css";

function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: ""
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage({
      type: "",
      text: ""
    });

    if (form.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự"
      });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage({
        type: "error",
        text: "Xác nhận mật khẩu mới không khớp"
      });
      return;
    }

    setSaving(true);

    try {
      const response = await userApi.changePassword(form);

      setMessage({
        type: "success",
        text: response.data.message || "Đổi mật khẩu thành công"
      });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Sau 1.5 giây chuyển về trang tài khoản
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Không thể đổi mật khẩu"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card password-card">
        <div className="profile-header">
          <div className="profile-avatar password-avatar">🔒</div>

          <div>
            <h2>Đổi mật khẩu</h2>
            <p>Đặt mật khẩu mới để bảo vệ tài khoản của bạn</p>
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

        <form onSubmit={handleSubmit} className="password-form">
          <div className="profile-form-group">
            <label>Mật khẩu hiện tại <span>*</span></label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu hiện tại"
              required
            />
          </div>

          <div className="profile-form-group">
            <label>Mật khẩu mới <span>*</span></label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Ít nhất 6 ký tự"
              required
            />
          </div>

          <div className="profile-form-group">
            <label>Xác nhận mật khẩu mới <span>*</span></label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              required
            />
          </div>

          <div className="password-note">
            <span>ℹ️</span>
            Mật khẩu mới phải có ít nhất 6 ký tự và không được trùng mật khẩu hiện tại.
          </div>

          <div className="profile-actions password-actions">
            <button
              type="button"
              className="profile-cancel-button"
              onClick={() => navigate("/profile")}
              disabled={saving}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving ? "Đang đổi mật khẩu..." : "🔒 Xác nhận đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;