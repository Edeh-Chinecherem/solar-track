"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  PieChart as PieIcon,
  FileSpreadsheet,
  FileText,
  DollarSign,
  ShieldCheck
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
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from "recharts";
import { formatNaira } from "@/lib/utils";

const STAGE_TURNAROUND_DATA = [
  { stage: "Survey", actual: 2.1, target: 3.0 },
  { stage: "Quote", actual: 1.4, target: 2.0 },
  { stage: "Pay Conf", actual: 0.8, target: 1.0 },
  { stage: "Procure", actual: 3.2, target: 4.0 },
  { stage: "Install", actual: 2.4, target: 3.0 },
  { stage: "Testing", actual: 1.1, target: 2.0 },
  { stage: "Handover", actual: 0.6, target: 1.0 }
];

const REVENUE_COLLECTIONS_DATA = [
  { month: "Jun", collected: 12.4, target: 14.0 },
  { month: "Jul", collected: 14.2, target: 15.0 },
  { month: "Aug", collected: 15.8, target: 16.5 },
  { month: "Sep", collected: 16.5, target: 17.0 },
  { month: "Oct", collected: 17.9, target: 18.5 },
  { month: "Nov", collected: 18.4, target: 19.6 }
];

const FAULT_DISTRIBUTION_DATA = [
  { name: "Overload Surges", value: 42, color: "#EF4444" },
  { name: "Under-charged Battery", value: 28, color: "#F59E0B" },
  { name: "Breaker / Wiring Trips", value: 18, color: "#3B82F6" },
  { name: "Hardware / Temperature", value: 12, color: "#8B5CF6" }
];

const BRAND_RELIABILITY = [
  { brand: "Victron Energy", uptime: "99.8%", systems: 8, meanTimeToRepair: "2.4 hrs", score: "A+" },
  { brand: "Deye Hybrid", uptime: "99.4%", systems: 11, meanTimeToRepair: "3.1 hrs", score: "A" },
  { brand: "Sunsynk", uptime: "99.1%", systems: 4, meanTimeToRepair: "3.8 hrs", score: "A-" },
  { brand: "Growatt SPF", uptime: "98.7%", systems: 2, meanTimeToRepair: "4.5 hrs", score: "B+" }
];

const TECHNICIANS_PRODUCTIVITY = [
  { name: "Tunde Bakare", region: "Lagos & Ogun", completed: 48, onTime: "98.2%", rating: 4.9 },
  { name: "Chinedu Eze", region: "Rivers & Delta", completed: 34, onTime: "96.5%", rating: 4.8 },
  { name: "Abdullahi Garba", region: "Abuja FCT & Kano", completed: 29, onTime: "95.8%", rating: 4.7 },
  { name: "Folake Adeleke", region: "Oyo & Osun", completed: 26, onTime: "97.1%", rating: 4.9 }
];

export default function AdminReportsPage() {
  const [exportToast, setExportToast] = useState<string | null>(null);

  const handleExportCSV = () => {
    // Generate and trigger simulated CSV download
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Technician,Region,Completed Jobs,On-Time Rate,Rating\n" +
      TECHNICIANS_PRODUCTIVITY.map((t) => `${t.name},${t.region},${t.completed},${t.onTime},${t.rating}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GreenerAfrik_Productivity_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportToast("CSV Productivity & Turnaround report exported successfully.");
    setTimeout(() => setExportToast(null), 3000);
  };

  const handleExportPDF = () => {
    setExportToast("PDF Executive Analytics Brief generated and downloaded.");
    setTimeout(() => setExportToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {exportToast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-amber-500" />
            Executive Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Installation turnaround times, technician productivity, collections efficiency, and inverter reliability indexes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs font-bold"
            onClick={handleExportCSV}
            data-testid="export-csv-btn"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </Button>

          <Button
            size="sm"
            className="gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950"
            onClick={handleExportPDF}
            data-testid="export-pdf-btn"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Avg Turnaround Time</p>
              <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">11.4 Days</h3>
              <p className="text-xs font-bold text-emerald-600 mt-0.5">
                ↓ 2.6 days faster than SLA
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">PAYG Recovery Rate</p>
              <h3 className="text-2xl font-black mt-1 text-emerald-600">93.8%</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                ₦18.4M of ₦19.6M collected
              </p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sky-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Fleet Uptime Index</p>
              <h3 className="text-2xl font-black mt-1 text-sky-600">99.3%</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Across 25 installations
              </p>
            </div>
            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 text-sky-600 rounded-2xl">
              <Zap className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Field Team Rating</p>
              <h3 className="text-2xl font-black mt-1 text-purple-600">4.85 / 5.0</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                137 customer reviews
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Stage Turnaround Time & Fault Categories Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Turnaround Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Stage Turnaround vs SLA Target (Days)</CardTitle>
                <CardDescription className="text-xs">
                  Average duration spent in each installation pipeline stage
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1 text-amber-500">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Actual
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> SLA Target
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STAGE_TURNAROUND_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      fontSize: "12px",
                      backgroundColor: "#0F172A",
                      color: "#fff",
                      border: "none"
                    }}
                  />
                  <Bar dataKey="actual" name="Actual (Days)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target (Days)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fault Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Technical Fault Categories Distribution</CardTitle>
            <CardDescription className="text-xs">
              Root-cause telemetry classification of 48 logged field issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={FAULT_DISTRIBUTION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent = 0 }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {FAULT_DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      fontSize: "12px",
                      backgroundColor: "#0F172A",
                      color: "#fff",
                      border: "none"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Monthly Collections Rate & Inverter Brand Reliability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Collections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">PAYG Revenue Collections (₦ Millions)</CardTitle>
                <CardDescription className="text-xs">
                  Monthly billing vs actual recovery through Paystack and Bank Transfers
                </CardDescription>
              </div>
              <Badge variant="success">93.8% Overall Efficiency</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_COLLECTIONS_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      fontSize: "12px",
                      backgroundColor: "#0F172A",
                      color: "#fff",
                      border: "none"
                    }}
                    formatter={(val: any) => [`₦${val} Million`, "Revenue"]}
                  />
                  <Bar dataKey="collected" name="Recovered" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target Billed" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Brand Reliability Index */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inverter OEM Reliability & Uptime Index</CardTitle>
            <CardDescription className="text-xs">
              Hardware durability comparison based on field MTTR and telemetry alarms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {BRAND_RELIABILITY.map((b) => (
                <div key={b.brand} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{b.brand}</span>
                      <Badge variant="outline" className="text-[10px]">{b.score}</Badge>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {b.systems} Active Fleets • MTTR: {b.meanTimeToRepair}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-600 text-sm">
                      {b.uptime}
                    </span>
                    <div className="text-[10px] text-slate-400">Hardware Uptime</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Technician Productivity Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Technician Field Productivity & Quality Leaderboard</CardTitle>
          <CardDescription className="text-xs">
            Assigned regional leads, completion speed, and customer satisfaction index
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Technician Lead</th>
                  <th className="p-3">Coverage Region</th>
                  <th className="p-3">Completed Installations</th>
                  <th className="p-3">On-Time SLA Rate</th>
                  <th className="p-3 text-right">Customer Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {TECHNICIANS_PRODUCTIVITY.map((tech) => (
                  <tr key={tech.name} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-black text-[11px] flex items-center justify-center">
                        {tech.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span>{tech.name}</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{tech.region}</td>
                    <td className="p-3 font-mono font-bold">{tech.completed} Systems</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">{tech.onTime}</td>
                    <td className="p-3 text-right font-mono font-bold text-amber-600">
                      {tech.rating} / 5.0 ★
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
