import {
  Customer,
  SolarSystem,
  Installation,
  PAYGAccount,
  Ticket,
  AuditLogEntry,
  InstallationStageId,
  InverterBrand
} from "@/lib/types";
import { INSTALLATION_STAGES } from "./stages";

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust_001",
    name: "Dr. Babatunde Adeleke",
    email: "babatunde.adeleke@gmail.com",
    phone: "+234 803 419 8821",
    state: "Lagos",
    lga: "Eti-Osa",
    address: "14 Admiralty Way, Lekki Phase 1, Lagos",
    gpsCoords: { lat: 6.4474, lng: 3.4731 },
    systemId: "sys_001",
    qrToken: "ST-LGS-001-X9",
    packageType: "Residential 3.5kVA Basic Hybrid",
    registeredDate: "2026-08-10",
    documents: [
      { id: "doc_1", title: "Installation Contract", type: "contract", fileUrl: "#", uploadedAt: "2026-08-10", fileSizeKb: 450 },
      { id: "doc_2", title: "Signed Handover Form", type: "handover_form", fileUrl: "#", uploadedAt: "2026-08-28", fileSizeKb: 380 },
      { id: "doc_3", title: "5-Year Inverter Warranty Certificate", type: "warranty_certificate", fileUrl: "#", uploadedAt: "2026-08-28", fileSizeKb: 520 }
    ]
  },
  {
    id: "cust_002",
    name: "Mrs. Ngozi Okonjo-Eze",
    email: "ngozi.okonjo@consulting.ng",
    phone: "+234 802 918 3344",
    state: "Abuja",
    lga: "Municipal",
    address: "22 Gana Street, Maitama, Abuja",
    gpsCoords: { lat: 9.0820, lng: 7.4985 },
    systemId: "sys_002",
    qrToken: "ST-ABJ-002-K3",
    packageType: "Executive 8.0kVA Sunsynk Tri-Phase",
    registeredDate: "2026-06-14",
    documents: [
      { id: "doc_4", title: "Commercial Power Agreement", type: "contract", fileUrl: "#", uploadedAt: "2026-06-15", fileSizeKb: 620 }
    ]
  },
  {
    id: "cust_003",
    name: "Engr. Emeka Nwosu",
    email: "emeka.nwosu@chevronalumni.org",
    phone: "+234 813 552 9011",
    state: "Rivers",
    lga: "Port Harcourt",
    address: "7 Peter Odili Road, Trans-Amadi, Port Harcourt",
    gpsCoords: { lat: 4.8156, lng: 7.0498 },
    systemId: "sys_003",
    qrToken: "ST-PHC-003-M7",
    packageType: "Premium 5.0kVA Victron BlueSolar",
    registeredDate: "2026-07-22",
    documents: []
  },
  {
    id: "cust_004",
    name: "Chief Olumide Bakare",
    email: "olumide.bakare@heritage.ng",
    phone: "+234 805 110 7765",
    state: "Oyo",
    lga: "Ibadan North",
    address: "18 Awolowo Avenue, Old Bodija, Ibadan",
    gpsCoords: { lat: 7.4266, lng: 3.9056 },
    systemId: "sys_004",
    qrToken: "ST-IBD-004-R2",
    packageType: "Residential 5.0kVA Victron MultiPlus-II",
    registeredDate: "2026-05-18",
    documents: []
  },
  {
    id: "cust_005",
    name: "Alhaji Ibrahim Danjuma",
    email: "ibrahim.danjuma@kntrading.com",
    phone: "+234 809 332 4410",
    state: "Kano",
    lga: "Nasarawa",
    address: "42 Bompai Road, Nasarawa GRA, Kano",
    gpsCoords: { lat: 12.0022, lng: 8.5919 },
    systemId: "sys_005",
    qrToken: "ST-KAN-005-P4",
    packageType: "Industrial 10.0kVA Growatt SPF 5000",
    registeredDate: "2026-04-10",
    documents: []
  },
  {
    id: "cust_006",
    name: "Barrister Funke Akindele",
    email: "funke.akindele@chambers.ng",
    phone: "+234 803 777 9922",
    state: "Lagos",
    lga: "Ikeja",
    address: "9 Isaac John Street, GRA Ikeja, Lagos",
    gpsCoords: { lat: 6.5901, lng: 3.3578 },
    systemId: "sys_006",
    qrToken: "ST-LGS-006-A1",
    packageType: "Executive 8.0kVA Deye Hybrid",
    registeredDate: "2026-09-02",
    documents: []
  },
  {
    id: "cust_007",
    name: "Mal. Abubakar Garba",
    email: "abubakar.garba@kanoagric.ng",
    phone: "+234 814 660 3218",
    state: "Kano",
    lga: "Fagge",
    address: "15 Murtala Mohammed Way, Kano",
    gpsCoords: { lat: 12.0150, lng: 8.5200 },
    systemId: "sys_007",
    qrToken: "ST-KAN-007-G8",
    packageType: "Commercial 5.0kVA Growatt Hybrid",
    registeredDate: "2026-08-01",
    documents: []
  },
  {
    id: "cust_008",
    name: "Hon. Chinedu Eze",
    email: "chinedu.eze@nass.gov.ng",
    phone: "+234 806 889 1234",
    state: "Abuja",
    lga: "Municipal",
    address: "5 Mississippi Street, Maitama, Abuja",
    gpsCoords: { lat: 9.0880, lng: 7.4920 },
    systemId: "sys_008",
    qrToken: "ST-ABJ-008-F5",
    packageType: "Executive 8.0kVA Sunsynk Tri-Phase",
    registeredDate: "2026-03-12",
    documents: []
  },
  {
    id: "cust_009",
    name: "Pastor Dayo Adeyemi",
    email: "dayo.adeyemi@rccgfaith.org",
    phone: "+234 802 334 5566",
    state: "Lagos",
    lga: "Surulere",
    address: "31 Adeniran Ogunsanya Street, Surulere, Lagos",
    gpsCoords: { lat: 6.4989, lng: 3.3562 },
    systemId: "sys_009",
    qrToken: "ST-LGS-009-T2",
    packageType: "Residential 3.5kVA Deye Hybrid",
    registeredDate: "2026-09-15",
    documents: []
  },
  {
    id: "cust_010",
    name: "Hajia Aisha Mohammed",
    email: "aisha.mohammed@wuseboutique.ng",
    phone: "+234 818 221 0099",
    state: "Abuja",
    lga: "Municipal",
    address: "12 Aminu Kano Crescent, Wuse II, Abuja",
    gpsCoords: { lat: 9.0734, lng: 7.4728 },
    systemId: "sys_010",
    qrToken: "ST-ABJ-010-W9",
    packageType: "Executive 5.0kVA Deye Hybrid",
    registeredDate: "2026-07-05",
    documents: []
  },
  {
    id: "cust_011",
    name: "Dr. Somtochukwu Obi",
    email: "somto.obi@medilink.ng",
    phone: "+234 803 999 4432",
    state: "Rivers",
    lga: "Port Harcourt",
    address: "8 Tombia Street, GRA Phase 2, Port Harcourt",
    gpsCoords: { lat: 4.8211, lng: 7.0055 },
    systemId: "sys_011",
    qrToken: "ST-PHC-011-B3",
    packageType: "Commercial 10.0kVA Victron Quattro",
    registeredDate: "2026-05-30",
    documents: []
  },
  {
    id: "cust_012",
    name: "Prof. Kayode Alabi",
    email: "kayode.alabi@ui.edu.ng",
    phone: "+234 805 443 2189",
    state: "Oyo",
    lga: "Ibadan South-West",
    address: "24 Ring Road, Oluyole Estate, Ibadan",
    gpsCoords: { lat: 7.3621, lng: 3.8642 },
    systemId: "sys_012",
    qrToken: "ST-IBD-012-Y7",
    packageType: "Residential 3.5kVA Growatt SPF",
    registeredDate: "2026-08-20",
    documents: []
  },
  {
    id: "cust_013",
    name: "Capt. Ken Saro-Wiwa Jr.",
    email: "ken.saro@atlanticmaritime.com",
    phone: "+234 809 881 7720",
    state: "Lagos",
    lga: "Ibeju-Lekki",
    address: "Plot 19, Beechwood Estate, Bogije, Ibeju-Lekki",
    gpsCoords: { lat: 6.4712, lng: 3.7123 },
    systemId: "sys_013",
    qrToken: "ST-LGS-013-C6",
    packageType: "Residential 5.0kVA Deye Hybrid",
    registeredDate: "2026-09-25",
    documents: []
  },
  {
    id: "cust_014",
    name: "Mrs. Folashade Tinubu-Ojo",
    email: "folashade.market@lagostraders.org",
    phone: "+234 802 555 1212",
    state: "Lagos",
    lga: "Lagos Island",
    address: "4 Broad Street, Lagos Island, Lagos",
    gpsCoords: { lat: 6.4531, lng: 3.3958 },
    systemId: "sys_014",
    qrToken: "ST-LGS-014-D4",
    packageType: "Commercial 10.0kVA Sunsynk Hybrid",
    registeredDate: "2026-10-01",
    documents: []
  },
  {
    id: "cust_015",
    name: "Alhaji Bello Kano",
    email: "bello.kano@arewatex.ng",
    phone: "+234 814 112 3345",
    state: "Kano",
    lga: "Dala",
    address: "5 Kofar Ruwa Market Road, Kano",
    gpsCoords: { lat: 12.0220, lng: 8.5110 },
    systemId: "sys_015",
    qrToken: "ST-KAN-015-E8",
    packageType: "Commercial 5.0kVA Growatt Hybrid",
    registeredDate: "2026-10-10",
    documents: []
  },
  {
    id: "cust_016",
    name: "Arc. Ifeanyi Okeke",
    email: "ifeanyi.okeke@studioarch.ng",
    phone: "+234 803 221 4455",
    state: "Abuja",
    lga: "Municipal",
    address: "14 3rd Avenue, Gwarinpa Estate, Abuja",
    gpsCoords: { lat: 9.1122, lng: 7.4110 },
    systemId: "sys_016",
    qrToken: "ST-ABJ-016-Z3",
    packageType: "Executive 5.0kVA Deye Hybrid",
    registeredDate: "2026-10-15",
    documents: []
  },
  {
    id: "cust_017",
    name: "Mrs. Bisi Akande",
    email: "bisi.akande@pharmahealth.ng",
    phone: "+234 805 776 1123",
    state: "Oyo",
    lga: "Ibadan North",
    address: "7 Agodi GRA, Agodi, Ibadan",
    gpsCoords: { lat: 7.4150, lng: 3.9180 },
    systemId: "sys_017",
    qrToken: "ST-IBD-017-H9",
    packageType: "Residential 3.5kVA Victron MultiPlus",
    registeredDate: "2026-10-20",
    documents: []
  },
  {
    id: "cust_018",
    name: "Engr. Tamuno Briggs",
    email: "tamuno.briggs@oilserv.com",
    phone: "+234 818 998 2211",
    state: "Rivers",
    lga: "Port Harcourt",
    address: "11 Stadium Road, Rumuomasi, Port Harcourt",
    gpsCoords: { lat: 4.8390, lng: 7.0280 },
    systemId: "sys_018",
    qrToken: "ST-PHC-018-K1",
    packageType: "Executive 8.0kVA Sunsynk Hybrid",
    registeredDate: "2026-10-25",
    documents: []
  },
  {
    id: "cust_019",
    name: "Mallam Sanusi Lamido",
    email: "sanusi.lamido@financialadvisory.ng",
    phone: "+234 809 665 4433",
    state: "Kano",
    lga: "Nasarawa",
    address: "28 Race Course Road, Nasarawa, Kano",
    gpsCoords: { lat: 12.0110, lng: 8.5420 },
    systemId: "sys_019",
    qrToken: "ST-KAN-019-L5",
    packageType: "Commercial 10.0kVA Victron Quattro",
    registeredDate: "2026-10-28",
    documents: []
  },
  {
    id: "cust_020",
    name: "Chief Anthony Anenih Jr.",
    email: "anthony.anenih@lagosports.ng",
    phone: "+234 802 887 6655",
    state: "Lagos",
    lga: "Eti-Osa",
    address: "5 Bourdillon Road, Ikoyi, Lagos",
    gpsCoords: { lat: 6.4490, lng: 3.4350 },
    systemId: "sys_020",
    qrToken: "ST-LGS-020-M2",
    packageType: "Executive 10.0kVA Sunsynk Tri-Phase",
    registeredDate: "2026-11-01",
    documents: []
  },
  {
    id: "cust_021",
    name: "Dr. Hadiza Bala",
    email: "hadiza.bala@healthclinic.ng",
    phone: "+234 813 445 6677",
    state: "Abuja",
    lga: "Municipal",
    address: "18 Yakubu Gowon Crescent, Asokoro, Abuja",
    gpsCoords: { lat: 9.0520, lng: 7.5250 },
    systemId: "sys_021",
    qrToken: "ST-ABJ-021-N8",
    packageType: "Executive 8.0kVA Deye Hybrid",
    registeredDate: "2026-11-05",
    documents: []
  },
  {
    id: "cust_022",
    name: "Mr. Seyi Makinde Ojo",
    email: "seyi.ojo@agritech.ng",
    phone: "+234 805 223 9988",
    state: "Oyo",
    lga: "Ibarapa",
    address: "Km 4 Ibadan-Abeokuta Expressway, Ibadan",
    gpsCoords: { lat: 7.3750, lng: 3.8210 },
    systemId: "sys_022",
    qrToken: "ST-IBD-022-Q4",
    packageType: "Commercial 5.0kVA Growatt Hybrid",
    registeredDate: "2026-11-10",
    documents: []
  },
  {
    id: "cust_023",
    name: "Lady Gloria Fiberesima",
    email: "gloria.fiberesima@bonnyoil.ng",
    phone: "+234 803 119 0088",
    state: "Rivers",
    lga: "Port Harcourt",
    address: "3 Woji Road, GRA Phase 2, Port Harcourt",
    gpsCoords: { lat: 4.8190, lng: 7.0120 },
    systemId: "sys_023",
    qrToken: "ST-PHC-023-V6",
    packageType: "Residential 3.5kVA Deye Hybrid",
    registeredDate: "2026-11-15",
    documents: []
  },
  {
    id: "cust_024",
    name: "Alhaji Usman Dantata",
    email: "usman.dantata@kanoflour.ng",
    phone: "+234 814 556 7788",
    state: "Kano",
    lga: "Kano Municipal",
    address: "8 Zoo Road, Kano",
    gpsCoords: { lat: 11.9750, lng: 8.5290 },
    systemId: "sys_024",
    qrToken: "ST-KAN-024-X1",
    packageType: "Residential 5.0kVA Victron MultiPlus",
    registeredDate: "2026-11-18",
    documents: []
  },
  {
    id: "cust_025",
    name: "Barrister Seyi Sowore",
    email: "seyi.sowore@legaladvocates.ng",
    phone: "+234 809 223 3445",
    state: "Lagos",
    lga: "Eti-Osa",
    address: "22 Chevron Drive, Lekki Peninsula, Lagos",
    gpsCoords: { lat: 6.4380, lng: 3.5280 },
    systemId: "sys_025",
    qrToken: "ST-LGS-025-W5",
    packageType: "Executive 8.0kVA Sunsynk Hybrid",
    registeredDate: "2026-11-20",
    documents: []
  }
];

