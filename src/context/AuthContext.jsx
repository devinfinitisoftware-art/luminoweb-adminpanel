import React, { createContext, useContext, useState, useMemo } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("luumilo-admin-user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      // ignore parse errors
      return null;
    }
  }); // { id, username, email, role, isTestFamily }

  // Helper function to map backend errors to user-friendly messages
  const getErrorMessage = (error) => {
    const errorMessage = error.message?.toLowerCase() || '';
    
    // Map common backend error messages to user-friendly ones
    if (errorMessage.includes('unauthorized access') || 
        errorMessage.includes('invalid credentials') ||
        errorMessage.includes('invalid email') ||
        errorMessage.includes('invalid password')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    
    if (errorMessage.includes('invalid admin secret key')) {
      return 'Configuration error. Please contact your administrator.';
    }
    
    if (errorMessage.includes('all fields are required') || 
        errorMessage.includes('required')) {
      return 'Please enter both email and password.';
    }
    
    if (errorMessage.includes('unable to connect') || 
        errorMessage.includes('server') ||
        errorMessage.includes('network')) {
      return 'Unable to connect to the server. Please check your connection and try again.';
    }
    
    if (errorMessage.includes('admin secret key is required')) {
      return 'System configuration error. Please contact support.';
    }
    
    // Return the original message if we can't map it, or a generic message
    return error.message || 'Something went wrong. Please try again.';
  };

  const login = async ({ email, password, adminSecretKey }) => {
    if (!email || !password) {
      throw new Error("Please enter both email and password.");
    }

    try {
      const response = await api.adminLogin(email, password, adminSecretKey);
      
      if (response.success && response.token && response.user) {
        // Store user data
        const userData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          role: response.user.role,
          isTestFamily: response.user.isTestFamily,
        };
        
        setUser(userData);
        
        // Store user and token in localStorage
        localStorage.setItem("luumilo-admin-user", JSON.stringify(userData));
        localStorage.setItem("luumilo-admin-token", response.token);
        
        return userData;
      } else {
        // If response doesn't have success, create an error with the message
        const errorMessage = response.message || "Login failed";
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Extract message from error object
      const errorMsg = error.message || (typeof error === 'string' ? error : 'Unknown error');
      // Re-throw with user-friendly message
      throw new Error(getErrorMessage({ message: errorMsg }));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("luumilo-admin-user");
    localStorage.removeItem("luumilo-admin-token");
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// We intentionally export a hook from this file.
// Allow it for the react-refresh rule.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
