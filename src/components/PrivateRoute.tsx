import { useAuth } from "src/firebase/auth";
import Skeleton from "./Skeleton";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { setUser } from "src/stores/auth";
import Notification from "./Notification";

export const PrivateRoute = () => {
  const { error, loading, user } = useAuth();
  const setUsers = setUser((v) => v.setUser);

  useEffect(() => {
    if (user) {
      setUsers();
      <Navigate to="/dashboard" />;
    }
  }, [user]);

  if (error) return <div>{error.message}</div>;
  if (loading)
    return (
      <div className="flex flex-col gap-5 lg:px-80 lg:py-6">
        <Skeleton />
      </div>
    );

  return (
    <>
      {user ? (
        <main>
          <Notification />
          <Outlet />
        </main>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};
