import axios from "axios";

const recommendationApi = {

    getAll: () => {

        const token =
            localStorage.getItem("token");

        return axios.get(
            "http://localhost:8080/api/recommendations",
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );
    }
};

export default recommendationApi;