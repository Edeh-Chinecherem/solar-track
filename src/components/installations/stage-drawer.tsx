"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  Calendar,
  User,
  Wrench,
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Lock
} from "lucide-react";
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Installation, InstallationStageId, SolarSystem, Customer } from "@/lib/types";
import { INSTALLATION_STAGES } from "@/lib/mock-data/stages";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { useToast } from "@/components/providers/toast-provider";
import { api } from "@/lib/api";

interface StageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installation: Installation | null;
  customer?: Customer;
  system?: SolarSystem;
  onStageUpdated: () => void;
}

export function StageDrawer({
  open,
  onOpenChange,
  installation,
  customer,
  system,
  onStageUpdated
}: StageDrawerProps) {
  const { currentUser, currentRole, canPerform } = useAuthRole();
  const { toast } = useToast();

  const [notes, setNotes] = useState("");
  const [blockedReason, setBlockedReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [newPhotoCaption, setNewPhotoCaption] = useState("");

  if (!installation || !customer) return null;

  const currentStageDef = INSTALLATION_STAGES.find((s) => s.id === installation.currentStage) || INSTALLATION_STAGES[0];
  const nextStageDef = INSTALLATION_STAGES.find((s) => s.order === currentStageDef.order + 1);
  const canEditStage =
    canPerform("ADVANCE_STAGE") &&
    (currentRole === "super_admin" ||
      currentRole === "operations_manager" ||
      currentStageDef.requiredRole.includes(currentRole));

  const currentChecklist = installation.checklists[installation.currentStage] || [];
  const completedCount = currentChecklist.filter((c) => c.isCompleted).length;
  const totalCount = currentChecklist.length;
  const allMandatoryChecked = totalCount === 0 || currentChecklist.filter((c) => c.isMandatory).every((c) => c.isCompleted);

  const handleToggleChecklist = async (itemId: string) => {
    try {
      await api.toggleChecklistItem(installation.id, installation.currentStage, itemId, currentUser);
      onStageUpdated();
      toast("Checklist Updated", { description: "Item saved to audit log.", type: "info" });
    } catch (e) {
      toast("Error", { description: "Failed to update checklist item.", type: "error" });
    }
  };

  const handleAdvanceStage = async () => {
    if (!nextStageDef) return;
    if (!allMandatoryChecked) {
      toast("Action Blocked", {
        description: "All mandatory checklist items must be ticked before stage advancement.",
        type: "error"
      });
      return;
    }

    setIsUpdating(true);
    try {
      await api.updateInstallationStage(
        installation.id,
        nextStageDef.id,
        currentUser,
        notes || `Completed ${currentStageDef.label}.`
      );
      toast("Installation Stage Advanced!", {
        description: `Successfully moved to ${nextStageDef.label}.`,
        type: "success"
      });
      onStageUpdated();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast("Update Failed", { description: "Could not advance stage.", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSimulatePhotoUpload = async () => {
    try {
      await api.uploadInstallationPhoto(
        installation.id,
        {
          url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
          caption: newPhotoCaption || `Field verification photo for ${currentStageDef.label}`,
          stageId: installation.currentStage
        },
        currentUser
      );
      setNewPhotoCaption("");
      toast("Photo Attached to Stage", {
        description: "Field photo uploaded with timestamp & technician tag.",
        type: "success"
      });
      onStageUpdated();
    } catch (e) {
      toast("Upload Failed", { description: "Could not attach photo.", type: "error" });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetHeader onClose={() => onOpenChange(false)}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
              Stage {currentStageDef.order} of 10
            </span>
            <Badge variant={installation.isOverdue ? "destructive" : "amber"}>
              {installation.isOverdue ? "Overdue SLA" : `${installation.daysInCurrentStage}d in stage`}
            </Badge>
          </div>
          <SheetTitle className="text-xl font-black text-slate-900 dark:text-white">
            {currentStageDef.label}
          </SheetTitle>
          <SheetDescription className="text-xs text-slate-500">
            Customer: <strong className="text-slate-900 dark:text-slate-100">{customer.name}</strong> • {customer.state} ({customer.qrToken})
          </SheetDescription>
        </div>
      </SheetHeader>

      <SheetContent className="space-y-6">
        {/* Stage Overview Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {currentStageDef.description}
          </p>
          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-500 text-[11px]">
            <span>Assigned Tech: <strong className="text-slate-900 dark:text-white">{installation.assignedTechnicianName || "Tunde Bakare"}</strong></span>
            <span>Target SLA: <strong className="text-amber-500">{currentStageDef.slaDays} Days</strong></span>
          </div>
        </div>

        {/* Mandatory Checklist Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Mandatory Stage Checklist</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {completedCount} of {totalCount} Done
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                allMandatoryChecked ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 100}%` }}
            />
          </div>

          <div className="space-y-2">
            {currentChecklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors text-xs ${
                  canEditStage ? "cursor-pointer" : "cursor-default opacity-80"
                } ${
                  item.isCompleted
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 font-medium"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 text-slate-700 dark:text-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  disabled={!canEditStage}
                  onChange={() => canEditStage && handleToggleChecklist(item.id)}
                  className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="flex-1">
                  <span>{item.text}</span>
                  {item.isCompleted && item.completedBy && (
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      Verified by {item.completedBy}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>

          {!allMandatoryChecked && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Advancing this stage is locked until all mandatory checklist items are verified.</span>
            </div>
          )}
        </div>

        {/* Photo Gallery & Camera Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-500" />
              <span>Field Photo Documentation</span>
            </h3>
            <span className="text-xs text-slate-500">{installation.photos.length} Photos</span>
          </div>

          {/* Grid of uploaded photos */}
          <div className="grid grid-cols-2 gap-2">
            {installation.photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-video flex items-end p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.caption} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="relative z-10 text-[10px] text-white bg-slate-950/70 p-1 rounded font-medium truncate w-full">
                  {photo.caption}
                </div>
              </div>
            ))}
          </div>

          {/* Upload trigger */}
          {canEditStage && (
            <div className="flex gap-2">
              <Input
                placeholder="Caption (e.g. Earthing rod resistance reading)..."
                value={newPhotoCaption}
                onChange={(e) => setNewPhotoCaption(e.target.value)}
                className="text-xs h-9"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSimulatePhotoUpload}
                className="text-xs font-semibold shrink-0 gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Attach Photo</span>
              </Button>
            </div>
          )}
        </div>

        {/* Notes & Blocked Reason */}
        {canEditStage && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Technician Stage Notes / Delay Reasons
            </label>
            <Textarea
              rows={3}
              placeholder="Record site remarks, customer requests, or contractor delays..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs"
            />
          </div>
        )}
      </SheetContent>

      <SheetFooter>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
          {canEditStage ? "Cancel" : "Close"}
        </Button>

        {canEditStage && (
          nextStageDef ? (
            <Button
              variant="primary"
              size="sm"
              disabled={!allMandatoryChecked || isUpdating}
              isLoading={isUpdating}
              onClick={handleAdvanceStage}
              className="text-xs font-bold shadow-md shadow-amber-500/20"
              title={!allMandatoryChecked ? "Complete all checklist items to unlock" : "Advance stage"}
            >
              <span>Advance to {nextStageDef.shortLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          ) : (
            <Button variant="success" size="sm" disabled className="text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              <span>Installation Fully Completed</span>
            </Button>
          )
        )}
      </SheetFooter>
    </Sheet>
  );
}
