import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authorApi from "../../../api/authorApi";

function AuthorList() {

    const [authors, setAuthors] = useState([]);

    const fetchAuthors = async () => {

        try {

            const res = await authorApi.getAll();

            setAuthors(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure to delete this author?"
        );

        if (!confirmDelete) return;

        try {

            await authorApi.delete(id);

            fetchAuthors();

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between mb-3">

                <h2>Quản Lý Tác Giả</h2>

                <Link
                    to="/admin/authors/add"
                    className="btn btn-primary"
                >
                    Thêm Tác Giả
                </Link>

            </div>

            <table className="table table-bordered">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th width="200">Hành động</th>
                    </tr>

                </thead>

                <tbody>

                    {authors.map((author) => (

                        <tr key={author.authorId}>

                            <td>{author.authorId}</td>

                            <td>{author.name}</td>

                            <td>

                                <Link
                                    to={`/admin/authors/edit/${author.authorId}`}
                                    className="btn btn-warning me-2"
                                >
                                    Sửa
                                </Link>

                                <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                        handleDelete(author.authorId)
                                    }
                                >
                                    Xóa
                                </button>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default AuthorList;