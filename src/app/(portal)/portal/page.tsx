"use client";

import React from "react";
import Link from "next/link";
import {
  Sun,
  Battery,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  CreditCard,
  Camera,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_CUSTOMERS, MOCK_SYSTEMS, MOCK_PAYG_ACCOUNTS, MOCK_INSTALLATIONS, INSTALLATION_STAGES } from "@/lib/mock-data";
import { formatNaira, formatDate } from "@/lib/utils";

export default function CustomerPortalHome() {
  const customer = MOCK_CUSTOMERS[0];
  const system = MOCK_SYSTEMS[0];
  const payg = MOCK_PAYG_ACCOUNTS[0];
  const installation = MOCK_INSTALLATIONS[0];

  const currentStageDef = INSTALLATION_STAGES.find((s) => s.id === installation.currentStage) || INSTALLATION_STAGES[8];

  return (
    <div className="space-y-6">
      {/* Customer Greeting Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0A5C36] via-[#074728] to-[#042414] text-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#EA580C]/25 blur-xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider bg-[#042414]/90 text-[#EA580C] px-2.5 py-1 rounded-full border border-[#EA580C]/30">
              {system.inverterBrand} {system.inverterCapacityKva}kVA System
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>Solar Active</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Hello, {customer.name.split(" ")[1]}
            </h1>
            <p className="text-xs font-semibold text-emerald-100/80 mt-0.5">
              {customer.address}
            </p>
          </div>
          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs font-bold font-mono text-emerald-100">
            <span>Tag: {customer.qrToken}</span>
            <span>Chassis SN: {system.inverterSerialNumber}</span>
          </div>
        </div>
      </div>

      {/* Energy Harvest Snapshot */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Today's Energy Snapshot</span>
            <Badge variant="success">Online</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
              <div className="text-[#EA580C] dark:text-orange-400 flex justify-center mb-1">
                <Sun className="w-5 h-5" />
              </div>
              <div className="text-lg font-black text-[#05361e] dark:text-white">18.4</div>
              <div className="text-[10px] font-bold text-emerald-700/80 dark:text-emerald-200/80 uppercase">kWh Harvest</div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <div className="text-[#0A5C36] dark:text-emerald-400 flex justify-center mb-1">
                <Battery className="w-5 h-5" />
              </div>
              <div className="text-lg font-black text-[#05361e] dark:text-white">78%</div>
              <div className="text-[10px] font-bold text-emerald-700/80 dark:text-emerald-200/80 uppercase">Battery SOC</div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-[#084729]/70 border border-emerald-200 dark:border-emerald-700">
              <div className="text-[#0A5C36] dark:text-emerald-200 flex justify-center mb-1">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-lg font-black text-[#05361e] dark:text-white">1.8</div>
              <div className="text-[10px] font-bold text-emerald-700/80 dark:text-emerald-200/80 uppercase">kW Home Load</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PAYG Balance Banner */}
      {payg && (
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-700/80 dark:text-emerald-200/80">PAYG Power Remaining</div>
              <div className="text-xl font-black text-[#05361e] dark:text-white">
                {payg.daysRemainingOfPower} Days Left
              </div>
              <div className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80 mt-0.5">
                Next billing: 10 Dec 2026 ({formatNaira(payg.monthlyInstallmentNaira)})
              </div>
            </div>
            <Link href="/portal/payments">
              <Button size="sm" variant="primary" className="shadow">
                <CreditCard className="w-4 h-4 mr-1.5" />
                <span>Pay Now</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* FULL 10-STAGE VERTICAL PROGRESS TRACKER */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0A5C36] dark:text-[#10B981]" />
              <span>Solar Installation Journey</span>
            </CardTitle>
            <Badge variant="orange">Stage {currentStageDef.order} of 10</Badge>
          </div>
          <CardDescription>
            Live status of your solar setup from initial assessment to 30-day performance review.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200 dark:before:bg-emerald-800">
            {INSTALLATION_STAGES.map((stage) => {
              const isPast = stage.order < currentStageDef.order;
              const isCurrent = stage.order === currentStageDef.order;
              const stagePhoto = installation.photos.find((p) => p.stageId === stage.id);

              return (
                <div key={stage.id} className="relative flex items-start gap-3 group">
                  {/* Step circle indicator */}
                  <div
                    className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow transition-all ${isPast
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                          ? "bg-[#EA580C] text-white font-black ring-4 ring-[#EA580C]/20 animate-pulse"
                          : "bg-emerald-100 dark:bg-[#084729] text-emerald-600/80 dark:text-emerald-300/80"
                      }`}
                  >
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : stage.order}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold leading-tight ${isCurrent
                            ? "text-[#EA580C] dark:text-orange-400"
                            : isPast
                              ? "text-[#05361e] dark:text-white"
                              : "text-emerald-600/70 dark:text-emerald-300/70"
                          }`}
                      >
                        {stage.order}. {stage.label}
                      </h4>
                      {isPast && <span className="text-[10px] text-emerald-600 font-bold">Done</span>}
                      {isCurrent && <Badge variant="orange">Current Stage</Badge>}
                    </div>

                    <p className="text-xs text-emerald-700/80 dark:text-emerald-200/80 leading-relaxed">{stage.description}</p>

                    {/* Milestone Photo if available */}
                    {stagePhoto && (
                      <div className="pt-2">
                        <div className="rounded-xl overflow-hidden border border-emerald-200 dark:border-emerald-800 bg-[#05361e] max-w-xs relative aspect-video flex items-end p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={stagePhoto.url}
                            alt={stagePhoto.caption}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="relative z-10 text-[10px] text-white bg-[#042414]/80 px-2 py-0.5 rounded font-medium truncate w-full flex items-center gap-1">
                            <Camera className="w-3 h-3 text-[#EA580C]" />
                            <span>{stagePhoto.caption}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
