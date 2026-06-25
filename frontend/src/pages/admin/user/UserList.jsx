import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userApi from "../../../api/userApi";

function UserList() {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {

        try {

            const res =
                await userApi.getAllUsers();

            setUsers(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus =
        async (id) => {

        try {

            await userApi.toggleStatus(id);

            fetchUsers();

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="container mt-4">

            <div className="
                d-flex
                justify-content-between
                align-items-center
                mb-4
            ">

                <h2>Quản Lý Người Dùng</h2>

            </div>

            <table className="
                table
                table-bordered
                table-hover
            ">

                <thead className="table-dark">

                    <tr>
                        <th>ID</th>
                        <th>Tên người dùng</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th width="250">
                            Hành động
                        </th>
                    </tr>

                </thead>

                <tbody>

                    {users.map((user) => (

                        <tr key={user.userId}>

                            <td>{user.userId}</td>

                            <td>{user.username}</td>

                            <td>{user.email}</td>

                            <td>{user.phone}</td>

                            <td>{user.role}</td>

                            <td>

                                {user.status === "ACTIVE"
                                    ? (
                                        <span className="
                                            badge bg-success
                                        ">
                                            Active
                                        </span>
                                    )
                                    : (
                                        <span className="
                                            badge bg-danger
                                        ">
                                            Blocked
                                        </span>
                                    )}

                            </td>

                            <td>

                                <Link
                                    to={`/admin/users/${user.userId}`}
                                    className="
                                    btn btn-primary me-2
                                    "
                                >
                                    Chi tiết
                                </Link>

                                <Link
                                    to={`/admin/users/edit/${user.userId}`}
                                    className="
                                    btn btn-warning me-2
                                    "
                                >
                                    Sửa
                                </Link>

                                <button
                                    className={
                                        user.status === "ACTIVE"
                                            ? "btn btn-danger"
                                            : "btn btn-success"
                                    }
                                    onClick={() =>
                                        handleToggleStatus(
                                            user.userId
                                        )
                                    }
                                >

                                    {user.status === "ACTIVE"
                                        ? "Block"
                                        : "Unblock"}

                                </button>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default UserList;