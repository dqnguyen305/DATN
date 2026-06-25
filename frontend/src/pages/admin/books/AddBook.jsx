import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bookApi from "../../../api/bookApi";

function AddBook() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stockQuantity: "",
    imageUrl: "",
    authorId: "",
    categoryId: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      setForm((prev) => ({
        ...prev,
        imageUrl: data.imageUrl,
      }));
    } catch (error) {
      console.log(error);
      alert("Upload ảnh thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookApi.createBook(form);
      alert("Thêm sách thành công");
      navigate("/admin/books");
    } catch (error) {
      console.log(error);
      alert("Thêm thất bại");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h2 className="fw-bold mb-4">➕ Thêm sách</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Tên sách</label>
            <input
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Mô tả</label>
            <textarea
              className="form-control"
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Giá</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Tồn kho</label>
              <input
                type="number"
                className="form-control"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Hình ảnh sản phẩm</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleUploadImage}
            />

            {uploading && (
              <p className="text-primary mt-2">⏳ Đang upload...</p>
            )}

            {form.imageUrl && (
              <div className="mt-3">
                <img
                  src={form.imageUrl}
                  alt="preview"
                  className="rounded shadow img-thumbnail"
                  style={{
                    width: "150px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Author ID</label>
              <input
                type="number"
                className="form-control"
                name="authorId"
                value={form.authorId}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Category ID</label>
              <input
                type="number"
                className="form-control"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={uploading}
          >
            {uploading ? "Đang tải ảnh lên..." : "Thêm sách"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBook;