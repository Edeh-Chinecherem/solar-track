"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ShieldCheck,
  Users,
  Sliders,
  Bell,
  Clock,
  History,
  Check,
  Save,
  AlertTriangle,
  Search,
  ChevronRight,
  Filter,
  CheckCircle2,
  Lock,
  Zap,
  PowerOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { MOCK_USERS, INSTALLATION_STAGES } from "@/lib/mock-data";
import { solarTrackApi } from "@/lib/api";
import { AuditLogEntry, UserRole } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const ROLE_PERMISSIONS: { [key in UserRole]: string[] } = {
  super_admin: ["All System Permissions", "User & Role Management", "Dual Contactor Override", "Audit Log Export"],
  operations_manager: ["Kanban Stage Progression", "Assign Technicians", "Approve Disconnect", "View Audit Logs"],
  finance: ["Defaulters Queue", "Approve Disconnect", "Grant Extensions", "Record Payments", "Collections Reports"],
  technician: ["Assigned Job Execution", "Stage Checklists", "Photo Uploads", "Alarm Acknowledgement"],
  support_agent: ["Customer Tickets Desk", "Diagnosis Inspection", "Customer Replies", "Attach Telemetry"],
  sales: ["Customer Onboarding Wizard", "Quotation Pipeline", "Generate QR Codes", "Lead Follow-up"]
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "stages" | "thresholds" | "payg" | "audit">("roles");
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogEntry | null>(null);
  const [auditSearch, setAuditSearch] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("all");
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // PAYG Rules State
  const [graceDays, setGraceDays] = useState("3");
  const [autoCutoff, setAutoCutoff] = useState(true);
  const [dualApprovalRequired, setDualApprovalRequired] = useState(true);
  const [smsSchedule, setSmsSchedule] = useState("3_days_before");

  // Thresholds State
  const [thresholds, setThresholds] = useState({
    maxLoadPercent: "110",
    maxTempCelsius: "70",
    batteryMinSoc: "18",
    offlineHeartbeatMinutes: "30"
  });

  useEffect(() => {
    solarTrackApi.getAuditLogs().then(setAuditLogs);
  }, []);

  const handleSaveSettings = (category: string) => {
    setSaveToast(`Settings for ${category} successfully saved and applied.`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      !auditSearch ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.targetId.toLowerCase().includes(auditSearch.toLowerCase());

    const matchesFilter = auditActionFilter === "all" || log.action === auditActionFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-amber-500" />
          Platform Settings & Governance
        </h1>
        <p className="text-sm text-slate-500">
          Configure multi-tenant roles, stage checklist templates, alert thresholds, PAYG rules, and inspect the immutable audit log.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl max-w-fit">
        {[
          { id: "roles", label: "Roles & Permissions", icon: Users },
          { id: "stages", label: "Stage Templates", icon: Sliders },
          { id: "thresholds", label: "Alert Thresholds", icon: Zap },
          { id: "payg", label: "PAYG Automation", icon: PowerOff },
          { id: "audit", label: `Audit Log (${auditLogs.length})`, icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              data-testid={`settings-tab-${tab.id}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: ROLES & PERMISSIONS --- */}
      {activeTab === "roles" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Role-Based Access Control (RBAC) Matrix</CardTitle>
              <CardDescription className="text-xs">
                SolarTrack enforces strict separation of duties between field technicians, sales, operations, support, and financial controllers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.keys(ROLE_PERMISSIONS) as UserRole[]).map((r) => {
                  const perms = ROLE_PERMISSIONS[r];
                  const userCount = MOCK_USERS.filter((u) => u.role === r).length;

                  return (
                    <div
                      key={r}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm capitalize text-slate-900 dark:text-white">
                          {r.replace("_", " ")}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {userCount} Active User{userCount > 1 ? "s" : ""}
                        </Badge>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {perms.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- TAB 2: STAGE TEMPLATES --- */}
      {activeTab === "stages" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">10-Stage Installation Workflow Templates</CardTitle>
            <CardDescription className="text-xs">
              Review and enforce mandatory checklist milestones required to unlock stage progression.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {INSTALLATION_STAGES.map((stg) => (
              <div
                key={stg.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-amber-500">
                      Step {stg.order}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{stg.label}</h4>
                    <Badge variant="outline" className="text-[10px]">
                      SLA: {stg.slaDays} Days
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{stg.description}</p>
                  <div className="pt-1.5 flex flex-wrap gap-1.5">
                    {stg.mandatoryChecklist.map((chk, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium"
                      >
                        ✓ {chk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* --- TAB 3: ALERT THRESHOLDS --- */}
      {activeTab === "thresholds" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inverter Telemetry Trigger Thresholds</CardTitle>
            <CardDescription className="text-xs">
              Configure parameters that trigger automatic diagnostic alarm classifications and support ticket dispatches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Surge Overload Cutoff Limit (% of Inverter Rating)
                </label>
                <Input
                  value={thresholds.maxLoadPercent}
                  onChange={(e) => setThresholds({ ...thresholds, maxLoadPercent: e.target.value })}
                  className="font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400">Triggers instantaneous trip on 5kVA / 10kVA inverters</p>
              </div>

              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Inverter Enclosure Thermal Alarm (°C)
                </label>
                <Input
                  value={thresholds.maxTempCelsius}
                  onChange={(e) => setThresholds({ ...thresholds, maxTempCelsius: e.target.value })}
                  className="font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400">Dispatches high heat-sink alert to regional technician</p>
              </div>

              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Battery Critical Depth of Discharge Minimum (% SOC)
                </label>
                <Input
                  value={thresholds.batteryMinSoc}
                  onChange={(e) => setThresholds({ ...thresholds, batteryMinSoc: e.target.value })}
                  className="font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400">Triggers "Under-charged" alert if held under limit for 3 days</p>
              </div>

              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  GSM Telemetry Heartbeat Timeout (Minutes)
                </label>
                <Input
                  value={thresholds.offlineHeartbeatMinutes}
                  onChange={(e) => setThresholds({ ...thresholds, offlineHeartbeatMinutes: e.target.value })}
                  className="font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400">Marks fleet system status as "Offline" after missed pings</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs gap-1.5"
                onClick={() => handleSaveSettings("Telemetry Thresholds")}
                data-testid="save-thresholds-btn"
              >
                <Save className="w-4 h-4" />
                Save Threshold Parameters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- TAB 4: PAYG AUTOMATION RULES --- */}
      {activeTab === "payg" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pay-As-You-Go (PAYG) Metering & Contactor Rules</CardTitle>
            <CardDescription className="text-xs">
              Automated grace periods, automated SMS warning schedule, and dual-approval security rules.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Grace Period Window (Days after due date)
                </label>
                <select
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-mono"
                  value={graceDays}
                  onChange={(e) => setGraceDays(e.target.value)}
                >
                  <option value="1">1 Day</option>
                  <option value="2">2 Days</option>
                  <option value="3">3 Days (Default Policy)</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days</option>
                </select>
                <p className="text-[10px] text-slate-400">Customer retains power before contactor disconnect</p>
              </div>

              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Automated SMS Reminder Schedule
                </label>
                <select
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-mono"
                  value={smsSchedule}
                  onChange={(e) => setSmsSchedule(e.target.value)}
                >
                  <option value="3_days_before">3 Days Before + Due Date + Day 2 Overdue</option>
                  <option value="5_days_before">5 Days Before + Daily Overdue</option>
                  <option value="due_date_only">Due Date Only</option>
                </select>
                <p className="text-[10px] text-slate-400">Dispatched via Nigerian SMS Gateway (Termii)</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dualApprovalRequired}
                  onChange={(e) => setDualApprovalRequired(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Enforce Dual-Approval on Bulk Contactor Disconnection
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Requires secondary authorization from Operations Manager or Super Admin before sending batch disconnect commands.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoCutoff}
                  onChange={(e) => setAutoCutoff(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Automatic Remote Disconnect on Grace Expiry (00:00 Midnight UTC+1)
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Automatically opens remote contactor for non-regularized accounts with no active extension.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs gap-1.5"
                onClick={() => handleSaveSettings("PAYG Automation Rules")}
                data-testid="save-payg-rules-btn"
              >
                <Save className="w-4 h-4" />
                Save PAYG Governance Rules
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- TAB 5: IMMUTABLE AUDIT LOG VIEWER --- */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="w-5 h-5 text-amber-500" />
                    Immutable Audit Trail Viewer
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Every sensitive action (disconnect, reconnect, extension, create customer) is permanently logged.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-48 sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Search user, action, target..."
                      className="pl-8 text-xs h-8"
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                    value={auditActionFilter}
                    onChange={(e) => setAuditActionFilter(e.target.value)}
                  >
                    <option value="all">All Actions</option>
                    <option value="REMOTE_DISCONNECT">Disconnects</option>
                    <option value="REMOTE_RECONNECT">Reconnects</option>
                    <option value="GRANT_PAYG_EXTENSION">Extensions</option>
                    <option value="CREATE_CUSTOMER">Create Customer</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Operator</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target Entity</th>
                      <th className="p-3">Audit Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center p-8 text-slate-400">
                          No audit entries match filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer"
                          onClick={() => setSelectedAuditLog(log)}
                          data-testid={`audit-row-${log.id}`}
                        >
                          <td className="p-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                            {formatDateTime(log.timestamp)}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {log.userName}
                            </div>
                            <div className="text-[10px] text-slate-400 capitalize">
                              {log.userRole?.replace("_", " ")}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={
                                log.action.includes("DISCONNECT")
                                  ? "destructive"
                                  : log.action.includes("RECONNECT")
                                  ? "success"
                                  : log.action.includes("EXTENSION")
                                  ? "outline"
                                  : "secondary"
                              }
                              className="font-mono text-[10px]"
                            >
                              {log.action}
                            </Badge>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                            {log.targetEntity}: {log.targetId}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                            {log.details}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- AUDIT DETAIL DIALOG --- */}
      <Dialog open={Boolean(selectedAuditLog)} onOpenChange={() => setSelectedAuditLog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-mono flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500" />
              Audit Entry #{selectedAuditLog?.id}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Cryptographically timestamped action record
            </DialogDescription>
          </DialogHeader>

          {selectedAuditLog && (
            <div className="space-y-3 py-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2 overflow-x-auto text-[11px]">
                <div><span className="text-slate-400">Action:</span> <span className="text-amber-400 font-bold">{selectedAuditLog.action}</span></div>
                <div><span className="text-slate-400">Timestamp:</span> {selectedAuditLog.timestamp}</div>
                <div><span className="text-slate-400">Operator:</span> {selectedAuditLog.userName} ({selectedAuditLog.userRole})</div>
                <div><span className="text-slate-400">Target:</span> {selectedAuditLog.targetEntity} / {selectedAuditLog.targetId}</div>
                <div className="pt-2 border-t border-slate-800 text-slate-300 font-sans">
                  {selectedAuditLog.details}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              className="w-full bg-slate-900 text-white text-xs font-bold"
              onClick={() => setSelectedAuditLog(null)}
            >
              Close Inspector
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
