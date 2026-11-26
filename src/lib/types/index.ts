export type UserRole =
  | "super_admin"
  | "operations_manager"
  | "sales"
  | "technician"
  | "support_agent"
  | "finance";

export type RegistrableStaffRole = Exclude<UserRole, "super_admin">;
export type AccountApprovalStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone: string;
  status?: AccountApprovalStatus;
}

export interface StaffRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RegistrableStaffRole;
  password: string;
  status: AccountApprovalStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export type InstallationStageId =
  | "inquiry"
  | "site_survey"
  | "quotation"
  | "payment_confirmed"
  | "procurement_dispatch"
  | "installing"
  | "testing_commissioning"
  | "handover"
  | "live"
  | "follow_up_30d";

export interface StageDefinition {
  id: InstallationStageId;
  order: number;
  label: string;
  shortLabel: string;
  slaDays: number;
  description: string;
  requiredRole: UserRole[];
  mandatoryChecklist: string[];
}

export interface ChecklistItemState {
  id: string;
  text: string;
  isMandatory: boolean;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
}

export interface InstallationPhoto {
  id: string;
  url: string;
  caption: string;
  stageId: InstallationStageId;
  uploadedAt: string;
  uploadedBy: string;
  gpsCoords?: { lat: number; lng: number };
}

export interface Installation {
  id: string;
  customerId: string;
  systemId: string;
  currentStage: InstallationStageId;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  stageHistory: {
    stageId: InstallationStageId;
    enteredAt: string;
    completedAt?: string;
    completedBy?: string;
    notes?: string;
    blockerReason?: string;
  }[];
  checklists: Record<InstallationStageId, ChecklistItemState[]>;
  photos: InstallationPhoto[];
  daysInCurrentStage: number;
  isOverdue: boolean;
  notes: string;
  blockedReason?: string;
  estimatedCompletionDate: string;
}

export type InverterBrand = "Deye" | "Growatt" | "Victron" | "Sunsynk";

export type SystemStatus = "online" | "offline" | "overload" | "low_battery" | "hardware_fault";

export interface SolarSystem {
  id: string;
  customerId: string;
  qrToken: string;
  inverterBrand: InverterBrand;
  inverterModel: string;
  inverterCapacityKva: number; // e.g. 3.5, 5.0, 8.0, 10.0
  inverterSerialNumber: string;
  batteryBrand: string;
  batteryModel?: string;
  batteryCapacityKwh: number;
  batteryChemistry: "LiFePO4" | "Lead-Acid" | "Gel";
  batterySerialNumber: string;
  solarPanelsCount: number;
  solarPanelsWattage: number; // e.g. 550W
  totalPvCapacityKw: number;
  status: SystemStatus;
  installationDate?: string;
  warrantyExpiryDate: string;
}

export interface TelemetryReading {
  timestamp: string;
  pvPowerWatts: number;
  gridPowerWatts: number;
  loadPowerWatts: number;
  batterySocPercent: number;
  batteryVoltageVolts: number;
  batteryPowerWatts: number; // positive = charging, negative = discharging
  inverterTempCelsius: number;
  gridFrequencyHz: number;
  errorCode?: string;
}

export type DiagnosisCause = "OVERLOAD" | "UNDER_CHARGED" | "OFFLINE" | "HARDWARE_FAULT" | "NORMAL";

export interface DiagnosisResult {
  cause: DiagnosisCause;
  confidence: number; // 0-100%
  headline: string;
  detailedAnalysis: string;
  timestampOccurred?: string;
  metricsSnapshot: {
    peakLoadWatts?: number;
    ratedCapacityWatts?: number;
    sustainedLowSocDays?: number;
    lastSeenMinutesAgo?: number;
    inverterTempCelsius?: number;
    batterySocPercent?: number;
    activeErrorCode?: string;
  };
  recommendedActions: string[];
  customerAdviceSms: string;
}

export type PAYGStatus = "active" | "grace_period" | "pending_disconnect" | "disconnected" | "completed";

export interface PAYGAccount {
  id: string;
  customerId: string;
  systemId: string;
  planName: "Outright" | "PAYG 12 Months" | "PAYG 24 Months" | "Lease to Own";
  totalCostNaira: number;
  downPaymentNaira: number;
  monthlyInstallmentNaira: number;
  balanceOwedNaira: number;
  daysRemainingOfPower: number;
  daysOverdue?: number;
  billingCycle?: string;
  gracePeriodDays: number; // e.g. 3 or 5 days
  graceDaysUsed: number;
  status: PAYGStatus;
  lastPaymentDate?: string;
  nextDueDate: string;
  isAutoDisconnectEnabled: boolean;
  activeExtensionUntil?: string;
  extensionReason?: string;
}

export type DisconnectCommandStatus = "sent" | "acknowledged" | "confirmed" | "failed";

export interface DisconnectCommand {
  id: string;
  systemId: string;
  customerId: string;
  type: "DISCONNECT" | "RECONNECT";
  status: DisconnectCommandStatus;
  reason: string;
  issuedByUserId: string;
  issuedByUserName: string;
  secondApproverId?: string;
  secondApproverName?: string;
  issuedAt: string;
  acknowledgedAt?: string;
  confirmedAt?: string;
}

export interface Payment {
  id: string;
  customerId: string;
  amountNaira: number;
  date: string;
  paymentMethod: "Paystack" | "Bank Transfer" | "Cash" | "POS";
  reference: string;
  status: "success" | "pending" | "failed";
  receiptUrl?: string;
}

export interface CustomerDocument {
  id: string;
  title: string;
  type: "contract" | "handover_form" | "warranty_certificate" | "site_survey_report" | "id_card";
  fileUrl: string;
  uploadedAt: string;
  fileSizeKb: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string; // +234
  state: string; // Lagos, Abuja, Rivers, Kano, Oyo, etc.
  lga: string;
  address: string;
  gpsCoords: { lat: number; lng: number };
  systemId: string;
  qrToken: string;
  packageType: string;
  registeredDate: string;
  documents: CustomerDocument[];
}

export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketStatus = "open" | "assigned" | "in_progress" | "waiting_customer" | "resolved" | "closed";
export type TicketCategory =
  | "Hardware"
  | "Battery/Charging"
  | "Overload"
  | "PAYG/Billing"
  | "Installation"
  | "Inverter Fault"
  | "Battery Degradation"
  | "Solar Generation Drop"
  | "PAYG Contactor Issue"
  | "Wiring & Breaker Trip"
  | "Other";

export interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: "customer" | "staff";
  isInternal: boolean;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  systemId: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  assignedToName?: string;
  assignedToRole?: string;
  slaDeadline: string; // ISO string
  createdAt: string;
  resolvedAt?: string;
  linkedDiagnosis?: DiagnosisResult;
  messages: TicketMessage[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
  ipAddress?: string;
}
