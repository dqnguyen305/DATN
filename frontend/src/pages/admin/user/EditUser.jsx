import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import userApi from "../../../api/userApi";

function EditUser() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({
            email: "",
            phone: "",
            role: ""
        });

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const res =
                    await userApi.getUserById(id);

                setFormData({
                    email: res.data.email,
                    phone: res.data.phone,
                    role: res.data.role
                });

            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();

    }, [id]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await userApi.updateUser(
                id,
                formData
            );

            navigate("/admin/users");

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="container mt-4">

            <h2 className="mb-4">
                Sửa Người Dùng
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label className="form-label">
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">
                        Điện thoại
                    </label>

                    <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">
                        Vai trò
                    </label>

                    <select
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleChange}
                    >

                        <option value="USER">
                            USER
                        </option>

                        <option value="ADMIN">
                            ADMIN
                        </option>

                    </select>

                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Cập nhật
                </button>

            </form>

        </div>
    );
}

export default EditUser;