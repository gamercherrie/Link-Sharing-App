import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

interface ProtectedRouteProps {
    path: string;
    element: React.ReactElement;
}

const ProtectedRoute : React.FC<ProtectedRouteProps> = ({ path, element}) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? element : <Navigate to="/login" />
}

export default ProtectedRoute;
