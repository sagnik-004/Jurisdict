import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://themisynctest.onrender.com",
    withCredentials: true,
     headers: {
        'Content-Type': 'application/json'
    }
});
