"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/lib/types";
import { MOCK_USERS } from "@/lib/mock-data/users";

interface AuthRoleContextType {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  canPerform: (action: string) => boolean;
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
  const canPerform = (action: string): boolean => {
    const role = currentUser.role;
    if (role === "super_admin") return true; // Super Admin has unrestricted authority

    switch (action) {
      case "CREATE_CUSTOMER":
        return ["super_admin", "operations_manager", "sales"].includes(role);

      case "ADVANCE_STAGE":
        return ["super_admin", "operations_manager", "technician"].includes(role);

      case "DISCONNECT_PAYG":
        return ["super_admin", "operations_manager", "finance"].includes(role);

      case "APPROVE_BULK_DISCONNECT":
        return ["super_admin", "operations_manager"].includes(role);

      case "GRANT_EXTENSION":
        return ["super_admin", "operations_manager", "finance"].includes(role);

      case "RESOLVE_TICKET":
        return ["super_admin", "operations_manager", "support_agent", "technician"].includes(role);

      case "VIEW_SETTINGS":
        return ["super_admin", "operations_manager", "finance"].includes(role);

      case "EXPORT_REPORTS":
        return ["super_admin", "operations_manager", "finance", "sales"].includes(role);

      default:
        return true;
    }
  };

  return (
    <AuthRoleContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        switchRole,
        canPerform,
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
