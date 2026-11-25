# GreenerAfrik ☀️🌿🇳🇬
### GreenerAfrik Energies Limited (RC 9402141) — ...Powering Africa
#### Enterprise Solar Fleet Registry, 10-Stage Installation Tracking & PAYG Remote Contactor Platform

**GreenerAfrik** is a web platform designed for Nigerian solar engineering and energy infrastructure companies. It manages the full lifecycle of residential, commercial, and enterprise solar installations: from inquiry and site survey to commissioning, remote IoT telemetry monitoring, automated fault diagnosis, and Pay-As-You-Go (PAYG) metering with remote hardware contactor control.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** + React 19 + TypeScript |
| **Styling & Design** | **Tailwind CSS**, Forest Green (`#0A5C36`) primary, Sunburst Orange (`#EA580C`) energy accent, Navy (`#0F172A`) contrast, Leaf Green (`#10B981`) healthy, Crimson (`#EF4444`) fault/disconnected |
| **State & Data** | **TanStack React Query**, localStorage persistence, synthetic latency simulation |
| **Data Visualizations** | **Recharts** (24h PV-vs-Load area charts, SOC line charts, stage turnaround bars, collections trend, fault distribution pie) |
| **Interactive Maps** | **Leaflet** + **OpenStreetMap** (Zero API keys required; custom status-colored SVG markers for Nigerian cities) |
| **QR System** | `qrcode.react` (SVG/Canvas rendering, print label & download) + Optical viewfinder scanner with manual ID fallback |
| **PWA & Offline** | Web App Manifest (`manifest.json`), offline detection banner (`OfflineBanner`), local storage queue for field technicians |
| **Form Handling** | **React Hook Form** + **Zod** schema validation |

---

## 📱 Three Apps + One Public Landing Route

The application is structured into four distinct route groups:

### 1. Staff Admin Dashboard (`/admin`)
- **6-Persona Role Switcher**: Switch between `Super Admin`, `Operations Manager`, `Sales`, `Technician`, `Support Agent`, and `Finance` in the top bar. Actions beyond a role's permissions are automatically hidden or disabled.
- **Executive Overview (`/admin`)**: High-level KPIs, 10-stage installation funnel, live Leaflet map of Nigerian installations, urgent telemetry alerts.
- **Customer Registry (`/admin/customers`)**: Searchable and filterable table. 6-step customer onboarding wizard (Details > Site & GPS > Equipment > Package & Payment > Documents > Review & QR Generation).
- **Customer Profile (`/admin/customers/[id]`)**: 8 dedicated tabs (Overview, Installation Timeline, Live Telemetry, Usage Analytics, PAYG & Billing, Support Tickets, Documents, Audit Trail).
- **10-Stage Installations Desk (`/admin/installations`)**: Dual-view Kanban and List views across all 10 stages (`Inquiry` → `Site Survey` → `Quotation` → `Payment Confirmed` → `Procurement` → `Installing` → `Testing & Commissioning` → `Handover` → `Live` → `30-Day Follow-Up`). Slide-out stage drawer with mandatory checklist enforcement, photo uploads, and blocking reason notes.
- **Fleet Monitoring & System Health (`/admin/monitoring` & `/admin/monitoring/[systemId]`)**: Real-time telemetry gauges (PV Power, Battery SOC, Load, Inverter Temp), 24h PV-vs-Load area chart, and the **Automated Diagnosis Card** (automatically classifies Overloads, Under-charged batteries, Offline heartbeat timeouts, and Hardware alarms with self-remediation advice and "Attach to Ticket" actions).
- **Support Tickets Desk (`/admin/tickets`)**: SLA countdown timers (2h, 4h, 24h), priority tags, internal engineering notes vs customer-visible replies, and resolution toggles.
- **PAYG & Defaulters Desk (`/admin/payg`)**: Delinquency queue, single & bulk remote contactor disconnect flows with animated 3-step GSM telemetry progress (`Sent` → `Acknowledged` → `Confirmed`), dual-approval supervisor modal, grace extensions, and manual payment recording.
- **Optical QR Scanner (`/admin/scan`)**: Optical camera viewfinder with animated laser line and demo tag chips to immediately resolve customer profiles.
- **Executive Reports (`/admin/reports`)**: Stage turnaround vs SLA targets, technician leaderboard, monthly PAYG recovery charts, fault pie distribution, and CSV export.
- **Settings & Audit Trail (`/admin/settings`)**: RBAC matrix, stage templates, inverter telemetry trigger thresholds, PAYG automation rules, and the immutable audit log inspector.

### 2. Technician Mobile App (`/tech`)
- Mobile-first shell (optimized for 390px iPhone / Android screens) with bottom navigation:
  - **My Jobs (`/tech`)**: Assigned installations with Google Maps routing links, direct WhatsApp chat links, and stage checklist drawer with offline auto-save.
  - **Scan QR (`/tech/scan`)**: Field QR camera scanner to verify inverter serial numbers on site.
  - **Alerts (`/tech/alerts`)**: Real-time hardware alarm dispatches with "Acknowledge & Accept" triggers.
  - **Profile (`/tech/profile`)**: Technician identity, completed installs, certifications (COREN, Victron, Deye), and manual offline sync queue.

