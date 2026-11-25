"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/lib/types";
import { MOCK_USERS } from "@/lib/mock-data/users";
import { canAccessRoute, canPerformAction } from "@/lib/rbac";

interface AuthRoleContextType {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  canPerform: (action: string) => boolean;
  canAccess: (pathname: string) => boolean;
  availableUsers: User[];
}

const AuthRoleContext = createContext<AuthRoleContextType | undefined>(undefined);

export function AuthRoleProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // default Super Admin

  useEffect(() => {
    try {
      const savedRoleId = localStorage.getItem("solartrack_active_role");
      if (savedRoleId) {
        const found = MOCK_USERS.find((u) => u.role === savedRoleId);
        if (found) setCurrentUser(found);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const switchRole = (role: UserRole) => {
    const matched = MOCK_USERS.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      try {
        localStorage.setItem("solartrack_active_role", role);
      } catch (e) {
        console.error(e);
      }
    }
  };

  /**
   * Role permissions enforcement matrix
   */
  const canPerform = (action: string): boolean => canPerformAction(currentUser.role, action);

  const canAccess = (pathname: string): boolean => canAccessRoute(currentUser.role, pathname);

  return (
    <AuthRoleContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        switchRole,
        canPerform,
        canAccess,
        availableUsers: MOCK_USERS
      }}
    >
      {children}
    </AuthRoleContext.Provider>
  );
}

export function useAuthRole() {
  const context = useContext(AuthRoleContext);
  if (!context) {
    throw new Error("useAuthRole must be used within an AuthRoleProvider");
  }
  return context;
}
