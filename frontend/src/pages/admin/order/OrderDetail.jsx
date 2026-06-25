import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderApi from "../../../api/orderApi";

function OrderDetail() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);

    useEffect(() => {

        const fetchOrder = async () => {

            try {

                const res =
                    await orderApi.getOrderById(id);

                setOrder(res.data);

            } catch (error) {
                console.log(error);
            }
        };

        fetchOrder();

    }, [id]);

    if (!order) {
        return <h3>Loading...</h3>;
    }

    return (

        <div className="container mt-4">

            <h2>
                Chi tiết đơn hàng #{order.orderId}
            </h2>

            <div className="card p-3 mb-4">

                <h5>ID Người dùng: {order.userId}</h5>

                <h5>Ngày đặt hàng: {order.orderDate}</h5>

                <h5>Trạng thái: {order.status}</h5>

                <h5>Tổng cộng: ${order.totalAmount}</h5>

            </div>

            <table className="table table-bordered">

                <thead>

                    <tr>
                        <th>Sách</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng phụ</th>
                    </tr>

                </thead>

                <tbody>

                    {order.items.map((item) => (

                        <tr key={item.orderDetailId}>

                            <td>
                                {item.title}
                            </td>

                            <td>
                                ${item.price}
                            </td>

                            <td>
                                {item.quantity}
                            </td>

                            <td>
                                $
                                {item.price * item.quantity}
                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default OrderDetail;