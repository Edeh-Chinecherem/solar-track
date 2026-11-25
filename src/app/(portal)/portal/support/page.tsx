"use client";

import React, { useState } from "react";
import {
  LifeBuoy,
  AlertCircle,
  HelpCircle,
  Camera,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Wrench,
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_CUSTOMERS, MOCK_SYSTEMS, MOCK_TICKETS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Ticket, TicketPriority, TicketCategory } from "@/lib/types";

export default function PortalSupportPage() {
  const customer = MOCK_CUSTOMERS[0];
  const system = MOCK_SYSTEMS[0];

  // Self-Help Diagnosis Wizard State
  const [activeTab, setActiveTab] = useState<"self-help" | "raise-ticket" | "tickets">("self-help");
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  // New ticket state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TicketCategory>("Inverter Fault");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [description, setDescription] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Existing tickets for this customer
  const [tickets, setTickets] = useState(
    MOCK_TICKETS.filter((t) => t.customerId === customer.id || t.id === "tic_001")
  );

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newTicket: Ticket = {
      id: `tic_${Date.now()}`,
      ticketNumber: `TIC-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      systemId: system.id,
      subject: title,
      description,
      category,
      priority,
      status: "open",
      slaDeadline: new Date(Date.now() + 4 * 3600000).toISOString(),
      createdAt: new Date().toISOString(),
      assignedToRole: "Support Agent",
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderName: customer.name,
          senderRole: "customer",
          content: description,
          createdAt: new Date().toISOString(),
          isInternal: false
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setTicketSubmitted(true);
    setTitle("");
    setDescription("");
    setTimeout(() => {
      setTicketSubmitted(false);
      setActiveTab("tickets");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <LifeBuoy className="w-6 h-6 text-amber-500" />
          Customer Help Desk
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Instant self-help diagnosis, automated breaker checks, and priority technical assistance.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab("self-help")}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "self-help"
              ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
          data-testid="tab-self-help"
        >
          Diagnostic Guide
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("raise-ticket")}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "raise-ticket"
              ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
          data-testid="tab-raise-ticket"
        >
          Report Issue
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tickets")}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "tickets"
              ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
          data-testid="tab-my-tickets"
        >
          My Tickets ({tickets.length})
        </button>
      </div>

      {/* --- TAB 1: SELF-HELP DIAGNOSIS FLOW --- */}
      {activeTab === "self-help" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-900 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">
                "My System Isn't Working" Troubleshooter
              </h4>
              <p className="text-slate-500 mt-0.5">
                90% of solar outages in Nigeria are resolved instantly through these common breaker and load checks before requiring a technician visit.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "overload",
                title: "Inverter Beeping or Tripped Off (Overload)",
                symptom: "Sudden blackout when using water heater, microwave or iron.",
                diagnosis: "Load exceeded inverter surge threshold.",
                steps: [
                  "Turn off high-power heating appliances (electric iron, electric boiling ring, water heater).",
                  "Locate the main inverter AC Output circuit breaker on your GreenerAfrik distribution board.",
                  "Switch the breaker OFF, wait 10 seconds, then toggle it firmly back to the ON position.",
                  "Stagger high-load appliances one at a time during peak solar hours (11:00 AM - 2:00 PM)."
                ]
              },
              {
                id: "undercharge",
                title: "Low Battery / System Shuts Down Early at Night",
                symptom: "Lights go off around 9 PM or 10 PM instead of lasting till morning.",
                diagnosis: "Consecutive cloudy days or heavy daytime consumption.",
                steps: [
                  "Check if dust, tree leaves, or bird droppings are covering solar panel glass.",
                  "Avoid running freezers and high wattage fans throughout the late night hours.",
                  "If NEPA/Grid power is available, toggle the Grid Charge breaker to replenish the lithium battery to 100%."
                ]
              },
              {
                id: "offline",
                title: "Inverter Screen Display is Blank",
                symptom: "No lights or display on inverter front panel.",
                diagnosis: "DC battery isolator or solar DC breaker might be switched off.",
                steps: [
                  "Check the red rotary DC isolator switch on the wall beside the battery.",
                  "Ensure the handle points vertically to the 'ON' position.",
                  "If the battery LED flashes red or alarm buzzes continuously, report a fault below immediately."
                ]
              }
            ].map((guide) => (
              <Card
                key={guide.id}
                className="overflow-hidden cursor-pointer hover:border-amber-400 transition-all"
                onClick={() => setSelectedIssue(selectedIssue === guide.id ? null : guide.id)}
              >
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                      {guide.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{guide.symptom}</p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      selectedIssue === guide.id ? "rotate-90 text-amber-500" : ""
                    }`}
                  />
                </div>

                {selectedIssue === guide.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/40 text-xs">
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold text-[11px]">
                      Diagnosis: {guide.diagnosis}
                    </div>

                    <div className="space-y-2">
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        Self-Resolution Steps:
                      </p>
                      {guide.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                          <span className="font-bold font-mono text-amber-600">{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTitle(`Assistance needed: ${guide.title}`);
                          setDescription(`Followed troubleshooting guide for ${guide.title} but system is still not functioning normally.`);
                          setActiveTab("raise-ticket");
                        }}
                      >
                        Still not resolved? Raise Ticket
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: RAISE TICKET FORM --- */}
      {activeTab === "raise-ticket" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Submit Technical Complaint</CardTitle>
            <CardDescription className="text-xs">
              Direct dispatch to our Lagos technical operations centre with 4-hour SLA response.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ticketSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-sm">Complaint Logged Successfully!</h3>
                <p className="text-xs text-slate-500">
                  Ticket dispatched to field supervisor. An engineer has been notified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRaiseTicket} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Issue Summary
                  </label>
                  <Input
                    placeholder="e.g. Inverter beeping F08 overload code"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    data-testid="ticket-title-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Category
                    </label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-medium"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                    >
                      <option value="Inverter Fault">Inverter Fault</option>
                      <option value="Battery Degradation">Battery Degradation</option>
                      <option value="Solar Generation Drop">Solar Generation Drop</option>
                      <option value="PAYG Contactor Issue">PAYG Contactor Issue</option>
                      <option value="Wiring & Breaker Trip">Wiring & Breaker Trip</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Urgency Level
                    </label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-medium"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                    >
                      <option value="low">Low (General Query)</option>
                      <option value="medium">Medium (Reduced Power)</option>
                      <option value="high">High (Total Blackout)</option>
                      <option value="critical">Critical (Smoke / Sparking)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Detailed Symptoms & Observations
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-sans"
                    placeholder="Describe what occurred, any error codes shown on the inverter screen, and what appliances were running..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    data-testid="ticket-desc-input"
                  />
                </div>

                {/* Photo attachment mock */}
                <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Camera className="w-5 h-5 text-amber-500" />
                    <span>{photoUploaded ? "inverter_screen_error.jpg attached" : "Attach Photo of Inverter Display / Breaker"}</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setPhotoUploaded(!photoUploaded)}
                  >
                    {photoUploaded ? "Remove" : "Attach"}
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black h-11 rounded-xl shadow-lg gap-2"
                  data-testid="submit-ticket-btn"
                >
                  <Send className="w-4 h-4" />
                  Submit Urgent Ticket
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- TAB 3: MY TICKETS TIMELINE --- */}
      {activeTab === "tickets" && (
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <p className="text-center p-8 text-xs text-slate-400">No support tickets found.</p>
          ) : (
            tickets.map((t) => (
              <Card key={t.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        t.status === "resolved"
                          ? "success"
                          : t.status === "in_progress"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {t.status.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-400">
                      Ticket #{t.id}
                    </span>
                  </div>
                  <CardTitle className="text-sm mt-1">{t.subject}</CardTitle>
                  <CardDescription className="text-xs flex items-center gap-2">
                    <span>{t.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Opened {formatDate(t.createdAt)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {t.messages.map((c) => (
                      <div key={c.id} className="py-2 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className={c.senderRole === "customer" ? "text-slate-900 dark:text-white" : "text-amber-600"}>
                            {c.senderName} ({c.senderRole})
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            {formatDate(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">{c.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
