// src/layouts/auth/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="min-h-screen w-full bg-white">
    <Outlet />
  </div>
);

export default AuthLayout;
