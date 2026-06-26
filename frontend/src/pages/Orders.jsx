import { useEffect, useState } from "react";
import orderApi from "../api/orderApi";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderApi.getMyOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
    }
  };

  // Hàm xử lý tải file hóa đơn PDF từ Server và kích hoạt download ở trình duyệt
  const exportInvoice = async (id) => {
    try {
      const response = await orderApi.downloadInvoice(id);
      
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${id}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      // Dọn dẹp bộ nhớ và xóa element tạm sau khi click
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi xuất hóa đơn:", error);
    }
  };

  // Hàm helper tự động đổi màu badge theo trạng thái đơn hàng
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-warning text-dark";
      case "CONFIRMED":
        return "bg-info text-white";
      case "COMPLETED":
        return "bg-success text-white";
      case "CANCELLED":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">📦 Đơn hàng của tôi</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info shadow-sm">Chưa có đơn hàng nào</div>
      ) : (
        orders.map((order) => (
          <div key={order.orderId} className="card shadow-sm mb-4">
            <div className="card-body">
              {/* Phần header đơn hàng */}
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold m-0">Đơn hàng #{order.orderId}</h5>
                <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <p className="text-muted small mt-2 mb-1">
                Ngày đặt: {new Date(order.orderDate).toLocaleString("vi-VN")}
              </p>
              <p className="text-dark mb-3">
                <b>Địa chỉ:</b> {order.shippingAddress}
              </p>
              <hr />

              {/* Chi tiết từng sản phẩm trong đơn */}
              <h6 className="fw-bold mb-3 text-secondary">Chi tiết đơn hàng</h6>
              {order.items.map((item) => (
                <div key={item.orderDetailId} className="d-flex align-items-center mb-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    width="70"
                    height="90"
                    className="me-3 rounded border"
                    style={{ objectFit: "cover" }}
                  />

                  <div className="flex-grow-1">
                    <h6 className="mb-1 text-dark fw-bold">{item.title}</h6>
                    <small className="text-muted d-block">Số lượng: {item.quantity}</small>
                    <small className="text-muted">
                      Đơn giá: {Number(item.price).toLocaleString()} đ
                    </small>
                  </div>

                  <div className="fw-bold text-dark">
                    {Number(item.subtotal).toLocaleString()} đ
                  </div>
                </div>
              ))}
              <hr />

              {/* Phần footer đơn hàng (Tổng tiền + Hành động) */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex align-items-center">
                  <span className="text-muted me-2">Tổng thanh toán:</span>
                  <h4 className="text-danger fw-bold m-0">
                    {Number(order.totalAmount).toLocaleString()} đ
                  </h4>
                </div>

                {order.status === "COMPLETED" && (
                  <button
                    className="btn btn-outline-primary btn-sm fw-bold"
                    onClick={() => exportInvoice(order.orderId)}
                  >
                    📄 Xuất hóa đơn
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;