import axiosClient from "./axiosClient";

const paymentApi = {

    create(orderId) {
        return axiosClient.post(
            `/payments/create/${orderId}`
        );
    },

    confirm(params) {
        return axiosClient.get(
            "/payments/vnpay-return",
            {
                params
            }
        );
    }
};

export default paymentApi;