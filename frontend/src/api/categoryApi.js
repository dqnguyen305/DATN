import axiosClient from "./axiosClient";

const categoryApi = {

    getAll() {
        return axiosClient.get("/categories");
    },

    getById(id) {
        return axiosClient.get(`/categories/${id}`);
    },

    create(data) {
        return axiosClient.post("/admin/categories", data);
    },

    update(id, data) {
        return axiosClient.put(`/admin/categories/${id}`, data);
    },

    delete(id) {
        return axiosClient.delete(`/admin/categories/${id}`);
    }
};

export default categoryApi;