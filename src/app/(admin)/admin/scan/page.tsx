"use client";

import React, { Suspense } from "react";
import { QrScannerView } from "@/components/scanner/qr-scanner-view";

export default function AdminScanPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-emerald-600/80">Loading scanner...</div>}>
      <QrScannerView
        mode="admin"
        title="Admin Optical QR Scanner"
        description="Scan any customer's physical inverter QR badge to immediately inspect their full technical profile, warranty, and telemetry."
      />
    </Suspense>
  );
}
