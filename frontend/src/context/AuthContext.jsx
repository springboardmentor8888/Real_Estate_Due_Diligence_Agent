"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authApi, userApi } from "../services/api";
const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore existing login
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          setLoading(false);
          return;
        }

        setToken(storedToken);

        // Get actual user details + role from backend
        const response = await fetch(
          "http://localhost:8080/api/users/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await response.json();

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("Failed to restore user session:", err);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);

      if (!data || !data.token) {
        throw new Error("Invalid login response");
      }

      const authToken = data.token;

      setToken(authToken);
      localStorage.setItem("token", authToken);

      // Get actual logged-in user from backend
      const response = await fetch(
        "http://localhost:8080/api/users/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userInfo = await response.json();

      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));

      return {
        success: true,
        data,
        user: userInfo,
      };
    } catch (err) {
      console.error("Login error:", err);
      throw new Error("Invalid email or password");
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);

      return response;
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}