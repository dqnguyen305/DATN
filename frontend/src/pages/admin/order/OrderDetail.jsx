import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderApi from "../../../api/orderApi";

function OrderDetail() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await orderApi.getOrderById(id);
                setOrder(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchOrder();
    }, [id]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return "Chưa có";

        return new Date(date).toLocaleString("vi-VN");
    };

    const getPaymentMethod = (method) => {
        if (!method) return "Chưa có";

        if (method === "COD") return "Thanh toán khi nhận hàng (COD)";
        if (method === "VNPAY") return "Thanh toán qua VNPay";
        if (method === "BANKING") return "Chuyển khoản ngân hàng";

        return method;
    };

    if (!order) {
        return <h3 className="text-center mt-4">Đang tải...</h3>;
    }

    // Hỗ trợ cả trường items và orderDetails từ backend
    const items = order.items || order.orderDetails || [];

    return (
        <div className="container mt-4">
            <h2 className="mb-4">
                Chi tiết đơn hàng #{order.orderId || order.id}
            </h2>

            <div className="card p-4 mb-4 shadow-sm">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <strong>Mã đơn hàng:</strong>{" "}
                        #{order.orderId || order.id}
                    </div>

                    <div className="col-md-6 mb-3">
                        <strong>ID người dùng:</strong>{" "}
                        {order.userId || order.user?.userId || "Chưa có"}
                    </div>

                    <div className="col-md-6 mb-3">
                        <strong>Ngày đặt hàng:</strong>{" "}
                        {formatDate(order.orderDate)}
                    </div>

                    <div className="col-md-6 mb-3">
                        <strong>Trạng thái đơn hàng:</strong>{" "}
                        <span className="badge bg-primary">
                            {order.status || "Chưa cập nhật"}
                        </span>
                    </div>

                    <div className="col-md-6 mb-3">
                        <strong>Phương thức thanh toán:</strong>{" "}
                        {getPaymentMethod(
                            order.paymentMethod ||
                            order.payment?.paymentMethod ||
                            order.payment?.method
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <strong>Trạng thái thanh toán:</strong>{" "}
                        <span
                            className={`badge ${
                                order.paymentStatus === "PAID" ||
                                order.payment?.status === "PAID"
                                    ? "bg-success"
                                    : "bg-warning text-dark"
                            }`}
                        >
                            {order.paymentStatus ||
                                order.payment?.status ||
                                "Chưa thanh toán"}
                        </span>
                    </div>

                    <div className="col-md-6 mb-3">
                        <strong>Địa chỉ giao hàng:</strong>{" "}
                        {order.shippingAddress ||
                            order.address ||
                            "Chưa có địa chỉ"}
                    </div>

                    

                    <div className="col-12">
                        <strong>Tổng tiền:</strong>{" "}
                        <span className="text-danger fw-bold">
                            {formatCurrency(order.totalAmount)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Danh sách sách đã đặt</h5>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Sách</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Tổng phụ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.length > 0 ? (
                                items.map((item, index) => {
                                    const price =
                                        item.price ||
                                        item.bookPrice ||
                                        item.book?.price ||
                                        0;

                                    const quantity = item.quantity || 0;

                                    const title =
                                        item.title ||
                                        item.bookTitle ||
                                        item.book?.title ||
                                        "Không xác định";

                                    return (
                                        <tr
                                            key={
                                                item.orderDetailId ||
                                                item.id ||
                                                index
                                            }
                                        >
                                            <td>{title}</td>

                                            <td>{formatCurrency(price)}</td>

                                            <td>{quantity}</td>

                                            <td className="fw-bold">
                                                {formatCurrency(
                                                    price * quantity
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center text-muted"
                                    >
                                        Đơn hàng chưa có sản phẩm.
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

export default OrderDetail;