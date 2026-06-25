import axiosClient from "./axiosClient";

const reviewApi = {

  createReview(data) {
    return axiosClient.post(
      "/reviews",
      data
    );
  },

  getBookReviews(bookId) {
    return axiosClient.get(
      `/reviews/book/${bookId}`
    );
  },

  getAverageRating(bookId) {
    return axiosClient.get(
      `/reviews/book/${bookId}/average`
    );
  }

};

export default reviewApi;