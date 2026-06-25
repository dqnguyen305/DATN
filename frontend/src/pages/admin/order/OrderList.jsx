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

    const fetchOrders = async () => {

        try {

            const res = await orderApi.getAllOrders();

            setOrders(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

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

            <h2 className="mb-4">
                Quản Lý Đơn Hàng
            </h2>

            <table className="table table-bordered">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Người dùng</th>
                        <th>Tổng cộng</th>
                        <th>Trạng thái</th>
                        <th>Ngày</th>
                        <th width="180">
                            Hành động
                        </th>
                    </tr>

                </thead>

                <tbody>

                    {orders.map((order) => (

                        <tr key={order.orderId}>

                            <td>{order.orderId}</td>

                            <td>
                                User #{order.userId}
                            </td>

                            <td>
                                ${order.totalAmount}
                            </td>

                            <td>

                                <select
                                    className="form-select"
                                    value={order.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            order.orderId,
                                            e.target.value
                                        )
                                    }
                                >

                                    {ORDER_STATUS.map(status => (

                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>

                                    ))}

                                </select>

                            </td>

                            <td>
                                {order.orderDate}
                            </td>

                            <td>

                                <Link
                                    to={`/admin/orders/${order.orderId}`}
                                    className="btn btn-primary"
                                >
                                    Chi tiết
                                </Link>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default OrderList;