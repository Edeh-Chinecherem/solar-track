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
        <div className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>All local checklists and photos synced with SolarTrack HQ</span>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shrink-0">
            TB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-tight">Tunde Bakare</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-amber-400 font-semibold">Lead Field Electrician</p>
            <p className="text-[11px] text-slate-400">ID: TECH-LAG-004 • Lagos Region</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
          <div>
            <div className="text-xl font-black text-amber-400 font-mono">48</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Installs</div>
          </div>
          <div>
            <div className="text-xl font-black text-emerald-400 font-mono">99.2%</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Pass Rate</div>
          </div>
          <div>
            <div className="text-xl font-black text-white font-mono">4.9 ★</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Rating</div>
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
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 dark:text-white">Local Queue</span>
              <p className="text-slate-500 text-[11px]">4 checklist items cached, 0 pending uploads</p>
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
            { title: "SolarTrack High-Voltage Safety Protocol (NEMSA)", year: "2025" }
          ].map((cert, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{cert.title}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{cert.year}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
