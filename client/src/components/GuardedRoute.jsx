import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const GuardedRoute = ({
    isRouteAccessible = false,
    redirectRoute,
}) =>
    isRouteAccessible ? <Outlet /> : <Navigate to={redirectRoute} replace />;

export default GuardedRoute;