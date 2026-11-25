"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_CUSTOMERS, MOCK_SYSTEMS } from "@/lib/mock-data";

export default function PortalDocumentsPage() {
  const customer = MOCK_CUSTOMERS[0];
  const system = MOCK_SYSTEMS[0];
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownload = (docName: string) => {
    setDownloadToast(`Downloaded ${docName}`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const docs = [
    {
      id: "doc_1",
      title: "SolarTrack PAYG Lease Agreement",
      category: "Contract",
      date: "15 Jan 2026",
      size: "2.4 MB PDF",
      verified: true
    },
    {
      id: "doc_2",
      title: `10-Year Lithium Battery Warranty Certificate (${system.batteryModel})`,
      category: "Warranty",
      date: "18 Jan 2026",
      size: "1.1 MB PDF",
      verified: true
    },
    {
      id: "doc_3",
      title: "Testing & Handover Commissioning Sign-Off Form",
      category: "Handover",
      date: "20 Jan 2026",
      size: "850 KB PDF",
      verified: true
    },
    {
      id: "doc_4",
      title: `${system.inverterBrand} Hybrid Inverter User Manual & Fault Codes`,
      category: "Manual",
      date: "20 Jan 2026",
      size: "4.8 MB PDF",
      verified: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {downloadToast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-500" />
          Official System Documents
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your digital contracts, OEM warranty certificates, and equipment user guides.
        </p>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {docs.map((d) => (
          <Card key={d.id} className="overflow-hidden hover:border-amber-400 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold text-slate-600">
                    {d.category}
                  </Badge>
                  {d.verified && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                      <ShieldCheck className="w-3 h-3" /> Digitally Verified
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">{d.title}</h3>
                <div className="text-[11px] text-slate-400">
                  Issued: {d.date} • {d.size}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-9 shrink-0"
                onClick={() => handleDownload(d.title)}
                data-testid={`doc-download-${d.id}`}
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
