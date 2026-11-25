"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Activity,
  Search,
  Filter,
  MapPin,
  Sun,
  Battery,
  Zap,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Radio
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_CUSTOMERS, MOCK_SYSTEMS, generateLiveTelemetry } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

// SSR-Safe dynamic Leaflet Map
const FleetMap = dynamic(() => import("@/components/monitoring/fleet-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-xs text-slate-400">
      Initializing OpenStreetMap Telemetry Grid...
    </div>
  )
});

export default function FleetMonitoringPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSystems = MOCK_SYSTEMS.filter((sys) => {
    const cust = MOCK_CUSTOMERS.find((c) => c.id === sys.customerId);
    const matchesSearch =
      !searchTerm ||
      cust?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust?.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sys.inverterBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sys.inverterSerialNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || sys.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const countByStatus = {
    all: MOCK_SYSTEMS.length,
    online: MOCK_SYSTEMS.filter((s) => s.status === "online").length,
    overload: MOCK_SYSTEMS.filter((s) => s.status === "overload").length,
    low_battery: MOCK_SYSTEMS.filter((s) => s.status === "low_battery").length,
    offline: MOCK_SYSTEMS.filter((s) => s.status === "offline").length,
    hardware_fault: MOCK_SYSTEMS.filter((s) => s.status === "hardware_fault").length
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-amber-500" />
            <span>Fleet Telemetry Monitoring</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time IoT heartbeat, generation curves, and automated fault diagnostics across Nigeria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            <span>Cellular Telemetry Active</span>
          </div>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Systems", count: countByStatus.all, color: "hover:border-slate-400" },
          { id: "online", label: "Healthy Online", count: countByStatus.online, color: "text-emerald-600 border-emerald-300" },
          { id: "overload", label: "Overload Trip", count: countByStatus.overload, color: "text-rose-600 border-rose-300" },
          { id: "low_battery", label: "Low Battery SOC", count: countByStatus.low_battery, color: "text-amber-600 border-amber-300" },
          { id: "offline", label: "Datalogger Offline", count: countByStatus.offline, color: "text-slate-600 border-slate-300" },
          { id: "hardware_fault", label: "Hardware Fault", count: countByStatus.hardware_fault, color: "text-purple-600 border-purple-300" }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedStatus(f.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              selectedStatus === f.id
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-transparent shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <span>{f.label}</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Map */}
      <FleetMap
        systems={MOCK_SYSTEMS}
        customers={MOCK_CUSTOMERS}
        selectedStatus={selectedStatus}
      />

      {/* Fleet Telemetry Data Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Real-Time Inverter & Battery Readings</CardTitle>
            <CardDescription>
              Showing {filteredSystems.length} telemetry streams with sub-second polling.
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <Input
              placeholder="Filter by customer, serial..."
              className="pl-9 h-9 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">System & Serial</th>
                <th className="py-3 px-4">Customer & State</th>
                <th className="py-3 px-4">Solar PV</th>
                <th className="py-3 px-4">Battery SOC</th>
                <th className="py-3 px-4">Home Load</th>
                <th className="py-3 px-4">Heatsink Temp</th>
                <th className="py-3 px-4">Heartbeat</th>
                <th className="py-3 px-4">Diagnosis</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSystems.map((sys) => {
                const cust = MOCK_CUSTOMERS.find((c) => c.id === sys.customerId);
                const tel = generateLiveTelemetry(sys);

                return (
                  <tr key={sys.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {sys.inverterBrand} {sys.inverterCapacityKva}kVA
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{sys.inverterSerialNumber}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{cust?.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span>{cust?.state}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-amber-600 dark:text-amber-400">
                      {(tel.pvPowerWatts / 1000).toFixed(2)} kW
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold">
                      <div className="flex items-center gap-1">
                        <span className={tel.batterySocPercent < 30 ? "text-rose-500" : "text-emerald-500"}>
                          {tel.batterySocPercent}%
                        </span>
                        <span className="text-[10px] text-slate-400">({tel.batteryVoltageVolts.toFixed(1)}V)</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {(tel.loadPowerWatts / 1000).toFixed(2)} kW
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className={tel.inverterTempCelsius > 65 ? "text-rose-500 font-bold" : "text-slate-600 dark:text-slate-300"}>
                        {tel.inverterTempCelsius.toFixed(1)}°C
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500">
                      {formatRelativeTime(tel.timestamp)}
                    </td>

                    <td className="py-3 px-4">
                      {sys.status === "online" && <Badge variant="success">Normal</Badge>}
                      {sys.status === "overload" && <Badge variant="destructive">Overload Trip</Badge>}
                      {sys.status === "low_battery" && <Badge variant="warning">Under-Charged</Badge>}
                      {sys.status === "offline" && <Badge variant="secondary">Offline</Badge>}
                      {sys.status === "hardware_fault" && <Badge variant="destructive">Fan Stall E04</Badge>}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/monitoring/${sys.id}`}>
                        <Button variant="outline" size="sm" className="text-xs h-8 font-semibold">
                          <span>Health</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
