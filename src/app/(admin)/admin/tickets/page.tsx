"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LifeBuoy,
  Search,
  Filter,
  Plus,
  Clock,
  AlertTriangle,
  User,
  ShieldCheck,
  Send,
  Lock,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { MOCK_TICKETS, MOCK_CUSTOMERS, MOCK_SYSTEMS } from "@/lib/mock-data";
import { Ticket, TicketStatus, TicketCategory, TicketPriority } from "@/lib/types";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { useToast } from "@/components/providers/toast-provider";
import { api } from "@/lib/api";

function TicketsContent() {
  const { currentUser, canPerform } = useAuthRole();
  const { toast } = useToast();

  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Ticket Detail Drawer
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      !searchTerm ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSendReply = async () => {
    if (!activeTicket || !replyText.trim()) return;

    try {
      const updated = await api.addTicketMessage(
        activeTicket.id,
        replyText,
        currentUser.name,
        "staff",
        isInternalNote
      );

      setActiveTicket({ ...updated });
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setReplyText("");
      toast(isInternalNote ? "Internal Note Logged" : "Customer Reply Dispatched", {
        description: isInternalNote
          ? "Visible only to staff."
          : `Sent to customer via SMS and portal.`,
        type: "success"
      });
    } catch (e) {
      toast("Error", { description: "Failed to post message.", type: "error" });
    }
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "resolved", resolvedAt: new Date().toISOString() } : t))
    );
    if (activeTicket?.id === ticketId) {
      setActiveTicket((prev) => (prev ? { ...prev, status: "resolved" } : prev));
    }
    toast("Ticket Marked Resolved", {
      description: "Service order closed and customer notified.",
      type: "success"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#05361e] dark:text-white tracking-tight flex items-center gap-2.5">
            <LifeBuoy className="w-7 h-7 text-[#0A5C36] dark:text-[#10B981]" />
            <span>Support & Maintenance Desk</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-700/80 dark:text-emerald-200/80 mt-1">
            SLA-monitored customer complaints, telemetric snapshots, and field technician dispatch.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-600/80 absolute left-3.5 top-3.5 pointer-events-none" />
              <Input
                placeholder="Search ticket number, customer name or issue..."
                className="pl-10 h-10 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-3 text-xs font-medium text-[#05361e] dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="Overload">Overload Trips</option>
                <option value="Battery/Charging">Battery / Under-Harvest</option>
                <option value="Hardware">Hardware & Inverter</option>
                <option value="PAYG/Billing">PAYG & Billing</option>
                <option value="Installation">Installation Pipeline</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-3 text-xs font-medium text-[#05361e] dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredTickets.map((ticket) => {
          const isCritical = ticket.priority === "critical";
          const isHigh = ticket.priority === "high";

          return (
            <Card
              key={ticket.id}
              data-testid={`ticket-row-${ticket.id}`}
              onClick={() => {
                setActiveTicket(ticket);
                setDrawerOpen(true);
              }}
              className={`hover:shadow-md transition-all cursor-pointer border-l-4 ${
                isCritical
                  ? "border-l-[#C2410C] bg-orange-50/30 dark:bg-orange-950/20"
                  : isHigh
                  ? "border-l-[#EA580C]"
                  : "border-l-[#0A5C36]"
              }`}
            >
              <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#EA580C] dark:text-orange-400">
                      {ticket.ticketNumber}
                    </span>
                    <Badge variant={isCritical ? "destructive" : isHigh ? "warning" : "secondary"}>
                      {ticket.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{ticket.category}</Badge>
                    <span className="text-xs text-emerald-600/80 dark:text-emerald-300/80 font-mono">
                      Logged {formatRelativeTime(ticket.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#05361e] dark:text-white leading-tight">
                    {ticket.subject}
                  </h3>

                  <p className="text-xs text-emerald-700/80 dark:text-emerald-200/80 line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-600/80 dark:text-emerald-300/80 pt-1">
                    <span>Customer: <strong className="text-[#0A5C36] dark:text-emerald-200">{ticket.customerName}</strong> ({ticket.customerPhone})</span>
                    <span>•</span>
                    <span>Assigned: <strong className="text-[#0A5C36] dark:text-emerald-200">{ticket.assignedToName || "Unassigned"}</strong></span>
                  </div>
                </div>

                {/* SLA Timer & Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between shrink-0 gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 dark:bg-[#084729] text-[#0A5C36] dark:text-emerald-200">
                    <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>SLA: 24h Left</span>
                  </div>

                  <Button variant="ghost" size="sm" className="text-xs text-[#0A5C36] dark:text-[#10B981] font-bold">
                    <span>Inspect Ticket</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Ticket Detail Drawer */}
      {activeTicket && (
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetHeader onClose={() => setDrawerOpen(false)}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-[#EA580C] dark:text-orange-400">
                  {activeTicket.ticketNumber}
                </span>
                <Badge variant={activeTicket.priority === "critical" ? "destructive" : "warning"}>
                  {activeTicket.priority.toUpperCase()}
                </Badge>
                <Badge variant="outline">{activeTicket.status.toUpperCase()}</Badge>
              </div>
              <SheetTitle className="text-lg font-black text-[#05361e] dark:text-white">
                {activeTicket.subject}
              </SheetTitle>
              <SheetDescription className="text-xs text-emerald-700/80 dark:text-emerald-200/80">
                Customer: {activeTicket.customerName} • {activeTicket.customerPhone}
              </SheetDescription>
            </div>
          </SheetHeader>

          <SheetContent className="space-y-6">
            {/* Description */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-[#084729]/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-300/80">
                Customer Complaint Statement
              </span>
              <p className="text-xs sm:text-sm text-[#0A5C36] dark:text-emerald-100 leading-relaxed font-medium">
                {activeTicket.description}
              </p>
            </div>

            {/* Linked Telemetric Diagnosis Snapshot */}
            {activeTicket.linkedDiagnosis && (
              <div className="p-4 rounded-xl border-2 border-[#EA580C]/40 bg-orange-50/40 dark:bg-orange-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-orange-950 dark:text-orange-200">
                    <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                    <span>Frozen Telemetry Snapshot</span>
                  </div>
                  <Badge variant="destructive">{activeTicket.linkedDiagnosis.cause}</Badge>
                </div>

                <div className="text-xs font-semibold text-[#05361e] dark:text-emerald-100">
                  {activeTicket.linkedDiagnosis.headline}
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-200/80 leading-relaxed">
                  {activeTicket.linkedDiagnosis.detailedAnalysis}
                </p>

                <div className="pt-2 border-t border-orange-200 dark:border-orange-800/60 flex items-center justify-between text-[11px] font-mono">
                  <span>Confidence: {activeTicket.linkedDiagnosis.confidence}%</span>
                  <Link href={`/admin/monitoring/${activeTicket.systemId}`} className="text-[#0A5C36] dark:text-[#10B981] font-bold hover:underline">
                    View Live Stream →
                  </Link>
                </div>
              </div>
            )}

            {/* Messages / Conversation Thread */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-300/80">
                Case Timeline & Notes
              </span>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {activeTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      msg.isInternal
                        ? "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/60"
                        : msg.senderRole === "customer"
                        ? "bg-white dark:bg-[#084729] border border-emerald-200 dark:border-emerald-700"
                        : "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#05361e] dark:text-white flex items-center gap-1">
                        {msg.isInternal && <Lock className="w-3 h-3 text-[#EA580C]" />}
                        <span>{msg.senderName}</span>
                        {msg.isInternal && <span className="text-[10px] text-[#EA580C] font-bold">(Internal Note)</span>}
                      </span>
                      <span className="text-emerald-600/80 dark:text-emerald-300/80 font-mono">{formatRelativeTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-[#0A5C36] dark:text-emerald-100 leading-relaxed">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply / Internal Note Composer */}
            <div className="space-y-2 pt-2 border-t border-emerald-100 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  {isInternalNote ? "Compose Internal Staff Note" : "Send Customer Reply (SMS / App)"}
                </span>
                <label className="flex items-center gap-1.5 text-xs text-emerald-700/80 dark:text-emerald-200/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#0A5C36] text-[#0A5C36] rounded"
                  />
                  <span>Internal Note Only</span>
                </label>
              </div>

              <Textarea
                rows={3}
                placeholder={isInternalNote ? "Staff-only remark..." : "Direct reply to customer..."}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="text-xs"
              />

              <div className="flex justify-end">
                <Button variant="primary" size="sm" onClick={handleSendReply} className="text-xs font-bold gap-1">
                  <Send className="w-3.5 h-3.5" />
                  <span>{isInternalNote ? "Save Internal Note" : "Dispatch Reply"}</span>
                </Button>
              </div>
            </div>
          </SheetContent>

          <SheetFooter className="flex items-center justify-between">
            {canPerform("RESOLVE_TICKET") && (
              <Button
                variant="success"
                size="sm"
                onClick={() => handleResolveTicket(activeTicket.id)}
                className="text-xs font-bold gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Ticket Resolved</span>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setDrawerOpen(false)} className="text-xs">
              Close
            </Button>
          </SheetFooter>
        </Sheet>
      )}
    </div>
  );
}

export default function SupportTicketsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-emerald-600/80">Loading tickets desk...</div>}>
      <TicketsContent />
    </React.Suspense>
  );
}
