import {
  Customer,
  SolarSystem,
  Installation,
  PAYGAccount,
  Payment,
  DisconnectCommand,
  Ticket,
  AuditLogEntry,
  InstallationStageId,
  User,
  TelemetryReading,
  DiagnosisResult
} from "@/lib/types";
import {
  MOCK_CUSTOMERS,
  MOCK_SYSTEMS,
  MOCK_INSTALLATIONS,
  MOCK_PAYG_ACCOUNTS,
  MOCK_TICKETS,
  MOCK_AUDIT_LOGS,
  INSTALLATION_STAGES,
  generate24HourTelemetry,
  generateLiveTelemetry,
  diagnoseSystem,
  HourlyTelemetryPoint
} from "@/lib/mock-data";

const STORAGE_KEYS = {
  CUSTOMERS: "solartrack_customers",
  SYSTEMS: "solartrack_systems",
  INSTALLATIONS: "solartrack_installations",
  PAYG: "solartrack_payg",
  TICKETS: "solartrack_tickets",
  AUDIT: "solartrack_audit",
  COMMANDS: "solartrack_commands"
};

// Helper to simulate network latency
const sleep = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

class SolarTrackApi {
  // --- CUSTOMERS ---
  async getCustomers(search?: string, filterState?: string): Promise<Customer[]> {
    await sleep(220);
    const customers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, MOCK_CUSTOMERS);
    return customers.filter((c) => {
      const matchesSearch = search
        ? c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.qrToken.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesState = filterState && filterState !== "all" ? c.state === filterState : true;
      return matchesSearch && matchesState;
    });
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    await sleep(150);
    const customers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, MOCK_CUSTOMERS);
    return customers.find((c) => c.id === id) || null;
  }

  async getCustomerByQrToken(qrToken: string): Promise<Customer | null> {
    await sleep(180);
    const customers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, MOCK_CUSTOMERS);
    return customers.find((c) => c.qrToken.toUpperCase() === qrToken.toUpperCase()) || null;
  }

  async createCustomer(customerData: Omit<Customer, "id" | "registeredDate">, currentUser: User): Promise<Customer> {
    await sleep(350);
    const customers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, MOCK_CUSTOMERS);
    const newId = `cust_${Date.now()}`;
    const newCustomer: Customer = {
      ...customerData,
      id: newId,
      registeredDate: new Date().toISOString().split("T")[0]
    };
    customers.unshift(newCustomer);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);

    // Also initialize an installation entry
    const installations = loadFromStorage<Installation[]>(STORAGE_KEYS.INSTALLATIONS, MOCK_INSTALLATIONS);
    const checklists: Record<InstallationStageId, any[]> = {} as any;
    INSTALLATION_STAGES.forEach((stg) => {
      checklists[stg.id] = stg.mandatoryChecklist.map((item, idx) => ({
        id: `${stg.id}_chk_${idx}`,
        text: item,
        isMandatory: true,
        isCompleted: false
      }));
    });

    const newInstallation: Installation = {
      id: `inst_${Date.now()}`,
      customerId: newId,
      systemId: newCustomer.systemId,
      currentStage: "inquiry",
      daysInCurrentStage: 0,
      isOverdue: false,
      notes: "Newly onboarded customer inquiry.",
      estimatedCompletionDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      photos: [],
      stageHistory: [
        {
          stageId: "inquiry",
          enteredAt: new Date().toISOString()
        }
      ],
      checklists
    };
    installations.unshift(newInstallation);
    saveToStorage(STORAGE_KEYS.INSTALLATIONS, installations);

    // Add audit log
    await this.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "CREATE_CUSTOMER",
      targetEntity: "Customer",
      targetId: newId,
      details: `Created new customer record for ${newCustomer.name} (${newCustomer.packageType})`
    });

    return newCustomer;
  }

  // --- SYSTEMS & TELEMETRY ---
  async getSystems(): Promise<SolarSystem[]> {
    await sleep(200);
    return loadFromStorage<SolarSystem[]>(STORAGE_KEYS.SYSTEMS, MOCK_SYSTEMS);
  }

  async getSolarSystems(): Promise<SolarSystem[]> {
    return this.getSystems();
  }

  async getSystemById(id: string): Promise<SolarSystem | null> {
    await sleep(150);
    const systems = loadFromStorage<SolarSystem[]>(STORAGE_KEYS.SYSTEMS, MOCK_SYSTEMS);
    return systems.find((s) => s.id === id) || null;
  }

  async getSystemTelemetry(systemId: string): Promise<TelemetryReading> {
    await sleep(160);
    const system = await this.getSystemById(systemId);
    if (!system) throw new Error("System not found");
    return generateLiveTelemetry(system);
  }

  async getSystem24hTelemetry(systemId: string): Promise<HourlyTelemetryPoint[]> {
    await sleep(240);
    const system = await this.getSystemById(systemId);
    if (!system) throw new Error("System not found");
    return generate24HourTelemetry(system);
  }

  async getSystemDiagnosis(systemId: string): Promise<DiagnosisResult> {
    await sleep(200);
    const system = await this.getSystemById(systemId);
    if (!system) throw new Error("System not found");
    const telemetry = generateLiveTelemetry(system);
    return diagnoseSystem(system, telemetry);
  }

  // --- INSTALLATIONS ---
  async getInstallations(): Promise<Installation[]> {
    await sleep(220);
    return loadFromStorage<Installation[]>(STORAGE_KEYS.INSTALLATIONS, MOCK_INSTALLATIONS);
  }

  async getInstallationByCustomerId(customerId: string): Promise<Installation | null> {
    await sleep(180);
    const installations = loadFromStorage<Installation[]>(STORAGE_KEYS.INSTALLATIONS, MOCK_INSTALLATIONS);
    return installations.find((i) => i.customerId === customerId) || null;
  }

  async updateInstallationStage(
    installationId: string,
    newStage: InstallationStageId,
    currentUser: User,
    notes?: string
  ): Promise<Installation> {
    await sleep(280);
    const installations = loadFromStorage<Installation[]>(STORAGE_KEYS.INSTALLATIONS, MOCK_INSTALLATIONS);
    const index = installations.findIndex((i) => i.id === installationId);
    if (index === -1) throw new Error("Installation not found");

    const inst = installations[index];
    const prevStage = inst.currentStage;
    inst.currentStage = newStage;
    inst.daysInCurrentStage = 0;
    inst.isOverdue = false;
    if (notes) inst.notes = notes;

    inst.stageHistory.push({
      stageId: newStage,
      enteredAt: new Date().toISOString(),
      completedBy: currentUser.name,
      notes: notes || `Advanced to ${newStage}`
    });

    installations[index] = inst;
    saveToStorage(STORAGE_KEYS.INSTALLATIONS, installations);

    await this.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "UPDATE_INSTALLATION_STAGE",
      targetEntity: "Installation",
      targetId: installationId,
      details: `Advanced installation stage from ${prevStage} to ${newStage}`
    });

    return inst;
  }

  async toggleChecklistItem(
    installationId: string,
    stageId: InstallationStageId,
    itemId: string,
    currentUser: User
  ): Promise<Installation> {
    await sleep(150);
    const installations = loadFromStorage<Installation[]>(STORAGE_KEYS.INSTALLATIONS, MOCK_INSTALLATIONS);
    const index = installations.findIndex((i) => i.id === installationId);
    if (index === -1) throw new Error("Installation not found");

    const inst = installations[index];
    if (inst.checklists[stageId]) {
      const item = inst.checklists[stageId].find((c) => c.id === itemId);
      if (item) {
        item.isCompleted = !item.isCompleted;
        item.completedAt = item.isCompleted ? new Date().toISOString() : undefined;
        item.completedBy = item.isCompleted ? currentUser.name : undefined;
      }
    }

    installations[index] = inst;
    saveToStorage(STORAGE_KEYS.INSTALLATIONS, installations);
    return inst;
  }

  async uploadInstallationPhoto(
    installationId: string,
    photoData: { url: string; caption: string; stageId: InstallationStageId },
    currentUser: User
  ): Promise<Installation> {
    await sleep(300);
    const installations = loadFromStorage<Installation[]>(STORAGE_KEYS.INSTALLATIONS, MOCK_INSTALLATIONS);
    const index = installations.findIndex((i) => i.id === installationId);
    if (index === -1) throw new Error("Installation not found");

    const inst = installations[index];
    inst.photos.unshift({
      id: `pho_${Date.now()}`,
      url: photoData.url,
      caption: photoData.caption,
      stageId: photoData.stageId,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser.name
    });

    installations[index] = inst;
    saveToStorage(STORAGE_KEYS.INSTALLATIONS, installations);
    return inst;
  }

  // --- PAYG & COMMANDS ---
  async getPAYGAccounts(): Promise<PAYGAccount[]> {
    await sleep(200);
    return loadFromStorage<PAYGAccount[]>(STORAGE_KEYS.PAYG, MOCK_PAYG_ACCOUNTS);
  }

  async getPAYGAccountByCustomerId(customerId: string): Promise<PAYGAccount | null> {
    await sleep(150);
    const accounts = loadFromStorage<PAYGAccount[]>(STORAGE_KEYS.PAYG, MOCK_PAYG_ACCOUNTS);
    return accounts.find((a) => a.customerId === customerId) || null;
  }

  async executeRemoteDisconnect(
    systemId: string,
    customerId: string,
    reason: string,
    currentUser: User,
    secondApprover?: User
  ): Promise<DisconnectCommand> {
    await sleep(400);
    const commands = loadFromStorage<DisconnectCommand[]>(STORAGE_KEYS.COMMANDS, []);
    const commandId = `cmd_${Date.now()}`;

    const command: DisconnectCommand = {
      id: commandId,
      systemId,
      customerId,
      type: "DISCONNECT",
      status: "confirmed", // Simulated complete handshake
      reason,
      issuedByUserId: currentUser.id,
      issuedByUserName: currentUser.name,
      secondApproverId: secondApprover?.id,
      secondApproverName: secondApprover?.name,
      issuedAt: new Date().toISOString(),
      acknowledgedAt: new Date(Date.now() + 800).toISOString(),
      confirmedAt: new Date(Date.now() + 1600).toISOString()
    };
    commands.unshift(command);
    saveToStorage(STORAGE_KEYS.COMMANDS, commands);

    // Update PAYG state
    const accounts = loadFromStorage<PAYGAccount[]>(STORAGE_KEYS.PAYG, MOCK_PAYG_ACCOUNTS);
    const acc = accounts.find((a) => a.systemId === systemId);
    if (acc) {
      acc.status = "disconnected";
      saveToStorage(STORAGE_KEYS.PAYG, accounts);
    }

    await this.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "REMOTE_DISCONNECT",
      targetEntity: "SolarSystem",
      targetId: systemId,
      details: `Executed remote disconnect command for system ${systemId}. Reason: ${reason}`
    });

    return command;
  }

  async executeRemoteReconnect(
    systemId: string,
    customerId: string,
    currentUser: User
  ): Promise<DisconnectCommand> {
    await sleep(400);
    const commands = loadFromStorage<DisconnectCommand[]>(STORAGE_KEYS.COMMANDS, []);
    const commandId = `cmd_${Date.now()}`;

    const command: DisconnectCommand = {
      id: commandId,
      systemId,
      customerId,
      type: "RECONNECT",
      status: "confirmed",
      reason: "Account regularized / payment received",
      issuedByUserId: currentUser.id,
      issuedByUserName: currentUser.name,
      issuedAt: new Date().toISOString(),
      acknowledgedAt: new Date(Date.now() + 800).toISOString(),
      confirmedAt: new Date(Date.now() + 1600).toISOString()
    };
    commands.unshift(command);
    saveToStorage(STORAGE_KEYS.COMMANDS, commands);

    // Update PAYG state
    const accounts = loadFromStorage<PAYGAccount[]>(STORAGE_KEYS.PAYG, MOCK_PAYG_ACCOUNTS);
    const acc = accounts.find((a) => a.systemId === systemId);
    if (acc) {
      acc.status = "active";
      acc.daysRemainingOfPower = 30;
      saveToStorage(STORAGE_KEYS.PAYG, accounts);
    }

    await this.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "REMOTE_RECONNECT",
      targetEntity: "SolarSystem",
      targetId: systemId,
      details: `Restored remote power contactor for system ${systemId}. Status changed to Active.`
    });

    return command;
  }

  async grantPAYGExtension(
    accountId: string,
    days: number,
    reason: string,
    currentUser: User
  ): Promise<PAYGAccount> {
    await sleep(300);
    const accounts = loadFromStorage<PAYGAccount[]>(STORAGE_KEYS.PAYG, MOCK_PAYG_ACCOUNTS);
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) throw new Error("PAYG account not found");

    const extensionDate = new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
    acc.daysRemainingOfPower = days;
    acc.status = "active";
    acc.activeExtensionUntil = extensionDate;
    acc.extensionReason = reason;

    saveToStorage(STORAGE_KEYS.PAYG, accounts);

    await this.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "GRANT_PAYG_EXTENSION",
      targetEntity: "PAYGAccount",
      targetId: accountId,
      details: `Granted ${days}-day extension until ${extensionDate}. Reason: ${reason}`
    });

    return acc;
  }

  async recordCustomerPayment(
    customerId: string,
    amountNaira: number,
    method: "Paystack" | "Bank Transfer" | "POS" = "Paystack",
    currentUser?: User
  ): Promise<Payment> {
    await sleep(400);
    const accounts = loadFromStorage<PAYGAccount[]>(STORAGE_KEYS.PAYG, MOCK_PAYG_ACCOUNTS);
    const acc = accounts.find((a) => a.customerId === customerId);
    if (acc) {
      acc.balanceOwedNaira = Math.max(0, acc.balanceOwedNaira - amountNaira);
      acc.status = "active";
      acc.daysRemainingOfPower = 30;
      acc.lastPaymentDate = new Date().toISOString().split("T")[0];
      const nextDue = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];
      acc.nextDueDate = nextDue;
      saveToStorage(STORAGE_KEYS.PAYG, accounts);
    }

    const payment: Payment = {
      id: `pay_${Date.now()}`,
      customerId,
      amountNaira,
      date: new Date().toISOString(),
      paymentMethod: method,
      reference: `ST-PAY-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: "success"
    };

    if (currentUser) {
      await this.addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: "RECORD_PAYMENT",
        targetEntity: "PAYGAccount",
        targetId: customerId,
        details: `Recorded payment of ₦${amountNaira.toLocaleString()} via ${method}`
      });
    }

    return payment;
  }

  // --- TICKETS ---
  async getTickets(): Promise<Ticket[]> {
    await sleep(220);
    return loadFromStorage<Ticket[]>(STORAGE_KEYS.TICKETS, MOCK_TICKETS);
  }

  async createTicket(ticketData: Omit<Ticket, "id" | "ticketNumber" | "createdAt" | "messages">, currentUser: User): Promise<Ticket> {
    await sleep(300);
    const tickets = loadFromStorage<Ticket[]>(STORAGE_KEYS.TICKETS, MOCK_TICKETS);
    const newNumber = `TK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: Ticket = {
      ...ticketData,
      id: `tkt_${Date.now()}`,
      ticketNumber: newNumber,
      createdAt: new Date().toISOString(),
      messages: []
    };
    tickets.unshift(newTicket);
    saveToStorage(STORAGE_KEYS.TICKETS, tickets);

    await this.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "CREATE_TICKET",
      targetEntity: "Ticket",
      targetId: newTicket.id,
      details: `Logged ticket ${newNumber}: ${newTicket.subject}`
    });

    return newTicket;
  }

  async addTicketMessage(
    ticketId: string,
    content: string,
    senderName: string,
    senderRole: "customer" | "staff",
    isInternal: boolean
  ): Promise<Ticket> {
    await sleep(200);
    const tickets = loadFromStorage<Ticket[]>(STORAGE_KEYS.TICKETS, MOCK_TICKETS);
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) throw new Error("Ticket not found");

    ticket.messages.push({
      id: `msg_${Date.now()}`,
      senderName,
      senderRole,
      isInternal,
      content,
      createdAt: new Date().toISOString()
    });

    saveToStorage(STORAGE_KEYS.TICKETS, tickets);
    return ticket;
  }

  // --- AUDIT LOGS ---
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    await sleep(150);
    return loadFromStorage<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, MOCK_AUDIT_LOGS);
  }

  async addAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<AuditLogEntry> {
    const logs = loadFromStorage<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, MOCK_AUDIT_LOGS);
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newEntry);
    saveToStorage(STORAGE_KEYS.AUDIT, logs);
    return newEntry;
  }
}

export const api = new SolarTrackApi();
export const solarTrackApi = api;
