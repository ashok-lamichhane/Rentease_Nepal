import { Navigate } from "react-router-dom";

const RegisterPage = () => {
  return <Navigate to="/auth?mode=signup" replace />;
};

export default RegisterPage;
