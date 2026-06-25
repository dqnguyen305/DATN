import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authorApi from "../../../api/authorApi";

function AddAuthor() {

    const [name, setName] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await authorApi.create({
                name
            });

            navigate("/admin/authors");

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="container mt-4">

            <h2>Thêm Tác Giả</h2>

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
                    className="btn btn-primary"
                >
                    Thêm
                </button>

            </form>

        </div>
    );
}

export default AddAuthor;