import { useEffect, useState } from "react";
import cartApi from "../api/cartApi";
import orderApi from "../api/orderApi";
import paymentApi from "../api/paymentApi";

function Cart() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false); // Tránh người dùng spam click nút đặt hàng

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await cartApi.getCart();
      setCart(res.data);
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await cartApi.removeItem(cartItemId);
      fetchCart();
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    setIsProcessing(true);
    try {
      const order = await orderApi.checkout({
        shippingAddress: address,
        paymentMethod,
      });

      // 1. Trường hợp thanh toán COD
      if (paymentMethod === "COD") {
        alert("Đặt hàng thành công!");
        fetchCart();
        setAddress("");
        return;
      }

      // 2. Trường hợp thanh toán trực tuyến qua cổng VNPay
      if (paymentMethod === "VNPAY") {
        const payment = await paymentApi.create(order.data.orderId);
        window.location.href = payment.data.paymentUrl;
        return;
      }
    } catch (error) {
      console.error("Lỗi xử lý đặt hàng:", error);
      alert("Đã có lỗi xảy ra trong quá trình thanh toán");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">🛒 Giỏ hàng</h2>

      {cart.items.length === 0 ? (
        <div className="alert alert-info shadow-sm">Giỏ hàng của bạn đang trống.</div>
      ) : (
        <div className="row">
          {/* Danh sách sản phẩm bên trái */}
          <div className="col-lg-8">
            {cart.items.map((item) => (
              <div key={item.cartItemId} className="card mb-3 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="img-fluid rounded-start"
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body d-flex flex-column h-100 justify-content-between">
                      <div>
                        <h5 className="fw-bold text-dark">{item.title}</h5>
                        <p className="text-muted mb-2">Số lượng: {item.quantity}</p>
                        <h6 className="text-muted small">
                          Đơn giá: {Number(item.price).toLocaleString()} đ
                        </h6>
                      </div>
                      <div className="d-flex justify-content-between align-items-end mt-3">
                        <h6 className="fw-bold m-0 text-primary">
                          Thành tiền: {Number(item.subtotal).toLocaleString()} đ
                        </h6>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemove(item.cartItemId)}
                        >
                          Xóa sản phẩm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phần tổng kết và thanh toán bên phải */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4 bg-light">
              <h4 className="fw-bold mb-3">Tổng đơn hàng</h4>
              <hr />

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Số sản phẩm</span>
                <b className="text-dark">{cart.items.length}</b>
              </div>

              <div className="d-flex justify-content-between mb-4 align-items-center">
                <span className="text-muted">Tổng tiền</span>
                <h4 className="text-danger fw-bold mb-0">
                  {Number(cart.totalAmount).toLocaleString()} đ
                </h4>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-secondary">Địa chỉ giao hàng</label>
                <input
                  className="form-control"
                  placeholder="Nhập địa chỉ nhận sách..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isProcessing}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold text-secondary">Phương thức thanh toán</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={isProcessing}
                >
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="VNPAY">Cổng thanh toán VNPay</option>
                </select>
              </div>

              <button
                className="btn btn-success w-100 py-2.5 fw-bold shadow-sm"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : "Đặt hàng ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;