"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Printer, X, ShieldCheck, Sun, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";

interface QrCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  customerName: string;
  systemModel: string;
  systemSerial: string;
  systemCapacity: number;
}

export function QrCodeModal({
  open,
  onOpenChange,
  token,
  customerName,
  systemModel,
  systemSerial,
  systemCapacity
}: QrCodeModalProps) {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/q/${token}` : `https://greenerafrik.com/q/${token}`;

  const handleDownload = () => {
    try {
      const svg = document.getElementById("customer-qr-svg");
      if (!svg) return;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `GreenerAfrik-${token}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        toast("QR Code Downloaded", { description: `Saved ${token}.png to your downloads folder.`, type: "success" });
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } catch (e) {
      console.error(e);
      toast("Download Failed", { description: "Could not export QR code PNG.", type: "error" });
    }
  };

  const handlePrint = () => {
    window.print();
    toast("Print Label Dialog Opened", { description: "Thermal sticker printing ready.", type: "info" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 bg-white dark:bg-[#06361f] border border-emerald-200 dark:border-emerald-800 rounded-3xl shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center mb-2">
            <Sun className="w-6 h-6 fill-[#EA580C]" />
          </div>
          <DialogTitle className="text-xl font-black text-[#05361e] dark:text-white">
            Weatherproof Hardware Tag
          </DialogTitle>
          <DialogDescription className="text-xs text-emerald-700/80 dark:text-emerald-200/80">
            Scan to inspect warranty and telemetry. Affix this tag to the inverter casing.
          </DialogDescription>
        </DialogHeader>

        {/* Printable Label Container */}
        <div
          ref={printRef}
          className="my-4 p-5 rounded-2xl border-2 border-dashed border-[#0A5C36]/40 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col items-center justify-center text-center space-y-4"
        >
          {/* Brand header */}
          <div className="flex items-center gap-2 text-[#05361e] dark:text-white">
            <Sun className="w-5 h-5 text-[#EA580C] fill-[#EA580C]" />
            <span className="font-extrabold text-sm tracking-tight text-[#0A5C36] dark:text-[#10B981]">GreenerAfrik</span>
            <span className="text-[10px] bg-[#0A5C36] text-white font-bold px-1.5 py-0.5 rounded">
              VERIFIED
            </span>
          </div>

          {/* QR SVG */}
          <div className="p-3 bg-white rounded-2xl shadow-md border border-emerald-200 inline-block">
            <QRCodeSVG
              id="customer-qr-svg"
              value={publicUrl}
              size={180}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/favicon.ico",
                x: undefined,
                y: undefined,
                height: 28,
                width: 28,
                excavate: true
              }}
            />
          </div>

          {/* Tag Metadata */}
          <div className="space-y-1">
            <div className="font-mono text-base font-black tracking-wider text-[#05361e] dark:text-white">
              {token}
            </div>
            <div className="text-xs font-semibold text-[#0A5C36] dark:text-emerald-100">
              {systemModel} • {systemCapacity}kVA
            </div>
            <div className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80 font-mono">
              Chassis SN: {systemSerial}
            </div>
            <div className="text-[10px] text-emerald-700/80 dark:text-emerald-200/80 font-medium">
              Registered to: {customerName}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="outline" onClick={handleDownload} className="w-full text-xs font-bold gap-1.5">
            <Download className="w-4 h-4 text-[#0A5C36] dark:text-[#10B981]" />
            <span>Download PNG</span>
          </Button>

          <Button variant="primary" onClick={handlePrint} className="w-full text-xs font-bold gap-1.5 shadow-md">
            <Printer className="w-4 h-4 text-white" />
            <span>Print Label</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
