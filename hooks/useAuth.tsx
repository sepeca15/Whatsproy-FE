import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const userLoggedIn = true; 
      setIsAuthenticated(userLoggedIn);
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timeout);
  }, []);

  return { isAuthenticated, loading };
}
