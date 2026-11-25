"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Cpu,
  CreditCard,
  FileText,
  Check,
  Upload,
  Sun,
  ShieldCheck,
  QrCode
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { useToast } from "@/components/providers/toast-provider";
import { api } from "@/lib/api";
import { QrCodeModal } from "@/components/customers/qr-code-modal";
import { InverterBrand } from "@/lib/types";

const STEPS = [
  { id: 1, label: "Customer Details", icon: UserPlus },
  { id: 2, label: "Site & GPS", icon: MapPin },
  { id: 3, label: "Equipment & Serials", icon: Cpu },
  { id: 4, label: "Package & PAYG Plan", icon: CreditCard },
  { id: 5, label: "Documents", icon: FileText },
  { id: 6, label: "Review & Issue Tag", icon: ShieldCheck }
];

export default function AddCustomerWizardPage() {
  const router = useRouter();
  const { currentUser } = useAuthRole();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Details
    name: "Alhaji Farouk Al-Hassan",
    email: "farouk.alhassan@trading.ng",
    phone: "+234 803 912 7701",
    state: "Lagos",
    lga: "Eti-Osa",
    address: "Plot 12, Ocean View Estate, Alpha Beach Road, Lekki",

    // Step 2: Site & GPS
    roofType: "Corrugated Metal (Longspan)",
    roofOrientation: "South-Facing (185° Azimuth)",
    gridAvailabilityHours: 8,
    lat: 6.4281,
    lng: 3.5192,

    // Step 3: Equipment
    inverterBrand: "Deye" as InverterBrand,
    inverterModel: "SUN-5K-SG03LP1-EU",
    inverterCapacityKva: 5.0,
    inverterSerial: "DEYE-5K-2026-9921",
    batteryBrand: "Felicity Solar",
    batteryCapacityKwh: 10.0,
    batterySerial: "FEL-BAT-48200-99",
    batteryChemistry: "LiFePO4",
    solarPanelsCount: 12,
    solarPanelsWattage: 550,

    // Step 4: Package & Payment
    packageType: "Executive 5.0kVA Deye Hybrid",
    planName: "PAYG 12 Months",
    totalCostNaira: 5200000,
    downPaymentNaira: 1560000,
    monthlyInstallmentNaira: 303333,
    gracePeriodDays: 5,

    // Step 5: Documents
    contractUploaded: true,
    surveyUploaded: true,
    idUploaded: true
  });

  // Success QR Modal State
  const [createdQr, setCreatedQr] = useState<{
    open: boolean;
    token: string;
    customerId: string;
    customerName: string;
    model: string;
    serial: string;
    capacity: number;
  }>({
    open: false,
    token: "",
    customerId: "",
    customerName: "",
    model: "",
    serial: "",
    capacity: 5
  });

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const statePrefix = formData.state === "Lagos" ? "LGS" : formData.state === "Abuja" ? "ABJ" : formData.state.slice(0, 3).toUpperCase();
      const generatedToken = `ST-${statePrefix}-026-N${Math.floor(1 + Math.random() * 9)}`;

      const newCustomer = await api.createCustomer(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          state: formData.state,
          lga: formData.lga,
          address: formData.address,
          gpsCoords: { lat: formData.lat, lng: formData.lng },
          systemId: `sys_026`,
          qrToken: generatedToken,
          packageType: formData.packageType,
          documents: [
            {
              id: "doc_new_1",
              title: "Signed Solar Contract",
              type: "contract",
              fileUrl: "#",
              uploadedAt: new Date().toISOString(),
              fileSizeKb: 480
            }
          ]
        },
        currentUser
      );

      toast("Customer Registered Successfully!", {
        description: `Issued hardware QR tag ${generatedToken} for ${newCustomer.name}.`,
        type: "success"
      });

      setCreatedQr({
        open: true,
        token: generatedToken,
        customerId: newCustomer.id,
        customerName: newCustomer.name,
        model: `${formData.inverterBrand} ${formData.inverterModel}`,
        serial: formData.inverterSerial,
        capacity: formData.inverterCapacityKva
      });
    } catch (e) {
      console.error(e);
      toast("Registration Failed", { description: "An error occurred while creating the customer record.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-700/80 dark:text-emerald-200/80 mb-1">
            <Link href="/admin/customers" className="hover:text-[#0A5C36] dark:hover:text-[#10B981]">
              Customers
            </Link>
            <span>/</span>
            <span>New Customer Registration</span>
          </div>
          <h1 className="text-2xl font-black text-[#05361e] dark:text-white tracking-tight flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-[#0A5C36] dark:text-[#10B981]" />
            <span>Onboard New Solar Customer</span>
          </h1>
        </div>
        <Badge variant="green">Step {currentStep} of 6</Badge>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="grid grid-cols-6 gap-2 bg-white dark:bg-[#06361f] p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm overflow-x-auto">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                isCurrent
                  ? "bg-[#0A5C36]/10 text-[#0A5C36] dark:text-[#10B981] font-bold border border-[#0A5C36]/30"
                  : isDone
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "text-emerald-600/70 dark:text-emerald-300/70 hover:text-[#05361e] dark:hover:text-white"
              }`}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-1">
                {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className="text-[11px] leading-tight line-clamp-1">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Wizard Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentStep === 1 && "Step 1: Customer Personal & Contact Information"}
            {currentStep === 2 && "Step 2: Physical Site Survey & GPS Coordinates"}
            {currentStep === 3 && "Step 3: Equipment Specifications & Serial Numbers"}
            {currentStep === 4 && "Step 4: Package Sizing & PAYG Payment Terms"}
            {currentStep === 5 && "Step 5: Handover Documents & Identification"}
            {currentStep === 6 && "Step 6: Review Summary & Issue Weatherproof Tag"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Provide authentic Nigerian contact and location information."}
            {currentStep === 2 && "Record roof condition, compass orientation, and precise GPS."}
            {currentStep === 3 && "Scan hardware chassis serial numbers for warranty validation."}
            {currentStep === 4 && "Configure payment duration, down payment, and monthly installment in ₦."}
            {currentStep === 5 && "Upload signed agreements and site survey validation documents."}
            {currentStep === 6 && "Verify all entries before committing to the immutable registry."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* STEP 1: Details */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Full Customer Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alhaji Babatunde Adeleke"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Nigerian Phone Number (+234) *
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 803 123 4567"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="customer@domain.ng"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">State *</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full h-11 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-3.5 text-sm text-[#05361e] dark:text-white"
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja (FCT)</option>
                  <option value="Rivers">Rivers</option>
                  <option value="Oyo">Oyo</option>
                  <option value="Kano">Kano</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">LGA *</label>
                <Input
                  value={formData.lga}
                  onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                  placeholder="e.g. Eti-Osa"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Detailed Street Address *
                </label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House number, street name, estate, landmarks..."
                />
              </div>
            </div>
          )}

          {/* STEP 2: Site & GPS */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">Roof Type</label>
                <select
                  value={formData.roofType}
                  onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
                  className="w-full h-11 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-3.5 text-sm text-[#05361e] dark:text-white"
                >
                  <option>Corrugated Metal (Longspan)</option>
                  <option>Stone-Coated Metal Tiles (Gerard)</option>
                  <option>Concrete Slab Rooftop</option>
                  <option>Ground Mount / Carport</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Roof Orientation & Azimuth
                </label>
                <Input
                  value={formData.roofOrientation}
                  onChange={(e) => setFormData({ ...formData, roofOrientation: e.target.value })}
                  placeholder="e.g. South-Facing 180°"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Avg DisCo Grid Availability (Hours/Day)
                </label>
                <Input
                  type="number"
                  value={formData.gridAvailabilityHours}
                  onChange={(e) => setFormData({ ...formData, gridAvailabilityHours: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  GPS Latitude & Longitude
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: Number(e.target.value) })}
                    placeholder="Lat"
                  />
                  <Input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: Number(e.target.value) })}
                    placeholder="Lng"
                  />
                </div>
              </div>

              <div className="md:col-span-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0A5C36] dark:text-[#10B981]" />
                  <span>GPS Coordinates locked to Lekki Peninsula grid corridor.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, lat: 6.4474, lng: 3.4731 });
                    toast("GPS Coordinates Updated", { description: "Simulated pin from mobile GPS.", type: "info" });
                  }}
                  className="font-bold underline cursor-pointer"
                >
                  Use Device GPS
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Equipment & Serials */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">Inverter Brand</label>
                <select
                  value={formData.inverterBrand}
                  onChange={(e) => setFormData({ ...formData, inverterBrand: e.target.value as InverterBrand })}
                  className="w-full h-11 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-3.5 text-sm text-[#05361e] dark:text-white"
                >
                  <option value="Deye">Deye Hybrid</option>
                  <option value="Sunsynk">Sunsynk Tri-Phase</option>
                  <option value="Victron">Victron Energy</option>
                  <option value="Growatt">Growatt SPF</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Inverter Capacity (kVA)
                </label>
                <Input
                  type="number"
                  step="0.5"
                  value={formData.inverterCapacityKva}
                  onChange={(e) => setFormData({ ...formData, inverterCapacityKva: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Inverter Chassis Serial Number *
                </label>
                <Input
                  className="font-mono"
                  value={formData.inverterSerial}
                  onChange={(e) => setFormData({ ...formData, inverterSerial: e.target.value })}
                  placeholder="DEYE-5K-2026-XXXX"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">Battery Brand</label>
                <Input
                  value={formData.batteryBrand}
                  onChange={(e) => setFormData({ ...formData, batteryBrand: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Battery Capacity (kWh)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.batteryCapacityKwh}
                  onChange={(e) => setFormData({ ...formData, batteryCapacityKwh: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Battery Serial Number *
                </label>
                <Input
                  className="font-mono"
                  value={formData.batterySerial}
                  onChange={(e) => setFormData({ ...formData, batterySerial: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">Solar Panel Count</label>
                <Input
                  type="number"
                  value={formData.solarPanelsCount}
                  onChange={(e) => setFormData({ ...formData, solarPanelsCount: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">Panel Wattage (W)</label>
                <Input
                  type="number"
                  value={formData.solarPanelsWattage}
                  onChange={(e) => setFormData({ ...formData, solarPanelsWattage: Number(e.target.value) })}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Package & PAYG */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">Package Type</label>
                <Input
                  value={formData.packageType}
                  onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">Payment Plan</label>
                <select
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  className="w-full h-11 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-3.5 text-sm text-[#05361e] dark:text-white"
                >
                  <option>PAYG 12 Months</option>
                  <option>PAYG 24 Months</option>
                  <option>Outright Purchase</option>
                  <option>Lease to Own</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Total Contract Value (₦)
                </label>
                <Input
                  type="number"
                  value={formData.totalCostNaira}
                  onChange={(e) => setFormData({ ...formData, totalCostNaira: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Down Payment Received (₦)
                </label>
                <Input
                  type="number"
                  value={formData.downPaymentNaira}
                  onChange={(e) => setFormData({ ...formData, downPaymentNaira: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  Monthly Installment (₦)
                </label>
                <Input
                  type="number"
                  value={formData.monthlyInstallmentNaira}
                  onChange={(e) => setFormData({ ...formData, monthlyInstallmentNaira: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A5C36] dark:text-emerald-200">
                  PAYG Default Grace Period (Days)
                </label>
                <Input
                  type="number"
                  value={formData.gracePeriodDays}
                  onChange={(e) => setFormData({ ...formData, gracePeriodDays: Number(e.target.value) })}
                />
              </div>
            </div>
          )}

          {/* STEP 5: Documents */}
          {currentStep === 5 && (
            <div className="space-y-3">
              {[
                { name: "Customer Signed Installation Agreement", size: "1.2 MB", checked: formData.contractUploaded },
                { name: "Site Survey Engineering Checklist & Roof Structural Approval", size: "3.4 MB", checked: formData.surveyUploaded },
                { name: "Government ID (NIN / Driver's License)", size: "850 KB", checked: formData.idUploaded },
                { name: "Utility Bill Proof of Residence (DisCo / Water)", size: "620 KB", checked: true }
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-[#084729]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0A5C36]/10 text-[#0A5C36] dark:text-[#10B981] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#05361e] dark:text-white">
                        {doc.name}
                      </div>
                      <div className="text-[11px] text-emerald-600/80 dark:text-emerald-300/80">{doc.size} • PDF Document</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 6: Review */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#EA580C]/10 border border-[#EA580C]/20 flex items-start gap-3">
                <Sun className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
                <div className="text-xs text-orange-950 dark:text-orange-200">
                  <div className="font-bold text-sm">Ready to Generate Weatherproof Hardware Seal</div>
                  <p className="mt-0.5">
                    Upon confirmation, a unique QR tag token will be cryptographically generated, registered in the immutable audit log, and ready for thermal sticker printing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-[#084729]/50 space-y-2">
                  <span className="font-bold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-300/80 text-[10px]">
                    Customer & Site
                  </span>
                  <div>
                    <div className="font-bold text-sm text-[#05361e] dark:text-white">{formData.name}</div>
                    <div className="text-emerald-700/80 dark:text-emerald-200/80">{formData.phone}</div>
                    <div className="text-emerald-700/80 dark:text-emerald-200/80 mt-1">{formData.address}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-[#084729]/50 space-y-2">
                  <span className="font-bold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-300/80 text-[10px]">
                    Equipment Sizing
                  </span>
                  <div>
                    <div className="font-bold text-sm text-[#05361e] dark:text-white">
                      {formData.inverterBrand} {formData.inverterCapacityKva}kVA Inverter
                    </div>
                    <div className="text-emerald-700/80 dark:text-emerald-200/80">{formData.batteryCapacityKwh}kWh LiFePO4 Battery</div>
                    <div className="text-emerald-700/80 dark:text-emerald-200/80 font-mono mt-1">SN: {formData.inverterSerial}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-emerald-100 dark:border-emerald-800 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className="text-xs font-semibold gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </Button>

          {currentStep < 6 ? (
            <Button variant="primary" size="sm" onClick={nextStep} className="text-xs font-bold gap-1.5">
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="text-xs font-bold gap-1.5 shadow-lg shadow-[#0A5C36]/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Issue Tag & Complete Registration</span>
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Post-Registration QR Modal */}
      <QrCodeModal
        open={createdQr.open}
        onOpenChange={(open) => {
          setCreatedQr((prev) => ({ ...prev, open }));
          if (!open) router.push(`/admin/customers/${createdQr.customerId}`);
        }}
        token={createdQr.token}
        customerName={createdQr.customerName}
        systemModel={createdQr.model}
        systemSerial={createdQr.serial}
        systemCapacity={createdQr.capacity}
      />
    </div>
  );
}