### 3. Customer Self-Service Portal (`/portal`)
- Friendly customer portal with phone + OTP login simulation:
  - **Home (`/portal`)**: Energy snapshot (today's harvest, battery %, home load) and vertical 10-stage installation progress journey with milestone photos.
  - **Usage (`/portal/usage`)**: Weekly solar harvest vs household load charts and Nigerian home energy-saving tips (e.g. staggering iron and AC to prevent overload).
  - **Payments (`/portal/payments`)**: Meter credit balance (days of power remaining), next due date, disconnected status banner, and the **Mock Paystack Modal** (Card, Bank Transfer, USSD *737#) with instant simulated reconnection.
  - **Support (`/portal/support`)**: "My System Isn't Working" self-help troubleshooter with collapsible breaker reset steps, plus direct complaint ticket logging with photo attachments.
  - **Documents (`/portal/documents`)**: Downloadable PDF contracts, 10-year battery warranty certificates, and handover forms.

### 4. Public QR Landing Page (`/q/[token]`)
- **Strict Privacy Guarantees**: Anyone scanning a physical inverter QR code without staff credentials sees **only** the GreenerAfrik verified hardware badge, system ID, inverter capacity, and warranty status. Customer name, phone number, and physical address are **strictly hidden**.
- Includes a direct "Report a Fault" button and a deep-link for authorized staff login.

---

## 🚀 Running Locally

```bash
# 1. Clone repository and navigate to workspace
cd "Solar Track"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Staff Admin:       http://localhost:3000/admin
# Technician App:     http://localhost:3000/tech
# Customer Portal:    http://localhost:3000/portal
# Public QR Landing:  http://localhost:3000/q/ST-LAG-001
```

---

## 🔌 Swapping the Mock API for a Real Backend

The frontend communicates exclusively through `src/lib/api/index.ts`. All methods return typed Promises, simulate realistic network latency (150-350ms), and persist state to `localStorage`.

### Step-by-Step Backend Integration:
1. Set your backend base URL in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://api.greenerafrik.com/v1
   ```
2. In `src/lib/api/index.ts`, replace the `loadFromStorage` and `saveToStorage` helpers with standard `fetch` or `axios` calls:
   ```typescript
   // Example replacement for getCustomers:
   async getCustomers(search?: string, filterState?: string): Promise<Customer[]> {
     const params = new URLSearchParams();
     if (search) params.append("search", search);
     if (filterState && filterState !== "all") params.append("state", filterState);

     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers?${params.toString()}`, {
       headers: { Authorization: `Bearer ${getAuthToken()}` }
     });
     if (!response.ok) throw new Error("Failed to fetch customers");
     return response.json();
   }
   ```

---

## 📡 Backend API Endpoint Contract

| Method | Endpoint | Description | Role Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/customers` | List and search customer registry with state filter | All Staff |
| `POST` | `/customers` | Create new customer, system ID, and initialize installation | Sales, Operations, Admin |
| `GET` | `/customers/:id` | Fetch full customer details, package, and GPS coordinates | All Staff |
| `GET` | `/installations` | Fetch all active and completed 10-stage installations | All Staff |
| `PATCH` | `/installations/:id/stage` | Advance or revert installation stage | Operations, Admin |
| `PATCH` | `/installations/:id/checklist` | Toggle checklist item state with completedBy timestamp | Technician, Operations |
| `POST` | `/installations/:id/photos` | Upload field commissioning photo with GPS timestamp | Technician, Operations |
| `GET` | `/systems/:id/telemetry` | Get real-time PV, battery SOC, home load, and temperature | All Staff |
| `GET` | `/systems/:id/telemetry/24h` | Get 24-hour hourly PV-vs-load generation array | All Staff |
| `GET` | `/systems/:id/diagnosis` | Run automated root-cause diagnosis engine | All Staff, Portal |
| `GET` | `/payg/accounts` | Fetch all PAYG accounts, balances owed, and grace states | Finance, Admin |
| `POST` | `/payg/commands/disconnect` | Issue GSM/MQTT contactor disconnect command | Finance, Admin (Dual Approval) |
| `POST` | `/payg/commands/reconnect` | Issue GSM/MQTT contactor reconnect command | Finance, Admin |
| `POST` | `/payg/extensions` | Grant 1-14 day grace extension with reason | Finance, Admin |
| `POST` | `/payg/payments` | Record payment (Paystack webhook or manual POS/transfer) | Finance, Customer |
| `GET` | `/tickets` | List support tickets with SLA countdowns | Support, Operations, Admin |
| `POST` | `/tickets` | Log new support complaint ticket with telemetry snapshot | Support, Customer |
| `POST` | `/tickets/:id/comments` | Add internal staff note or customer-visible reply | Support, Customer |
| `GET` | `/audit-logs` | Fetch immutable platform audit trail entries | Super Admin, Operations |

---

## 🇳🇬 Nigerian Operational Context & Assumptions

1. **Grid Instability & High Surge Loads**: In Nigeria, public utility power (NEPA/DisCo) fluctuates heavily. Many households run high-wattage resistive appliances (electric pressing irons, boiling rings, pumping machines). The **Diagnosis Engine** specifically identifies simultaneous appliance surges exceeding inverter capacity (e.g. 6.1 kW on a 5.0 kVA inverter).
2. **Inverter Ecosystem**: Most Nigerian installations utilize hybrid inverters from **Victron Energy**, **Deye**, **Sunsynk**, and **Growatt**, paired with LiFePO4 rack-mount lithium batteries.
3. **Dual-Key Governance for Contactor Cutoff**: Disconnecting customer power in Nigeria is highly sensitive. GreenerAfrik enforces a **Dual-Approval Rule**: Bulk disconnections require secondary authorization from an Operations Manager or Super Admin, preventing accidental outages.
4. **Offline Resilience for Field Technicians**: Installation technicians frequently work in low-connectivity areas (e.g., outskirts of Ogun, Oyo, Delta). The Technician view caches all checklist updates and captured photos locally until connection is restored.
5. **Strict Public Privacy**: In accordance with the Nigeria Data Protection Act (NDPA), public QR tags mounted on outdoor inverter casings never expose customer names, phone numbers, or addresses.
