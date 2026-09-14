import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function ProtectedRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
