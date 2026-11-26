"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  LogIn,
  QrCode,
  Search,
  Activity,
  Battery,
  Cpu,
  Calendar,
  Layers,
  XCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MOCK_CUSTOMERS,
  MOCK_SYSTEMS,
  MOCK_INSTALLATIONS,
  INSTALLATION_STAGES
} from "@/lib/mock-data";
import { Customer, Installation, SolarSystem, SystemStatus } from "@/lib/types";
import { useAuthRole } from "@/components/providers/auth-role-provider";

const STATUS_META: Record<
  SystemStatus,
  { label: string; badgeClass: string }
> = {
  online: {
    label: "Online & Normal",
    badgeClass: "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
  },
  overload: {
    label: "Load Warning",
    badgeClass: "bg-orange-950/70 text-orange-300 border-orange-500/40"
  },
  low_battery: {
    label: "Low Battery Reserve",
    badgeClass: "bg-orange-950/70 text-orange-300 border-orange-500/40"
  },
  offline: {
    label: "Telemetry Offline",
    badgeClass: "bg-orange-950/70 text-orange-200 border-orange-500/40"
  },
  hardware_fault: {
    label: "Service Attention Needed",
    badgeClass: "bg-orange-950/70 text-orange-300 border-orange-500/40"
  }
};

function PublicQrContent() {
  const params = useParams();
  const router = useRouter();
  const rawToken = decodeURIComponent((params?.token as string) || "ST-LGS-001-X9").trim();
  const { isStaffSignedIn, currentRole } = useAuthRole();

  const [systems, setSystems] = useState<SolarSystem[]>(MOCK_SYSTEMS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [installations, setInstallations] = useState<Installation[]>(MOCK_INSTALLATIONS);
  const [lookupInput, setLookupInput] = useState(rawToken);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setLookupInput(rawToken);
      setLookupError(null);
      setNowMs(Date.now());
      try {
        const storedSystems = localStorage.getItem("solartrack_systems");
        if (storedSystems) {
          setSystems(JSON.parse(storedSystems));
        }
        const storedCustomers = localStorage.getItem("solartrack_customers");
        if (storedCustomers) {
          setCustomers(JSON.parse(storedCustomers));
        }
        const storedInstallations = localStorage.getItem("solartrack_installations");
        if (storedInstallations) {
          setInstallations(JSON.parse(storedInstallations));
        }
      } catch (e) {
        console.error(e);
      }
    });
  }, [rawToken]);

  const normalizedQuery = rawToken.toUpperCase();
  const matchedSystem =
    systems.find(
      (s) =>
        s.qrToken.toUpperCase() === normalizedQuery ||
        s.inverterSerialNumber.toUpperCase() === normalizedQuery ||
        s.batterySerialNumber.toUpperCase() === normalizedQuery
    ) || null;

  const linkedCustomerRecord = matchedSystem
    ? customers.find((c) => c.id === matchedSystem.customerId || c.systemId === matchedSystem.id) || null
    : customers.find((c) => c.qrToken.toUpperCase() === normalizedQuery) || null;

  const resolvedSystem =
    matchedSystem ||
    (linkedCustomerRecord
      ? systems.find((s) => s.id === linkedCustomerRecord.systemId) || null
      : null);

  const resolvedInstallation = resolvedSystem
    ? installations.find((inst) => inst.systemId === resolvedSystem.id) || null
    : null;

  const stageDef = resolvedInstallation
    ? INSTALLATION_STAGES.find((stg) => stg.id === resolvedInstallation.currentStage) || null
    : null;

  const isWarrantyActive = resolvedSystem
    ? nowMs === null
      ? true
      : new Date(resolvedSystem.warrantyExpiryDate).getTime() >= nowMs
    : false;

  const statusInfo = resolvedSystem
    ? STATUS_META[resolvedSystem.status] || STATUS_META.online
    : STATUS_META.online;

  const staffInspectHref = linkedCustomerRecord
    ? isStaffSignedIn
      ? currentRole === "technician"
        ? "/tech/scan"
        : `/admin/customers/${linkedCustomerRecord.id}`
      : `/sign-in?mode=staff&redirect=${encodeURIComponent(`/admin/customers/${linkedCustomerRecord.id}`)}`
    : "/sign-in?mode=staff";

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = lookupInput.trim().toUpperCase();
    if (!cleaned) {
      setLookupError("Enter a QR Tag ID or hardware serial number.");
      return;
    }

    const foundSys = systems.find(
      (s) =>
        s.qrToken.toUpperCase() === cleaned ||
        s.inverterSerialNumber.toUpperCase() === cleaned ||
        s.batterySerialNumber.toUpperCase() === cleaned
    );
    const foundCust = customers.find((c) => c.qrToken.toUpperCase() === cleaned);
    const targetToken = foundSys?.qrToken || foundCust?.qrToken || cleaned;

    setLookupError(null);
    router.push(`/q/${encodeURIComponent(targetToken)}`);
  };

  return (
    <div className="min-h-screen bg-[#042414] text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Privacy & Return Bar */}
      <div className="max-w-lg w-full mx-auto space-y-3 mb-4">
        <div className="flex items-center justify-between text-xs">
          <Link
            href="/"
            className="text-emerald-300 hover:text-white font-semibold transition"
          >
            ← Back to GreenerAfrik Home
          </Link>
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Privacy Protected
          </span>
        </div>

        <div className="rounded-2xl bg-[#06361f] border border-emerald-800 p-3 flex items-center justify-between text-xs text-emerald-200/80">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>Public Hardware Verification & System Tag</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400">Zero PII</span>
        </div>

        {/* QR Token / Serial Lookup Bar */}
        <Card className="border-emerald-800 bg-[#06361f] text-white">
          <CardContent className="p-3.5 space-y-2.5">
            <form onSubmit={handleLookupSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5 pointer-events-none" />
                <Input
                  type="text"
                  value={lookupInput}
                  onChange={(e) => setLookupInput(e.target.value)}
                  placeholder="Scan/enter QR Tag or Inverter SN (e.g. ST-LGS-001-X9)"
                  className="pl-9 bg-[#042414] border-emerald-700 text-white placeholder:text-emerald-300/50 text-xs font-mono uppercase"
                  data-testid="public-qr-input"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="text-xs font-bold shrink-0"
                data-testid="public-qr-lookup-btn"
              >
                <QrCode className="w-3.5 h-3.5 mr-1.5" />
                <span>Verify Tag</span>
              </Button>
            </form>

            {lookupError && (
              <div className="text-[11px] text-orange-300 font-medium">{lookupError}</div>
            )}

            {/* Quick System Tag Presets (strictly non-PII) */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80 mr-1">
                Registered Tags:
              </span>
              {systems.slice(0, 4).map((sys) => {
                const active = sys.qrToken.toUpperCase() === (resolvedSystem?.qrToken || "").toUpperCase();
                return (
                  <Link
                    key={sys.id}
                    href={`/q/${encodeURIComponent(sys.qrToken)}`}
                    className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold border transition ${
                      active
                        ? "bg-[#EA580C] border-[#EA580C] text-white"
                        : "bg-[#042414]/80 border-emerald-800 text-emerald-200 hover:border-emerald-500"
                    }`}
                  >
                    {sys.qrToken}
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-lg w-full mx-auto space-y-4 my-auto">
        {!resolvedSystem ? (
          <Card className="border-orange-500/40 bg-[#06361f] text-white shadow-2xl">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-950/60 border border-orange-500/40 flex items-center justify-center mx-auto text-orange-400">
                <XCircle className="w-6 h-6" />
              </div>
              <h1 className="text-lg font-black text-white">Unrecognized QR Tag</h1>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                No verified GreenerAfrik solar hardware record matched{" "}
                <span className="font-mono font-bold text-orange-300">{rawToken}</span>. Check the
                laminated inverter sticker and try again.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Main Hardware Card */
          <Card className="border-emerald-800 bg-[#06361f] text-white shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0A5C36] via-[#074728] to-[#05361e] p-6 text-white flex items-center justify-between border-b-2 border-[#EA580C]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#042414] flex items-center justify-center text-[#10B981] font-black shadow-lg">
                  <Sun className="w-7 h-7 fill-[#EA580C] text-[#EA580C]" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight leading-none text-white">
                    GreenerAfrik
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 mt-1 block">
                    Official Hardware Seal • RC 9402141
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1 text-[11px] font-black bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authentic</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.badgeClass}`}
                >
                  {statusInfo.label}
                </span>
              </div>
            </div>

            <CardContent className="p-6 space-y-5">
              {/* Tag Identity & System Package (non-PII) */}
              <div className="space-y-1.5 border-b border-emerald-800 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200/80">
                    System QR Tag ID
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300/90">
                    Asset Ref: {resolvedSystem.id.toUpperCase()}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono tracking-tight text-orange-400">
                  {resolvedSystem.qrToken}
                </div>
                {linkedCustomerRecord?.packageType && (
                  <div className="text-xs font-semibold text-emerald-100">
                    System Package:{" "}
                    <span className="text-white">{linkedCustomerRecord.packageType}</span>
                  </div>
                )}
              </div>

              {/* Spec details - strictly non-PII hardware & telemetry status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-xl bg-[#084729]/70 border border-emerald-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-[#EA580C]" />
                    <span>Inverter Unit</span>
                  </span>
                  <span className="font-bold text-sm text-white block">
                    {resolvedSystem.inverterBrand} {resolvedSystem.inverterCapacityKva}kVA
                  </span>
                  <span className="text-[11px] text-emerald-200/90 block">
                    Model: <span className="font-mono text-white">{resolvedSystem.inverterModel}</span>
                  </span>
                  <span className="text-[10px] text-emerald-300/80 block">
                    SN: <span className="font-mono text-emerald-50">{resolvedSystem.inverterSerialNumber}</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#084729]/70 border border-emerald-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80 flex items-center gap-1">
                    <Battery className="w-3 h-3 text-[#10B981]" />
                    <span>Battery Storage</span>
                  </span>
                  <span className="font-bold text-sm text-white block">
                    {resolvedSystem.batteryBrand} {resolvedSystem.batteryCapacityKwh}kWh
                  </span>
                  <span className="text-[11px] text-emerald-200/90 block">
                    Chemistry: <span className="text-white font-semibold">{resolvedSystem.batteryChemistry}</span>
                  </span>
                  <span className="text-[10px] text-emerald-300/80 block">
                    SN: <span className="font-mono text-emerald-50">{resolvedSystem.batterySerialNumber}</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#084729]/70 border border-emerald-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-[#EA580C]" />
                    <span>PV Solar Array</span>
                  </span>
                  <span className="font-bold text-sm text-white block">
                    {resolvedSystem.totalPvCapacityKw} kW Peak
                  </span>
                  <span className="text-[11px] text-emerald-200/90 block">
                    {resolvedSystem.solarPanelsCount} × {resolvedSystem.solarPanelsWattage}W Panels
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#084729]/70 border border-emerald-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                    <span>Warranty & Health</span>
                  </span>
                  <span
                    className={`font-bold text-sm flex items-center gap-1 ${
                      isWarrantyActive ? "text-emerald-400" : "text-orange-300"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isWarrantyActive ? "Active Warranty" : "Warranty Expired"}</span>
                  </span>
                  <span className="text-[11px] text-emerald-200/90 block">
                    Valid until: <span className="font-mono text-white">{resolvedSystem.warrantyExpiryDate}</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#084729]/70 border border-emerald-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#EA580C]" />
                    <span>Commissioning</span>
                  </span>
                  <span className="font-bold text-xs text-white block">
                    {resolvedSystem.installationDate || "Scheduled / In Progress"}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 block">
                    Installation Date
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#084729]/70 border border-emerald-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#10B981]" />
                    <span>Deployment Lifecycle</span>
                  </span>
                  <span className="font-bold text-xs text-white block">
                    {stageDef
                      ? `Stage ${stageDef.order}/10: ${stageDef.shortLabel}`
                      : "Verified Hardware"}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-[#10B981]" />
                    <span>{statusInfo.label}</span>
                  </span>
                </div>
              </div>

              {/* Strict Privacy Notice */}
              <div className="p-3 rounded-xl bg-[#042414]/70 border border-emerald-800 text-[11px] text-emerald-200/80 flex items-start gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  To safeguard customer privacy, personal names, phone numbers, email addresses, street addresses, GPS coordinates, and PAYG billing details are never displayed on public QR scans.
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <Link href="/sign-in?mode=customer" className="block">
                  <Button
                    variant="danger"
                    size="lg"
                    className="w-full text-sm font-bold shadow-lg shadow-[#EA580C]/20"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span>Customer Sign In: Report Fault / Support</span>
                  </Button>
                </Link>

                {/* Staff login deep link */}
                <Link href={staffInspectHref} className="block">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full text-xs border-emerald-700 bg-transparent text-emerald-100 hover:bg-[#0A5C36] hover:text-white"
                  >
                    <LogIn className="w-3.5 h-3.5 mr-2 text-orange-400" />
                    <span>
                      {isStaffSignedIn
                        ? "Open Staff Inspection View"
                        : "Authorized Staff Inspection Login"}
                    </span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="max-w-lg w-full mx-auto text-center text-xs text-emerald-200/70 py-4">
        © 2026 GreenerAfrik Energies Limited (RC 9402141). ...Powering Africa. All hardware tags are cryptographically authenticated.
      </div>
    </div>
  );
}

export default function PublicQrLandingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#042414] text-white flex items-center justify-center">
          Loading tag...
        </div>
      }
    >
      <PublicQrContent />
    </Suspense>
  );
}
