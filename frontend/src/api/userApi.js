import axiosClient from "./axiosClient";

const userApi = {

    getAllUsers() {
        return axiosClient.get("/users");
    },

    getUserById(id) {
        return axiosClient.get(`/users/${id}`);
    },

    updateUser(id, data) {
        return axiosClient.put(
            `/users/${id}`,
            data
        );
    },

    toggleStatus(id) {
        return axiosClient.put(
            `/users/${id}/toggle-status`
        );
    }
};

export default userApi;