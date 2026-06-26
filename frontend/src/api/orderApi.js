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
    },
    downloadInvoice(id) {
        return axiosClient.get(
            `/orders/${id}/invoice`,
            {
                responseType: "blob"
            }
        );
    }
};

export default orderApi;