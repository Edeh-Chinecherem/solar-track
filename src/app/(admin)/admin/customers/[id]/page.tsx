"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  QrCode,
  Zap,
  Activity,
  CreditCard,
  LifeBuoy,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  PowerOff,
  Power,
  Download,
  Plus,
  ArrowRight,
  Sun,
  Battery,
  Flame,
  Gauge
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  MOCK_CUSTOMERS,
  MOCK_SYSTEMS,
  MOCK_INSTALLATIONS,
  MOCK_PAYG_ACCOUNTS,
  MOCK_TICKETS,
  MOCK_AUDIT_LOGS,
  INSTALLATION_STAGES,
  generateLiveTelemetry,
  generate24HourTelemetry,
  HourlyTelemetryPoint
} from "@/lib/mock-data";
import { formatNaira, formatDate, formatDateTime } from "@/lib/utils";
import { QrCodeModal } from "@/components/customers/qr-code-modal";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { useToast } from "@/components/providers/toast-provider";
import { api } from "@/lib/api";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function CustomerProfileContent() {
  const params = useParams();
  const customerId = (params?.id as string) || "cust_001";
  const { currentUser, canPerform } = useAuthRole();
  const { toast } = useToast();

  const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId) || MOCK_CUSTOMERS[0];
  const system = MOCK_SYSTEMS.find((s) => s.id === customer.systemId) || MOCK_SYSTEMS[0];
  const installation = MOCK_INSTALLATIONS.find((i) => i.customerId === customer.id) || MOCK_INSTALLATIONS[0];
  const [payg, setPayg] = useState(MOCK_PAYG_ACCOUNTS.find((p) => p.customerId === customer.id));
  const tickets = MOCK_TICKETS.filter((t) => t.customerId === customer.id);
  const auditLogs = MOCK_AUDIT_LOGS.filter((a) => a.targetId === customer.id || a.targetId === system.id || a.targetId === payg?.id);

  const [activeTab, setActiveTab] = useState("overview");

  // Modals
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsContent, setSmsContent] = useState(
    `GreenerAfrik Alert: Dear ${customer.name}, your solar system (${system.inverterBrand} ${system.inverterCapacityKva}kVA) is operating under remote monitoring.`
  );
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Live telemetry data
  const telemetry = generateLiveTelemetry(system);
  const hourlyData = generate24HourTelemetry(system);

  // Disconnect / Reconnect Handler
  const handleTogglePower = async () => {
    setIsDisconnecting(true);
    try {
      if (payg?.status === "disconnected") {
        await api.executeRemoteReconnect(system.id, customer.id, currentUser);
        setPayg((prev) => (prev ? { ...prev, status: "active", daysRemainingOfPower: 30 } : prev));
        toast("Power Contactor Restored", {
          description: `AC inverter output re-engaged for ${customer.name}.`,
          type: "success"
        });
      } else {
        await api.executeRemoteDisconnect(
          system.id,
          customer.id,
          "Administrative Remote Disconnect",
          currentUser
        );
        setPayg((prev) => (prev ? { ...prev, status: "disconnected", daysRemainingOfPower: 0 } : prev));
        toast("Power Remote Disconnected", {
          description: `Remote IoT contactor opened for ${customer.name}.`,
          type: "warning"
        });
      }
      setDisconnectModalOpen(false);
    } catch (e) {
      console.error(e);
      toast("Command Failed", { description: "Remote gateway failed to confirm command.", type: "error" });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSendSms = () => {
    toast("SMS Dispatched to Customer", {
      description: `Sent to ${customer.phone} via MTN Nigeria SMS Gateway.`,
      type: "success"
    });
    setSmsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/admin/customers" className="hover:text-amber-500">
          Customers Registry
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">{customer.name}</span>
      </div>

      {/* Customer Header Banner */}
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Clickable QR thumbnail */}
            <button
              onClick={() => setQrModalOpen(true)}
              className="p-2 rounded-2xl bg-white text-slate-950 hover:scale-105 transition-transform shadow-lg cursor-pointer shrink-0"
              title="Click to view full printable QR hardware tag"
            >
              <QrCode className="w-10 h-10 text-amber-500" />
            </button>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{customer.name}</h1>
                <Badge variant={system.status === "online" ? "success" : system.status === "overload" ? "destructive" : "warning"}>
                  {system.status.toUpperCase()}
                </Badge>
                {payg?.status === "disconnected" && (
                  <Badge variant="destructive" className="animate-pulse">
                    PAYG DISCONNECTED
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono">
                <span>Tag: <strong className="text-amber-400">{customer.qrToken}</strong></span>
                <span>•</span>
                <span>System: {system.inverterBrand} {system.inverterCapacityKva}kVA</span>
                <span>•</span>
                <span>Chassis SN: {system.inverterSerialNumber}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSmsModalOpen(true)}
              className="text-xs border-slate-600 text-white hover:bg-slate-800"
            >
              <Send className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              <span>Send SMS</span>
            </Button>

            <Link href="/admin/tickets">
              <Button variant="outline" size="sm" className="text-xs border-slate-600 text-white hover:bg-slate-800">
                <LifeBuoy className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                <span>Create Ticket</span>
              </Button>
            </Link>

            {canPerform("DISCONNECT_PAYG") && (
              <Button
                variant={payg?.status === "disconnected" ? "success" : "danger"}
                size="sm"
                onClick={() => setDisconnectModalOpen(true)}
                className="text-xs font-bold"
              >
                {payg?.status === "disconnected" ? (
                  <>
                    <Power className="w-3.5 h-3.5 mr-1.5" />
                    <span>Reconnect Power</span>
                  </>
                ) : (
                  <>
                    <PowerOff className="w-3.5 h-3.5 mr-1.5" />
                    <span>Remote Disconnect</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 8 Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 flex-wrap">
          <TabsTrigger value="overview">1. Overview</TabsTrigger>
          <TabsTrigger value="timeline">2. Installation Pipeline</TabsTrigger>
          <TabsTrigger value="telemetry">3. Live System</TabsTrigger>
          <TabsTrigger value="usage">4. Usage Graphs</TabsTrigger>
          <TabsTrigger value="payments">5. PAYG & Ledger</TabsTrigger>
          <TabsTrigger value="tickets">6. Support Tickets ({tickets.length})</TabsTrigger>
          <TabsTrigger value="documents">7. Documents ({customer.documents.length})</TabsTrigger>
          <TabsTrigger value="audit">8. Activity Log</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Customer & Site Profile</CardTitle>
                <CardDescription>Primary account contact and installation coordinates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs font-semibold uppercase">Phone Number</span>
                    <div className="font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                      {customer.phone}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-semibold uppercase">Email Address</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{customer.email}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-semibold uppercase">Nigerian State & LGA</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {customer.state} ({customer.lga})
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-semibold uppercase">Registration Date</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {formatDate(customer.registeredDate)}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 text-xs font-semibold uppercase">Full Physical Address</span>
                  <div className="font-medium text-slate-700 dark:text-slate-300 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{customer.address}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs font-mono">
                  <span>GPS Lat: {customer.gpsCoords.lat.toFixed(4)}, Lng: {customer.gpsCoords.lng.toFixed(4)}</span>
                  <a
                    href={`https://maps.google.com/?q=${customer.gpsCoords.lat},${customer.gpsCoords.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                  >
                    Launch Google Maps ↗
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Sizing</CardTitle>
                <CardDescription>Installed hardware components.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-1">
                  <div className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                    {system.inverterBrand} {system.inverterCapacityKva}kVA Inverter
                  </div>
                  <div className="text-slate-500">Model: {system.inverterModel}</div>
                  <div className="text-slate-500 font-mono">SN: {system.inverterSerialNumber}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {system.batteryBrand} {system.batteryCapacityKwh}kWh LiFePO4
                  </div>
                  <div className="text-slate-500 font-mono">SN: {system.batterySerialNumber}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {system.solarPanelsCount}x 550W Solar Panels
                  </div>
                  <div className="text-slate-500">Total Harvest: {system.totalPvCapacityKw} kW Peak</div>
                </div>

                <div className="pt-2 text-slate-500 flex items-center justify-between">
                  <span>Warranty Active Until:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {formatDate(system.warrantyExpiryDate)}
                  </strong>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: INSTALLATION TIMELINE */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">10-Stage Pipeline Lifecycle</CardTitle>
              <CardDescription>
                Current Stage: <strong className="text-amber-500 capitalize">{installation.currentStage.replace("_", " ")}</strong> ({installation.daysInCurrentStage} days in current stage)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {INSTALLATION_STAGES.map((stg) => {
                  const isCompleted = installation.stageHistory.some((h) => h.stageId === stg.id && h.completedAt);
                  const isCurrent = installation.currentStage === stg.id;

                  return (
                    <div key={stg.id} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow ${
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : isCurrent
                            ? "bg-amber-500 text-slate-950 font-bold ring-4 ring-amber-500/20"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : stg.order}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {stg.order}. {stg.label}
                          </h4>
                          {isCurrent && <Badge variant="amber">In Progress</Badge>}
                          {isCompleted && <Badge variant="success">Completed</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{stg.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: LIVE SYSTEM TELEMETRY */}
        <TabsContent value="telemetry">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center space-y-1">
                <Sun className="w-6 h-6 text-amber-500 mx-auto" />
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {(telemetry.pvPowerWatts / 1000).toFixed(2)} kW
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Solar PV Input
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center space-y-1">
                <Battery className="w-6 h-6 text-emerald-500 mx-auto" />
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {telemetry.batterySocPercent}%
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Battery SOC ({telemetry.batteryVoltageVolts.toFixed(1)}V)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center space-y-1">
                <Zap className="w-6 h-6 text-sky-500 mx-auto" />
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {(telemetry.loadPowerWatts / 1000).toFixed(2)} kW
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Home AC Load
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center space-y-1">
                <Flame className="w-6 h-6 text-rose-500 mx-auto" />
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {telemetry.inverterTempCelsius.toFixed(1)}°C
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Inverter Heatsink
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 4: USAGE GRAPHS */}
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">24-Hour Solar Generation vs. Household Consumption</CardTitle>
              <CardDescription>Real-time power balance curve across day and night periods.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis unit="W" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="pvWatts" name="Solar PV (W)" stroke="#f59e0b" fillOpacity={1} fill="url(#pvGrad)" />
                    <Area type="monotone" dataKey="loadWatts" name="Home Load (W)" stroke="#38bdf8" fillOpacity={1} fill="url(#loadGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: PAYMENTS */}
        <TabsContent value="payments">
          {payg ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 space-y-1">
                    <span className="text-xs text-slate-500">Plan Type</span>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{payg.planName}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 space-y-1">
                    <span className="text-xs text-slate-500">Total Contract</span>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {formatNaira(payg.totalCostNaira)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 space-y-1">
                    <span className="text-xs text-slate-500">Balance Owed</span>
                    <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
                      {formatNaira(payg.balanceOwedNaira)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 space-y-1">
                    <span className="text-xs text-slate-500">Power Remaining</span>
                    <div className="text-lg font-bold text-amber-500">
                      {payg.daysRemainingOfPower} Days
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-8 text-center text-slate-500 text-xs">No PAYG contract on file.</Card>
          )}
        </TabsContent>

        {/* TAB 6: TICKETS */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Support & Maintenance Tickets</CardTitle>
                <CardDescription>Service requests logged for this customer.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {tickets.length > 0 ? (
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-500">{t.ticketNumber}</span>
                        <Badge variant={t.priority === "critical" ? "destructive" : "amber"}>
                          {t.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.subject}</h4>
                      <p className="text-xs text-slate-500">{t.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">No active tickets for this customer.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 7: DOCUMENTS */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Signed Legal & Engineering Files</CardTitle>
              <CardDescription>Handover certificates, contracts, and warranty cards.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-amber-500" />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {doc.fileSizeKb} KB • Uploaded {formatDate(doc.uploadedAt)}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs font-semibold gap-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 8: AUDIT LOG */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Immutable Audit Trail</CardTitle>
              <CardDescription>Cryptographic log of all staff actions regarding this customer.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{log.action}</div>
                      <div className="text-slate-500 mt-0.5">{log.details}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        By {log.userName} ({log.userRole})
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDateTime(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hardware QR Code Modal */}
      <QrCodeModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        token={customer.qrToken}
        customerName={customer.name}
        systemModel={`${system.inverterBrand} ${system.inverterModel}`}
        systemSerial={system.inverterSerialNumber}
        systemCapacity={system.inverterCapacityKva}
      />

      {/* Remote Disconnect Confirmation Modal */}
      <Dialog open={disconnectModalOpen} onOpenChange={setDisconnectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>Confirm Remote Power Contactor Action</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {payg?.status === "disconnected"
                ? "This will transmit a cellular telemetry command to engage the AC contactor and restore household power."
                : "This will transmit a remote disconnect command to shut off the inverter AC output. The customer's power will immediately drop."}
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1.5 my-2">
            <div>Customer: <strong>{customer.name}</strong></div>
            <div>Inverter SN: <strong className="font-mono">{system.inverterSerialNumber}</strong></div>
            <div>Balance Owed: <strong className="text-rose-500">{formatNaira(payg?.balanceOwedNaira || 0)}</strong></div>
            <div>Audited Operator: <strong>{currentUser.name} ({currentUser.role})</strong></div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDisconnectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={payg?.status === "disconnected" ? "success" : "danger"}
              size="sm"
              isLoading={isDisconnecting}
              onClick={handleTogglePower}
            >
              {payg?.status === "disconnected" ? "Execute Reconnect Command" : "Execute Disconnect Command"}
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
              <span>Dispatch SMS to Customer</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Transmits an instant advisory notification to {customer.phone}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 my-2">
            <label className="text-xs font-semibold text-slate-500">Message Text:</label>
            <Textarea
              rows={4}
              value={smsContent}
              onChange={(e) => setSmsContent(e.target.value)}
              className="text-xs font-medium"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSmsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSendSms}>
              Send SMS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CustomerProfilePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading customer profile...</div>}>
      <CustomerProfileContent />
    </React.Suspense>
  );
}
