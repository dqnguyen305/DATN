import axiosClient from "./axiosClient";

const authorApi = {
  getAll(params = {}) {
    return axiosClient.get("/authors", { params });
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