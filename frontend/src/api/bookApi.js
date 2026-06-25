import axiosClient from "./axiosClient";

const bookApi = {

  getAll(params) {

    return axiosClient.get(
      "/books",
      { params }
    );
  },

  getById(id) {

    return axiosClient.get(
      `/books/${id}`
    );
  },

  createBook(data) {

    return axiosClient.post(
      "/books",
      data
    );
  },

  updateBook(id, data) {

    return axiosClient.put(
      `/books/${id}`,
      data
    );
  },

  deleteBook(id) {

    return axiosClient.delete(
      `/books/${id}`
    );
  },
};

export default bookApi;