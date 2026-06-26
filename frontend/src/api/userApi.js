import axiosClient from "./axiosClient";

const userApi = {
  // ================= ADMIN =================
  getAllUsers() {
    return axiosClient.get("/users");
  },

  getUserById(id) {
    return axiosClient.get(`/users/${id}`);
  },

  updateUser(id, data) {
    return axiosClient.put(`/users/${id}`, data);
  },

  toggleStatus(id) {
    return axiosClient.put(`/users/${id}/toggle-status`);
  },

  // ================= USER PROFILE =================
  getMyProfile() {
    return axiosClient.get("/users/me");
  },

  updateMyProfile(data) {
    return axiosClient.put("/users/me", data);
  },

  changePassword(data) {
    return axiosClient.put("/users/change-password", data);
  }
};

export default userApi;