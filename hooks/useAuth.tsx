import { getData } from "@/storage/localStorage";
import { useState, useEffect } from "react";
import { useUser } from "./redux/useUser";

export function useAuth() {
  const { handleAddUserData } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  const isAuth = async () => {
    setLoading(true); 
    try {
      const userLoggedIn = await getData("token");      
      if (userLoggedIn) {
        setIsAuthenticated(true);
        setRedirecting(true);
        await handleAddUserData();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

  return { isAuthenticated, loading, redirecting };
}
