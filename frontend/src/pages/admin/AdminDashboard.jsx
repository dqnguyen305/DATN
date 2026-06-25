import { useEffect, useState } from "react";
import dashboardApi from "../../api/dashboardApi";

function AdminDashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const res =
          await dashboardApi.getDashboard();

        setData(res.data);

      } catch (error) {

        console.log(error);

      }

    };

    fetchDashboard();

  }, []);

  if (!data) {

    return <h3>Đang tải...</h3>;

  }

  return (

    <div>

      <div className="mb-5">

        <h2 className="fw-bold">
          Xin chào Admin 👋
        </h2>

        <p className="text-muted">
          Tổng quan hệ thống BookStore
        </p>

      </div>

      <div className="row g-4">

        <div className="col-md-3">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body">
              <h5 className="text-muted">
                📚 Tổng Sách
              </h5>
              <h1 className="fw-bold text-primary">
                {data.totalBooks}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body">
              <h5 className="text-muted">
                👥 Người Dùng
              </h5>
              <h1 className="fw-bold text-success">
                {data.totalUsers}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body">
              <h5 className="text-muted">
                📦 Đơn Hàng
              </h5>
              <h1 className="fw-bold text-warning">
                {data.totalOrders}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body">
              <h5 className="text-muted">
                💰 Doanh Thu
              </h5>
              <h1 className="fw-bold text-danger">
                {Number(
                  data.totalRevenue
                ).toLocaleString()} đ
              </h1>
            </div>
          </div>
        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;