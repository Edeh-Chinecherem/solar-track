import Link from "next/link";
import {
  Sun,
  ShieldCheck,
  Smartphone,
  Users,
  QrCode,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
  KanbanSquare,
  Activity,
  CreditCard
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Background radial glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Sun className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white block leading-none">
              Solar<span className="text-amber-500">Track</span>
            </span>
            <span className="text-[10px] uppercase font-semibold text-amber-400/80 tracking-widest block mt-0.5">
              Nigeria Solar Ops
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-105"
          >
            <span>Launch Admin</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 lg:py-16 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-semibold shadow-inner">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Built for Nigerian Solar Installers, Technicians & Customers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Next-Gen Solar Registry, Telemetry & <span className="text-amber-400">PAYG Management</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
            A comprehensive frontend platform uniting customer lifecycle tracking with 10-stage gated installations, remote inverter diagnostics (overload, under-charge, offline, hardware fault), and dual-approval PAYG remote contactor control.
          </p>
        </div>

        {/* 4 Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {/* Card 1: Admin */}
          <Link
            href="/admin"
            className="group rounded-3xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 p-6 transition-all duration-200 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Staff Dashboard</div>
                <h2 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  /admin
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Role switcher across 6 staff personas, 10-stage installations Kanban, fleet telemetry map, diagnosis card & PAYG defaulters.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Open Staff Operations</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Tech Mobile */}
          <Link
            href="/tech"
            className="group rounded-3xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 p-6 transition-all duration-200 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Technician App</div>
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
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Customer Portal */}
          <Link
            href="/portal"
            className="group rounded-3xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 p-6 transition-all duration-200 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-400">Customer Portal</div>
                <h2 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                  /portal
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Mobile-friendly customer tracker, OTP login, daily kWh usage with Nigerian appliance tips, mock Paystack & self-help diagnosis.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
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
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500">
        SolarTrack Web Platform — Engineered with Next.js App Router, Tailwind CSS & TanStack Query for Nigerian Solar Energy Companies.
      </footer>
    </div>
  );
}
