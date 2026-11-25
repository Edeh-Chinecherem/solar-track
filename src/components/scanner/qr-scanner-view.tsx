"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Camera,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Building,
  UserCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";

interface QrScannerViewProps {
  mode: "admin" | "tech";
  title?: string;
  description?: string;
}

export function QrScannerView({ mode, title, description }: QrScannerViewProps) {
  const router = useRouter();
  const [manualToken, setManualToken] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [simulatingScan, setSimulatingScan] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  const handleResolveToken = (token: string) => {
    setErrorMsg(null);
    const cleanToken = token.trim().toUpperCase();
    const customer = MOCK_CUSTOMERS.find(
      (c) =>
        c.qrToken.toUpperCase() === cleanToken ||
        c.id.toUpperCase() === cleanToken ||
        c.systemId.toUpperCase() === cleanToken
    );

    if (customer) {
      if (mode === "admin") {
        router.push(`/admin/customers/${customer.id}`);
      } else {
        router.push(`/tech?search=${encodeURIComponent(customer.name)}`);
      }
    } else {
      setErrorMsg(`No customer system found matching tag or serial "${cleanToken}". Try demo tags below.`);
    }
  };

  const handleSimulateCameraCapture = (token: string) => {
    setSimulatingScan(true);
    setTimeout(() => {
      setSimulatingScan(false);
      handleResolveToken(token);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <QrCode className="w-6 h-6 text-amber-500" />
          {title || "Hardware QR Scanner"}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {description || "Scan the laminated QR label on the inverter casing to open the verified installation record."}
        </p>
      </div>

      {/* Camera Viewport Simulation */}
      <Card className="overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative aspect-square sm:aspect-video bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
          {/* Viewfinder crosshairs */}
          <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-amber-400/80 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
            <div className="flex justify-between">
              <span className="w-5 h-5 border-t-4 border-l-4 border-amber-400" />
              <span className="w-5 h-5 border-t-4 border-r-4 border-amber-400" />
            </div>
            {/* Animated Laser Scanning Line */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#F59E0B] animate-pulse" />
            <div className="flex justify-between">
              <span className="w-5 h-5 border-b-4 border-l-4 border-amber-400" />
              <span className="w-5 h-5 border-b-4 border-r-4 border-amber-400" />
            </div>
          </div>

          <Camera className="w-10 h-10 text-slate-600 mb-2 animate-bounce" />
          <p className="text-xs font-bold text-slate-300 text-center max-w-xs">
            {simulatingScan
              ? "Decoding QR Tag Barcode..."
              : "Point camera at solar inverter QR badge or barcode"}
          </p>
          <span className="text-[10px] text-amber-400 font-mono mt-1">
            Optical OCR & Barcode Reader Active
          </span>
        </div>

        {/* Manual Fallback & Quick Demo Tags */}
        <CardContent className="p-4 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleResolveToken(manualToken);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Enter QR Token or Chassis SN..."
                className="pl-9 text-xs font-mono uppercase"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                data-testid="manual-qr-input"
              />
            </div>
            <Button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs gap-1.5"
              data-testid="resolve-qr-btn"
            >
              <span>Inspect</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Demo Scans (Click to Simulate Camera Scan):
            </span>
            <div className="flex flex-wrap gap-2">
              {MOCK_CUSTOMERS.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSimulateCameraCapture(c.qrToken)}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-400 border border-transparent text-left transition-all"
                  data-testid={`demo-scan-${c.qrToken}`}
                >
                  <div className="font-mono text-xs font-black text-amber-600 dark:text-amber-400">
                    {c.qrToken}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {c.name.split(" ")[0]} ({c.state})
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
