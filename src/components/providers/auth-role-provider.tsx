"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Customer, User, UserRole } from "@/lib/types";
import { MOCK_USERS } from "@/lib/mock-data/users";
import { MOCK_CUSTOMERS } from "@/lib/mock-data/customers";
import { canAccessRoute, canPerformAction } from "@/lib/rbac";
import { api } from "@/lib/api";

interface AuthRoleContextType {
  currentUser: User;
  loggedInUser: User | null;
  currentRole: UserRole;
  isStaffSignedIn: boolean;
  isAuthReady: boolean;
  canSwitchRoles: boolean;
  switchRole: (role: UserRole) => void;
  setActiveStaffUser: (user: User) => void;
  signOutStaff: () => void;
  refreshUsers: () => void;
  canPerform: (action: string) => boolean;
  canAccess: (pathname: string) => boolean;
  availableUsers: User[];
  currentCustomer: Customer | null;
  setActiveCustomer: (customer: Customer) => void;
  signOutCustomer: () => void;
}

const AuthRoleContext = createContext<AuthRoleContextType | undefined>(undefined);

export function AuthRoleProvider({ children }: { children: React.ReactNode }) {
  const [availableUsers, setAvailableUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // fallback persona
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isStaffSignedIn, setIsStaffSignedIn] = useState<boolean>(false);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const canSwitchRoles = isStaffSignedIn && loggedInUser?.role === "super_admin";

  const refreshUsers = useCallback(() => {
    try {
      const users = api.getAllActiveUsersSync();
      setAvailableUsers(users);
      return users;
    } catch (e) {
      console.error(e);
      return MOCK_USERS;
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      const users = refreshUsers();
      try {
        const staffSignedInFlag = localStorage.getItem("solartrack_staff_signed_in") === "true";
        const loggedInId = localStorage.getItem("solartrack_logged_in_user_id");
        const savedUserId = localStorage.getItem("solartrack_active_user_id");
        const savedRoleId = localStorage.getItem("solartrack_active_role");

        if (staffSignedInFlag) {
          const signedInAccount =
            (loggedInId ? users.find((u) => u.id === loggedInId) : undefined) ||
            (savedUserId ? users.find((u) => u.id === savedUserId) : undefined) ||
            (savedRoleId ? users.find((u) => u.role === savedRoleId) : undefined) ||
            null;

          if (signedInAccount) {
            setLoggedInUser(signedInAccount);
            setIsStaffSignedIn(true);

            if (signedInAccount.role === "super_admin") {
              const previewUser =
                (savedUserId ? users.find((u) => u.id === savedUserId) : undefined) ||
                (savedRoleId ? users.find((u) => u.role === savedRoleId) : undefined) ||
                signedInAccount;
              setCurrentUser(previewUser);
            } else {
              // Non-super-admin roles remain strictly locked to their signed-in account
              setCurrentUser(signedInAccount);
            }
          } else {
            setLoggedInUser(null);
            setIsStaffSignedIn(false);
            localStorage.removeItem("solartrack_staff_signed_in");
            localStorage.removeItem("solartrack_logged_in_user_id");
            localStorage.removeItem("solartrack_active_user_id");
            localStorage.removeItem("solartrack_active_role");
          }
        } else {
          setLoggedInUser(null);
          setIsStaffSignedIn(false);
        }

        const savedCustomerId = localStorage.getItem("solartrack_customer_id");
        if (savedCustomerId) {
          const storedCustomersRaw = localStorage.getItem("solartrack_customers");
          const customers: Customer[] = storedCustomersRaw ? JSON.parse(storedCustomersRaw) : MOCK_CUSTOMERS;
          const cust = customers.find((c) => c.id === savedCustomerId);
          if (cust) setCurrentCustomer(cust);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsAuthReady(true);
      }
    });
  }, [refreshUsers]);

  const switchRole = (role: UserRole) => {
    if (!isStaffSignedIn || loggedInUser?.role !== "super_admin") {
      return;
    }
    const users = refreshUsers();
    const matched = users.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      try {
        localStorage.setItem("solartrack_active_role", role);
        localStorage.setItem("solartrack_active_user_id", matched.id);
        localStorage.setItem("solartrack_staff_signed_in", "true");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const setActiveStaffUser = (user: User) => {
    refreshUsers();
    setLoggedInUser(user);
    setCurrentUser(user);
    setIsStaffSignedIn(true);
    try {
      localStorage.setItem("solartrack_logged_in_user_id", user.id);
      localStorage.setItem("solartrack_active_role", user.role);
      localStorage.setItem("solartrack_active_user_id", user.id);
      localStorage.setItem("solartrack_staff_signed_in", "true");
    } catch (e) {
      console.error(e);
    }
  };

  const signOutStaff = () => {
    setLoggedInUser(null);
    setCurrentUser(MOCK_USERS[0]);
    setIsStaffSignedIn(false);
    try {
      localStorage.removeItem("solartrack_logged_in_user_id");
      localStorage.removeItem("solartrack_active_role");
      localStorage.removeItem("solartrack_active_user_id");
      localStorage.removeItem("solartrack_staff_signed_in");
    } catch (e) {
      console.error(e);
    }
  };

  const setActiveCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    try {
      localStorage.setItem("solartrack_customer_id", customer.id);
    } catch (e) {
      console.error(e);
    }
  };

  const signOutCustomer = () => {
    setCurrentCustomer(null);
    try {
      localStorage.removeItem("solartrack_customer_id");
    } catch (e) {
      console.error(e);
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
        loggedInUser,
        currentRole: currentUser.role,
        isStaffSignedIn,
        isAuthReady,
        canSwitchRoles,
        switchRole,
        setActiveStaffUser,
        signOutStaff,
        refreshUsers,
        canPerform,
        canAccess,
        availableUsers,
        currentCustomer,
        setActiveCustomer,
        signOutCustomer
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
