"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  HelpCircle,
  LogIn
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_CUSTOMERS, MOCK_SYSTEMS } from "@/lib/mock-data";
import { useAuthRole } from "@/components/providers/auth-role-provider";

function PublicQrContent() {
  const params = useParams();
  const token = (params?.token as string) || "ST-LGS-001-X9";
  const { currentUser, currentRole } = useAuthRole();

  // Find customer and system by token
  const customer = MOCK_CUSTOMERS.find((c) => c.qrToken.toUpperCase() === token.toUpperCase()) || MOCK_CUSTOMERS[0];
  const system = MOCK_SYSTEMS.find((s) => s.id === customer.systemId) || MOCK_SYSTEMS[0];

  return (
    <div className="min-h-screen bg-[#042414] text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Privacy Notice Banner */}
      <div className="max-w-md w-full mx-auto mb-4">
        <div className="rounded-2xl bg-[#06361f] border border-emerald-800 p-3 flex items-center justify-between text-xs text-emerald-200/80">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-orange-400" />
            <span>Public Hardware Verification Tag</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400">Privacy Protected</span>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto space-y-4 my-auto">
        {/* Main Hardware Card */}
        <Card className="border-emerald-800 bg-[#06361f] text-white shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#0A5C36] via-[#074728] to-[#05361e] p-6 text-white flex items-center justify-between border-b-2 border-[#EA580C]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#042414] flex items-center justify-center text-[#10B981] font-black shadow-lg">
                <Sun className="w-7 h-7 fill-[#EA580C] text-[#EA580C]" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none text-white">GreenerAfrik</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 mt-1 block">
                  Official Hardware Seal • RC 9402141
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-[11px] font-black bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-5">
            <div className="space-y-1 border-b border-emerald-800 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200/80">
                System Tag ID
              </span>
              <div className="text-2xl font-black font-mono tracking-tight text-orange-400">
                {customer.qrToken}
              </div>
              <div className="text-xs text-emerald-200/80">
                Chassis Serial: <span className="font-mono text-emerald-50">{system.inverterSerialNumber}</span>
              </div>
            </div>

            {/* Spec details - strictly non-PII */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-xl bg-[#084729]/70 border border-emerald-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80 block">
                  Inverter Model
                </span>
                <span className="font-bold text-sm text-white mt-0.5 block truncate">
                  {system.inverterBrand} {system.inverterCapacityKva}kVA
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#084729]/70 border border-emerald-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80 block">
                  Battery Pack
                </span>
                <span className="font-bold text-sm text-white mt-0.5 block truncate">
                  {system.batteryCapacityKwh}kWh LiFePO4
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#084729]/70 border border-emerald-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80 block">
                  PV Solar Array
                </span>
                <span className="font-bold text-sm text-white mt-0.5 block">
                  {system.totalPvCapacityKw} kW Peak
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#084729]/70 border border-emerald-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80 block">
                  Warranty Status
                </span>
                <span className="font-bold text-sm text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active</span>
                </span>
              </div>
            </div>

            {/* Strict Privacy Notice */}
            <div className="p-3 rounded-xl bg-[#042414]/70 border border-emerald-800 text-[11px] text-emerald-200/80 flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                To safeguard customer privacy, personal identifiers, contact numbers, and payment details are never displayed on public tags.
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <Link href="/portal/support" className="block">
                <Button variant="danger" size="lg" className="w-full text-sm font-bold shadow-lg shadow-[#EA580C]/20">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span>Report a Fault / Service Request</span>
                </Button>
              </Link>

              {/* Staff login deep link */}
              <Link href={`/admin/customers/${customer.id}`} className="block">
                <Button variant="outline" size="md" className="w-full text-xs border-emerald-700 bg-transparent text-emerald-100 hover:bg-[#0A5C36] hover:text-white">
                  <LogIn className="w-3.5 h-3.5 mr-2 text-orange-400" />
                  <span>Authorized Staff Inspection Login</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-md w-full mx-auto text-center text-xs text-emerald-200/70 py-4">
        © 2026 GreenerAfrik Energies Limited (RC 9402141). ...Powering Africa. All hardware tags are cryptographically authenticated.
      </div>
    </div>
  );
}

export default function PublicQrLandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#042414] text-white flex items-center justify-center">Loading tag...</div>}>
      <PublicQrContent />
    </Suspense>
  );
}
