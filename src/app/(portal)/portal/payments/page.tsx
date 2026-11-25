"use client";

import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  ShieldCheck,
  Zap,
  ArrowRight,
  Check,
  Building,
  Smartphone,
  Loader2,
  PowerOff,
  Power
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { MOCK_CUSTOMERS, MOCK_SYSTEMS, MOCK_PAYG_ACCOUNTS } from "@/lib/mock-data";
import { formatNaira, formatDate } from "@/lib/utils";
import { solarTrackApi } from "@/lib/api";

export default function PortalPaymentsPage() {
  const [customer, setCustomer] = useState(MOCK_CUSTOMERS[0]);
  const [system, setSystem] = useState(MOCK_SYSTEMS[0]);
  const [payg, setPayg] = useState(MOCK_PAYG_ACCOUNTS[0]);

  // Paystack Modal State
  const [paystackOpen, setPaystackOpen] = useState(false);
  const [selectedPlanAmount, setSelectedPlanAmount] = useState<number>(payg.monthlyInstallmentNaira || 45000);
  const [paymentChannel, setPaymentChannel] = useState<"card" | "bank" | "ussd">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptToast, setReceiptToast] = useState<string | null>(null);

  // Mock payment history
  const [payments, setPayments] = useState([
    {
      id: "pay_101",
      date: "2026-11-01",
      amount: 45000,
      method: "Paystack (Debit Card)",
      reference: "PSTK-981249120",
      status: "Successful"
    },
    {
      id: "pay_100",
      date: "2026-10-01",
      amount: 45000,
      method: "Bank Transfer (GTBank)",
      reference: "TRF-841920831",
      status: "Successful"
    },
    {
      id: "pay_099",
      date: "2026-09-01",
      amount: 45000,
      method: "Paystack (USSD *737#)",
      reference: "PSTK-381920199",
      status: "Successful"
    }
  ]);

  const handleOpenPaystack = () => {
    setPaymentSuccess(false);
    setIsProcessing(false);
    setPaystackOpen(true);
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    // Simulate Paystack authentication & webhook latency
    await new Promise((r) => setTimeout(r, 1200));

    try {
      await solarTrackApi.recordCustomerPayment(customer.id, selectedPlanAmount, "Paystack");
      setPayg((prev) => ({
        ...prev,
        status: "active",
        daysRemainingOfPower: 30,
        balanceOwedNaira: 0,
        nextDueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
      }));

      // Add to history
      const newPay = {
        id: `pay_${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        amount: selectedPlanAmount,
        method: "Paystack (" + (paymentChannel === "card" ? "Mastercard" : paymentChannel.toUpperCase()) + ")",
        reference: `PSTK-${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: "Successful"
      };
      setPayments([newPay, ...payments]);
      setPaymentSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = (reference: string) => {
    setReceiptToast(`Downloaded PDF Receipt for ${reference}`);
    setTimeout(() => setReceiptToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {receiptToast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{receiptToast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-amber-500" />
          PAYG Power Recharge
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Instant Paystack top-up with automatic GSM inverter contactor reactivation.
        </p>
      </div>

      {/* Disconnection or Grace Period Alert Banner */}
      {payg.status === "disconnected" ? (
        <div className="p-4 rounded-2xl bg-red-500 text-white shadow-lg space-y-2">
          <div className="flex items-center gap-2 font-black text-sm">
            <PowerOff className="w-5 h-5 animate-bounce" />
            <span>Power Contactor Cutoff Active</span>
          </div>
          <p className="text-xs text-red-100 font-medium leading-relaxed">
            Your system power is currently paused due to an overdue balance. Pay now via Paystack to automatically send the reconnect signal and restore electricity within 60 seconds.
          </p>
        </div>
      ) : payg.status === "grace_period" ? (
        <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 shadow-lg space-y-2">
          <div className="flex items-center gap-2 font-black text-sm">
            <Clock className="w-5 h-5" />
            <span>Grace Period Active (Auto-Cutoff in 2 Days)</span>
          </div>
          <p className="text-xs text-slate-900 font-medium leading-relaxed">
            Your monthly PAYG subscription has expired. Re-energize your account now to prevent uninterrupted solar power cutoff.
          </p>
        </div>
      ) : null}

      {/* PAYG Balance Card */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Meter ID: {payg.systemId}
            </span>
            <Badge
              variant={payg.status === "disconnected" ? "destructive" : "success"}
              className="gap-1 font-bold"
            >
              {payg.status === "disconnected" ? "Disconnected" : "Power Contactor: Closed (Live)"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400">Days Power Remaining</p>
              <div className="text-3xl font-black text-amber-400 mt-1 font-mono">
                {payg.daysRemainingOfPower} Days
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Valid until {formatDate(payg.nextDueDate)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">Outstanding Balance</p>
              <div className="text-2xl font-black text-white mt-1">
                {formatNaira(payg.balanceOwedNaira)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {payg.monthlyInstallmentNaira ? `${formatNaira(payg.monthlyInstallmentNaira)} / mo` : "Subscription"}
              </p>
            </div>
          </div>

          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm h-12 rounded-2xl shadow-lg gap-2"
            onClick={handleOpenPaystack}
            data-testid="pay-now-btn"
          >
            <Zap className="w-5 h-5 fill-current" />
            Recharge Power Now
          </Button>
        </div>
      </div>

      {/* Plan Details & Benefits */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Subscription Details</CardTitle>
          <CardDescription className="text-xs">
            GreenerAfrik Rent-To-Own (36 Months Tenure)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 font-medium">Customer</span>
            <span className="font-bold">{customer.name}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 font-medium">Inverter Model</span>
            <span className="font-bold">{system.inverterBrand} {system.inverterCapacityKva}kVA</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 font-medium">Monthly Installment</span>
            <span className="font-bold font-mono text-amber-600">{formatNaira(payg.monthlyInstallmentNaira)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 font-medium">Warranty & Service</span>
            <span className="font-bold text-emerald-600">Active (Full Coverage)</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Payment History & Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {payments.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {formatNaira(p.amount)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {formatDate(p.date)} • {p.method}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Ref: {p.reference}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px] px-2 py-0.5">
                    {p.status}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-slate-500 hover:text-slate-900"
                    onClick={() => handleDownloadReceipt(p.reference)}
                    title="Download Receipt"
                    data-testid={`download-receipt-${p.id}`}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* --- MOCK PAYSTACK MODAL --- */}
      <Dialog open={paystackOpen} onOpenChange={setPaystackOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden border-0 shadow-2xl">
          {/* Paystack Header */}
          <div className="bg-[#0BA4DB] p-4 text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-widest uppercase">PAYSTACK SECURE</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">TEST MODE</span>
            </div>
            <div className="mt-3">
              <span className="text-xs text-white/80">Pay GreenerAfrik Energies Limited</span>
              <div className="text-2xl font-black tracking-tight mt-0.5">
                {formatNaira(selectedPlanAmount)}
              </div>
              <span className="text-[11px] text-white/80">{customer.email}</span>
            </div>
          </div>

          <div className="p-5 space-y-4 bg-white dark:bg-slate-900 text-xs">
            {paymentSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Payment Confirmed!
                </h3>
                <p className="text-slate-500 text-xs px-2">
                  ₦{selectedPlanAmount.toLocaleString()} credited successfully. 30 days of power added to meter {payg.systemId}.
                </p>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                  <Power className="w-4 h-4" />
                  <span>Contactor Signal: Engaged & Live</span>
                </div>
                <Button
                  className="w-full bg-[#0BA4DB] hover:bg-[#098bb9] text-white font-bold h-10 mt-2"
                  onClick={() => setPaystackOpen(false)}
                  data-testid="paystack-close-btn"
                >
                  Return to Dashboard
                </Button>
              </div>
            ) : (
              <>
                {/* Payment Channel Selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentChannel("card")}
                    className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentChannel === "card"
                        ? "border-[#0BA4DB] bg-sky-50 dark:bg-sky-950/30 text-[#0BA4DB]"
                        : "border-slate-200 dark:border-slate-800 text-slate-600"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChannel("bank")}
                    className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentChannel === "bank"
                        ? "border-[#0BA4DB] bg-sky-50 dark:bg-sky-950/30 text-[#0BA4DB]"
                        : "border-slate-200 dark:border-slate-800 text-slate-600"
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChannel("ussd")}
                    className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentChannel === "ussd"
                        ? "border-[#0BA4DB] bg-sky-50 dark:bg-sky-950/30 text-[#0BA4DB]"
                        : "border-slate-200 dark:border-slate-800 text-slate-600"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>USSD</span>
                  </button>
                </div>

                {/* Channel-Specific Mock Form */}
                {paymentChannel === "card" && (
                  <div className="space-y-3 font-mono">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-sans font-bold">
                        Card Number (Test Simulation)
                      </label>
                      <Input defaultValue="4084 0841 2981 9024" readOnly className="font-mono text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-500 font-sans font-bold">Expires</label>
                        <Input defaultValue="08/28" readOnly className="font-mono text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-500 font-sans font-bold">CVV</label>
                        <Input defaultValue="381" readOnly className="font-mono text-xs" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentChannel === "bank" && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      Transfer to Wema Bank / Paystack:
                    </p>
                    <div className="font-mono font-black text-base text-slate-900 dark:text-white">
                      0291 8491 82
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Account Name: Paystack Checkout / GreenerAfrik Energies Limited
                    </p>
                  </div>
                )}

                {paymentChannel === "ussd" && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      Dial on your registered phone:
                    </p>
                    <div className="font-mono font-black text-base text-slate-900 dark:text-white">
                      *737*50*{selectedPlanAmount}*912#
                    </div>
                    <p className="text-[10px] text-slate-500">
                      GTBank, Access, Zenith, UBA supported
                    </p>
                  </div>
                )}

                <Button
                  className="w-full bg-[#0BA4DB] hover:bg-[#098bb9] text-white font-black h-11 rounded-xl shadow-lg gap-2"
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  data-testid="paystack-submit-btn"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating with Bank...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Pay {formatNaira(selectedPlanAmount)}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
