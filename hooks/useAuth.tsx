import api from "@/services/api/admin";
import { getData } from "@/storage/localStorage";
import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);

  // const isAuth = async () => {
  //   const userLoggedIn = await getData('token');
  //   setIsAuthenticated(userLoggedIn ? true : false);
  //   if(userLoggedIn) {
  //     const data = await api.auth.me()
  //   }
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   isAuth();
  // }, []);

  return { isAuthenticated, loading };
}