export const MOCK_SYSTEMS: SolarSystem[] = [
  {
    id: "sys_001",
    customerId: "cust_001",
    qrToken: "ST-LGS-001-X9",
    inverterBrand: "Deye",
    inverterModel: "SUN-3.6K-SG03LP1-EU",
    inverterCapacityKva: 3.5,
    inverterSerialNumber: "DEYE-2026-08819A",
    batteryBrand: "Felicity Solar",
    batteryCapacityKwh: 5.12,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "FEL-LPBF48100-881",
    solarPanelsCount: 8,
    solarPanelsWattage: 550,
    totalPvCapacityKw: 4.4,
    status: "overload", // Overload Anomaly Scenario
    installationDate: "2026-08-28",
    warrantyExpiryDate: "2031-08-28"
  },
  {
    id: "sys_002",
    customerId: "cust_002",
    qrToken: "ST-ABJ-002-K3",
    inverterBrand: "Sunsynk",
    inverterModel: "SUNSYNK-8K-SG01LP1",
    inverterCapacityKva: 8.0,
    inverterSerialNumber: "SYN-8K-2026-4410",
    batteryBrand: "Pylontech",
    batteryCapacityKwh: 10.6,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "PYL-US5000-0982",
    solarPanelsCount: 16,
    solarPanelsWattage: 550,
    totalPvCapacityKw: 8.8,
    status: "online",
    installationDate: "2026-07-02",
    warrantyExpiryDate: "2031-07-02"
  },
  {
    id: "sys_003",
    customerId: "cust_003",
    qrToken: "ST-PHC-003-M7",
    inverterBrand: "Victron",
    inverterModel: "MultiPlus-II 48/5000/70-50",
    inverterCapacityKva: 5.0,
    inverterSerialNumber: "VIC-MP2-2026-901",
    batteryBrand: "FreedomWon",
    batteryCapacityKwh: 10.0,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "FW-LITE-HOME-10",
    solarPanelsCount: 10,
    solarPanelsWattage: 550,
    totalPvCapacityKw: 5.5,
    status: "online",
    installationDate: "2026-08-12",
    warrantyExpiryDate: "2031-08-12"
  },
  {
    id: "sys_004",
    customerId: "cust_004",
    qrToken: "ST-IBD-004-R2",
    inverterBrand: "Victron",
    inverterModel: "MultiPlus-II 48/5000/70-50",
    inverterCapacityKva: 5.0,
    inverterSerialNumber: "VIC-MP2-2026-339",
    batteryBrand: "Felicity Solar",
    batteryCapacityKwh: 7.5,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "FEL-LPBF48150-120",
    solarPanelsCount: 8,
    solarPanelsWattage: 540,
    totalPvCapacityKw: 4.32,
    status: "low_battery", // Under-Charged Anomaly Scenario
    installationDate: "2026-06-05",
    warrantyExpiryDate: "2031-06-05"
  },
  {
    id: "sys_005",
    customerId: "cust_005",
    qrToken: "ST-KAN-005-P4",
    inverterBrand: "Growatt",
    inverterModel: "SPF 5000 ES Dual",
    inverterCapacityKva: 10.0,
    inverterSerialNumber: "GRO-SPF10K-2026-11",
    batteryBrand: "Dyness",
    batteryCapacityKwh: 14.4,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "DYN-BX51100-33",
    solarPanelsCount: 20,
    solarPanelsWattage: 550,
    totalPvCapacityKw: 11.0,
    status: "online",
    installationDate: "2026-05-02",
    warrantyExpiryDate: "2031-05-02"
  },
  {
    id: "sys_006",
    customerId: "cust_006",
    qrToken: "ST-LGS-006-A1",
    inverterBrand: "Deye",
    inverterModel: "SUN-8K-SG01LP1-EU",
    inverterCapacityKva: 8.0,
    inverterSerialNumber: "DEYE-8K-2026-8802",
    batteryBrand: "Pylontech",
    batteryCapacityKwh: 10.6,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "PYL-US5000-8802",
    solarPanelsCount: 16,
    solarPanelsWattage: 550,
    totalPvCapacityKw: 8.8,
    status: "online",
    installationDate: "2026-09-20",
    warrantyExpiryDate: "2031-09-20"
  },
  {
    id: "sys_007",
    customerId: "cust_007",
    qrToken: "ST-KAN-007-G8",
    inverterBrand: "Growatt",
    inverterModel: "SPF 5000 ES",
    inverterCapacityKva: 5.0,
    inverterSerialNumber: "GRO-SPF5K-2026-77",
    batteryBrand: "Felicity Solar",
    batteryCapacityKwh: 5.12,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "FEL-LPBF-771",
    solarPanelsCount: 10,
    solarPanelsWattage: 550,
    totalPvCapacityKw: 5.5,
    status: "offline", // Offline Anomaly Scenario
    installationDate: "2026-08-19",
    warrantyExpiryDate: "2031-08-19"
  },
  {
    id: "sys_008",
    customerId: "cust_008",
    qrToken: "ST-ABJ-008-F5",
    inverterBrand: "Sunsynk",
    inverterModel: "SUNSYNK-8K-SG01LP1",
    inverterCapacityKva: 8.0,
    inverterSerialNumber: "SYN-8K-2026-004",
    batteryBrand: "Pylontech",
    batteryCapacityKwh: 10.6,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "PYL-US5000-004",
    solarPanelsCount: 16,
    solarPanelsWattage: 550,
    totalPvCapacityKw: 8.8,
    status: "hardware_fault", // Hardware Fault Anomaly Scenario
    installationDate: "2026-04-01",
    warrantyExpiryDate: "2031-04-01"
  },
  {
    id: "sys_009",
    customerId: "cust_009",
    qrToken: "ST-LGS-009-T2",
    inverterBrand: "Deye",
    inverterModel: "SUN-3.6K-SG03LP1-EU",
    inverterCapacityKva: 3.5,
    inverterSerialNumber: "DEYE-3K-2026-991",
    batteryBrand: "Felicity Solar",
    batteryCapacityKwh: 5.12,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "FEL-LPBF-991",
    solarPanelsCount: 8,
    solarPanelsWattage: 550,
    totalPvCapacityKw: 4.4,
    status: "online",
    installationDate: "2026-09-29",
    warrantyExpiryDate: "2031-09-29"
  },
  {
    id: "sys_010",
    customerId: "cust_010",
    qrToken: "ST-ABJ-010-W9",
    inverterBrand: "Deye",
    inverterModel: "SUN-5K-SG03LP1-EU",
    inverterCapacityKva: 5.0,
    inverterSerialNumber: "DEYE-5K-2026-101",
    batteryBrand: "Pylontech",
    batteryCapacityKwh: 7.2,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "PYL-UP5000-101",
    solarPanelsCount: 10,
    solarPanelsWattage: 550,
    totalPvCapacityKw: 5.5,
    status: "online",
    installationDate: "2026-07-28",
    warrantyExpiryDate: "2031-07-28"
  },
  {
    id: "sys_011",
    customerId: "cust_011",
    qrToken: "ST-PHC-011-B3",
    inverterBrand: "Victron",
    inverterModel: "Quattro 48/10000/140-100",
    inverterCapacityKva: 10.0,
    inverterSerialNumber: "VIC-QTR-2026-111",
    batteryBrand: "FreedomWon",
    batteryCapacityKwh: 20.0,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "FW-LITE-HOME-20",
    solarPanelsCount: 20,
    solarPanelsWattage: 550,
    totalPvCapacityKw: 11.0,
    status: "online",
    installationDate: "2026-06-25",
    warrantyExpiryDate: "2031-06-25"
  },
  {
    id: "sys_012",
    customerId: "cust_012",
    qrToken: "ST-IBD-012-Y7",
    inverterBrand: "Growatt",
    inverterModel: "SPF 3500 ES",
    inverterCapacityKva: 3.5,
    inverterSerialNumber: "GRO-SPF3K-2026-12",
    batteryBrand: "Felicity Solar",
    batteryCapacityKwh: 5.12,
    batteryChemistry: "LiFePO4",
    batterySerialNumber: "FEL-LPBF-121",
    solarPanelsCount: 8,
    solarPanelsWattage: 550,
    totalPvCapacityKw: 4.4,
    status: "online",
    installationDate: "2026-09-08",
    warrantyExpiryDate: "2031-09-08"
  },
  // Systems for in-flight installations (13 - 25)
  ...Array.from({ length: 13 }, (_, i) => {
    const idx = 13 + i;
    const custId = `cust_0${idx < 10 ? "0" + idx : idx}`;
    const brands: InverterBrand[] = ["Deye", "Growatt", "Victron", "Sunsynk"];
    const brand = brands[i % brands.length];
    return {
      id: `sys_0${idx < 10 ? "0" + idx : idx}`,
      customerId: custId,
      qrToken: `ST-STG-0${idx}-Q${i}`,
      inverterBrand: brand,
      inverterModel: `${brand}-Pro-${i % 2 === 0 ? "5K" : "8K"}`,
      inverterCapacityKva: i % 2 === 0 ? 5.0 : 8.0,
      inverterSerialNumber: `${brand.toUpperCase()}-SN-2026-${100 + i}`,
      batteryBrand: "Felicity Solar",
      batteryCapacityKwh: i % 2 === 0 ? 7.5 : 10.0,
      batteryChemistry: "LiFePO4" as const,
      batterySerialNumber: `FEL-BAT-2026-${200 + i}`,
      solarPanelsCount: i % 2 === 0 ? 10 : 16,
      solarPanelsWattage: 550,
      totalPvCapacityKw: i % 2 === 0 ? 5.5 : 8.8,
      status: "online" as const,
      warrantyExpiryDate: "2031-11-24"
    };
  })
];

