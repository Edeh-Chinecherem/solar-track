"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  AlertTriangle,
  PowerOff,
  Power,
  Clock,
  ShieldAlert,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowRight,
  Filter,
  Check,
  RotateCcw,
  UserCheck,
  Send,
  Loader2,
  FileCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { api, solarTrackApi } from "@/lib/api";
import { Customer, SolarSystem, PAYGAccount, DisconnectCommand, User } from "@/lib/types";
import { MOCK_USERS } from "@/lib/mock-data";
import { formatNaira, formatDate } from "@/lib/utils";

export default function AdminPAYGPage() {
  const { currentUser } = useAuthRole();
  const currentRole = currentUser.role;
  const [accounts, setAccounts] = useState<PAYGAccount[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [systems, setSystems] = useState<SolarSystem[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "defaulters" | "grace" | "disconnected" | "extended">("all");
  const [isLoading, setIsLoading] = useState(true);

  // Selection for bulk actions
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Disconnect Modal State
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [targetAccount, setTargetAccount] = useState<PAYGAccount | null>(null);
  const [disconnectReason, setDisconnectReason] = useState("");
  const [isBulkDisconnect, setIsBulkDisconnect] = useState(false);
  const [secondApproverId, setSecondApproverId] = useState(MOCK_USERS[0].id);

  // Command handshake execution simulation
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);
  const [commandStage, setCommandStage] = useState<"idle" | "sent" | "acknowledged" | "confirmed">("idle");
  const [completedCommand, setCompletedCommand] = useState<DisconnectCommand | null>(null);

  // Reconnect Modal State
  const [reconnectModalOpen, setReconnectModalOpen] = useState(false);

  // Extension Modal State
  const [extensionModalOpen, setExtensionModalOpen] = useState(false);
  const [extensionDays, setExtensionDays] = useState("7");
  const [extensionReason, setExtensionReason] = useState("Salary delay confirmed by employer");

  // Manual Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Bank Transfer" | "POS" | "Paystack">("Bank Transfer");
  const [paymentReference, setPaymentReference] = useState("");

  // Role permissions
  const canManagePAYG = ["super_admin", "operations_manager", "finance"].includes(currentRole);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [accs, custs, syss] = await Promise.all([
        solarTrackApi.getPAYGAccounts(),
        solarTrackApi.getCustomers(),
        solarTrackApi.getSolarSystems()
      ]);
      setAccounts(accs);
      setCustomers(custs);
      setSystems(syss);
    } catch (e) {
      console.error("Failed to load PAYG data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    const cust = customers.find((c) => c.id === acc.customerId);
    const matchesSearch =
      !search ||
      (cust?.name.toLowerCase().includes(search.toLowerCase()) ||
        cust?.phone.includes(search) ||
        acc.systemId.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === "defaulters") return acc.balanceOwedNaira > 0 || (acc.daysOverdue || 0) > 0;
    if (activeTab === "grace") return acc.status === "grace_period";
    if (activeTab === "disconnected") return acc.status === "disconnected";
    if (activeTab === "extended") return Boolean(acc.activeExtensionUntil);

    return true;
  });

  // Calculate KPIs
  const totalDefaulters = accounts.filter((a) => (a.daysOverdue || 0) > 0 || a.balanceOwedNaira > 0);
  const totalBalanceOwed = totalDefaulters.reduce((acc, curr) => acc + curr.balanceOwedNaira, 0);
  const graceAccounts = accounts.filter((a) => a.status === "grace_period");
  const disconnectedAccounts = accounts.filter((a) => a.status === "disconnected");

  // Handle single disconnect
  const openSingleDisconnect = (acc: PAYGAccount) => {
    setTargetAccount(acc);
    setIsBulkDisconnect(false);
    setDisconnectReason(`Payment ${acc.daysOverdue || 0} days overdue. Contactor disconnect triggered.`);
    setCommandStage("idle");
    setCompletedCommand(null);
    setDisconnectModalOpen(true);
  };

  // Handle bulk disconnect
  const openBulkDisconnect = () => {
    setIsBulkDisconnect(true);
    setTargetAccount(null);
    setDisconnectReason(`Bulk disconnection for ${selectedAccountIds.length} overdue accounts past grace limit.`);
    setCommandStage("idle");
    setCompletedCommand(null);
    setDisconnectModalOpen(true);
  };

  // Execute Disconnect Handshake
  const handleExecuteDisconnect = async () => {
    setIsExecutingCommand(true);
    setCommandStage("sent");

    // Stage 1 -> Stage 2: Sent to Acknowledged
    await new Promise((r) => setTimeout(r, 600));
    setCommandStage("acknowledged");

    // Stage 2 -> Stage 3: Acknowledged to Confirmed
    await new Promise((r) => setTimeout(r, 800));

    try {
      const secondApprover = isBulkDisconnect
        ? MOCK_USERS.find((u) => u.id === secondApproverId)
        : undefined;

      if (isBulkDisconnect) {
        for (const accId of selectedAccountIds) {
          const acc = accounts.find((a) => a.id === accId);
          if (acc) {
            await solarTrackApi.executeRemoteDisconnect(
              acc.systemId,
              acc.customerId,
              disconnectReason,
              currentUser,
              secondApprover
            );
          }
        }
        setSelectedAccountIds([]);
      } else if (targetAccount) {
        const cmd = await solarTrackApi.executeRemoteDisconnect(
          targetAccount.systemId,
          targetAccount.customerId,
          disconnectReason,
          currentUser
        );
        setCompletedCommand(cmd);
      }

      setCommandStage("confirmed");
      await loadData();
    } catch (e) {
      console.error("Disconnect execution failed", e);
    } finally {
      setIsExecutingCommand(false);
    }
  };

  // Open Reconnect
  const openReconnect = (acc: PAYGAccount) => {
    setTargetAccount(acc);
    setCommandStage("idle");
    setCompletedCommand(null);
    setReconnectModalOpen(true);
  };

  // Execute Reconnect Handshake
  const handleExecuteReconnect = async () => {
    if (!targetAccount) return;
    setIsExecutingCommand(true);
    setCommandStage("sent");

    await new Promise((r) => setTimeout(r, 600));
    setCommandStage("acknowledged");

    await new Promise((r) => setTimeout(r, 800));

    try {
      const cmd = await solarTrackApi.executeRemoteReconnect(
        targetAccount.systemId,
        targetAccount.customerId,
        currentUser
      );
      setCompletedCommand(cmd);
      setCommandStage("confirmed");
      await loadData();
    } catch (e) {
      console.error("Reconnect execution failed", e);
    } finally {
      setIsExecutingCommand(false);
    }
  };

  // Open Extension
  const openExtension = (acc: PAYGAccount) => {
    setTargetAccount(acc);
    setExtensionDays("7");
    setExtensionReason("Salary delay confirmed by employer");
    setExtensionModalOpen(true);
  };

  const handleGrantExtension = async () => {
    if (!targetAccount) return;
    setIsExecutingCommand(true);
    try {
      await solarTrackApi.grantPAYGExtension(
        targetAccount.id,
        parseInt(extensionDays) || 7,
        extensionReason,
        currentUser
      );
      setExtensionModalOpen(false);
      await loadData();
    } catch (e) {
      console.error("Failed to grant extension", e);
    } finally {
      setIsExecutingCommand(false);
    }
  };

  // Open Payment
  const openManualPayment = (acc: PAYGAccount) => {
    setTargetAccount(acc);
    setPaymentAmount(acc.balanceOwedNaira > 0 ? acc.balanceOwedNaira.toString() : "45000");
    setPaymentReference(`TRF-${Math.floor(100000 + Math.random() * 900000)}`);
    setPaymentModalOpen(true);
  };

  const handleRecordPayment = async () => {
    if (!targetAccount) return;
    setIsExecutingCommand(true);
    try {
      const amt = parseFloat(paymentAmount) || 0;
      await solarTrackApi.recordCustomerPayment(
        targetAccount.customerId,
        amt,
        paymentMethod,
        currentUser
      );
      setPaymentModalOpen(false);
      await loadData();
    } catch (e) {
      console.error("Failed to record payment", e);
    } finally {
      setIsExecutingCommand(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedAccountIds.length === filteredAccounts.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(filteredAccounts.map((a) => a.id));
    }
  };

  const toggleSelectAccount = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-[#0A5C36] dark:text-[#10B981]" />
            PAYG & Defaulters Desk
          </h1>
          <p className="text-sm text-emerald-700/80 dark:text-emerald-200/80">
            Real-time metering credit management, grace tracking, and dual-approved remote contactor control.
          </p>
        </div>

        {/* Role permission status banner */}
        {!canManagePAYG ? (
          <div className="flex items-center gap-2 text-xs font-bold text-[#EA580C] bg-orange-50 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800 px-3 py-2 rounded-xl">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Role: {currentRole} (Read-Only Financial Operations)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {selectedAccountIds.length > 0 && (
              <Button
                variant="destructive"
                className="gap-2 shadow-lg"
                onClick={openBulkDisconnect}
                data-testid="bulk-disconnect-btn"
              >
                <PowerOff className="w-4 h-4" />
                Disconnect Selected ({selectedAccountIds.length})
              </Button>
            )}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#C2410C]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-700/80 dark:text-emerald-200/80 uppercase">Defaulters Queue</p>
              <h3 className="text-2xl font-black mt-1 text-[#C2410C] dark:text-orange-400">{totalDefaulters.length} Accounts</h3>
              <p className="text-xs font-semibold text-emerald-700/80 dark:text-emerald-200/80 mt-0.5">
                Total owed: {formatNaira(totalBalanceOwed)}
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/40 text-[#C2410C] dark:text-orange-400 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#EA580C]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-700/80 dark:text-emerald-200/80 uppercase">In Grace Period</p>
              <h3 className="text-2xl font-black mt-1 text-[#EA580C]">{graceAccounts.length} Systems</h3>
              <p className="text-xs font-semibold text-emerald-700/80 dark:text-emerald-200/80 mt-0.5">
                Auto-disconnect in 1-3 days
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/40 text-[#EA580C] rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#074728]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-700/80 dark:text-emerald-200/80 uppercase">Contactor Cutoff</p>
              <h3 className="text-2xl font-black mt-1 text-[#05361e] dark:text-white">
                {disconnectedAccounts.length} Disconnected
              </h3>
              <p className="text-xs font-semibold text-emerald-700/80 dark:text-emerald-200/80 mt-0.5">
                Hardware contactor open
              </p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-[#084729] text-[#0A5C36] dark:text-emerald-200 rounded-2xl">
              <PowerOff className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-700/80 dark:text-emerald-200/80 uppercase">Collection Rate</p>
              <h3 className="text-2xl font-black mt-1 text-emerald-600">93.8%</h3>
              <p className="text-xs font-semibold text-emerald-700/80 dark:text-emerald-200/80 mt-0.5">
                ₦18.4M recovered this month
              </p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Accounts" },
            { id: "defaulters", label: `Defaulters (${totalDefaulters.length})` },
            { id: "grace", label: `Grace Period (${graceAccounts.length})` },
            { id: "disconnected", label: `Disconnected (${disconnectedAccounts.length})` },
            { id: "extended", label: "Extensions" }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              className="rounded-full text-xs font-bold"
              onClick={() => setActiveTab(tab.id as any)}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-emerald-600/80" />
          <Input
            placeholder="Search customer, phone, system..."
            className="pl-9 h-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-50 dark:bg-[#084729]/60 text-emerald-700/80 dark:text-emerald-200/80 font-bold border-b border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-emerald-300 accent-[#0A5C36] text-[#0A5C36] focus:ring-[#0A5C36] h-4 w-4"
                    checked={
                      filteredAccounts.length > 0 &&
                      selectedAccountIds.length === filteredAccounts.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4">Customer & Location</th>
                <th className="p-4">Solar System</th>
                <th className="p-4">Balance Owed</th>
                <th className="p-4">Status & Grace</th>
                <th className="p-4">Power Credit Left</th>
                <th className="p-4">Last Payment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900 font-medium">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-emerald-600/80 dark:text-emerald-300/80">
                    No matching PAYG accounts found.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const cust = customers.find((c) => c.id === acc.customerId);
                  const sys = systems.find((s) => s.id === acc.systemId);
                  const isSelected = selectedAccountIds.includes(acc.id);

                  return (
                    <tr
                      key={acc.id}
                      className={`hover:bg-emerald-50/80 dark:hover:bg-[#084729]/40 transition-colors ${isSelected ? "bg-emerald-50/60 dark:bg-emerald-950/20" : ""
                        }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="rounded border-emerald-300 accent-[#0A5C36] text-[#0A5C36] focus:ring-[#0A5C36] h-4 w-4"
                          checked={isSelected}
                          onChange={() => toggleSelectAccount(acc.id)}
                        />
                      </td>

                      {/* Customer Info */}
                      <td className="p-4">
                        <div className="font-bold text-[#05361e] dark:text-white text-sm">
                          {cust?.name || "Customer"}
                        </div>
                        <div className="text-emerald-700/80 dark:text-emerald-200/80 font-mono text-[11px]">{cust?.phone}</div>
                        <div className="text-emerald-600/80 dark:text-emerald-300/80 text-[11px]">{cust?.state}, {cust?.lga}</div>
                      </td>

                      {/* Solar System */}
                      <td className="p-4">
                        <div className="font-bold text-[#05361e] dark:text-emerald-100">
                          {sys?.inverterBrand} {sys?.inverterCapacityKva}kVA
                        </div>
                        <div className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80 font-mono">
                          SN: {sys?.inverterSerialNumber}
                        </div>
                        <div className="text-[10px] text-emerald-600/80 dark:text-emerald-300/80 font-mono">
                          SysID: {acc.systemId}
                        </div>
                      </td>

                      {/* Balance Owed */}
                      <td className="p-4">
                        <div
                          className={`font-black text-sm ${acc.balanceOwedNaira > 0 ? "text-[#C2410C] dark:text-orange-400" : "text-emerald-600"
                            }`}
                        >
                          {formatNaira(acc.balanceOwedNaira)}
                        </div>
                        {(acc.daysOverdue || 0) > 0 && (
                          <div className="text-[11px] text-[#EA580C] font-semibold">
                            {acc.daysOverdue} days overdue
                          </div>
                        )}
                      </td>

                      {/* Status & Grace */}
                      <td className="p-4">
                        {acc.status === "disconnected" ? (
                          <Badge variant="destructive" className="gap-1">
                            <PowerOff className="w-3 h-3" />
                            Contactor Cutoff
                          </Badge>
                        ) : acc.status === "grace_period" ? (
                          <div className="space-y-1">
                            <Badge variant="warning" className="gap-1 animate-pulse">
                              <Clock className="w-3 h-3" />
                              Grace Period
                            </Badge>
                            <div className="text-[10px] text-[#EA580C] dark:text-orange-400 font-bold">
                              Due: {formatDate(acc.nextDueDate)}
                            </div>
                          </div>
                        ) : acc.activeExtensionUntil ? (
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-[#0A5C36] dark:text-[#10B981] border-[#0A5C36]/40 bg-emerald-50 dark:bg-emerald-950/40">
                              Extension: {formatDate(acc.activeExtensionUntil)}
                            </Badge>
                            <div className="text-[10px] text-emerald-700/80 dark:text-emerald-200/80 truncate max-w-[130px]" title={acc.extensionReason}>
                              {acc.extensionReason}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>

                      {/* Power Credit Left */}
                      <td className="p-4 font-mono font-bold">
                        <span
                          className={
                            acc.daysRemainingOfPower <= 3
                              ? "text-[#C2410C] dark:text-orange-400"
                              : acc.daysRemainingOfPower <= 7
                                ? "text-[#EA580C]"
                                : "text-[#0A5C36] dark:text-emerald-200"
                          }
                        >
                          {acc.daysRemainingOfPower} days
                        </span>
                        <div className="text-[10px] text-emerald-600/80 dark:text-emerald-300/80 font-sans">
                          {acc.billingCycle} billing
                        </div>
                      </td>

                      {/* Last Payment */}
                      <td className="p-4">
                        <div className="font-semibold text-[#05361e] dark:text-emerald-100">
                          {formatDate(acc.lastPaymentDate)}
                        </div>
                        <div className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80">
                          {formatNaira(acc.monthlyInstallmentNaira)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canManagePAYG ? (
                            <>
                              {acc.status === "disconnected" ? (
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                  onClick={() => openReconnect(acc)}
                                  data-testid={`reconnect-btn-${acc.id}`}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                  Reconnect
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs text-[#C2410C] border-orange-300 hover:bg-orange-50 hover:text-[#9A3412] dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-950/50 gap-1"
                                  onClick={() => openSingleDisconnect(acc)}
                                  data-testid={`disconnect-btn-${acc.id}`}
                                >
                                  <PowerOff className="w-3.5 h-3.5" />
                                  Disconnect
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs gap-1"
                                onClick={() => openExtension(acc)}
                                title="Grant Extension"
                                data-testid={`extension-btn-${acc.id}`}
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                Extend
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs gap-1 bg-orange-50 hover:bg-orange-100 text-[#EA580C] border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800"
                                onClick={() => openManualPayment(acc)}
                                title="Record Manual Payment"
                                data-testid={`payment-btn-${acc.id}`}
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                Pay
                              </Button>
                            </>
                          ) : (
                            <span className="text-[11px] text-emerald-600/80 dark:text-emerald-300/80 italic">
                              Restricted (Finance only)
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* --- DISCONNECT MODAL (Single / Bulk with Handshake) --- */}
      <Dialog open={disconnectModalOpen} onOpenChange={setDisconnectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#C2410C] dark:text-orange-400">
              <ShieldAlert className="w-6 h-6" />
              <DialogTitle>
                {isBulkDisconnect
                  ? `Dual-Approved Bulk Disconnect (${selectedAccountIds.length} Systems)`
                  : "Remote Contactor Disconnect"}
              </DialogTitle>
            </div>
            <DialogDescription>
              {isBulkDisconnect
                ? "Disconnection of multiple systems requires second-approver authorization and immediately opens the remote load contactors."
                : `System: ${targetAccount?.systemId} | Balance: ${formatNaira(targetAccount?.balanceOwedNaira || 0)}`}
            </DialogDescription>
          </DialogHeader>

          {/* Handshake Command Execution UI */}
          {commandStage !== "idle" ? (
            <div className="py-6 space-y-4">
              <div className="p-4 rounded-2xl bg-[#05361e] text-white space-y-3 font-mono text-xs border border-emerald-800">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-800">
                  <span className="text-emerald-200/80">TELEMETRY HANDSHAKE PROTOCOL</span>
                  <span className="text-[#EA580C]">GSM/MQTT CH: 0x88F</span>
                </div>

                {/* Step 1: Sent */}
                <div className="flex items-center gap-3">
                  {commandStage === "sent" ? (
                    <Loader2 className="w-4 h-4 text-[#EA580C] animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className={commandStage === "sent" ? "text-orange-300 font-bold" : "text-emerald-100"}>
                    Step 1: Queued & Transmitted to Remote Contactor Gateway
                  </span>
                </div>

                {/* Step 2: Acknowledged */}
                <div className="flex items-center gap-3">
                  {commandStage === "acknowledged" ? (
                    <Loader2 className="w-4 h-4 text-[#EA580C] animate-spin" />
                  ) : commandStage === "confirmed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-emerald-700" />
                  )}
                  <span className={commandStage === "acknowledged" ? "text-orange-300 font-bold" : "text-emerald-200/80"}>
                    Step 2: Inverter Telemetry Gateway Acknowledged (ACK 200)
                  </span>
                </div>

                {/* Step 3: Confirmed */}
                <div className="flex items-center gap-3">
                  {commandStage === "confirmed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-emerald-700" />
                  )}
                  <span className={commandStage === "confirmed" ? "text-emerald-300 font-bold" : "text-emerald-200/80"}>
                    Step 3: Contactor Open Confirmed | Load Cutoff Verified
                  </span>
                </div>
              </div>

              {commandStage === "confirmed" && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Hardware disconnect successful. Audit log entry recorded.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800 text-[#9A3412] dark:text-orange-300">
                <p className="font-bold">⚠️ Contactor Tripping Warning:</p>
                <p className="mt-1">
                  This command triggers the mechanical relay contactor inside the inverter. The customer will lose AC output power immediately until balance regularization.
                </p>
              </div>

              {isBulkDisconnect && (
                <div className="space-y-2 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800">
                  <label className="font-bold text-orange-900 dark:text-orange-300 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    Mandatory Second Approver (GreenerAfrik Dual-Key Rule)
                  </label>
                  <select
                    className="w-full bg-white dark:bg-[#06361f] border border-orange-300 dark:border-orange-700 rounded-lg p-2 text-xs font-medium"
                    value={secondApproverId}
                    onChange={(e) => setSecondApproverId(e.target.value)}
                  >
                    {MOCK_USERS.filter((u) => u.id !== currentUser.id && ["super_admin", "operations_manager"].includes(u.role)).map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-[#EA580C] dark:text-orange-400">
                    Primary operator: {currentUser.name} ({currentRole})
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#0A5C36] dark:text-emerald-200">
                  Disconnection Reason / Note:
                </label>
                <textarea
                  className="w-full bg-emerald-50/50 dark:bg-[#084729] border border-emerald-200 dark:border-emerald-700 rounded-lg p-2 text-xs font-mono"
                  rows={2}
                  value={disconnectReason}
                  onChange={(e) => setDisconnectReason(e.target.value)}
                  placeholder="Reason for disconnection..."
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {commandStage === "confirmed" ? (
              <Button
                className="w-full bg-[#0A5C36] text-white hover:bg-[#074728]"
                onClick={() => setDisconnectModalOpen(false)}
                data-testid="disconnect-done-btn"
              >
                Close & Finish
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setDisconnectModalOpen(false)}
                  disabled={isExecutingCommand}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={handleExecuteDisconnect}
                  disabled={isExecutingCommand || !disconnectReason.trim()}
                  data-testid="confirm-disconnect-btn"
                >
                  {isExecutingCommand ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Executing Handshake...
                    </>
                  ) : (
                    <>
                      <PowerOff className="w-4 h-4" />
                      {isBulkDisconnect ? "Authorize Bulk Disconnect" : "Confirm Disconnect"}
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- RECONNECT MODAL (With Handshake) --- */}
      <Dialog open={reconnectModalOpen} onOpenChange={setReconnectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-600">
              <Power className="w-6 h-6" />
              <DialogTitle>Remote Contactor Reconnection</DialogTitle>
            </div>
            <DialogDescription>
              Restore AC grid/inverter output contactor for customer {targetAccount?.customerId} (System {targetAccount?.systemId}).
            </DialogDescription>
          </DialogHeader>

          {commandStage !== "idle" ? (
            <div className="py-6 space-y-4">
              <div className="p-4 rounded-2xl bg-[#05361e] text-white space-y-3 font-mono text-xs border border-emerald-800">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-800">
                  <span className="text-emerald-200/80">TELEMETRY RECONNECTION</span>
                  <span className="text-emerald-400">RELAY CLOSE: 0x99A</span>
                </div>

                <div className="flex items-center gap-3">
                  {commandStage === "sent" ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className={commandStage === "sent" ? "text-emerald-300 font-bold" : "text-emerald-100"}>
                    Step 1: Queuing Contactor Reclose Packet
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {commandStage === "acknowledged" ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  ) : commandStage === "confirmed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-emerald-700" />
                  )}
                  <span className={commandStage === "acknowledged" ? "text-emerald-300 font-bold" : "text-emerald-200/80"}>
                    Step 2: Inverter Microcontroller Handshake Received
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {commandStage === "confirmed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-emerald-700" />
                  )}
                  <span className={commandStage === "confirmed" ? "text-emerald-300 font-bold" : "text-emerald-200/80"}>
                    Step 3: Output Contactor Closed | Power Restored (230V AC Live)
                  </span>
                </div>
              </div>

              {commandStage === "confirmed" && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Customer power restored. Account status updated to Active with 30 days credit.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                <p className="font-bold">Power Restoration Confirmation:</p>
                <p className="mt-1">
                  Sending this command will close the inverter internal contactor and restore customer power within 5-10 seconds.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            {commandStage === "confirmed" ? (
              <Button
                className="w-full bg-[#0A5C36] text-white hover:bg-[#074728]"
                onClick={() => setReconnectModalOpen(false)}
                data-testid="reconnect-done-btn"
              >
                Close & Complete
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setReconnectModalOpen(false)}
                  disabled={isExecutingCommand}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  onClick={handleExecuteReconnect}
                  disabled={isExecutingCommand}
                  data-testid="confirm-reconnect-btn"
                >
                  {isExecutingCommand ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Closing Contactor...
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4" />
                      Confirm & Restore Power
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- GRANT EXTENSION MODAL --- */}
      <Dialog open={extensionModalOpen} onOpenChange={setExtensionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#0A5C36] dark:text-[#10B981]">
              <Calendar className="w-6 h-6" />
              <DialogTitle>Grant PAYG Grace Extension</DialogTitle>
            </div>
            <DialogDescription>
              Grant additional power days without triggering remote contactor cutoff.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#0A5C36] dark:text-emerald-200">
                Extension Duration (Days)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["3", "5", "7", "14"].map((d) => (
                  <Button
                    key={d}
                    type="button"
                    variant={extensionDays === d ? "default" : "outline"}
                    size="sm"
                    className="text-xs font-bold"
                    onClick={() => setExtensionDays(d)}
                  >
                    {d} Days
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0A5C36] dark:text-emerald-200">
                Extension Justification (Required for Audit Trail)
              </label>
              <select
                className="w-full bg-emerald-50/50 dark:bg-[#084729] border border-emerald-200 dark:border-emerald-700 rounded-lg p-2 text-xs font-medium"
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
              >
                <option value="Salary delay confirmed by employer">Salary delay confirmed by employer</option>
                <option value="Awaiting bank transfer verification">Awaiting bank transfer verification</option>
                <option value="Customer medical emergency exception">Customer medical emergency exception</option>
                <option value="System maintenance reconciliation in progress">System maintenance reconciliation in progress</option>
                <option value="Direct executive authorization">Direct executive authorization</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setExtensionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0A5C36] hover:bg-[#074728] text-white gap-2"
              onClick={handleGrantExtension}
              disabled={isExecutingCommand}
              data-testid="confirm-extension-btn"
            >
              {isExecutingCommand ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Apply Extension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- RECORD MANUAL PAYMENT MODAL --- */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#EA580C]">
              <CreditCard className="w-6 h-6" />
              <DialogTitle>Record Manual Payment</DialogTitle>
            </div>
            <DialogDescription>
              Record an offline or bank transfer payment and immediately reactivate customer power.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#0A5C36] dark:text-emerald-200">
                Payment Amount (₦ Naira)
              </label>
              <Input
                type="number"
                placeholder="45000"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0A5C36] dark:text-emerald-200">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Bank Transfer", "POS", "Paystack"] as const).map((method) => (
                  <Button
                    key={method}
                    type="button"
                    variant={paymentMethod === method ? "default" : "outline"}
                    size="sm"
                    className="text-xs font-bold"
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0A5C36] dark:text-emerald-200">
                Reference / Narration
              </label>
              <Input
                placeholder="e.g. GTB-TRF-091823"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0A5C36] hover:bg-[#074728] text-white gap-2"
              onClick={handleRecordPayment}
              disabled={isExecutingCommand || !paymentAmount}
              data-testid="confirm-manual-payment-btn"
            >
              {isExecutingCommand ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
              Record & Re-enable Power
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
