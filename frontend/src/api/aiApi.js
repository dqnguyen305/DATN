import axiosClient from "./axiosClient";

const aiApi = {

  chat(message, history) {

    return axiosClient.post(
      "/ai/chat",
      {
        message,
        history
      }
    );

  }

};

export default aiApi;