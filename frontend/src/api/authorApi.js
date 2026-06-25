import axiosClient from "./axiosClient";

const authorApi = {

    getAll() {
        return axiosClient.get("/authors");
    },

    getById(id) {
        return axiosClient.get(`/authors/${id}`);
    },

    create(data) {
        return axiosClient.post("/authors", data);
    },

    update(id, data) {
        return axiosClient.put(`/authors/${id}`, data);
    },

    delete(id) {
        return axiosClient.delete(`/authors/${id}`);
    }
};

export default authorApi;