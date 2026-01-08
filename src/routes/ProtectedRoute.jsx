import React from "react";
import { Outlet } from "react-router-dom";

// Auth has been removed from the app for now. Keep a no-op
// ProtectedRoute that simply renders its children/outlet so
// existing imports don't break.
const ProtectedRoute = () => <Outlet />;

export default ProtectedRoute;
