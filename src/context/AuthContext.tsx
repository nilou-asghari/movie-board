import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

type User = {
  _id: string;
  email: string;
  favorites: number[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loadProfile: () => Promise<void>;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  toggleFavorite: (movieId: number) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    await loadProfile();
  };

  const register = async (email: string, password: string) => {
    const res = await api.post("/auth/register", { email, password });
    localStorage.setItem("token", res.data.token);
    await loadProfile();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const toggleFavorite = async (movieId: number) => {
    if (!user) return;
    const isFav = user.favorites.includes(movieId);
    try {
      if (isFav) {
        await api.delete(`/favorites/${movieId}`);
        setUser({
          ...user,
          favorites: user.favorites.filter((id) => id !== movieId),
        });
      } else {
        await api.post(`/favorites/${movieId}`);
        setUser({ ...user, favorites: [...user.favorites, movieId] });
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loadProfile,
        logout,
        login,
        register,
        toggleFavorite,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
