import axiosClient from "./axiosClient";

const dashboardApi = {
  getDashboard(fromDate, toDate, type = "ALL") {
    return axiosClient.get("/admin/dashboard", {
      params: {
        fromDate,
        toDate,
        type
      }
    });
  }
};

export default dashboardApi;