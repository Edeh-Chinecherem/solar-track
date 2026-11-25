"use client";

import React, { useState } from "react";
import {
  Zap,
  TrendingDown,
  Sun,
  Battery,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  Clock,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";

const DAILY_USAGE_DATA = [
  { day: "Mon", generation: 19.4, consumption: 14.2 },
  { day: "Tue", generation: 22.1, consumption: 16.5 },
  { day: "Wed", generation: 18.0, consumption: 15.1 },
  { day: "Thu", generation: 24.5, consumption: 17.8 },
  { day: "Fri", generation: 21.3, consumption: 15.9 },
  { day: "Sat", generation: 25.0, consumption: 21.4 },
  { day: "Sun", generation: 23.8, consumption: 19.2 }
];

const HOURLY_TODAY = [
  { hour: "06:00", pv: 0.1, load: 0.8 },
  { hour: "08:00", pv: 1.4, load: 1.2 },
  { hour: "10:00", pv: 3.2, load: 1.6 },
  { hour: "12:00", pv: 4.8, load: 2.1 },
  { hour: "14:00", pv: 4.5, load: 2.4 },
  { hour: "16:00", pv: 2.8, load: 1.8 },
  { hour: "18:00", pv: 0.4, load: 2.2 },
  { hour: "20:00", pv: 0.0, load: 1.9 },
  { hour: "22:00", pv: 0.0, load: 1.4 }
];

export default function PortalUsagePage() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" />
          Energy & Load Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your household solar generation vs consumption to optimize battery life and avoid overloads.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1">
          <div className="flex items-center justify-between text-amber-600 text-xs font-bold">
            <span>Weekly Solar Harvest</span>
            <Sun className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            154.1 <span className="text-xs font-sans text-slate-500">kWh</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +8.2% vs last week
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-1">
          <div className="flex items-center justify-between text-sky-600 text-xs font-bold">
            <span>Weekly Home Load</span>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            120.1 <span className="text-xs font-sans text-slate-500">kWh</span>
          </div>
          <div className="text-[11px] text-sky-600 font-bold">
            Solar Self-Sufficiency: 88%
          </div>
        </div>
      </div>

      {/* Energy Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Solar vs Home Load (Last 7 Days)</CardTitle>
              <CardDescription className="text-xs">Measured in Kilowatt-Hours (kWh)</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-amber-500">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Solar
              </span>
              <span className="flex items-center gap-1 text-sky-500">
                <span className="w-2 h-2 rounded-full bg-sky-500" /> Load
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-56 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_USAGE_DATA} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    backgroundColor: "#0F172A",
                    color: "#fff",
                    border: "none"
                  }}
                />
                <Bar dataKey="generation" name="Solar (kWh)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="consumption" name="Load (kWh)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Smart Efficiency Tips */}
      <Card className="border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Energy-Saving & Overload Prevention Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>⚡</span> Avoid Simultaneous Heavy Resistive Loads
            </h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Do not run an electric pressing iron, water heater, and microwave at the same time. Doing so can cause a temporary surge trip on your 5kVA inverter.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>☀️</span> Run Pumping Machines at Solar Peak (11 AM - 2 PM)
            </h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Water pumping draws direct power from the sun when your panels produce over 4 kW, saving battery reserve for nighttime illumination and cooling.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🔋</span> Battery Health Preservation
            </h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Your LiFePO4 battery is calibrated for 6,000+ cycles. Keeping overnight battery depth of discharge above 20% extends operating lifespan beyond 10 years.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