export const MOCK_PAYG_ACCOUNTS: PAYGAccount[] = [
  {
    id: "payg_001",
    customerId: "cust_001",
    systemId: "sys_001",
    planName: "PAYG 12 Months",
    totalCostNaira: 3600000,
    downPaymentNaira: 1080000,
    monthlyInstallmentNaira: 210000,
    balanceOwedNaira: 1260000,
    daysRemainingOfPower: 14,
    gracePeriodDays: 3,
    graceDaysUsed: 0,
    status: "active",
    lastPaymentDate: "2026-11-10",
    nextDueDate: "2026-12-10",
    isAutoDisconnectEnabled: true
  },
  {
    id: "payg_002",
    customerId: "cust_002",
    systemId: "sys_002",
    planName: "Outright",
    totalCostNaira: 7200000,
    downPaymentNaira: 7200000,
    monthlyInstallmentNaira: 0,
    balanceOwedNaira: 0,
    daysRemainingOfPower: 9999,
    gracePeriodDays: 0,
    graceDaysUsed: 0,
    status: "completed",
    lastPaymentDate: "2026-06-15",
    nextDueDate: "2099-01-01",
    isAutoDisconnectEnabled: false
  },
  {
    id: "payg_003",
    customerId: "cust_003",
    systemId: "sys_003",
    planName: "PAYG 24 Months",
    totalCostNaira: 5400000,
    downPaymentNaira: 1620000,
    monthlyInstallmentNaira: 157500,
    balanceOwedNaira: 3150000,
    daysRemainingOfPower: 22,
    gracePeriodDays: 3,
    graceDaysUsed: 0,
    status: "active",
    lastPaymentDate: "2026-11-16",
    nextDueDate: "2026-12-16",
    isAutoDisconnectEnabled: true
  },
  // DEFAULTER 1: in Grace Period (cust_004)
  {
    id: "payg_004",
    customerId: "cust_004",
    systemId: "sys_004",
    planName: "PAYG 12 Months",
    totalCostNaira: 4800000,
    downPaymentNaira: 1440000,
    monthlyInstallmentNaira: 280000,
    balanceOwedNaira: 1680000,
    daysRemainingOfPower: 0,
    gracePeriodDays: 5,
    graceDaysUsed: 2, // 2 of 5 days used
    status: "grace_period",
    lastPaymentDate: "2026-10-18",
    nextDueDate: "2026-11-18",
    isAutoDisconnectEnabled: true
  },
  // DEFAULTER 2: in Grace Period (cust_009)
  {
    id: "payg_009",
    customerId: "cust_009",
    systemId: "sys_009",
    planName: "PAYG 12 Months",
    totalCostNaira: 3600000,
    downPaymentNaira: 1080000,
    monthlyInstallmentNaira: 210000,
    balanceOwedNaira: 1890000,
    daysRemainingOfPower: 0,
    gracePeriodDays: 3,
    graceDaysUsed: 1,
    status: "grace_period",
    lastPaymentDate: "2026-10-22",
    nextDueDate: "2026-11-22",
    isAutoDisconnectEnabled: true
  },
  // DEFAULTER 3: Scheduled for Disconnect (cust_007)
  {
    id: "payg_007",
    customerId: "cust_007",
    systemId: "sys_007",
    planName: "PAYG 12 Months",
    totalCostNaira: 4800000,
    downPaymentNaira: 1440000,
    monthlyInstallmentNaira: 280000,
    balanceOwedNaira: 2240000,
    daysRemainingOfPower: 0,
    gracePeriodDays: 3,
    graceDaysUsed: 3,
    status: "pending_disconnect",
    lastPaymentDate: "2026-10-15",
    nextDueDate: "2026-11-15",
    isAutoDisconnectEnabled: true
  },
  // DEFAULTER 4: Scheduled for Disconnect (cust_010)
  {
    id: "payg_010",
    customerId: "cust_010",
    systemId: "sys_010",
    planName: "PAYG 24 Months",
    totalCostNaira: 5200000,
    downPaymentNaira: 1560000,
    monthlyInstallmentNaira: 152000,
    balanceOwedNaira: 2736000,
    daysRemainingOfPower: 0,
    gracePeriodDays: 3,
    graceDaysUsed: 3,
    status: "pending_disconnect",
    lastPaymentDate: "2026-10-12",
    nextDueDate: "2026-11-12",
    isAutoDisconnectEnabled: true
  },
  // DEFAULTER 5: Actively Disconnected (cust_012)
  {
    id: "payg_012",
    customerId: "cust_012",
    systemId: "sys_012",
    planName: "PAYG 12 Months",
    totalCostNaira: 3500000,
    downPaymentNaira: 1050000,
    monthlyInstallmentNaira: 204000,
    balanceOwedNaira: 1632000,
    daysRemainingOfPower: 0,
    gracePeriodDays: 3,
    graceDaysUsed: 3,
    status: "disconnected",
    lastPaymentDate: "2026-09-28",
    nextDueDate: "2026-10-28",
    isAutoDisconnectEnabled: true
  },
  // DEFAULTER 6: Granted Medical Extension (cust_005)
  {
    id: "payg_005",
    customerId: "cust_005",
    systemId: "sys_005",
    planName: "PAYG 24 Months",
    totalCostNaira: 8500000,
    downPaymentNaira: 2550000,
    monthlyInstallmentNaira: 248000,
    balanceOwedNaira: 4464000,
    daysRemainingOfPower: 5,
    gracePeriodDays: 5,
    graceDaysUsed: 0,
    status: "active",
    lastPaymentDate: "2026-10-10",
    nextDueDate: "2026-11-29",
    activeExtensionUntil: "2026-11-29",
    extensionReason: "Hospitalized family member, approved 7-day medical extension",
    isAutoDisconnectEnabled: true
  }
];

