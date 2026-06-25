import { useEffect, useState } from "react";
import cartApi from "../api/cartApi";
import orderApi from "../api/orderApi";

function Cart() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await cartApi.getCart();
      setCart(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await cartApi.removeItem(cartItemId);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ");
      return;
    }

    try {
      await orderApi.checkout({
        shippingAddress: address,
      });
      alert("Đặt hàng thành công!");
      fetchCart();
      setAddress("");
    } catch (error) {
      console.log(error);
      alert("Thanh toán thất bại");
    }
  };

  if (!cart) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">🛒 Giỏ hàng</h2>

      {cart.items.length === 0 ? (
        <div className="alert alert-info">Giỏ hàng trống</div>
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
                    <div className="card-body">
                      <h5 className="fw-bold">{item.title}</h5>
                      <p className="text-muted">Số lượng: {item.quantity}</p>
                      <h6 className="text-danger">
                        {Number(item.price).toLocaleString()} đ
                      </h6>
                      <h6 className="mt-3">
                        Thành tiền: {Number(item.subtotal).toLocaleString()} đ
                      </h6>
                      <button
                        className="btn btn-danger mt-3"
                        onClick={() => handleRemove(item.cartItemId)}
                      >
                        Xóa sản phẩm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phần tổng kết và thanh toán bên phải */}
          <div className="col-lg-4">
            <div className="card shadow-lg border-0 p-4">

              <h4 className="fw-bold">
                Tổng đơn hàng
              </h4>

              <hr />

              <div
                className="
                  d-flex
                  justify-content-between
                  mb-3
                "
              >
                <span>Số sản phẩm</span>

                <b>
                  {cart.items.length}
                </b>
              </div>

              <div
                className="
                  d-flex
                  justify-content-between
                  mb-4
                "
              >
                <span>Tổng tiền</span>

                <h4 className="text-danger">
                  {Number(
                    cart.totalAmount
                  ).toLocaleString()}
                  đ
                </h4>
              </div>

              <input
                className="form-control"
                placeholder="Nhập địa chỉ giao hàng..."
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
              />

              <button
                className="
                  btn
                  btn-success
                  w-100
                  mt-4
                  py-3
                  fw-bold
                "
                onClick={handleCheckout}
              >
                Đặt hàng ngay
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;