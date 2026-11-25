import Link from "next/link";
import {
  ShieldCheck,
  Smartphone,
  Users,
  QrCode,
  ArrowRight,
  Zap,
  Leaf,
  Activity,
  CreditCard
} from "lucide-react";
import { GreenerAfrikLogo, GreenerAfrikTopBand } from "@/components/ui/greenerafrik-logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-[#0A5C36] selection:text-white">
      {/* Signature GreenerAfrik Top Band */}
      <GreenerAfrikTopBand />

      {/* Background radial glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0A5C36]/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] bg-[#EA580C]/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <GreenerAfrikLogo size="lg" textColor="light" showTagline={true} showRc={true} />
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A5C36] hover:bg-[#074728] text-white font-bold text-sm shadow-md shadow-[#0A5C36]/30 transition-all hover:scale-105 border border-emerald-600/40"
          >
            <span>Launch Operations Desk</span>
            <ArrowRight className="w-4 h-4 text-[#EA580C]" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 lg:py-16 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-inner">
            <Leaf className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Energy Powered Agricultural Clusters (EPAC) & Commercial Solar Telemetry</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Clean Energy for Africa: Registry, Telemetry & <span className="text-[#EA580C]">PAYG Metering</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
            <span className="font-semibold text-white">GreenerAfrik Energies Limited (RC 9402141)</span> provides end-to-end solar infrastructure management across Nigeria. Featuring 10-stage gated installations, remote IoT inverter diagnostics (overload, under-charge, offline, hardware fault), and dual-approval PAYG power contactor control.
          </p>
        </div>

        {/* 4 Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {/* Card 1: Admin */}
          <Link
            href="/admin"
            className="group rounded-3xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 p-6 transition-all duration-200 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-[#0A5C36]/20 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0A5C36]/20 border border-[#0A5C36]/40 flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Staff Operations Desk</div>
                <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  /admin
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Persona switcher across 6 staff roles, 10-stage gated pipeline, fleet telemetry map, diagnosis card & PAYG defaulters queue.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Open Operations Desk</span>
              <ArrowRight className="w-4 h-4 text-[#EA580C]" />
            </div>
          </Link>

          {/* Card 2: Tech Mobile */}
          <Link
            href="/tech"
            className="group rounded-3xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 p-6 transition-all duration-200 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-[#0A5C36]/20 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0A5C36]/20 border border-[#0A5C36]/40 flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Field Technician App</div>
                <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  /tech
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Mobile-first field worker view with Google Maps routing, WhatsApp triggers, stage checklists, and camera photo capture.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Open Field Technician View</span>
              <ArrowRight className="w-4 h-4 text-[#EA580C]" />
            </div>
          </Link>

          {/* Card 3: Customer Portal */}
          <Link
            href="/portal"
            className="group rounded-3xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 p-6 transition-all duration-200 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-[#0A5C36]/20 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EA580C]/20 border border-[#EA580C]/40 flex items-center justify-center text-[#EA580C] group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-orange-400">Customer Portal</div>
                <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                  /portal
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Mobile-friendly customer tracker, OTP login, daily kWh usage with Nigerian appliance tips, mock Paystack & self-help diagnosis.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-orange-400 group-hover:translate-x-1 transition-transform">
              <span>Open Customer Portal</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 4: Public QR Landing */}
          <Link
            href="/q/ST-LGS-001-X9"
            className="group rounded-3xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 p-6 transition-all duration-200 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-400">Public QR Scan</div>
                <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                  /q/[token]
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict privacy public sticker landing: shows equipment authenticity and warranty, without exposing customer PII or debts.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Inspect Public QR Tag</span>
              <ArrowRight className="w-4 h-4 text-[#EA580C]" />
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500">
        GreenerAfrik Energies Limited (RC 9402141) — ...Powering Africa. Energy Powered Agricultural Clusters & Commercial Solar Infrastructure.
      </footer>
    </div>
  );
}
