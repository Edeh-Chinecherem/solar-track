"use client";

import React, { useState } from "react";
import {
  User,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  HardHat,
  Award,
  Phone,
  Mail,
  CloudCheck,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TechProfilePage() {
  const [syncing, setSyncing] = useState(false);
  const [syncedToast, setSyncedToast] = useState(false);

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncedToast(true);
      setTimeout(() => setSyncedToast(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {syncedToast && (
        <div className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 bg-[#05361e] text-white text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>All local checklists and photos synced with GreenerAfrik HQ</span>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="p-5 rounded-3xl bg-[#05361e] text-white shadow-xl space-y-4 relative overflow-hidden border border-emerald-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0A5C36] border border-[#10B981]/30 text-white font-black text-2xl flex items-center justify-center shrink-0">
            TB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-tight">Tunde Bakare</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-[#EA580C] font-semibold">Lead Field Electrician</p>
            <p className="text-[11px] text-emerald-200/80">ID: TECH-LAG-004 • Lagos Region</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-800 text-center">
          <div>
            <div className="text-xl font-black text-[#EA580C] font-mono">48</div>
            <div className="text-[10px] text-emerald-200/80 uppercase font-semibold">Installs</div>
          </div>
          <div>
            <div className="text-xl font-black text-emerald-400 font-mono">99.2%</div>
            <div className="text-[10px] text-emerald-200/80 uppercase font-semibold">Pass Rate</div>
          </div>
          <div>
            <div className="text-xl font-black text-white font-mono">4.9 ★</div>
            <div className="text-[10px] text-emerald-200/80 uppercase font-semibold">Rating</div>
          </div>
        </div>
      </div>

      {/* Offline Storage Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Offline Sync Storage</span>
            <Badge variant="success" className="text-[10px]">Connected</Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Cached site surveys, photos, and checklist ticks stored locally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-[#084729] border border-emerald-200 dark:border-emerald-700 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#05361e] dark:text-white">Local Queue</span>
              <p className="text-emerald-700/80 dark:text-emerald-200/80 text-[11px]">4 checklist items cached, 0 pending uploads</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 font-bold"
              onClick={handleManualSync}
              disabled={syncing}
              data-testid="sync-now-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              Sync Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certifications & Tools */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Verified Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 text-xs">
          {[
            { title: "COREN Registered Electrical Contractor", year: "2022" },
            { title: "Victron Energy MultiPlus & Quattro Level 2", year: "2023" },
            { title: "Deye High-Voltage Hybrid Inverter Specialist", year: "2024" },
            { title: "GreenerAfrik High-Voltage Safety Protocol (NEMSA)", year: "2025" }
          ].map((cert, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-emerald-100 dark:border-emerald-900 last:border-0">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0A5C36] dark:text-[#10B981] shrink-0" />
                <span className="font-semibold text-[#05361e] dark:text-emerald-100">{cert.title}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600/80 dark:text-emerald-300/80">{cert.year}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
