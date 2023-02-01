import React from 'react';
import {useLocation, Navigate, Outlet} from "react-router";

const AuthRequire = () => {
    const token = localStorage.getItem('token')
    const location = useLocation()
    console.log(token)
    return (
        token ?
            <Outlet/>
            :
            <Navigate to="/login" state={{from: location}} replace/>
    );
};

export default AuthRequire;