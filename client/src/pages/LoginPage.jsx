import { Navigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const location = useLocation();
  return <Navigate to={`/auth?mode=login${location.search ? `&${location.search.slice(1)}` : ""}`} replace />;
};

export default LoginPage;
