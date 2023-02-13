import React from "react";
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";

import { selectCurrentToken } from "../redux/features/auth/authSlice";

const useAuth = () => {
    const token = useSelector(selectCurrentToken);

    let isAuthenticated = false;

    if (token) {

        const decodedToken = jwtDecode(token);

        const { username, email } = decodedToken.UserInfo;

        isAuthenticated = true;

        return { username, email, isAuthenticated };
    }
    return { username: "", email: "", isAuthenticated };
};

export default useAuth;