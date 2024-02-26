import { useAuth } from "src/firebase/auth";
import Skeleton from "./Skeleton";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { error, loading, user } = useAuth();

  if (error) return <div>{error.message}</div>;
  if (loading)
    return (
      <div className="flex flex-col gap-5 lg:px-80 lg:py-6">
        <Skeleton />
      </div>
    );

  user?.getIdToken().then((e) => console.log(e));
  // console.log(user);

  return <>{user ? <Outlet /> : <Navigate to="/" />}</>;
};
