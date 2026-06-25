import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userApi from "../../../api/userApi";

function UserDetail() {

    const { id } = useParams();

    const [user, setUser] = useState(null);

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const res =
                    await userApi.getUserById(id);

                setUser(res.data);

            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();

    }, [id]);

    if (!user) {
        return <h3>Loading...</h3>;
    }

    return (

        <div className="container mt-4">

            <h2 className="mb-4">
                Chi tiết Người dùng
            </h2>

            <div className="card p-4">

                <h5>ID: {user.userId}</h5>

                <h5>
                    Tên người dùng: {user.username}
                </h5>

                <h5>
                    Email: {user.email}
                </h5>

                <h5>
                    Điện thoại: {user.phone}
                </h5>

                <h5>
                    Địa chỉ: {user.address}
                </h5>

                <h5>
                    Vai trò: {user.role}
                </h5>

                <h5>
                    Trạng thái: {user.status}
                </h5>

                <h5>
                    Created At:
                    {" "}
                    {user.createdAt}
                </h5>

            </div>

        </div>
    );
}

export default UserDetail;