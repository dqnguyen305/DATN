import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";

function CategoryList() {

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {

        try {

            const res = await categoryApi.getAll();

            setCategories(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure to delete this category?"
        );

        if (!confirmDelete) return;

        try {

            await categoryApi.delete(id);

            fetchCategories();

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between mb-3">

                <h2>Quản Lý Danh Mục</h2>

                <Link
                    to="/admin/categories/add"
                    className="btn btn-primary"
                >
                    Thêm Danh Mục
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

                    {categories.map((category) => (

                        <tr key={category.categoryId}>

                            <td>{category.categoryId}</td>

                            <td>{category.name}</td>

                            <td>

                                <Link
                                    to={`/admin/categories/edit/${category.categoryId}`}
                                    className="btn btn-warning me-2"
                                >
                                    Sửa
                                </Link>

                                <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                        handleDelete(category.categoryId)
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

export default CategoryList;