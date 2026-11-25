"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SolarSystem, Customer } from "@/lib/types";

interface FleetMapProps {
  systems: SolarSystem[];
  customers: Customer[];
  selectedStatus: string;
}

export default function FleetMap({ systems, customers, selectedStatus }: FleetMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    // Dynamically import Leaflet on client side only
    import("leaflet").then((leafletModule) => {
      setL(leafletModule.default || leafletModule);
    });
  }, []);

  useEffect(() => {
    if (!isMounted || !L) return;

    // Check if container already initialized
    const container = document.getElementById("fleet-leaflet-map");
    if (!container) return;

    // Fix map initialization if already set
    if ((container as any)._leaflet_id) {
      container.innerHTML = "";
    }

    // Centered on Nigeria
    const map = L.map("fleet-leaflet-map").setView([9.082, 8.6753], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // Custom status markers
    const createMarkerIcon = (status: string) => {
      const colors: Record<string, string> = {
        online: "#16A34A",
        overload: "#DC2626",
        low_battery: "#EAB308",
        offline: "#64748B",
        hardware_fault: "#9333EA"
      };
      const color = colors[status] || "#F59E0B";

      return L.divIcon({
        className: "custom-solar-marker",
        html: `
          <div style="
            background-color: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
          ">
            ☀
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
    };

    // Filter systems
    const filtered = systems.filter((s) => selectedStatus === "all" || s.status === selectedStatus);

    filtered.forEach((sys) => {
      const cust = customers.find((c) => c.id === sys.customerId);
      if (!cust || !cust.gpsCoords) return;

      const marker = L.marker([cust.gpsCoords.lat, cust.gpsCoords.lng], {
        icon: createMarkerIcon(sys.status)
      }).addTo(map);

      const statusLabels: Record<string, string> = {
        online: "Normal Online",
        overload: "Overload Trip",
        low_battery: "Low Battery SOC",
        offline: "Datalogger Offline",
        hardware_fault: "Hardware Fault"
      };

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 180px;">
          <div style="font-weight: 800; font-size: 13px; color: #0F172A; margin-bottom: 2px;">
            ${cust.name}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">
            ${cust.state} • ${cust.qrToken}
          </div>
          <div style="font-size: 11px; font-weight: 600; margin-bottom: 4px;">
            ${sys.inverterBrand} ${sys.inverterCapacityKva}kVA (${sys.batteryCapacityKwh}kWh)
          </div>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; background-color: ${
            sys.status === "online" ? "#DCFCE7; color: #166534;" : sys.status === "overload" ? "#FEE2E2; color: #991B1B;" : "#FEF3C7; color: #92400E;"
          }">
            ${statusLabels[sys.status] || sys.status}
          </div>
          <div>
            <a href="/admin/monitoring/${sys.id}" style="
              display: block;
              text-align: center;
              background-color: #F59E0B;
              color: #0F172A;
              text-decoration: none;
              font-weight: bold;
              font-size: 11px;
              padding: 6px 10px;
              border-radius: 8px;
            ">
              Inspect System Health →
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    return () => {
      map.remove();
    };
  }, [isMounted, L, systems, customers, selectedStatus]);

  if (!isMounted) {
    return (
      <div className="h-[420px] w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-xs text-slate-400">
        Loading Nigeria Fleet Telemetry Map...
      </div>
    );
  }

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm z-10">
      <div id="fleet-leaflet-map" className="w-full h-full" />
      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-[10px] space-y-1 font-semibold">
        <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[9px] mb-1">
          Marker Status
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span>Online (Healthy)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
          <span>Overload / Fault</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Low Battery SOC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <span>Offline Datalogger</span>
        </div>
      </div>
    </div>
  );
}
