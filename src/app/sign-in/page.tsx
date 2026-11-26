"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LogIn,
  ShieldCheck,
  Smartphone,
  Mail,
  Lock,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Users,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GreenerAfrikLogo, GreenerAfrikTopBand } from "@/components/ui/greenerafrik-logo";
import { api } from "@/lib/api";
import { DEMO_STAFF_PASSWORD, MOCK_USERS, MOCK_CUSTOMERS } from "@/lib/mock-data";
import { canAccessRoute, ROLE_META } from "@/lib/rbac";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Customer } from "@/lib/types";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setActiveStaffUser, setActiveCustomer } = useAuthRole();
  const { toast } = useToast();

  const paramMode = searchParams.get("mode");
  const [selectedMode, setSelectedMode] = useState<"staff" | "customer" | null>(null);
  const mode: "staff" | "customer" =
    selectedMode ?? (paramMode === "customer" ? "customer" : "staff");
  const setMode = (nextMode: "staff" | "customer") => setSelectedMode(nextMode);

  // --- Staff Sign In State ---
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffError, setStaffError] = useState<string | null>(null);
  const [staffPendingInfo, setStaffPendingInfo] = useState<{ name: string; role: string } | null>(null);
  const [staffLoading, setStaffLoading] = useState(false);

  // --- Customer Phone + OTP State ---
  const [customerPhone, setCustomerPhone] = useState("");
  const [otpStep, setOtpStep] = useState<"phone" | "otp">("phone");
  const [otpCode, setOtpCode] = useState("");
  const [demoOtpPreview, setDemoOtpPreview] = useState<string | null>(null);
  const [matchedCustomer, setMatchedCustomer] = useState<Customer | null>(null);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendSeconds]);

  const handleStaffSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError(null);
    setStaffPendingInfo(null);
    setStaffLoading(true);

    try {
      const result = await api.authenticateStaff(staffEmail, staffPassword);
      if (!result.ok) {
        if (result.reason === "pending_approval" && result.registration) {
          setStaffPendingInfo({
            name: result.registration.name,
            role: ROLE_META[result.registration.role]?.title || result.registration.role
          });
        } else {
          setStaffError(result.message);
        }
        return;
      }

      setActiveStaffUser(result.user);
      toast("Signed In Successfully", {
        description: `Welcome back, ${result.user.name} (${ROLE_META[result.user.role]?.title}).`,
        type: "success"
      });

      const redirectParam = searchParams.get("redirect");
      const safeRedirect =
        redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
          ? redirectParam
          : null;

      if (safeRedirect && canAccessRoute(result.user.role, safeRedirect)) {
        router.push(safeRedirect);
      } else if (result.user.role === "technician") {
        router.push("/tech");
      } else {
        router.push("/admin");
      }
    } catch {
      setStaffError("Unable to complete sign in. Please try again.");
    } finally {
      setStaffLoading(false);
    }
  };

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCustomerError(null);
    setCustomerLoading(true);

    try {
      const res = await api.requestCustomerOtp(customerPhone);
      if (!res.ok) {
        setCustomerError(res.message);
        return;
      }

      setMatchedCustomer(res.customer);
      setDemoOtpPreview(res.otpCode);
      setOtpCode("");
      setOtpStep("otp");
      setResendSeconds(60);
      toast("OTP Sent to Registered Phone", {
        description: `6-digit verification code dispatched to ${res.customer.phone}.`,
        type: "info"
      });
    } catch {
      setCustomerError("Failed to dispatch OTP. Please check the phone number.");
    } finally {
      setCustomerLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerError(null);
    setCustomerLoading(true);

    try {
      const res = await api.verifyCustomerOtp(customerPhone, otpCode);
      if (!res.ok) {
        setCustomerError(res.message);
        return;
      }

      setActiveCustomer(res.customer);
      toast("Customer Verified", {
        description: `Welcome, ${res.customer.name}. Opening your solar portal.`,
        type: "success"
      });
      router.push("/portal");
    } catch {
      setCustomerError("OTP verification failed. Please try again.");
    } finally {
      setCustomerLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-[#042414] flex flex-col justify-between">
      <GreenerAfrikTopBand />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <GreenerAfrikLogo size="md" showTagline={true} showRc={true} />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/sign-up">
            <Button variant="primary" size="sm" className="text-xs font-bold">
              Register Staff
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-lg space-y-5">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#06361f] border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <button
              type="button"
              data-testid="signin-tab-staff"
              onClick={() => setMode("staff")}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${mode === "staff"
                  ? "bg-[#0A5C36] text-white shadow-sm"
                  : "text-[#0A5C36] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-[#084729]"
                }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Staff Operations</span>
            </button>
            <button
              type="button"
              data-testid="signin-tab-customer"
              onClick={() => setMode("customer")}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${mode === "customer"
                  ? "bg-[#EA580C] text-white shadow-sm"
                  : "text-[#0A5C36] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-[#084729]"
                }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Customer (Phone + OTP)</span>
            </button>
          </div>

          {/* STAFF SIGN IN CARD */}
          {mode === "staff" && (
            <Card className="shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#042414] via-[#074728] to-[#05361e] p-6 text-white border-b-2 border-[#EA580C]">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  <LogIn className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Operations & Field Access</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight mt-1">Staff Sign In</h1>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  Sign in with your approved GreenerAfrik staff account.
                </p>
              </div>

              <CardContent className="p-6 space-y-5">
                {staffPendingInfo && (
                  <div
                    data-testid="pending-approval-alert"
                    className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-700 text-xs space-y-1.5"
                  >
                    <div className="flex items-center gap-2 font-black text-[#EA580C]">
                      <Clock className="w-4 h-4" />
                      <span>Pending Super Admin Approval</span>
                    </div>
                    <p className="text-[#9A3412] dark:text-orange-200 leading-relaxed">
                      Hello <strong>{staffPendingInfo.name}</strong>, your registration for{" "}
                      <strong>{staffPendingInfo.role}</strong> has not been approved yet. A Super Admin must approve your account before you can sign in.
                    </p>
                  </div>
                )}

                {staffError && (
                  <div
                    data-testid="staff-signin-error"
                    className="p-3 rounded-xl bg-orange-100 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-700 text-[#9A3412] dark:text-orange-200 text-xs flex items-center gap-2 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 text-[#EA580C] shrink-0" />
                    <span>{staffError}</span>
                  </div>
                )}

                <form onSubmit={handleStaffSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                      Staff Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-emerald-600/80 absolute left-3.5 top-3.5 pointer-events-none" />
                      <Input
                        type="email"
                        required
                        placeholder="e.g. femi.adeleke@greenerafrik.com"
                        className="pl-10"
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                        data-testid="staff-email-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-emerald-600/80 absolute left-3.5 top-3.5 pointer-events-none" />
                      <Input
                        type="password"
                        required
                        placeholder="Enter your password"
                        className="pl-10"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        data-testid="staff-password-input"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={staffLoading}
                    className="w-full font-bold text-sm shadow-md shadow-[#0A5C36]/20"
                    data-testid="staff-signin-btn"
                  >
                    <span>Sign In to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>

                {/* Demo Staff Quick Fill */}
                <div className="pt-4 border-t border-emerald-100 dark:border-emerald-800 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700/80 dark:text-emerald-200/80">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#0A5C36] dark:text-[#10B981]" />
                      Demo Staff Accounts
                    </span>
                    <span className="font-mono text-[#EA580C]">Pass: {DEMO_STAFF_PASSWORD}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {MOCK_USERS.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setStaffEmail(u.email);
                          setStaffPassword(DEMO_STAFF_PASSWORD);
                          setStaffError(null);
                          setStaffPendingInfo(null);
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-[#084729]/60 hover:border-[#0A5C36] text-left transition cursor-pointer"
                      >
                        <div className="text-[11px] font-bold text-[#05361e] dark:text-white truncate">
                          {ROLE_META[u.role].title}
                        </div>
                        <div className="text-[10px] text-emerald-700/80 dark:text-emerald-200/80 truncate">
                          {u.email}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-emerald-700/80 dark:text-emerald-200/80">
                  New staff member?{" "}
                  <Link href="/sign-up" className="font-bold text-[#EA580C] hover:underline">
                    Register under a designated role →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* CUSTOMER PHONE + OTP SIGN IN CARD */}
          {mode === "customer" && (
            <Card className="shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#0A5C36] via-[#074728] to-[#042414] p-6 text-white border-b-2 border-[#EA580C]">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-orange-300">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Customer Self-Service Portal</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight mt-1">Customer Phone & OTP Login</h1>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  Sign in using the phone number registered on your GreenerAfrik solar account.
                </p>
              </div>

              <CardContent className="p-6 space-y-5">
                {customerError && (
                  <div
                    data-testid="customer-signin-error"
                    className="p-3 rounded-xl bg-orange-100 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-700 text-[#9A3412] dark:text-orange-200 text-xs flex items-center gap-2 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 text-[#EA580C] shrink-0" />
                    <span>{customerError}</span>
                  </div>
                )}

                {otpStep === "phone" ? (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                        Registered Phone Number
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-emerald-600/80 absolute left-3.5 top-3.5 pointer-events-none" />
                        <Input
                          type="tel"
                          required
                          placeholder="e.g. +234 803 419 8821 or 08034198821"
                          className="pl-10 font-mono"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          data-testid="customer-phone-input"
                        />
                      </div>
                      <p className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80">
                        Only phone numbers already registered in the customer registry can receive an OTP.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      variant="orange"
                      size="lg"
                      isLoading={customerLoading}
                      className="w-full font-bold text-sm shadow-md shadow-[#EA580C]/20"
                      data-testid="request-otp-btn"
                    >
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>

                    {/* Registered Customer Quick Fill for Demo */}
                    <div className="pt-4 border-t border-emerald-100 dark:border-emerald-800 space-y-2">
                      <span className="text-[11px] font-bold text-emerald-700/80 dark:text-emerald-200/80 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                        Sample Registered Customer Numbers (Demo):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {MOCK_CUSTOMERS.slice(0, 3).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setCustomerPhone(c.phone);
                              setCustomerError(null);
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-[#084729]/60 hover:border-[#EA580C] text-left transition cursor-pointer"
                          >
                            <div className="text-[10px] font-bold text-[#05361e] dark:text-white">
                              {c.name}
                            </div>
                            <div className="text-[10px] font-mono text-[#EA580C]">{c.phone}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    {matchedCustomer && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-[#084729] border border-emerald-200 dark:border-emerald-700 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-[#05361e] dark:text-white">{matchedCustomer.name}</div>
                          <div className="text-[11px] font-mono text-emerald-700/80 dark:text-emerald-200/80">
                            {matchedCustomer.phone} • {matchedCustomer.qrToken}
                          </div>
                        </div>
                        <Badge variant="success">Registered</Badge>
                      </div>
                    )}

                    {/* Simulated SMS Delivery Preview for Testing */}
                    {demoOtpPreview && (
                      <div
                        data-testid="otp-sms-preview"
                        className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-xs flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-[#EA580C] text-[11px] uppercase tracking-wider">
                            Simulated SMS OTP Code
                          </div>
                          <div className="text-[#05361e] dark:text-white mt-0.5">
                            Your GreenerAfrik login code is{" "}
                            <strong className="font-mono text-sm text-[#EA580C]">{demoOtpPreview}</strong>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-[11px] h-7 shrink-0"
                          onClick={() => setOtpCode(demoOtpPreview)}
                        >
                          Auto-fill
                        </Button>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                        Enter 6-Digit OTP Code
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-emerald-600/80 absolute left-3.5 top-3.5 pointer-events-none" />
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          required
                          placeholder="000000"
                          className="pl-10 font-mono text-lg tracking-[0.35em] font-black text-center"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          data-testid="customer-otp-input"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={customerLoading}
                      disabled={otpCode.length !== 6}
                      className="w-full font-bold text-sm shadow-md shadow-[#0A5C36]/20"
                      data-testid="verify-otp-btn"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify OTP & Open Portal</span>
                    </Button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep("phone");
                          setOtpCode("");
                          setDemoOtpPreview(null);
                          setCustomerError(null);
                        }}
                        className="text-emerald-700/80 dark:text-emerald-200/80 hover:underline font-medium cursor-pointer"
                      >
                        ← Change Phone Number
                      </button>

                      <button
                        type="button"
                        disabled={resendSeconds > 0 || customerLoading}
                        onClick={() => handleRequestOtp()}
                        className="inline-flex items-center gap-1 font-bold text-[#EA580C] disabled:opacity-50 hover:underline cursor-pointer disabled:cursor-not-allowed"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{resendSeconds > 0 ? `Resend in ${resendSeconds}s` : "Resend OTP"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="py-4 px-6 text-center text-xs text-emerald-700/80 dark:text-emerald-200/70">
        GreenerAfrik Energies Limited (RC 9402141) | ...Powering Africa
      </footer>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-emerald-50/30 dark:bg-[#042414] flex items-center justify-center text-xs text-[#0A5C36] dark:text-emerald-200">
          Loading authentication...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
