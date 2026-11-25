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

    // Custom status markers (Strictly Green, Orange & White)
    const createMarkerIcon = (status: string) => {
      const markerStyles: Record<string, { bg: string; border: string; text: string }> = {
        online: { bg: "#0A5C36", border: "#FFFFFF", text: "#FFFFFF" },
        overload: { bg: "#C2410C", border: "#FFFFFF", text: "#FFFFFF" },
        low_battery: { bg: "#EA580C", border: "#FFFFFF", text: "#FFFFFF" },
        offline: { bg: "#FFFFFF", border: "#0A5C36", text: "#0A5C36" },
        hardware_fault: { bg: "#9A3412", border: "#FFFFFF", text: "#FFFFFF" }
      };
      const style = markerStyles[status] || { bg: "#EA580C", border: "#FFFFFF", text: "#FFFFFF" };

      return L.divIcon({
        className: "custom-solar-marker",
        html: `
          <div style="
            background-color: ${style.bg};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid ${style.border};
            box-shadow: 0 4px 10px rgba(5,54,30,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${style.text};
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
          <div style="font-weight: 800; font-size: 13px; color: #05361e; margin-bottom: 2px;">
            ${cust.name}
          </div>
          <div style="font-size: 11px; color: #0A5C36; margin-bottom: 6px;">
            ${cust.state} • ${cust.qrToken}
          </div>
          <div style="font-size: 11px; font-weight: 600; color: #05361e; margin-bottom: 4px;">
            ${sys.inverterBrand} ${sys.inverterCapacityKva}kVA (${sys.batteryCapacityKwh}kWh)
          </div>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; ${sys.status === "online"
          ? "background-color: #DCFCE7; color: #0A5C36;"
          : sys.status === "offline"
            ? "background-color: #FFFFFF; color: #0A5C36; border: 1px solid #0A5C36;"
            : sys.status === "overload" || sys.status === "hardware_fault"
              ? "background-color: #EA580C; color: #FFFFFF;"
              : "background-color: #FFEDD5; color: #9A3412;"
        }">
            ${statusLabels[sys.status] || sys.status}
          </div>
          <div>
            <a href="/admin/monitoring/${sys.id}" style="
              display: block;
              text-align: center;
              background-color: #0A5C36;
              color: #FFFFFF;
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
      <div className="h-[420px] w-full rounded-2xl bg-emerald-50 dark:bg-[#084729] animate-pulse flex items-center justify-center text-xs text-emerald-700/80 dark:text-emerald-200/80">
        Loading Nigeria Fleet Telemetry Map...
      </div>
    );
  }

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-800 shadow-sm z-10">
      <div id="fleet-leaflet-map" className="w-full h-full" />
      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-[#06361f]/95 backdrop-blur p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-lg text-[10px] space-y-1 font-semibold text-[#05361e] dark:text-white">
        <div className="font-bold text-[#05361e] dark:text-white uppercase tracking-wider text-[9px] mb-1">
          Marker Status
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0A5C36]" />
          <span>Online (Healthy)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]" />
          <span>Overload / Fault</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
          <span>Low Battery SOC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#0A5C36]" />
          <span>Offline Datalogger</span>
        </div>
      </div>
    </div>
  );
}
