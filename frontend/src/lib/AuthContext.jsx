import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await axios.get("/api/validate-token", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(response.data.user);
                } catch (error) {
                    console.error("Token validation failed:", error);
                    localStorage.removeItem("token");
                }
            }
            setLoading(false);
        };
        checkToken();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};