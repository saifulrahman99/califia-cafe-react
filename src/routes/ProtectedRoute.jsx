import {Navigate} from 'react-router-dom';
import {useAuth} from "@/context/AuthContext.jsx";

const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to={`/auth/login`} replace/>;
};

export default ProtectedRoute;
