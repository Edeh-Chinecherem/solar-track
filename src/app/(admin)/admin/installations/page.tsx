"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  KanbanSquare,
  ListFilter,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Wrench,
  Camera,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Installation, InstallationStageId, Customer, SolarSystem } from "@/lib/types";
import { INSTALLATION_STAGES } from "@/lib/mock-data/stages";
import { MOCK_CUSTOMERS, MOCK_SYSTEMS, MOCK_INSTALLATIONS } from "@/lib/mock-data";
import { StageDrawer } from "@/components/installations/stage-drawer";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { api } from "@/lib/api";

export default function InstallationsPipelinePage() {
  const { canPerform } = useAuthRole();
  const [installations, setInstallations] = useState<Installation[]>(MOCK_INSTALLATIONS);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("all");

  // Selected for Drawer
  const [activeDrawer, setActiveDrawer] = useState<{
    open: boolean;
    installation: Installation | null;
    customer?: Customer;
    system?: SolarSystem;
  }>({
    open: false,
    installation: null
  });

  const reloadInstallations = async () => {
    try {
      const data = await api.getInstallations();
      setInstallations(data);
      if (activeDrawer.installation) {
        const refreshed = data.find((i) => i.id === activeDrawer.installation?.id);
        if (refreshed) {
          setActiveDrawer((prev) => ({ ...prev, installation: refreshed }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredInstallations = installations.filter((inst) => {
    const cust = MOCK_CUSTOMERS.find((c) => c.id === inst.customerId);
    const matchesSearch =
      !searchTerm ||
      cust?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust?.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust?.qrToken.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTech =
      selectedTechnician === "all" || inst.assignedTechnicianName?.toLowerCase().includes(selectedTechnician.toLowerCase());

    return matchesSearch && matchesTech;
  });

  return (
    <div className="space-y-6">
      {/* Header and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#05361e] dark:text-white tracking-tight flex items-center gap-2.5">
            <KanbanSquare className="w-7 h-7 text-[#0A5C36] dark:text-[#10B981]" />
            <span>Installations Pipeline</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-700/80 dark:text-emerald-200/80 mt-1">
            Gated 10-stage execution from initial assessment to 30-day warranty sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="inline-flex rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] p-1 shadow-sm">
            <button
              data-testid="kanban-view-btn"
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "kanban"
                  ? "bg-[#0A5C36] text-white shadow-sm"
                  : "text-emerald-700/80 dark:text-emerald-200/80 hover:text-[#05361e] dark:hover:text-white"
              }`}
            >
              Kanban Board
            </button>
            <button
              data-testid="list-view-btn"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "list"
                  ? "bg-[#0A5C36] text-white shadow-sm"
                  : "text-emerald-700/80 dark:text-emerald-200/80 hover:text-[#05361e] dark:hover:text-white"
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 text-emerald-600/80 absolute left-3 top-3 pointer-events-none" />
            <Input
              placeholder="Search customer, state or tag..."
              className="pl-9 h-9 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
              className="h-9 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-3 text-xs font-medium text-[#05361e] dark:text-white"
            >
              <option value="all">All Field Technicians</option>
              <option value="Tunde">Engr. Tunde Bakare</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1 snap-x min-h-[650px]">
          {INSTALLATION_STAGES.map((stage) => {
            const stageInstalls = filteredInstallations.filter((i) => i.currentStage === stage.id);

            return (
              <div
                key={stage.id}
                className="w-72 shrink-0 flex flex-col rounded-2xl bg-emerald-50/70 dark:bg-[#06361f]/50 border border-emerald-200/80 dark:border-emerald-800 p-3 snap-start"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0A5C36]/10 text-[#0A5C36] dark:text-[#10B981] font-black text-[11px] flex items-center justify-center">
                      {stage.order}
                    </span>
                    <h3 className="font-bold text-xs text-[#05361e] dark:text-white leading-tight">
                      {stage.shortLabel}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700/80 dark:text-emerald-200/80">
                    <Clock className="w-3 h-3 text-emerald-600/80" />
                    <span>{stage.slaDays}d</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-[#084729] text-[10px] font-bold ml-1 text-[#0A5C36] dark:text-emerald-200">
                      {stageInstalls.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-2.5 mt-3 overflow-y-auto max-h-[700px] pr-0.5">
                  {stageInstalls.map((inst) => {
                    const cust = MOCK_CUSTOMERS.find((c) => c.id === inst.customerId);
                    const sys = MOCK_SYSTEMS.find((s) => s.id === inst.systemId);
                    const checklist = inst.checklists[inst.currentStage] || [];
                    const doneChecks = checklist.filter((c) => c.isCompleted).length;

                    return (
                      <div
                        key={inst.id}
                        data-testid="installation-card"
                        onClick={() =>
                          setActiveDrawer({
                            open: true,
                            installation: inst,
                            customer: cust,
                            system: sys
                          })
                        }
                        className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] p-3.5 shadow-sm hover:shadow-md hover:border-[#0A5C36]/70 transition-all cursor-pointer group space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="font-bold text-xs text-[#05361e] dark:text-white leading-tight group-hover:text-[#0A5C36] dark:group-hover:text-[#10B981] transition-colors">
                            {cust?.name}
                          </h4>
                          {inst.isOverdue && (
                            <span className="text-[9px] font-bold bg-[#EA580C] text-white px-1.5 py-0.5 rounded border border-[#C2410C] animate-pulse">
                              OVERDUE
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80 flex items-center justify-between">
                          <span>{sys?.inverterBrand} {sys?.inverterCapacityKva}kVA</span>
                          <span className="font-mono text-[10px]">{cust?.state}</span>
                        </div>

                        {/* Checklist Counter & Photos */}
                        <div className="flex items-center justify-between pt-2 border-t border-emerald-100 dark:border-emerald-900 text-[10px] text-emerald-600/80 dark:text-emerald-300/80">
                          <div className="flex items-center gap-1 font-semibold text-[#0A5C36] dark:text-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-[#0A5C36] dark:text-[#10B981]" />
                            <span>{doneChecks}/{checklist.length} Checklist</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {inst.photos.length > 0 && (
                              <span className="flex items-center gap-0.5 text-emerald-700/80 dark:text-emerald-200/80">
                                <Camera className="w-3 h-3 text-emerald-600/80" />
                                <span>{inst.photos.length}</span>
                              </span>
                            )}
                            <span className="font-semibold text-emerald-700/80 dark:text-emerald-200/80">
                              {inst.daysInCurrentStage}d
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {stageInstalls.length === 0 && (
                    <div className="p-4 text-center text-[11px] text-emerald-600/80 dark:text-emerald-300/80 border border-dashed border-emerald-200 dark:border-emerald-800 rounded-xl my-4">
                      No active jobs
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: LIST VIEW */}
      {viewMode === "list" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-[#084729]/40 text-[11px] font-bold uppercase tracking-wider text-emerald-700/80 dark:text-emerald-200/80">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">System Spec</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Days in Stage</th>
                  <th className="py-3 px-4">Checklist</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900">
                {filteredInstallations.map((inst) => {
                  const cust = MOCK_CUSTOMERS.find((c) => c.id === inst.customerId);
                  const sys = MOCK_SYSTEMS.find((s) => s.id === inst.systemId);
                  const stageDef = INSTALLATION_STAGES.find((s) => s.id === inst.currentStage);
                  const checklist = inst.checklists[inst.currentStage] || [];
                  const doneCount = checklist.filter((c) => c.isCompleted).length;

                  return (
                    <tr key={inst.id} className="hover:bg-emerald-50/50 dark:hover:bg-[#084729]/30">
                      <td className="py-3 px-4 font-bold text-[#05361e] dark:text-white">
                        {cust?.name}
                        <div className="text-[11px] text-emerald-600/80 dark:text-emerald-300/80 font-normal">{cust?.state}</div>
                      </td>
                      <td className="py-3 px-4">
                        {sys?.inverterBrand} {sys?.inverterCapacityKva}kVA
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="green">{stageDef?.label}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {inst.daysInCurrentStage} days
                        {inst.isOverdue && (
                          <span className="ml-2 text-[10px] text-[#EA580C] font-bold uppercase">
                            Overdue
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#0A5C36] dark:text-emerald-200">
                        {doneCount} / {checklist.length}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setActiveDrawer({
                              open: true,
                              installation: inst,
                              customer: cust,
                              system: sys
                            })
                          }
                          className="text-xs h-8"
                        >
                          Stage Drawer
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Stage Detail Drawer */}
      <StageDrawer
        open={activeDrawer.open}
        onOpenChange={(open) => setActiveDrawer((prev) => ({ ...prev, open }))}
        installation={activeDrawer.installation}
        customer={activeDrawer.customer}
        system={activeDrawer.system}
        onStageUpdated={reloadInstallations}
      />
    </div>
  );
}
