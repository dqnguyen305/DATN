import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authorApi from "../../../api/authorApi";

function EditAuthor() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [name, setName] = useState("");

    useEffect(() => {

        const fetchAuthor = async () => {

            try {

                const res = await authorApi.getById(id);

                setName(res.data.name);

            } catch (error) {
                console.log(error);
            }
        };

        fetchAuthor();

    }, [id]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await authorApi.update(id, {
                name
            });

            navigate("/admin/authors");

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="container mt-4">

            <h2>Sửa Tác Giả</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label className="form-label">
                        Tên Tác Giả
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

export default EditAuthor;