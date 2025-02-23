import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://jurisdict.onrender.com",
    withCredentials: true,
     headers: {
        'Content-Type': 'application/json'
    }
});
