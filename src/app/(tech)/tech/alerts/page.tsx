"use client";

import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Flame,
  PowerOff,
  Clock,
  MapPin,
  Check,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TechAlertsPage() {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);

  const alerts = [
    {
      id: "alt_1",
      systemId: "sys_001",
      customer: "Emeka Okafor",
      location: "Lekki Phase 1, Lagos",
      type: "Overload Contactor Trip",
      severity: "critical",
      time: "12 mins ago",
      description: "Surge load peaked at 6.1 kW (exceeded 5.0 kW inverter limit). Contactor opened automatically."
    },
    {
      id: "alt_2",
      systemId: "sys_004",
      customer: "Amina Bello",
      location: "Maitama, Abuja",
      type: "High Inverter Heat Sink Temp",
      severity: "warning",
      time: "45 mins ago",
      description: "Inverter enclosure internal temperature reached 68°C. Check fan filter obstruction."
    },
    {
      id: "alt_3",
      systemId: "sys_007",
      customer: "Ibrahim Musa",
      location: "Nassarawa, Kano",
      type: "Persistent Battery Depletion",
      severity: "warning",
      time: "2 hours ago",
      description: "LiFePO4 battery sustained below 20% SOC for 48 consecutive hours. Customer needs charge check."
    }
  ];

  const handleAcknowledge = (id: string) => {
    setAcknowledgedAlerts((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-[#05361e] dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#EA580C]" />
          Field Alarm Dispatches
        </h1>
        <p className="text-xs text-emerald-700/80 dark:text-emerald-200/80">Live hardware warnings requiring technician attention.</p>
      </div>

      <div className="space-y-3">
        {alerts.map((alt) => {
          const isAck = acknowledgedAlerts.includes(alt.id);

          return (
            <Card
              key={alt.id}
              className={`border-l-4 transition-all ${
                alt.severity === "critical" ? "border-l-[#C2410C]" : "border-l-[#EA580C]"
              }`}
            >
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <Badge variant={alt.severity === "critical" ? "destructive" : "warning"}>
                      {alt.type}
                    </Badge>
                    <h3 className="font-bold text-sm text-[#05361e] dark:text-white mt-1">
                      {alt.customer}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600/80 dark:text-emerald-300/80 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alt.time}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700/80 dark:text-emerald-200/80">
                  <MapPin className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                  <span>{alt.location}</span>
                </div>

                <p className="text-xs text-[#0A5C36] dark:text-emerald-200 bg-emerald-50/50 dark:bg-[#084729]/60 p-2.5 rounded-xl">
                  {alt.description}
                </p>

                <div className="flex justify-end pt-1">
                  {isAck ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Check className="w-3.5 h-3.5" />
                      Dispatched to You
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-bold gap-1 text-[#EA580C] border-orange-300 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-950/40"
                      onClick={() => handleAcknowledge(alt.id)}
                      data-testid={`ack-alert-${alt.id}`}
                    >
                      <span>Acknowledge & Accept</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
