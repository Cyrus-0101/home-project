import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom"

import './App.css'
import Layout from "./components/Layout"
import Login from "./redux/features/auth/Login"
import Signup from "./redux/features/auth/SignUp"
import Dashboard from "./redux/features/auth/Dashboard"
import ForgotPassword from "./redux/features/auth/ForgotPassword"
import PersistLogin from "./redux/features/auth/PersistLogin"
import Profile from "./redux/features/auth/Profile"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "./redux/features/auth/authSlice"
import GuardedRoute from './components/GuardedRoute'
import RequireAuth from './redux/features/RequireAuth'

const App = () => {

  // Select token from local storage
  const alwaysLoggedIn = localStorage.getItem('persist')

  const token = useSelector(selectCurrentToken)

  return (
    <div className="container-fluid">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/*  element={<GuardedRoute isRouteAccessible={true} redirectRoute="/dashboard" />}> */}
          {(
            <Route>
              <Route index element={<Login />} />

              <Route path="login" element={<Login />} />

              <Route path="signup" element={<Signup />} />

              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>
          )}

          {(
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
                <Route path="dashboard" element={<Dashboard />} />

                <Route path="me" element={<Profile />} />

                <Route path="*" element={<Navigate to="dashboard" />} />
              </Route>
            </Route>

          )}
          <Route path="*" element={<Navigate to="/" />} />

        </Route>
      </Routes>
    </div>
  )
}

export default App
