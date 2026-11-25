"use client";

import React, { useState } from "react";
import {
  Menu,
  Sun,
  Moon,
  UserCheck,
  ChevronDown,
  ExternalLink
} from "lucide-react";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GreenerAfrikTopBand, GreenerAfrikEmblem } from "@/components/ui/greenerafrik-logo";
import { canAccessRoute, ROLE_META } from "@/lib/rbac";

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentRole, switchRole, availableUsers } = useAuthRole();
  const { theme, toggleTheme } = useTheme();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex flex-col w-full border-b border-emerald-200 dark:border-emerald-900 bg-white/95 dark:bg-[#06361f]/95 backdrop-blur transition-colors">
      {/* GreenerAfrik Signature Dual-Color Band */}
      <GreenerAfrikTopBand />

      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden rounded-lg p-2 text-[#0A5C36] hover:text-[#05361e] dark:text-emerald-200 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-[#084729] transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="lg:hidden">
              <GreenerAfrikEmblem size={28} />
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-700/80 dark:text-emerald-200/80">
              <span className="font-bold text-[#0A5C36] dark:text-[#10B981]">GreenerAfrik Operations</span>
              <span>/</span>
              <span>Nigeria Solar Fleet & Telemetry</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* ROLE SWITCHER DROPDOWN */}
          <div className="relative">
            <button
              data-testid="role-switcher-btn"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-[#084729]/80 px-3 py-1.5 text-xs font-semibold text-[#05361e] dark:text-white hover:border-[#0A5C36] dark:hover:border-[#10B981] transition cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0A5C36] dark:bg-[#10B981] animate-pulse" />
                <span className="hidden md:inline text-emerald-700/80 dark:text-emerald-200/80 font-normal">Active Role:</span>
                <span className="font-bold text-[#05361e] dark:text-white">
                  {ROLE_META[currentRole]?.title || currentRole}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#0A5C36] dark:text-emerald-300" />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-emerald-100 dark:border-emerald-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#0A5C36] dark:text-[#10B981]">
                      Switch Active Persona
                    </div>
                    <div className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80 mt-0.5">
                      Live demo: UI permissions adapt immediately
                    </div>
                  </div>

                  <div className="mt-1 space-y-1">
                    {availableUsers.map((user) => {
                      const isSelected = user.role === currentRole;
                      const meta = ROLE_META[user.role];

                      return (
                        <button
                          key={user.id}
                          data-testid={`role-option-${user.role}`}
                          onClick={() => {
                            switchRole(user.role);
                            setRoleDropdownOpen(false);
                            if (!canAccessRoute(user.role, pathname)) {
                              router.push("/admin");
                            }
                          }}
                          className={cn(
                            "w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition cursor-pointer",
                            isSelected
                              ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 font-semibold text-emerald-950 dark:text-emerald-200"
                              : "hover:bg-emerald-50/70 dark:hover:bg-[#084729] text-[#05361e] dark:text-emerald-100"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-[#0A5C36] flex items-center justify-center font-bold text-[#0A5C36] dark:text-white text-[11px]">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold leading-tight">{meta?.title}</div>
                              <div className="text-[10px] text-emerald-700/80 dark:text-emerald-200/80">{user.name}</div>
                            </div>
                          </div>
                          {isSelected && <UserCheck className="w-4 h-4 text-[#0A5C36] dark:text-[#10B981]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            data-testid="theme-toggle-btn"
            onClick={toggleTheme}
            className="rounded-xl p-2 text-[#0A5C36] hover:text-[#05361e] dark:text-emerald-200 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-[#084729] transition"
            aria-label="Toggle color theme"
            title="Toggle light/dark mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-[#EA580C]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Public QR shortcut */}
          <Link
            href="/q/ST-LGS-001-X9"
            target="_blank"
            className="hidden xl:flex items-center gap-1.5 text-xs text-emerald-700/80 dark:text-emerald-200 hover:text-[#0A5C36] dark:hover:text-[#10B981] transition font-medium"
            title="Open sample public QR landing"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Tag</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
