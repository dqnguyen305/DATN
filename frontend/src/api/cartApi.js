import axiosClient from "./axiosClient";

const cartApi = {

  addToCart(data) {

    return axiosClient.post(
      "/cart/add",
      data
    );

  },

  getCart() {

    return axiosClient.get("/cart");

  },

  removeItem(cartItemId) {

    return axiosClient.delete(
      `/cart/items/${cartItemId}`
    );

  }

};

export default cartApi;