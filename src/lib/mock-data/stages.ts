import { StageDefinition } from "@/lib/types";

export const INSTALLATION_STAGES: StageDefinition[] = [
  {
    id: "inquiry",
    order: 1,
    label: "Customer Inquiry",
    shortLabel: "Inquiry",
    slaDays: 2,
    description: "Initial energy assessment and customer load profiling.",
    requiredRole: ["sales", "operations_manager", "super_admin"],
    mandatoryChecklist: [
      "Customer contact information verified",
      "Preliminary daily load calculation completed",
      "Tariff / DisCo supply stability recorded"
    ]
  },
  {
    id: "site_survey",
    order: 2,
    label: "Site Survey & Engineering",
    shortLabel: "Survey",
    slaDays: 3,
    description: "Physical inspection of roof orientation, shading, and DB board wiring.",
    requiredRole: ["technician", "operations_manager", "super_admin"],
    mandatoryChecklist: [
      "Roof azimuth and tilt angles measured",
      "Main DB distribution box phase configuration checked",
      "Earthing pit test location identified",
      "Roof structural integrity approved"
    ]
  },
  {
    id: "quotation",
    order: 3,
    label: "Quotation & Proposal",
    shortLabel: "Quotation",
    slaDays: 2,
    description: "Formal system sizing proposal and financial payment plan presentation.",
    requiredRole: ["sales", "operations_manager", "super_admin"],
    mandatoryChecklist: [
      "System Bill of Engineering Measurement & Evaluation (BEME) generated",
      "PAYG / Outright agreement reviewed with customer",
      "Customer signed acceptance received"
    ]
  },
  {
    id: "payment_confirmed",
    order: 4,
    label: "Payment / Deposit Confirmed",
    shortLabel: "Payment",
    slaDays: 1,
    description: "Finance department verification of down payment or outright wire.",
    requiredRole: ["finance", "super_admin"],
    mandatoryChecklist: [
      "Bank deposit / transaction reference matched",
      "Official receipt issued and emailed to customer",
      "Customer account unlocked for fulfillment"
    ]
  },
  {
    id: "procurement_dispatch",
    order: 5,
    label: "Procurement & Dispatch",
    shortLabel: "Dispatch",
    slaDays: 3,
    description: "Warehouse kit preparation, serial number scanning, and logistics dispatch.",
    requiredRole: ["operations_manager", "super_admin"],
    mandatoryChecklist: [
      "Inverter serial number scanned and assigned to customer",
      "Battery lithium pack voltage and cell balance checked",
      "Mounting rails, DC cables, and surge arresters packed",
      "Waybill signed by logistics carrier"
    ]
  },
  {
    id: "installing",
    order: 6,
    label: "Physical Installation",
    shortLabel: "Installing",
    slaDays: 4,
    description: "Mounting solar arrays, DC/AC cabling, inverter and battery installation.",
    requiredRole: ["technician", "operations_manager", "super_admin"],
    mandatoryChecklist: [
      "PV array installed with wind-rated clamps",
      "DC isolator switch and surge protective devices (SPD) wired",
      "Inverter and battery securely wall-mounted",
      "Earth rod resistance tested (< 5 Ohms)"
    ]
  },
  {
    id: "testing_commissioning",
    order: 7,
    label: "Testing & Commissioning",
    shortLabel: "Testing",
    slaDays: 2,
    description: "Grid synchronisation, load-shedding test, and IoT gateway connectivity check.",
    requiredRole: ["technician", "operations_manager", "super_admin"],
    mandatoryChecklist: [
      "Inverter firmware updated to latest stable version",
      "Full load test executed for 60 minutes",
      "Wi-Fi / 4G cellular IoT datalogger online and transmitting telemetry",
      "Emergency shutdown sequence verified"
    ]
  },
  {
    id: "handover",
    order: 8,
    label: "Customer Handover & Training",
    shortLabel: "Handover",
    slaDays: 2,
    description: "Customer training, mobile portal onboarding, and QR sticker affixed.",
    requiredRole: ["technician", "operations_manager", "sales", "super_admin"],
    mandatoryChecklist: [
      "Weatherproof QR code sticker affixed to inverter chassis",
      "Customer trained on high-wattage appliance management (AC, iron)",
      "Customer portal credentials and mobile app walkthrough completed",
      "Signed handover acceptance certificate uploaded"
    ]
  },
  {
    id: "live",
    order: 9,
    label: "System Live & Monitored",
    shortLabel: "Live",
    slaDays: 365,
    description: "Operational system in commercial service under remote automated telemetry.",
    requiredRole: ["operations_manager", "super_admin", "technician", "support_agent"],
    mandatoryChecklist: [
      "Automated telemetry anomaly detection active",
      "Routine performance baseline established"
    ]
  },
  {
    id: "follow_up_30d",
    order: 10,
    label: "30-Day Performance Audit",
    shortLabel: "30d Follow-up",
    slaDays: 10,
    description: "Post-installation satisfaction review, generation review, and wiring inspection.",
    requiredRole: ["operations_manager", "support_agent", "super_admin"],
    mandatoryChecklist: [
      "30-day cumulative generation vs. projected harvest validated",
      "Customer feedback survey completed",
      "Connection terminals thermal scan (no hot spots detected)"
    ]
  }
];
