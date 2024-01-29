import { useEffect, useState } from "react";
import { FbAuth } from "src/firebase";
import type firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState<firebase.User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = FbAuth.onAuthStateChanged(
      (user) => {
        if (user) setUser(user);
        else setUser(undefined);
        setLoading(false);
      },
      (e) => {
        setError(e);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await FbAuth.signOut();
      localStorage.clear();
      navigate("/");
    } catch (e) {
      const error = e as Error;
      setError(error);
    }
  };

  return { user, loading, error, logout };
};
