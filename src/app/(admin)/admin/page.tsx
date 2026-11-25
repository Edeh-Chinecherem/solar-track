"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  KanbanSquare,
  Activity,
  CreditCard,
  LifeBuoy,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Sun,
  BatteryCharging,
  Zap,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { MOCK_CUSTOMERS, MOCK_SYSTEMS, MOCK_INSTALLATIONS, MOCK_PAYG_ACCOUNTS, MOCK_TICKETS } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";
import { ROLE_META } from "@/lib/rbac";

export default function AdminOverviewPage() {
  const { currentRole, currentUser, canAccess } = useAuthRole();

  const canSeeCustomers = canAccess("/admin/customers");
  const canCreateCustomer = canAccess("/admin/customers/new");
  const canSeeInstallations = canAccess("/admin/installations");
  const canSeeMonitoring = canAccess("/admin/monitoring");
  const canSeeTickets = canAccess("/admin/tickets");
  const canSeePayg = canAccess("/admin/payg");
  const canSeeReports = canAccess("/admin/reports");

  const totalCustomers = MOCK_CUSTOMERS.length;
  const activeInstallations = MOCK_INSTALLATIONS.filter((i) => i.currentStage !== "live" && i.currentStage !== "follow_up_30d").length;
  const onlineSystems = MOCK_SYSTEMS.filter((s) => s.status === "online").length;
  const offlineSystems = MOCK_SYSTEMS.filter((s) => s.status === "offline").length;
  const alertSystems = MOCK_SYSTEMS.filter((s) => s.status === "overload" || s.status === "hardware_fault" || s.status === "low_battery").length;
  const openTickets = MOCK_TICKETS.filter((t) => t.status !== "closed" && t.status !== "resolved").length;
  const paygDefaulters = MOCK_PAYG_ACCOUNTS.filter((p) => p.status === "grace_period" || p.status === "pending_disconnect" || p.status === "disconnected").length;
  const monthlyCollections = 14850000;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* Top Banner with Active Persona Feedback */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <Sun className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Solar Operations Desk • Nigeria Fleet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Operating as <strong className="text-amber-400 uppercase tracking-wide">{ROLE_META[currentRole]?.title || currentRole.replace("_", " ")}</strong>. Navigation, metrics, and actions reflect your authorized workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {canCreateCustomer && (
              <Link href="/admin/customers/new">
                <Button variant="primary" className="shadow-lg shadow-amber-500/20">
                  + Add Customer
                </Button>
              </Link>
            )}
            {canSeeMonitoring && (
              <Link href="/admin/monitoring">
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                  Fleet Health View
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        {canSeeCustomers && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Customers</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCustomers}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>5 states in NG</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metric 2 */}
        {canSeeInstallations && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Pipelines</span>
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <KanbanSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{activeInstallations}</div>
              <div className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
                Across 10 stages
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metric 3 */}
        {canSeeMonitoring && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Fleet Online</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{onlineSystems}</div>
              <div className="text-[11px] text-slate-500 font-medium">
                {offlineSystems} offline dataloggers
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metric 4 */}
        {canSeeMonitoring && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Telemetry Alerts</span>
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{alertSystems}</div>
              <div className="text-[11px] text-rose-500 font-semibold">
                Overload & Hardware
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metric 5 */}
        {canSeePayg && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">PAYG Defaulters</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{paygDefaulters}</div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                Grace & Disconnect
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metric 6 */}
        {canSeePayg && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Collections (MTD)</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white truncate">
                {formatNaira(monthlyCollections)}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">
                +18% vs last month
              </div>
            </CardContent>
          </Card>
        )}

        {/* Open Tickets KPI for roles with Tickets access without PAYG */}
        {canSeeTickets && !canSeePayg && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Open Tickets</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <LifeBuoy className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{openTickets}</div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                SLA Active Queue
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {canSeeCustomers && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Customer Registry</span>
                <Badge variant="amber">{totalCustomers} Installed</Badge>
              </CardTitle>
              <CardDescription>
                Searchable directory with customer onboarding and QR label generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-slate-500">
                Lagos (10), Abuja (5), Rivers (4), Oyo (3), Kano (3).
              </div>
              <Link href="/admin/customers" className="block">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>View Registry</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {canSeeInstallations && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Installations Kanban</span>
                <Badge variant="secondary">10 Stages</Badge>
              </CardTitle>
              <CardDescription>
                Workflow board with mandatory checklist gating and photo upload drawer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-slate-500">
                Inquiry → Survey → Quotation → Dispatch → Commissioning → Live.
              </div>
              <Link href="/admin/installations" className="block">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>Open Kanban Board</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {canSeePayg && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Telemetry & PAYG</span>
                <Badge variant="destructive">{paygDefaulters} Defaulters</Badge>
              </CardTitle>
              <CardDescription>
                PAYG billing oversight, grace extensions, and remote disconnect commands.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-slate-500">
                Deye, Sunsynk, Growatt, Victron telemetries with 3-step disconnect handshake.
              </div>
              <Link href="/admin/payg" className="block">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>Manage PAYG Accounts</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {canSeeMonitoring && !canSeePayg && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Fleet Monitoring</span>
                <Badge variant="destructive">{alertSystems} Alerts</Badge>
              </CardTitle>
              <CardDescription>
                Live inverter telemetry, fault diagnosis engine, and site health metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-slate-500">
                {onlineSystems} systems online • {offlineSystems} offline dataloggers.
              </div>
              <Link href="/admin/monitoring" className="block">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>Open Fleet Health</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {canSeeTickets && !canSeePayg && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Support & SLA Desk</span>
                <Badge variant="warning">{openTickets} Open</Badge>
              </CardTitle>
              <CardDescription>
                Customer complaint tickets, SLA timers, and telemetry diagnosis snapshots.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-slate-500">
                Respond to customers, log internal engineering notes, and resolve cases.
              </div>
              <Link href="/admin/tickets" className="block">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>Open Tickets Desk</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {canSeeReports && currentRole === "finance" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Collections Reports</span>
                <Badge variant="success">93.8% Rate</Badge>
              </CardTitle>
              <CardDescription>
                Monthly PAYG revenue recovery charts and collections CSV/PDF exports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-slate-500">
                Track billed targets vs Paystack & bank transfer settlements.
              </div>
              <Link href="/admin/reports" className="block">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>View Collections Reports</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
