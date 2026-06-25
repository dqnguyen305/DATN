import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});

axiosClient.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    const publicApis = [
      "/auth/login",
      "/auth/register"
    ];

    const isPublicApi = publicApis.some(
      (url) => config.url?.includes(url)
    );

    if (token && !isPublicApi) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(

  (response) => response,

  (error) => {

    if (
      error.response &&
      error.response.status === 401
    ) {

      localStorage.removeItem("token");
      localStorage.removeItem("chatHistory");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;