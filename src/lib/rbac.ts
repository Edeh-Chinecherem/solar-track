import { UserRole } from "@/lib/types";

export type CustomerProfileTab =
  | "overview"
  | "timeline"
  | "telemetry"
  | "usage"
  | "payments"
  | "tickets"
  | "documents"
  | "audit";

export type SettingsTab = "roles" | "stages" | "thresholds" | "payg" | "audit";

export const ROLE_META: Record<
  UserRole,
  {
    title: string;
    shortTitle: string;
    badgeColor: string;
  }
> = {
  super_admin: {
    title: "Super Admin",
    shortTitle: "Super Admin",
    badgeColor:
      "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
  },
  operations_manager: {
    title: "Operations Manager",
    shortTitle: "Ops Manager",
    badgeColor:
      "bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"
  },
  sales: {
    title: "Sales Executive",
    shortTitle: "Sales",
    badgeColor:
      "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
  },
  technician: {
    title: "Field Technician",
    shortTitle: "Technician",
    badgeColor:
      "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
  },
  support_agent: {
    title: "Support Specialist",
    shortTitle: "Support Agent",
    badgeColor:
      "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
  },
  finance: {
    title: "Finance & Accounts",
    shortTitle: "Finance",
    badgeColor:
      "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
  }
};

export const ROLE_ALLOWED_ROUTES: Record<UserRole, string[]> = {
  super_admin: [
    "/admin",
    "/admin/customers",
    "/admin/customers/new",
    "/admin/installations",
    "/admin/monitoring",
    "/admin/tickets",
    "/admin/payg",
    "/admin/scan",
    "/admin/reports",
    "/admin/settings",
    "/tech",
    "/portal"
  ],
  operations_manager: [
    "/admin",
    "/admin/customers",
    "/admin/customers/new",
    "/admin/installations",
    "/admin/monitoring",
    "/admin/tickets",
    "/admin/payg",
    "/admin/scan",
    "/admin/reports",
    "/admin/settings",
    "/tech",
    "/portal"
  ],
  sales: [
    "/admin",
    "/admin/customers",
    "/admin/customers/new",
    "/admin/installations",
    "/admin/scan",
    "/portal"
  ],
  technician: [
    "/admin",
    "/admin/installations",
    "/admin/monitoring",
    "/admin/tickets",
    "/admin/scan",
    "/tech"
  ],
  support_agent: [
    "/admin",
    "/admin/customers",
    "/admin/monitoring",
    "/admin/tickets",
    "/admin/scan",
    "/portal"
  ],
  finance: [
    "/admin",
    "/admin/customers",
    "/admin/payg",
    "/admin/reports"
  ]
};

/**
 * Checks whether the given role is permitted to access the given route pathname.
 */
export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const allowed = ROLE_ALLOWED_ROUTES[role] || [];

  if (pathname === "/admin" || pathname === "/admin/") {
    return allowed.includes("/admin");
  }

  // Check exact /admin/customers/new before /admin/customers prefix
  if (pathname === "/admin/customers/new" || pathname.startsWith("/admin/customers/new/")) {
    return allowed.includes("/admin/customers/new");
  }

  if (pathname === "/admin/customers" || pathname.startsWith("/admin/customers/")) {
    return allowed.includes("/admin/customers");
  }

  if (pathname === "/tech" || pathname.startsWith("/tech/")) {
    return allowed.includes("/tech");
  }

  if (pathname === "/portal" || pathname.startsWith("/portal/")) {
    return allowed.includes("/portal");
  }

  const matchedBase = [
    "/admin/installations",
    "/admin/monitoring",
    "/admin/tickets",
    "/admin/payg",
    "/admin/scan",
    "/admin/reports",
    "/admin/settings"
  ].find((base) => pathname === base || pathname.startsWith(`${base}/`));

  if (matchedBase) {
    return allowed.includes(matchedBase);
  }

  return true;
}

const CUSTOMER_TAB_ROLES: Record<CustomerProfileTab, UserRole[]> = {
  overview: ["super_admin", "operations_manager", "sales", "support_agent", "finance"],
  timeline: ["super_admin", "operations_manager", "sales"],
  telemetry: ["super_admin", "operations_manager", "support_agent"],
  usage: ["super_admin", "operations_manager", "support_agent"],
  payments: ["super_admin", "operations_manager", "finance"],
  tickets: ["super_admin", "operations_manager", "support_agent"],
  documents: ["super_admin", "operations_manager", "sales", "support_agent", "finance"],
  audit: ["super_admin", "operations_manager"]
};

export function canAccessCustomerTab(role: UserRole, tab: CustomerProfileTab): boolean {
  return CUSTOMER_TAB_ROLES[tab]?.includes(role) ?? false;
}

const SETTINGS_TAB_ROLES: Record<SettingsTab, UserRole[]> = {
  roles: ["super_admin", "operations_manager"],
  stages: ["super_admin", "operations_manager"],
  thresholds: ["super_admin"],
  payg: ["super_admin"],
  audit: ["super_admin", "operations_manager"]
};

export function canAccessSettingsTab(role: UserRole, tab: SettingsTab): boolean {
  return SETTINGS_TAB_ROLES[tab]?.includes(role) ?? false;
}

const ACTION_ROLES: Record<string, UserRole[]> = {
  CREATE_CUSTOMER: ["super_admin", "operations_manager", "sales"],
  ADVANCE_STAGE: ["super_admin", "operations_manager", "technician", "sales"],
  DISCONNECT_PAYG: ["super_admin", "operations_manager", "finance"],
  APPROVE_BULK_DISCONNECT: ["super_admin", "operations_manager"],
  GRANT_EXTENSION: ["super_admin", "operations_manager", "finance"],
  RESOLVE_TICKET: ["super_admin", "operations_manager", "support_agent", "technician"],
  VIEW_SETTINGS: ["super_admin", "operations_manager"],
  EDIT_SETTINGS: ["super_admin"],
  VIEW_AUDIT_LOGS: ["super_admin", "operations_manager"],
  EXPORT_REPORTS: ["super_admin", "operations_manager", "finance", "sales"]
};

export function canPerformAction(role: UserRole, action: string): boolean {
  if (role === "super_admin") return true;
  const allowed = ACTION_ROLES[action];
  if (!allowed) return false;
  return allowed.includes(role);
}
