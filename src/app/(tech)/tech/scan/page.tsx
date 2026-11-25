"use client";

import React, { Suspense } from "react";
import { QrScannerView } from "@/components/scanner/qr-scanner-view";

export default function TechScanPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-emerald-600/80">Loading scanner...</div>}>
      <QrScannerView
        mode="tech"
        title="Field QR Scanner"
        description="Scan inverter badge on site to verify chassis serial number and unlock stage checklist."
      />
    </Suspense>
  );
}
