import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userApi from "../../../api/userApi";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await userApi.toggleStatus(id);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // CSS inline để ép cố định kích thước 3 nút giống hệt nhau
  const buttonStyle = {
    width: "82px",
    textAlign: "center"
  };

  return (
    <div className="container py-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* TIÊU ĐỀ TRÊN BẢNG */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Quản Lý Người Dùng</h2>
          <p className="text-muted small mb-0">Danh sách thành viên và phân quyền hệ thống</p>
        </div>
        {loading && (
          <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
        )}
      </div>

      {/* BLOCK CONTAINER CHỨA BẢNG */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ tableLayout: "fixed", width: "100%" }}>
            {/* Thu bé kích thước các cột khác để nhường chỗ cho cột dữ liệu và hành động */}
            <thead className="table-light border-bottom">
              <tr>
                <th className="py-3 ps-4 text-secondary fw-semibold" style={{ width: "70px" }}>ID</th>
                <th className="py-3 text-secondary fw-semibold" style={{ width: "160px" }}>Tên người dùng</th>
                <th className="py-3 text-secondary fw-semibold">Email</th>
                <th className="py-3 text-secondary fw-semibold" style={{ width: "140px" }}>Điện thoại</th>
                <th className="py-3 text-secondary fw-semibold" style={{ width: "110px" }}>Vai trò</th>
                <th className="py-3 text-secondary fw-semibold" style={{ width: "130px" }}>Trạng thái</th>
                <th className="py-3 text-secondary fw-semibold text-center" style={{ width: "280px" }}>Hành động</th>
              </tr>
            </thead>
            
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    Đang tải danh sách thành viên...
                  </td>
                </tr>
              ) : Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.userId}>
                    {/* ID */}
                    <td className="ps-4 fw-bold text-secondary">#{user.userId}</td>
                    
                    {/* Tên người dùng - Nếu quá dài sẽ tự động thêm dấu ... gọn gàng */}
                    <td className="text-truncate fw-semibold text-dark" title={user.username}>
                      {user.username}
                    </td>
                    
                    {/* Email - Tự động co giãn theo khoảng trống còn lại */}
                    <td className="text-muted text-truncate" title={user.email}>
                      {user.email}
                    </td>
                    
                    {/* Điện thoại */}
                    <td className="text-muted fw-medium">{user.phone || "---"}</td>
                    
                    {/* Vai trò */}
                    <td>
                      <span className={`fw-bold small px-2 py-1 rounded ${
                        user.role === "ADMIN" ? "bg-danger-subtle text-danger" : "bg-light text-secondary"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    
                    {/* Trạng thái */}
                    <td>
                      {user.status === "ACTIVE" ? (
                        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-semibold border border-success-subtle d-inline-block text-center" style={{ width: "90px" }}>
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-semibold border border-danger-subtle d-inline-block text-center" style={{ width: "90px" }}>
                          Blocked
                        </span>
                      )}
                    </td>
                    
                    {/* Cột hành động: Giữ nguyên vị trí và hình dạng nút */}
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Link
                          to={`/admin/users/${user.userId}`}
                          className="btn btn-sm btn-outline-primary rounded-3 fw-semibold d-inline-block"
                          style={buttonStyle}
                        >
                          Chi tiết
                        </Link>
                        
                        <Link
                          to={`/admin/users/edit/${user.userId}`}
                          className="btn btn-sm btn-outline-warning text-dark rounded-3 fw-semibold d-inline-block"
                          style={buttonStyle}
                        >
                          Sửa
                        </Link>

                        <button
                          className={`btn btn-sm rounded-3 fw-semibold d-inline-block transition-all ${
                            user.status === "ACTIVE" 
                              ? "btn-light text-danger border-danger-subtle" 
                              : "btn-success"
                          }`}
                          onClick={() => handleToggleStatus(user.userId)}
                          style={buttonStyle}
                        >
                          {user.status === "ACTIVE" ? "Block" : "Unblock"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    Chưa có người dùng nào trong hệ thống 📝
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserList;