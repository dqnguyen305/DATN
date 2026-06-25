import axiosClient from "./axiosClient";

const dashboardApi = {

    getDashboard() {

        return axiosClient.get(
            "/admin/dashboard"
        );
    }
};

export default dashboardApi;