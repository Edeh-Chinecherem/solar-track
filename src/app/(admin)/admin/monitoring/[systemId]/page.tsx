"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  Sun,
  Battery,
  Zap,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  LifeBuoy,
  Send,
  ShieldAlert,
  HelpCircle,
  FileText,
  TrendingDown,
  Info,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import {
  MOCK_SYSTEMS,
  MOCK_CUSTOMERS,
  generateLiveTelemetry,
  generate24HourTelemetry,
  diagnoseSystem
} from "@/lib/mock-data";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { useToast } from "@/components/providers/toast-provider";
import { api } from "@/lib/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

function SystemHealthDetailContent() {
  const params = useParams();
  const router = useRouter();
  const systemId = (params?.systemId as string) || "sys_001";
  const { currentUser } = useAuthRole();
  const { toast } = useToast();

  const system = MOCK_SYSTEMS.find((s) => s.id === systemId) || MOCK_SYSTEMS[0];
  const customer = MOCK_CUSTOMERS.find((c) => c.id === system.customerId) || MOCK_CUSTOMERS[0];

  const telemetry = generateLiveTelemetry(system);
  const hourlyData = generate24HourTelemetry(system);
  const diagnosis = diagnoseSystem(system, telemetry);

  // Modals
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState(`[Telemetric Diagnostic] ${diagnosis.headline}`);
  const [ticketDescription, setTicketDescription] = useState(
    `${diagnosis.detailedAnalysis}\n\nRecommended Actions:\n${diagnosis.recommendedActions.map((a) => `- ${a}`).join("\n")}`
  );
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsText, setSmsText] = useState(diagnosis.customerAdviceSms);

  const handleCreateTicketWithSnapshot = async () => {
    setIsCreatingTicket(true);
    try {
      const newTicket = await api.createTicket(
        {
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phone,
          systemId: system.id,
          category: diagnosis.cause === "OVERLOAD" ? "Overload" : diagnosis.cause === "UNDER_CHARGED" ? "Battery/Charging" : "Hardware",
          priority: diagnosis.cause === "OVERLOAD" || diagnosis.cause === "HARDWARE_FAULT" ? "critical" : "high",
          status: "open",
          subject: ticketSubject,
          description: ticketDescription,
          slaDeadline: new Date(Date.now() + 24 * 3600000).toISOString(),
          linkedDiagnosis: diagnosis
        },
        currentUser
      );

      toast("Ticket Logged with Snapshot", {
        description: `Created ${newTicket.ticketNumber} and linked telemetry analysis.`,
        type: "success"
      });
      setTicketModalOpen(false);
      router.push("/admin/tickets");
    } catch (e) {
      console.error(e);
      toast("Error", { description: "Failed to create support ticket.", type: "error" });
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleSendAdviceSms = () => {
    toast("Advisory SMS Sent to Customer", {
      description: `Dispatched to ${customer.phone} via MTN Nigeria.`,
      type: "success"
    });
    setSmsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/admin/monitoring" className="hover:text-amber-500 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Fleet Monitoring</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">
          {system.inverterBrand} {system.inverterCapacityKva}kVA ({customer.name})
        </span>
      </div>

      {/* Header Banner */}
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight">{customer.name}</h1>
              <Badge variant={system.status === "online" ? "success" : "destructive"}>
                {system.status.toUpperCase()}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                Heartbeat: {formatRelativeTime(telemetry.timestamp)}
              </span>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Inverter: {system.inverterBrand} {system.inverterModel} • SN: {system.inverterSerialNumber} • Battery: {system.batteryCapacityKwh}kWh
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSmsModalOpen(true)}
              className="text-xs border-slate-600 text-white hover:bg-slate-800"
            >
              <Send className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              <span>Send Advice SMS</span>
            </Button>

            <Button
              data-testid="attach-ticket-btn"
              variant="primary"
              size="sm"
              onClick={() => setTicketModalOpen(true)}
              className="text-xs font-bold shadow-md shadow-amber-500/20"
            >
              <LifeBuoy className="w-3.5 h-3.5 mr-1.5 text-slate-950" />
              <span>Attach to Ticket</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 4 LIVE TELEMETRY GAUGES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* PV Solar Input */}
        <Card>
          <CardContent className="p-5 text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sun className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {(telemetry.pvPowerWatts / 1000).toFixed(2)} <span className="text-sm font-bold text-slate-400">kW</span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Solar PV Generation
              </div>
            </div>
            <div className="text-[10px] text-slate-500">
              Array: {system.totalPvCapacityKw} kW Peak ({system.solarPanelsCount} Panels)
            </div>
          </CardContent>
        </Card>

        {/* Battery SOC */}
        <Card>
          <CardContent className="p-5 text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Battery className="w-6 h-6" />
            </div>
            <div>
              <div className={`text-3xl font-black ${telemetry.batterySocPercent < 30 ? "text-rose-500" : "text-emerald-500"}`}>
                {telemetry.batterySocPercent}%
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Battery State of Charge
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Pack Voltage: {telemetry.batteryVoltageVolts.toFixed(1)}V (LiFePO4)
            </div>
          </CardContent>
        </Card>

        {/* Home AC Load */}
        <Card>
          <CardContent className="p-5 text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className={`text-3xl font-black ${telemetry.loadPowerWatts > system.inverterCapacityKva * 1000 ? "text-rose-500" : "text-slate-900 dark:text-white"}`}>
                {(telemetry.loadPowerWatts / 1000).toFixed(2)} <span className="text-sm font-bold text-slate-400">kW</span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Active AC Load
              </div>
            </div>
            <div className="text-[10px] text-slate-500">
              Limit: {system.inverterCapacityKva} kVA ({((telemetry.loadPowerWatts / (system.inverterCapacityKva * 1000)) * 100).toFixed(0)}% Utilized)
            </div>
          </CardContent>
        </Card>

        {/* Inverter Heatsink Temp */}
        <Card>
          <CardContent className="p-5 text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className={`text-3xl font-black ${telemetry.inverterTempCelsius > 65 ? "text-rose-600 animate-pulse" : "text-slate-900 dark:text-white"}`}>
                {telemetry.inverterTempCelsius.toFixed(1)} <span className="text-sm font-bold text-slate-400">°C</span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Inverter Temperature
              </div>
            </div>
            <div className="text-[10px] text-slate-500">
              Grid Frequency: {telemetry.gridFrequencyHz.toFixed(1)} Hz
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AUTOMATED DIAGNOSIS CARD */}
      <Card className={`border-2 ${
        diagnosis.cause === "NORMAL"
          ? "border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10"
          : diagnosis.cause === "OVERLOAD"
          ? "border-rose-500/60 bg-rose-50/20 dark:bg-rose-950/20"
          : "border-amber-500/60 bg-amber-50/20 dark:bg-amber-950/20"
      }`}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-base sm:text-lg">
                Automated Root-Cause Diagnostic Engine
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={diagnosis.cause === "NORMAL" ? "success" : "destructive"}>
                {diagnosis.cause} ({diagnosis.confidence}% Confidence)
              </Badge>
            </div>
          </div>
          <CardDescription className="text-xs">
            Algorithmic analysis of telemetry stream distinguishing overload vs under-charge vs offline vs hardware fault.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Headline & Analysis */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{diagnosis.headline}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {diagnosis.detailedAnalysis}
            </p>
          </div>

          {/* Recommended Actions */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Prescribed Field & Customer Actions
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {diagnosis.recommendedActions.map((action, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Customer Advice SMS */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Generated Plain-Language Customer SMS
              </span>
              <p className="text-slate-300 italic">"{diagnosis.customerAdviceSms}"</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setSmsModalOpen(true)}
              className="shrink-0 text-xs font-bold"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>Send to Customer</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 24-HOUR PV VS. LOAD AREA CHART */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">24-Hour Solar Production vs. Home Consumption Profile</CardTitle>
          <CardDescription>
            Hourly solar curve (Amber) compared against household AC power draw (Sky Blue).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pvColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="loadColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis unit="W" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="pvWatts" name="Solar PV Generation (W)" stroke="#f59e0b" fillOpacity={1} fill="url(#pvColor)" />
                <Area type="monotone" dataKey="loadWatts" name="Household AC Load (W)" stroke="#0284c7" fillOpacity={1} fill="url(#loadColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 7-DAY BATTERY STATE OF CHARGE (SOC) LINE CHART */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Battery State of Charge (SOC) Trend Curve</CardTitle>
          <CardDescription>
            Displays depth of discharge and daily recharge replenishment efficiency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="batterySoc" name="Battery SOC (%)" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Attach to Ticket Modal */}
      <Dialog open={ticketModalOpen} onOpenChange={setTicketModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-amber-500" />
              <span>Log Support Ticket with Telemetric Snapshot</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Attaches current live metrics, fault cause, and engineering recommendations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Ticket Subject</label>
              <Input
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Diagnostic Description & Snapshot
              </label>
              <Textarea
                rows={6}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setTicketModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isCreatingTicket}
              onClick={handleCreateTicketWithSnapshot}
            >
              Dispatch Ticket to Operations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send SMS Modal */}
      <Dialog open={smsModalOpen} onOpenChange={setSmsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-500" />
              <span>Dispatch Advice SMS</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Send plain-language guidance directly to customer ({customer.phone}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 my-2">
            <Textarea
              rows={4}
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              className="text-xs font-medium"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSmsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSendAdviceSms}>
              Send SMS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SystemHealthDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading System Health...</div>}>
      <SystemHealthDetailContent />
    </Suspense>
  );
}
