import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";

function EditCategory() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [name, setName] = useState("");

    useEffect(() => {

        const fetchCategory = async () => {

            try {

                const res = await categoryApi.getById(id);

                setName(res.data.name);

            } catch (error) {
                console.log(error);
            }
        };

        fetchCategory();

    }, [id]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await categoryApi.update(id, {
                name
            });

            navigate("/admin/categories");

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="container mt-4">

            <h2>Sửa Danh Mục</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label className="form-label">
                        Tên Danh Mục
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />

                </div>

                <button
                    type="submit"
                    className="btn btn-warning"
                >
                    Cập nhật
                </button>

            </form>

        </div>
    );
}

export default EditCategory;