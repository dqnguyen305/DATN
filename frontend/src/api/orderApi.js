import axiosClient from "./axiosClient";

const orderApi = {

    checkout(data) {

        return axiosClient.post(
            "/orders/checkout",
            data
        );
    },

    getMyOrders() {

        return axiosClient.get(
            "/orders/my-orders"
        );
    },

    getAllOrders() {

        return axiosClient.get(
            "/admin/orders"
        );
    },

    getOrderById(id) {

        return axiosClient.get(
            `/admin/orders/${id}`
        );
    },

    updateStatus(id, status) {

        return axiosClient.put(
            `/admin/orders/${id}/status`,
            { status }
        );
    }
};

export default orderApi;