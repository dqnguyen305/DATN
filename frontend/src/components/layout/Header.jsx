import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const username = localStorage.getItem("username") || "User";
  const avatarLetter = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleGoToProfile = () => {
    setShowMenu(false);
    navigate("/profile");
  };

  const handleChangePassword = () => {
    setShowMenu(false);
    navigate("/change-password");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bookstore-header sticky-top">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="brand-logo">
            <span className="brand-icon">📚</span>
            <span>BookStore</span>
          </Link>

          <nav className="header-navigation">
            <Link to="/" className="nav-link-custom">
              Trang chủ
            </Link>

            <Link to="/cart" className="nav-cart-button">
              <span>🛒</span>
              <span>Giỏ hàng</span>
            </Link>

            <Link to="/orders" className="nav-orders-button">
              <span>📦</span>
              <span>Đơn hàng</span>
            </Link>

            <div className="user-menu-wrapper" ref={menuRef}>
              <button
                type="button"
                className="avatar-button"
                onClick={() => setShowMenu(!showMenu)}
                title="Tài khoản"
              >
                {avatarLetter}
              </button>

              {showMenu && (
                <div className="account-dropdown">
                  <div className="account-dropdown-header">
                    <div className="account-avatar-small">
                      {avatarLetter}
                    </div>
                    <div>
                      <div className="account-name">{username}</div>
                      <div className="account-text">Tài khoản của bạn</div>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <button type="button" className="dropdown-item-custom" onClick={handleGoToProfile}>
                    <span>👤</span> Quản lý tài khoản
                  </button>

                  <button type="button" className="dropdown-item-custom" onClick={handleChangePassword}>
                    <span>🔒</span> Đổi mật khẩu
                  </button>

                  <div className="dropdown-divider" />

                  <button type="button" className="dropdown-item-custom logout-item" onClick={handleLogout}>
                    <span>🚪</span> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;