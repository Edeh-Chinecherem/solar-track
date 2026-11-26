"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GreenerAfrikLogo, GreenerAfrikTopBand } from "@/components/ui/greenerafrik-logo";
import { REGISTRABLE_ROLES, ROLE_META } from "@/lib/rbac";
import { RegistrableStaffRole, StaffRegistration } from "@/lib/types";
import { api } from "@/lib/api";
import { useToast } from "@/components/providers/toast-provider";

const ROLE_DESCRIPTIONS: Record<RegistrableStaffRole, string> = {
  operations_manager: "Oversee installation pipelines, assign field teams, and approve dual-key disconnects.",
  sales: "Onboard new solar customers, manage quotations, and issue hardware QR tags.",
  technician: "Execute field installations, upload checklist photos, and respond to hardware alarms.",
  support_agent: "Manage customer support tickets, SLA timers, and telemetry diagnostics.",
  finance: "Track PAYG collections, manage defaulters queue, grant extensions, and record payments."
};

export default function SignUpPage() {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState<RegistrableStaffRole>("technician");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReg, setSubmittedReg] = useState<StaffRegistration | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please complete all required personal and contact fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reg = await api.registerStaffAccount({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: selectedRole,
        password
      });
      setSubmittedReg(reg);
      toast("Registration Submitted", {
        description: `Your ${ROLE_META[selectedRole].title} request is awaiting Super Admin approval.`,
        type: "info"
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit registration.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-[#042414] flex flex-col justify-between">
      <GreenerAfrikTopBand />

      {/* Top Bar */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <GreenerAfrikLogo size="md" showTagline={true} showRc={true} />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/sign-in">
            <Button variant="outline" size="sm" className="text-xs font-bold">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-in?mode=customer">
            <Button variant="orange" size="sm" className="text-xs font-bold">
              Customer OTP Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-2xl space-y-5">
          {submittedReg ? (
            <Card className="border-2 border-[#0A5C36]/40 shadow-xl">
              <CardContent className="p-6 sm:p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-[#EA580C] flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <Badge variant="orange" className="text-xs">
                    Pending Super Admin Approval
                  </Badge>
                  <h1 className="text-2xl font-black text-[#05361e] dark:text-white">
                    Registration Submitted
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-700/80 dark:text-emerald-200/80 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#05361e] dark:text-white">{submittedReg.name}</strong>. Your application for{" "}
                    <strong className="text-[#EA580C]">{ROLE_META[submittedReg.role].title}</strong> has been queued for Super Admin verification.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-[#084729]/60 border border-emerald-200 dark:border-emerald-800 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-emerald-700/80 dark:text-emerald-200/80">Email:</span>
                    <span className="font-mono font-bold text-[#05361e] dark:text-white">{submittedReg.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700/80 dark:text-emerald-200/80">Designated Role:</span>
                    <span className="font-bold text-[#0A5C36] dark:text-[#10B981]">{ROLE_META[submittedReg.role].title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700/80 dark:text-emerald-200/80">Status:</span>
                    <span className="font-bold text-[#EA580C] uppercase">Pending Approval</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link href="/sign-in" className="w-full sm:w-auto">
                    <Button variant="primary" className="w-full gap-1.5 text-xs font-bold">
                      <span>Go to Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/admin/settings?tab=roles" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full gap-1.5 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#0A5C36] dark:text-[#10B981]" />
                      <span>Super Admin Approval Queue</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#042414] via-[#074728] to-[#05361e] p-6 text-white border-b-2 border-[#EA580C]">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-300">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Staff Onboarding & Access Request</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight">Register Staff Account</h1>
                    <p className="text-xs text-emerald-100/90">
                      Select your designated operational role. All registrations require Super Admin approval before sign-in.
                    </p>
                  </div>
                  <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-[#0A5C36] border border-emerald-400/30 items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[#EA580C]" />
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-5">
                {/* Approval Notice */}
                <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-xs text-[#9A3412] dark:text-orange-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Governance Policy:</strong> Only the Super Admin approves registrations for Operations Manager, Sales Executive, Field Technician, Support Specialist, and Finance & Accounts roles.
                  </span>
                </div>

                {error && (
                  <div
                    data-testid="signup-error"
                    className="p-3 rounded-xl bg-orange-100 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-700 text-[#9A3412] dark:text-orange-200 text-xs flex items-center gap-2 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 text-[#EA580C] shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#05361e] dark:text-white flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#EA580C]" />
                      <span>Select Designated Role *</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {REGISTRABLE_ROLES.map((role) => {
                        const isSelected = selectedRole === role;
                        const meta = ROLE_META[role];
                        return (
                          <button
                            key={role}
                            type="button"
                            data-testid={`signup-role-${role}`}
                            onClick={() => setSelectedRole(role)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#0A5C36] bg-emerald-50 dark:bg-[#084729] ring-2 ring-[#0A5C36]/20 shadow-sm"
                                : "border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] hover:border-[#EA580C]/60"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-xs text-[#05361e] dark:text-white">
                                {meta.title}
                              </span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0A5C36] dark:text-[#10B981] shrink-0" />}
                            </div>
                            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80 mt-1 leading-snug">
                              {ROLE_DESCRIPTIONS[role]}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personal & Credentials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                        Full Name *
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-emerald-600/80 absolute left-3.5 top-3.5 pointer-events-none" />
                        <Input
                          required
                          placeholder="e.g. Chinedu Okafor"
                          className="pl-10"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          data-testid="signup-name"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                        Work Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-emerald-600/80 absolute left-3.5 top-3.5 pointer-events-none" />
                        <Input
                          type="email"
                          required
                          placeholder="name@greenerafrik.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          data-testid="signup-email"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                        Phone Number (+234) *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-emerald-600/80 absolute left-3.5 top-3.5 pointer-events-none" />
                        <Input
                          type="tel"
                          required
                          placeholder="+234 803 000 0000"
                          className="pl-10"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          data-testid="signup-phone"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-emerald-600/80 absolute left-3.5 top-3.5 pointer-events-none" />
                        <Input
                          type="password"
                          required
                          minLength={6}
                          placeholder="Minimum 6 characters"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          data-testid="signup-password"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-emerald-600/80 absolute left-3.5 top-3.5 pointer-events-none" />
                        <Input
                          type="password"
                          required
                          minLength={6}
                          placeholder="Re-enter password"
                          className="pl-10"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          data-testid="signup-confirm-password"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full font-bold text-sm shadow-lg shadow-[#0A5C36]/20"
                    data-testid="signup-submit-btn"
                  >
                    <span>Submit Registration for Approval</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>

                <div className="pt-4 border-t border-emerald-100 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-700/80 dark:text-emerald-200/80">
                  <span>
                    Already approved?{" "}
                    <Link href="/sign-in" className="font-bold text-[#0A5C36] dark:text-[#10B981] hover:underline">
                      Sign In as Staff →
                    </Link>
                  </span>
                  <span>
                    Solar Customer?{" "}
                    <Link href="/sign-in?mode=customer" className="font-bold text-[#EA580C] hover:underline">
                      Login with Phone & OTP →
                    </Link>
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="py-4 px-6 text-center text-xs text-emerald-700/80 dark:text-emerald-200/70">
        GreenerAfrik Energies Limited (RC 9402141) — Role-Governed Solar Operations Platform
      </footer>
    </div>
  );
}
