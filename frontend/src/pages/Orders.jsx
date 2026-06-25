import { useEffect, useState } from "react";
import orderApi from "../api/orderApi";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const res =
        await orderApi.getMyOrders();

      setOrders(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="container mt-5">

      <h2 className="fw-bold mb-4">
        📦 Đơn hàng của tôi
      </h2>

      {orders.length === 0 ? (

        <div className="alert alert-info">
          Chưa có đơn hàng nào
        </div>

      ) : (

        orders.map((order) => (

          <div
            key={order.orderId}
            className="card shadow-sm mb-4"
          >

            <div className="card-body">

              <div className="d-flex justify-content-between">

                <h5 className="fw-bold">
                  Đơn hàng #{order.orderId}
                </h5>

                <span className="badge bg-success">
                  {order.status}
                </span>

              </div>

              <p className="text-muted mt-2">
                Ngày đặt:
                {" "}
                {new Date(order.orderDate)
                .toLocaleString("vi-VN")}
              </p>

              <p>
                Địa chỉ:
                {" "}
                {order.shippingAddress}
              </p>

              <h5 className="text-danger">
                {Number(order.totalAmount)
                  .toLocaleString()} đ
              </h5>

            </div>

          </div>

        ))

      )}

    </div>

  );
}

export default Orders;