export const MOCK_INSTALLATIONS: Installation[] = [
  // Live installations (1 - 6)
  ...MOCK_CUSTOMERS.slice(0, 6).map((cust, i) => {
    const stageId: InstallationStageId = i === 3 ? "follow_up_30d" : "live";
    const checklists: Record<InstallationStageId, any[]> = {} as any;
    INSTALLATION_STAGES.forEach((stg) => {
      checklists[stg.id] = stg.mandatoryChecklist.map((item, idx) => ({
        id: `${stg.id}_chk_${idx}`,
        text: item,
        isMandatory: true,
        isCompleted: true,
        completedAt: "2026-08-25T10:00:00Z",
        completedBy: "Tunde Bakare"
      }));
    });

    return {
      id: `inst_00${i + 1}`,
      customerId: cust.id,
      systemId: cust.systemId,
      currentStage: stageId,
      assignedTechnicianId: "usr_technician",
      assignedTechnicianName: "Tunde Bakare",
      daysInCurrentStage: 85 + i,
      isOverdue: false,
      notes: "System commissioned and operating smoothly under remote telemetry.",
      estimatedCompletionDate: "2026-08-28",
      photos: [
        {
          id: `pho_${i}_1`,
          url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
          caption: "Rooftop 16-panel solar array with tilt angle verification",
          stageId: "installing" as const,
          uploadedAt: "2026-08-20T14:30:00Z",
          uploadedBy: "Tunde Bakare"
        },
        {
          id: `pho_${i}_2`,
          url: "https://images.unsplash.com/photo-1558441719-8b489c63f7d1?w=600&auto=format&fit=crop&q=80",
          caption: "Inverter and LiFePO4 battery wall mount with DC isolator",
          stageId: "testing_commissioning" as const,
          uploadedAt: "2026-08-26T11:15:00Z",
          uploadedBy: "Tunde Bakare"
        }
      ],
      stageHistory: INSTALLATION_STAGES.map((stg) => ({
        stageId: stg.id,
        enteredAt: "2026-08-01T08:00:00Z",
        completedAt: "2026-08-28T16:00:00Z",
        completedBy: "Tunde Bakare",
        notes: `Completed stage ${stg.label}`
      })),
      checklists
    };
  }),

  // Spread remaining customers across other stages
  // cust_007 to cust_025
  ...MOCK_CUSTOMERS.slice(6).map((cust, i) => {
    const stageIds: InstallationStageId[] = [
      "inquiry",
      "site_survey",
      "quotation",
      "payment_confirmed",
      "procurement_dispatch",
      "installing",
      "testing_commissioning",
      "handover",
      "live",
      "follow_up_30d"
    ];
    const currentStage = stageIds[i % stageIds.length];
    const stageDef = INSTALLATION_STAGES.find((s) => s.id === currentStage)!;
    const isOverdue = i % 3 === 0;

    const checklists: Record<InstallationStageId, any[]> = {} as any;
    INSTALLATION_STAGES.forEach((stg) => {
      const isPast = stg.order < stageDef.order;
      const isCurrent = stg.order === stageDef.order;
      checklists[stg.id] = stg.mandatoryChecklist.map((item, idx) => ({
        id: `${stg.id}_chk_${idx}`,
        text: item,
        isMandatory: true,
        isCompleted: isPast ? true : isCurrent ? idx < 1 : false,
        completedAt: isPast ? "2026-10-15T09:00:00Z" : undefined,
        completedBy: isPast ? "Tunde Bakare" : undefined
      }));
    });

    return {
      id: `inst_0${i + 7}`,
      customerId: cust.id,
      systemId: cust.systemId,
      currentStage,
      assignedTechnicianId: "usr_technician",
      assignedTechnicianName: "Tunde Bakare",
      daysInCurrentStage: isOverdue ? stageDef.slaDays + 2 : Math.max(1, stageDef.slaDays - 1),
      isOverdue,
      notes: isOverdue ? "Customer delayed delivery confirmation due to site renovation." : "Progressing normally.",
      blockedReason: isOverdue ? "Pending main DB box replacement by building contractor" : undefined,
      estimatedCompletionDate: "2026-12-05",
      photos: [
        {
          id: `pho_in_${i}_1`,
          url: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80",
          caption: "Site survey roof angle measurement",
          stageId: "site_survey" as const,
          uploadedAt: "2026-11-02T10:00:00Z",
          uploadedBy: "Tunde Bakare"
        }
      ],
      stageHistory: INSTALLATION_STAGES.filter((s) => s.order <= stageDef.order).map((stg) => ({
        stageId: stg.id,
        enteredAt: "2026-11-01T08:00:00Z",
        completedAt: stg.order < stageDef.order ? "2026-11-10T16:00:00Z" : undefined,
        completedBy: "Tunde Bakare"
      })),
      checklists
    };
  })
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "tkt_001",
    ticketNumber: "TK-2026-0881",
    customerId: "cust_001",
    customerName: "Dr. Babatunde Adeleke",
    customerPhone: "+234 803 419 8821",
    systemId: "sys_001",
    category: "Overload",
    priority: "high",
    status: "in_progress",
    subject: "Inverter trips repeatedly in afternoon when AC is on",
    description: "Whenever we turn on the 1.5HP air conditioner in the master bedroom while ironing, the solar inverter emits a beeping sound and powers off for 30 seconds before resetting.",
    assignedToName: "Tunde Bakare",
    assignedToRole: "technician",
    slaDeadline: "2026-11-25T16:00:00Z",
    createdAt: "2026-11-24T08:30:00Z",
    linkedDiagnosis: {
      cause: "OVERLOAD",
      confidence: 96,
      headline: "Inverter AC Overload Trip (3.5 kVA capacity exceeded)",
      detailedAnalysis: "Peak active load reached 4.42 kW at 14:15, exceeding inverter rated limit of 3.50 kW by 26%. Cause: concurrent inductive surge from 1.5HP AC compressor and 1.8kW ironing element.",
      timestampOccurred: "2026-11-24T14:15:00",
      metricsSnapshot: {
        peakLoadWatts: 4420,
        ratedCapacityWatts: 3500,
        inverterTempCelsius: 58,
        batterySocPercent: 78
      },
      recommendedActions: [
        "Educate customer to stagger high-wattage appliance usage (ironing vs. AC)",
        "Recommend upgrading to 5.0kVA hybrid inverter if full simultaneous load is required",
        "Inspect distribution box priority breaker separation"
      ],
      customerAdviceSms: "SolarTrack Advice: Your solar inverter tripped because simultaneous power use reached 4.4 kW (limit is 3.5 kW). Please turn off your electric iron before running the bedroom AC."
    },
    messages: [
      {
        id: "msg_1",
        senderName: "Dr. Babatunde Adeleke",
        senderRole: "customer",
        isInternal: false,
        content: "Good day, the light keeps tripping every afternoon around 2 PM.",
        createdAt: "2026-11-24T08:30:00Z"
      },
      {
        id: "msg_2",
        senderName: "Zainab Bello",
        senderRole: "staff",
        isInternal: true,
        content: "Automated telemetry diagnosis confirmed 4.4 kW overload trip at 14:15. Inverter capacity is 3.5 kW. Assigned to field technician Tunde Bakare.",
        createdAt: "2026-11-24T08:45:00Z"
      }
    ]
  },
  {
    id: "tkt_002",
    ticketNumber: "TK-2026-0882",
    customerId: "cust_004",
    customerName: "Chief Olumide Bakare",
    customerPhone: "+234 805 110 7765",
    systemId: "sys_004",
    category: "Battery/Charging",
    priority: "critical",
    status: "open",
    subject: "Battery does not last through the night (dead by 3 AM)",
    description: "The system powers off completely around 3:00 AM every night and the red battery light flashes until sunrise.",
    assignedToName: "Zainab Bello",
    assignedToRole: "support_agent",
    slaDeadline: "2026-11-25T12:00:00Z",
    createdAt: "2026-11-24T06:15:00Z",
    linkedDiagnosis: {
      cause: "UNDER_CHARGED",
      confidence: 94,
      headline: "Sustained Low Battery State of Charge (Under-Harvest)",
      detailedAnalysis: "Battery SOC has failed to recharge past 32% for the past 3 consecutive days. Sustained overnight load of 920W (two deep freezers) exhausts remaining 2.4 kWh capacity by 03:10 AM.",
      timestampOccurred: "2026-11-24T03:10:00",
      metricsSnapshot: {
        sustainedLowSocDays: 3,
        batterySocPercent: 18,
        inverterTempCelsius: 38
      },
      recommendedActions: [
        "Check solar panel array for dust or partial shading from tree canopy",
        "Enable grid boost charge via customer app between 12 AM - 4 AM if DisCo is available",
        "Turn off secondary deep freezer after 10 PM"
      ],
      customerAdviceSms: "SolarTrack Notice: Your battery is currently under-charged due to 3 days of heavy cloud cover and high night consumption. Please unplug deep freezers at night or enable grid boost charging."
    },
    messages: [
      {
        id: "msg_3",
        senderName: "Chief Olumide Bakare",
        senderRole: "customer",
        isInternal: false,
        content: "Please help, our lights went out in the dead of the night again.",
        createdAt: "2026-11-24T06:15:00Z"
      }
    ]
  },
  {
    id: "tkt_003",
    ticketNumber: "TK-2026-0883",
    customerId: "cust_007",
    customerName: "Mal. Abubakar Garba",
    customerPhone: "+234 814 660 3218",
    systemId: "sys_007",
    category: "Hardware",
    priority: "medium",
    status: "assigned",
    subject: "System Datalogger Offline - No app telemetry",
    description: "Customer reports customer portal app shows 'Offline' since 8:30 AM this morning.",
    assignedToName: "Tunde Bakare",
    assignedToRole: "technician",
    slaDeadline: "2026-11-26T18:00:00Z",
    createdAt: "2026-11-24T09:10:00Z",
    linkedDiagnosis: {
      cause: "OFFLINE",
      confidence: 99,
      headline: "IoT Datalogger Heartbeat Lost",
      detailedAnalysis: "No telemetry packets received for over 4 hours. Inverter AC supply may still be active locally, but cellular 4G gateway is unreachable.",
      metricsSnapshot: {
        lastSeenMinutesAgo: 260
      },
      recommendedActions: [
        "Power cycle the external USB Wi-Fi / 4G datalogger",
        "Verify cellular SIM card data subscription balance",
        "Check antenna connection on inverter side port"
      ],
      customerAdviceSms: "SolarTrack Update: Your solar monitor is currently offline. Please unplug and re-insert the small blue monitoring stick on the right side of your inverter."
    },
    messages: []
  },
  {
    id: "tkt_004",
    ticketNumber: "TK-2026-0884",
    customerId: "cust_008",
    customerName: "Hon. Chinedu Eze",
    customerPhone: "+234 806 889 1234",
    systemId: "sys_008",
    category: "Hardware",
    priority: "critical",
    status: "in_progress",
    subject: "Inverter Overheating Alarm & Fan Error Code E04",
    description: "Inverter internal temperature reached 79°C under load. Cooling fan stalled.",
    assignedToName: "Tunde Bakare",
    assignedToRole: "technician",
    slaDeadline: "2026-11-25T10:00:00Z",
    createdAt: "2026-11-24T07:45:00Z",
    linkedDiagnosis: {
      cause: "HARDWARE_FAULT",
      confidence: 98,
      headline: "Inverter High-Temperature Trip (Fan Failure Code E04)",
      detailedAnalysis: "Internal heatsink temperature exceeded thermal threshold (79°C vs 65°C max normal). Telemetry reports fan RPM = 0. Probable dust blockage or fan motor failure.",
      metricsSnapshot: {
        inverterTempCelsius: 79,
        activeErrorCode: "E04_FAN_STALL"
      },
      recommendedActions: [
        "Dispatch emergency field service to clear ventilation grill",
        "Replace 80mm cooling fan unit",
        "Instruct customer to reduce load until technician arrives"
      ],
      customerAdviceSms: "URGENT SolarTrack Notice: Your inverter cooling fan has stopped and the system is overheating. Please switch off heavy appliances immediately while our technician is en route."
    },
    messages: []
  }
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud_001",
    timestamp: "2026-11-24T09:30:15Z",
    userId: "usr_finance",
    userName: "Olumide Daniels",
    userRole: "finance",
    action: "GRANT_PAYG_EXTENSION",
    targetEntity: "PAYGAccount",
    targetId: "payg_005",
    details: "Granted 7-day payment extension to Alhaji Ibrahim Danjuma (Medical emergency)",
    ipAddress: "102.89.44.12"
  },
  {
    id: "aud_002",
    timestamp: "2026-11-24T08:45:22Z",
    userId: "usr_ops_mgr",
    userName: "Amina Yusuf",
    userRole: "operations_manager",
    action: "UPDATE_INSTALLATION_STAGE",
    targetEntity: "Installation",
    targetId: "inst_001",
    details: "Advanced installation from Handover to Live following signed certificate",
    ipAddress: "197.210.65.180"
  },
  {
    id: "aud_003",
    timestamp: "2026-11-23T16:10:05Z",
    userId: "usr_super_admin",
    userName: "Engr. Femi Adeleke",
    userRole: "super_admin",
    action: "REMOTE_DISCONNECT",
    targetEntity: "SolarSystem",
    targetId: "sys_012",
    details: "Authorized remote disconnect for Prof. Kayode Alabi (Overdue balance ₦1,632,000, grace expired)",
    ipAddress: "105.112.98.54"
  },
  {
    id: "aud_004",
    timestamp: "2026-11-23T11:20:44Z",
    userId: "usr_sales",
    userName: "Chukwudi Okafor",
    userRole: "sales",
    action: "CREATE_CUSTOMER",
    targetEntity: "Customer",
    targetId: "cust_025",
    details: "Registered new customer Barrister Seyi Sowore with 8.0kVA Sunsynk package",
    ipAddress: "102.89.32.99"
  }
];
