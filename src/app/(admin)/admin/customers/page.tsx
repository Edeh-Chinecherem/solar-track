"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  QrCode,
  MapPin,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Zap,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_CUSTOMERS, MOCK_SYSTEMS, MOCK_PAYG_ACCOUNTS, MOCK_INSTALLATIONS } from "@/lib/mock-data";
import { QrCodeModal } from "@/components/customers/qr-code-modal";
import { formatNaira, formatDate } from "@/lib/utils";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { useToast } from "@/components/providers/toast-provider";

export default function CustomersRegistryPage() {
  const { canPerform } = useAuthRole();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  // QR Modal state
  const [qrModalCustomer, setQrModalCustomer] = useState<{
    open: boolean;
    token: string;
    customerName: string;
    model: string;
    serial: string;
    capacity: number;
  }>({
    open: false,
    token: "",
    customerName: "",
    model: "",
    serial: "",
    capacity: 0
  });

  const filteredCustomers = MOCK_CUSTOMERS.filter((cust) => {
    const system = MOCK_SYSTEMS.find((s) => s.id === cust.systemId);
    const matchesSearch =
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.includes(searchTerm) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.qrToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState = selectedState === "all" || cust.state === selectedState;
    const matchesBrand = selectedBrand === "all" || system?.inverterBrand === selectedBrand;

    return matchesSearch && matchesState && matchesBrand;
  });

  const exportCSV = () => {
    try {
      const headers = ["Customer ID,Full Name,Phone,Email,State,Address,QR Token,System ID,Inverter Brand,Capacity kVA,Registration Date\n"];
      const rows = filteredCustomers.map((c) => {
        const sys = MOCK_SYSTEMS.find((s) => s.id === c.systemId);
        return `"${c.id}","${c.name}","${c.phone}","${c.email}","${c.state}","${c.address.replace(/"/g, '""')}","${c.qrToken}","${c.systemId}","${sys?.inverterBrand || ""}","${sys?.inverterCapacityKva || ""}","${c.registeredDate}"`;
      });
      const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `GreenerAfrik-Customers-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast("CSV Export Completed", { description: `Exported ${filteredCustomers.length} customer records.`, type: "success" });
    } catch (e) {
      toast("Export Failed", { description: "Could not export customer records.", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#05361e] dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#0A5C36] dark:text-[#10B981]" />
            <span>Customer Registry</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-700/80 dark:text-emerald-200/80 mt-1">
            Official database of installed solar customers, hardware serial tags, and PAYG statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {canPerform("EXPORT_REPORTS") && (
            <Button variant="outline" size="sm" onClick={exportCSV} className="text-xs font-semibold gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#0A5C36] dark:text-[#10B981]" />
              <span>Export CSV</span>
            </Button>
          )}

          {canPerform("CREATE_CUSTOMER") && (
            <Link href="/admin/customers/new">
              <Button variant="primary" size="sm" className="text-xs font-bold gap-1.5 shadow-md shadow-[#0A5C36]/20">
                <Plus className="w-4 h-4" />
                <span>Add Customer</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-600/80 absolute left-3.5 top-3.5 pointer-events-none" />
              <Input
                placeholder="Search by name, phone (+234), email, address or QR tag (e.g. ST-LGS-001)..."
                className="pl-10 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              {/* State Filter */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="h-10 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-3 text-xs font-medium text-[#05361e] dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C36]"
              >
                <option value="all">All States (Nigeria)</option>
                <option value="Lagos">Lagos State</option>
                <option value="Abuja">Abuja (FCT)</option>
                <option value="Rivers">Rivers (Port Harcourt)</option>
                <option value="Oyo">Oyo State (Ibadan)</option>
                <option value="Kano">Kano State</option>
              </select>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="h-10 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-3 text-xs font-medium text-[#05361e] dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C36]"
              >
                <option value="all">All Inverter Brands</option>
                <option value="Deye">Deye Hybrid</option>
                <option value="Sunsynk">Sunsynk Tri-Phase</option>
                <option value="Victron">Victron Energy</option>
                <option value="Growatt">Growatt SPF</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-700/80 dark:text-emerald-200/80 pt-1">
            <span>
              Showing <strong className="text-[#05361e] dark:text-white">{filteredCustomers.length}</strong> of {MOCK_CUSTOMERS.length} total registered customers
            </span>
            {(searchTerm || selectedState !== "all" || selectedBrand !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedState("all");
                  setSelectedBrand("all");
                }}
                className="text-[#0A5C36] dark:text-[#10B981] font-semibold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Registry Data Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-[#084729]/40 text-[11px] font-bold uppercase tracking-wider text-emerald-700/80 dark:text-emerald-200/80">
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Installed System</th>
                <th className="py-3.5 px-4">QR Hardware Tag</th>
                <th className="py-3.5 px-4">Status & Stage</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900">
              {filteredCustomers.map((cust) => {
                const system = MOCK_SYSTEMS.find((s) => s.id === cust.systemId);
                const install = MOCK_INSTALLATIONS.find((i) => i.customerId === cust.id);
                const payg = MOCK_PAYG_ACCOUNTS.find((p) => p.customerId === cust.id);

                return (
                  <tr
                    key={cust.id}
                    className="hover:bg-emerald-50/60 dark:hover:bg-[#084729]/30 transition-colors group"
                  >
                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <Link href={`/admin/customers/${cust.id}`} className="block group-hover:text-[#0A5C36] dark:group-hover:text-[#10B981]">
                        <div className="font-bold text-[#05361e] dark:text-white text-sm">
                          {cust.name}
                        </div>
                        <div className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80 font-mono mt-0.5">{cust.phone}</div>
                        <div className="text-[11px] text-emerald-600/80 dark:text-emerald-300/80 truncate max-w-[180px]">{cust.email}</div>
                      </Link>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-semibold text-[#05361e] dark:text-emerald-100">
                        <MapPin className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                        <span>{cust.state}</span>
                      </div>
                      <div className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80 truncate max-w-[200px] mt-0.5" title={cust.address}>
                        {cust.address}
                      </div>
                    </td>

                    {/* System specs */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#05361e] dark:text-white">
                        {system?.inverterBrand} {system?.inverterCapacityKva}kVA
                      </div>
                      <div className="text-[11px] text-emerald-700/80 dark:text-emerald-200/80 mt-0.5">
                        {system?.batteryCapacityKwh}kWh • {system?.solarPanelsCount}x 550W Panels
                      </div>
                    </td>

                    {/* QR Code Token */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          setQrModalCustomer({
                            open: true,
                            token: cust.qrToken,
                            customerName: cust.name,
                            model: `${system?.inverterBrand} ${system?.inverterModel}`,
                            serial: system?.inverterSerialNumber || "N/A",
                            capacity: system?.inverterCapacityKva || 5
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800 text-[#EA580C] dark:text-orange-300 font-mono text-xs font-bold hover:bg-orange-100 transition cursor-pointer"
                        title="Click to view and print QR label"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#EA580C] dark:text-orange-400" />
                        <span>{cust.qrToken}</span>
                      </button>
                    </td>

                    {/* Status & Stage */}
                    <td className="py-3.5 px-4 space-y-1">
                      <div>
                        {system?.status === "online" && <Badge variant="success">Online</Badge>}
                        {system?.status === "overload" && <Badge variant="destructive">Overload Trip</Badge>}
                        {system?.status === "low_battery" && <Badge variant="warning">Low Battery</Badge>}
                        {system?.status === "offline" && <Badge variant="secondary">Offline</Badge>}
                        {system?.status === "hardware_fault" && <Badge variant="destructive">Hardware Fault</Badge>}
                      </div>
                      <div className="text-[10px] text-emerald-700/80 dark:text-emerald-200/80 font-medium capitalize">
                        Stage: {install?.currentStage.replace("_", " ")}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/admin/customers/${cust.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-semibold text-[#0A5C36] dark:text-[#10B981] hover:bg-emerald-50 dark:hover:bg-emerald-950/40">
                          <span>Profile</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* QR Code Modal preview */}
      <QrCodeModal
        open={qrModalCustomer.open}
        onOpenChange={(open) => setQrModalCustomer((prev) => ({ ...prev, open }))}
        token={qrModalCustomer.token}
        customerName={qrModalCustomer.customerName}
        systemModel={qrModalCustomer.model}
        systemSerial={qrModalCustomer.serial}
        systemCapacity={qrModalCustomer.capacity}
      />
    </div>
  );
}
