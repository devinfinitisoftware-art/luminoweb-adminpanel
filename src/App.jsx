// src/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import { TimeframeProvider } from "./context/TimeframeContext";
import LoadingSpinner from "./components/ui/shared/LoadingSpinner";

// Layouts (keep these eager so shell loads instantly)
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import AuthLayout from "./layouts/auth/AuthLayout";

// --- Lazy-loaded pages ---
// auth pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const VerifyCodePage = lazy(() => import("./pages/auth/VerifyCodePage"));
const ForgotPasswordPage = lazy(
  () => import("./pages/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(
  () => import("./pages/auth/ResetPasswordPage")
);

// dashboard main
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));

// activities
const ActivitiesPage = lazy(() => import("./pages/activities/ActivitiesPage"));

// submitted activities
const SubmittedActivitiesPage = lazy(() => import("./pages/submitted-activities/SubmittedActivitiesPage"));

// badges
const BadgesPage = lazy(() => import("./pages/badges/BadgesPage"));

// community
const CommunityPage = lazy(() => import("./pages/community/CommunityPage"));


// users
const UsersPage = lazy(() => import("./pages/users/UsersPage"));
const UserDetailsPage = lazy(() => import("./pages/users/UserDetailsPage"));

// settings
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));

const App = () => {
  return (
    <TimeframeProvider>
      <Suspense
        fallback={
          <LoadingSpinner />
        }
      >
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-code" element={<VerifyCodePage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Dashboard + app routes */}
          <Route element={<DashboardLayout />}>
            {/* main dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Activities */}
            <Route path="/activities" element={<ActivitiesPage />} />

            {/* Submitted Activities */}
            <Route path="/submitted-activities" element={<SubmittedActivitiesPage />} />

            {/* Badges */}
            <Route path="/badges" element={<BadgesPage />} />

            {/* Community */}
            <Route path="/community" element={<CommunityPage />} />
            {/* <Route path="/community/:id" element={<CommunityDetailsPage />} /> */}

            {/* Users */}
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetailsPage />} />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback: anything unknown -> dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </TimeframeProvider>
  );
};

export default App;
