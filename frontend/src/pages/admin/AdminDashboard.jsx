import { useEffect, useState } from "react";
import dashboardApi from "../../api/dashboardApi";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [type, setType] = useState("ALL");
  
  // Bổ sung State quản lý ngày tháng để truyền vào API dashboardApi.getDashboard
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Đưa hàm fetchDashboard ra ngoài để nút bấm "Xem thống kê" có thể gọi được
  const fetchDashboard = async () => {
    try {
      const res = await dashboardApi.getDashboard(fromDate, toDate, type);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Tự động gọi API lần đầu khi Component được mount hoặc khi thay đổi bộ lọc "Loại đơn hàng"
  useEffect(() => {
    fetchDashboard();
  }, [type]); 

  if (!data) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-muted">Đang tải dữ liệu thống kê...</h3>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* TIÊU ĐỀ */}
      <div className="mb-4">
        <h2 className="fw-bold">Xin chào Admin 👋</h2>
        <p className="text-muted">Tổng quan hệ thống BookStore</p>
      </div>

      {/* THANH BỘ LỌC THỐNG KÊ (FILTER BAR) */}
      <div className="bg-white rounded-4 shadow-sm p-4 mb-5">
        <div className="row g-3 align-items-end">
          {/* Chọn từ ngày */}
          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Từ ngày</label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          {/* Đến ngày */}
          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Đến ngày</label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Loại đơn hàng */}
          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">Loại đơn hàng</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="ALL">Tất cả đơn hàng</option>
              <option value="COMPLETED">Chỉ đơn hoàn thành</option>
            </select>
          </div>

          {/* Nút xem thống kê */}
          <div className="col-md-3">
            <button
              type="button"
              className="btn btn-primary w-100 fw-semibold py-2"
              onClick={fetchDashboard}
            >
              📊 Xem thống kê
            </button>
          </div>
        </div>
      </div>

      {/* KHỐI HIỂN THỊ SỐ LIỆU CARD */}
      <div className="row g-4">
        {/* Tổng Sách */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 transition-hover">
            <div className="card-body p-4">
              <h5 className="text-muted fs-6 mb-2">📚 Tổng Sách</h5>
              <h1 className="fw-bold text-primary mb-0">{data.totalBooks}</h1>
            </div>
          </div>
        </div>

        {/* Người Dùng */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 transition-hover">
            <div className="card-body p-4">
              <h5 className="text-muted fs-6 mb-2">👥 Người Dùng</h5>
              <h1 className="fw-bold text-success mb-0">{data.totalUsers}</h1>
            </div>
          </div>
        </div>

        {/* Đơn Hàng */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 transition-hover">
            <div className="card-body p-4">
              <h5 className="text-muted fs-6 mb-2">📦 Đơn Hàng</h5>
              <h1 className="fw-bold text-warning mb-0">{data.totalOrders}</h1>
            </div>
          </div>
        </div>

        {/* Doanh Thu */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 transition-hover">
            <div className="card-body p-4">
              <h5 className="text-muted fs-6 mb-2">💰 Doanh Thu</h5>
              <h1 className="fw-bold text-danger mb-0">
                {Number(data.totalRevenue).toLocaleString()} đ
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;