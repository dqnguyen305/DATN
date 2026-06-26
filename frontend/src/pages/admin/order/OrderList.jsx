import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderApi from "../../../api/orderApi";

const ORDER_STATUS = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED"
];

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getAllOrders({
        page,
        size: 8
      });

      console.log("ORDER RESPONSE:", res.data);

      // Backend trả Page<OrderResponse>
      if (res.data && Array.isArray(res.data.content)) {
        setOrders(res.data.content);
        setTotalPages(res.data.totalPages || 0);
      }
      // Backend trả List<OrderResponse>
      else if (Array.isArray(res.data)) {
        setOrders(res.data);
        setTotalPages(1);
      }
      // Trường hợp response không đúng
      else {
        setOrders([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.log(error);
      setOrders([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Tự động gọi lại khi thay đổi trang (Pagination)
  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleStatusChange = async (id, status) => {
    try {
      await orderApi.updateStatus(id, status);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">📦 Quản Lý Đơn Hàng</h2>
        {loading && <div className="spinner-border spinner-border-sm text-primary" role="status"></div>}
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="py-3">ID</th>
              <th className="py-3">Người dùng</th>
              <th className="py-3">Tổng cộng</th>
              <th className="py-3">Trạng thái</th>
              <th className="py-3">Ngày đặt</th>
              <th className="py-3 text-center" width="140">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  Đang tải dữ liệu đơn hàng...
                </td>
              </tr>
            ) : Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderId}>
                  <td className="fw-semibold">#{order.orderId}</td>
                  <td>{order.username}</td>
                  <td className="text-danger fw-bold">
                    {Number(order.totalAmount).toLocaleString()} đ
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm fw-semibold"
                      style={{
                        maxWidth: "150px",
                        backgroundColor: 
                          order.status === "COMPLETED" ? "#e8f5e9" :
                          order.status === "CANCELLED" ? "#ffebee" :
                          order.status === "SHIPPING" ? "#e3f2fd" : "#fff3e0",
                        color:
                          order.status === "COMPLETED" ? "#2e7d32" :
                          order.status === "CANCELLED" ? "#c62828" :
                          order.status === "SHIPPING" ? "#1565c0" : "#ef6c00"
                      }}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    >
                      {ORDER_STATUS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-muted">{order.orderDate}</td>
                  <td className="text-center">
                    <Link
                      to={`/admin/orders/${order.orderId}`}
                      className="btn btn-outline-primary btn-sm rounded-pill px-3"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  Chưa có đơn hàng nào 📝
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* THANH PHÂN TRANG (PAGINATION) */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination shadow-sm rounded-3">
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${page === index ? "active" : ""}`}>
                  <button
                    className="page-link px-3 py-2 fw-semibold"
                    onClick={() => setPage(index)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default OrderList;