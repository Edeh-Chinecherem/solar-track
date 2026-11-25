"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Camera,
  Check,
  Clock,
  WifiOff,
  CloudCheck,
  ShieldCheck,
  Upload,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { MOCK_CUSTOMERS, MOCK_INSTALLATIONS, INSTALLATION_STAGES } from "@/lib/mock-data";
import { Installation, InstallationStageId } from "@/lib/types";

export default function TechJobsPage() {
  const [jobs, setJobs] = useState<Installation[]>(MOCK_INSTALLATIONS.slice(0, 5));
  const [activeJob, setActiveJob] = useState<Installation | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [offlineToast, setOfflineToast] = useState<string | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<{ [jobId: string]: string[] }>({
    inst_001: [
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80"
    ]
  });

  const openJobChecklist = (job: Installation) => {
    setActiveJob(job);
    setChecklistOpen(true);
  };

  const toggleChecklistItem = (jobId: string, stageId: InstallationStageId, itemId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        const currentChecklist = j.checklists[stageId] || [];
        const updatedChecklist = currentChecklist.map((c) =>
          c.id === itemId
            ? {
                ...c,
                isCompleted: !c.isCompleted,
                completedAt: !c.isCompleted ? new Date().toISOString() : undefined,
                completedBy: !c.isCompleted ? "Tunde Bakare (Tech)" : undefined
              }
            : c
        );
        return {
          ...j,
          checklists: {
            ...j.checklists,
            [stageId]: updatedChecklist
          }
        };
      })
    );

    // Trigger offline sync notification
    setOfflineToast("Progress saved to offline storage & queued for background cloud sync");
    setTimeout(() => setOfflineToast(null), 3000);
  };

  const handleSimulatePhotoUpload = (jobId: string) => {
    const mockPhotoUrls = [
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&auto=format&fit=crop&q=80"
    ];
    const newPhoto = mockPhotoUrls[Math.floor(Math.random() * mockPhotoUrls.length)];
    setUploadedPhotos((prev) => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), newPhoto]
    }));
    setOfflineToast("Photo captured with GPS timestamp (6.5244° N, 3.3792° E) & cached locally");
    setTimeout(() => setOfflineToast(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Offline Toast */}
      {offlineToast && (
        <div className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="leading-tight">{offlineToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            Field Operations
          </h1>
          <p className="text-xs text-slate-500">Technician: Tunde Bakare (Lead Electrician)</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Offline Ready</span>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {jobs.map((job) => {
          const cust = MOCK_CUSTOMERS.find((c) => c.id === job.customerId);
          if (!cust) return null;

          const stageDef = INSTALLATION_STAGES.find((s) => s.id === job.currentStage);
          const stageChecklist = job.checklists[job.currentStage] || [];
          const completedCount = stageChecklist.filter((c) => c.isCompleted).length;
          const photos = uploadedPhotos[job.id] || [];

          return (
            <Card key={job.id} className="border-l-4 border-l-amber-500 overflow-hidden shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Stage: {stageDef?.label || job.currentStage}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                      {cust.name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">Tag: {cust.qrToken}</p>
                  </div>
                  <Badge variant={job.isOverdue ? "destructive" : "secondary"}>
                    {job.isOverdue ? "Overdue" : `${job.daysInCurrentStage}d in stage`}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{cust.address}</span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Stage Checklist</span>
                    <span>{completedCount} of {stageChecklist.length} done</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{
                        width: `${stageChecklist.length ? (completedCount / stageChecklist.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons: Maps & WhatsApp */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={`https://maps.google.com/?q=${cust.gpsCoords.lat},${cust.gpsCoords.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                    data-testid={`maps-btn-${job.id}`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>Maps Route</span>
                  </a>
                  <a
                    href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    data-testid={`whatsapp-btn-${job.id}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Checklist & Photos triggers */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 gap-1.5"
                    onClick={() => openJobChecklist(job)}
                    data-testid={`open-checklist-${job.id}`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Checklist ({completedCount}/{stageChecklist.length})
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold gap-1.5"
                    onClick={() => handleSimulatePhotoUpload(job.id)}
                    data-testid={`upload-photo-${job.id}`}
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-500" />
                    Photo ({photos.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* --- CHECKLIST DIALOG --- */}
      <Dialog open={checklistOpen} onOpenChange={setChecklistOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center justify-between">
              <span>{activeJob ? INSTALLATION_STAGES.find((s) => s.id === activeJob.currentStage)?.label : "Checklist"}</span>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                Offline Auto-Save
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tick required safety, mechanical, and electrical verification points.
            </DialogDescription>
          </DialogHeader>

          {activeJob && (
            <div className="space-y-3 py-2 text-xs">
              {(activeJob.checklists[activeJob.currentStage] || []).map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(activeJob.id, activeJob.currentStage, item.id)}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    item.isCompleted
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                  }`}
                  data-testid={`checklist-item-${item.id}`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      item.isCompleted
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-400"
                    }`}
                  >
                    {item.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${item.isCompleted ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                      {item.text}
                    </p>
                    {item.completedAt && (
                      <p className="text-[10px] text-emerald-600 font-mono mt-0.5">
                        Ticked at {new Date(item.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button
              className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold"
              onClick={() => setChecklistOpen(false)}
              data-testid="close-checklist-btn"
            >
              Done & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
