import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ENV = process.env.ENV

const baseURL = ENV === "development"
    ? "http://127.0.0.1:5001"
    : "https://jurisdict-yu4x.onrender.com";

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});