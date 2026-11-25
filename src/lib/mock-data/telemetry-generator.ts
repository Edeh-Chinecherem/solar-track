import { TelemetryReading, DiagnosisResult, SolarSystem } from "@/lib/types";

export interface HourlyTelemetryPoint {
  hour: string;
  pvWatts: number;
  loadWatts: number;
  batterySoc: number;
  gridWatts: number;
}

export function generate24HourTelemetry(system: SolarSystem): HourlyTelemetryPoint[] {
  const points: HourlyTelemetryPoint[] = [];
  const maxPv = system.totalPvCapacityKw * 1000;
  const ratedLoad = system.inverterCapacityKva * 1000 * 0.8; // ~80% power factor

  for (let h = 0; h < 24; h++) {
    const hourLabel = `${String(h).padStart(2, "0")}:00`;
    let pvFraction = 0;
    // Bell curve for solar radiation between 06:00 and 18:00 peaking at 13:00
    if (h >= 6 && h <= 18) {
      pvFraction = Math.sin(((h - 6) / 12) * Math.PI);
    }

    let pvWatts = Math.round(maxPv * pvFraction * (system.status === "low_battery" ? 0.35 : 0.88));
    if (system.status === "offline") {
      pvWatts = h < 9 ? pvWatts : 0;
    }

    // Typical Nigerian residential load profile:
    // Morning rush (06-08), day baseline (09-16), evening peak (18-23)
    let loadFactor = 0.25;
    if (h >= 6 && h <= 8) loadFactor = 0.55;
    else if (h >= 9 && h <= 13) loadFactor = 0.40;
    else if (h === 14 && system.status === "overload") loadFactor = 1.35; // Overload spike!
    else if (h >= 14 && h <= 17) loadFactor = 0.45;
    else if (h >= 18 && h <= 22) loadFactor = 0.80;
    else if (h >= 23 || h <= 5) loadFactor = system.status === "low_battery" ? 0.45 : 0.20;

    const loadWatts = Math.round(ratedLoad * loadFactor);

    // SOC calculation
    let batterySoc = 75;
    if (system.status === "low_battery") {
      batterySoc = Math.max(15, Math.min(32, Math.round(20 + pvFraction * 12 - (h > 18 ? (h - 18) * 3 : 0))));
    } else if (system.status === "overload") {
      batterySoc = Math.round(75 + pvFraction * 20 - (h === 14 ? 12 : 0));
    } else {
      batterySoc = Math.round(50 + pvFraction * 45 - (h > 18 ? (h - 18) * 4 : 0));
    }

    points.push({
      hour: hourLabel,
      pvWatts,
      loadWatts,
      batterySoc: Math.min(100, Math.max(10, batterySoc)),
      gridWatts: h >= 19 && h <= 21 ? 800 : 0 // Occasional DisCo grid supply
    });
  }

  return points;
}

export function generateLiveTelemetry(system: SolarSystem): TelemetryReading {
  const currentHour = new Date().getHours();
  const maxPv = system.totalPvCapacityKw * 1000;
  const isDaytime = currentHour >= 6 && currentHour <= 18;
  const pvFraction = isDaytime ? Math.sin(((currentHour - 6) / 12) * Math.PI) : 0;

  if (system.status === "overload") {
    return {
      timestamp: new Date().toISOString(),
      pvPowerWatts: Math.round(maxPv * 0.75),
      gridPowerWatts: 0,
      loadPowerWatts: 4420, // 4.42 kW > 3.5 kW
      batterySocPercent: 78,
      batteryVoltageVolts: 51.8,
      batteryPowerWatts: -1100,
      inverterTempCelsius: 58.4,
      gridFrequencyHz: 50.1,
      errorCode: "F28_AC_OVERLOAD"
    };
  }

  if (system.status === "low_battery") {
    return {
      timestamp: new Date().toISOString(),
      pvPowerWatts: 620, // Poor harvest
      gridPowerWatts: 0,
      loadPowerWatts: 1450,
      batterySocPercent: 21, // Sustained deficit
      batteryVoltageVolts: 47.2,
      batteryPowerWatts: -830,
      inverterTempCelsius: 41.2,
      gridFrequencyHz: 50.0,
      errorCode: "W03_LOW_BATTERY_SOC"
    };
  }

  if (system.status === "offline") {
    return {
      timestamp: "2026-11-24T08:30:00Z", // 4 hours ago
      pvPowerWatts: 0,
      gridPowerWatts: 0,
      loadPowerWatts: 0,
      batterySocPercent: 68,
      batteryVoltageVolts: 50.4,
      batteryPowerWatts: 0,
      inverterTempCelsius: 32.0,
      gridFrequencyHz: 0,
      errorCode: "COM_LOST_DATALOGGER"
    };
  }

  if (system.status === "hardware_fault") {
    return {
      timestamp: new Date().toISOString(),
      pvPowerWatts: 3800,
      gridPowerWatts: 0,
      loadPowerWatts: 3100,
      batterySocPercent: 88,
      batteryVoltageVolts: 53.2,
      batteryPowerWatts: 700,
      inverterTempCelsius: 79.5, // Over temp!
      gridFrequencyHz: 49.9,
      errorCode: "E04_FAN_STALL"
    };
  }

  // Normal healthy online
  return {
    timestamp: new Date().toISOString(),
    pvPowerWatts: Math.round(maxPv * pvFraction * 0.9),
    gridPowerWatts: 0,
    loadPowerWatts: Math.round(system.inverterCapacityKva * 1000 * 0.45),
    batterySocPercent: 92,
    batteryVoltageVolts: 53.8,
    batteryPowerWatts: 1450,
    inverterTempCelsius: 44.5,
    gridFrequencyHz: 50.02
  };
}

/**
 * Algorithmic Diagnostic Engine
 */
export function diagnoseSystem(system: SolarSystem, telemetry: TelemetryReading): DiagnosisResult {
  const ratedWatts = system.inverterCapacityKva * 1000;

  // 1. Check for Overload
  if (telemetry.loadPowerWatts > ratedWatts || telemetry.errorCode?.includes("OVERLOAD")) {
    const peak = telemetry.loadPowerWatts;
    const overPercent = Math.round(((peak - ratedWatts) / ratedWatts) * 100);
    return {
      cause: "OVERLOAD",
      confidence: 96,
      headline: `Inverter AC Overload Trip (${system.inverterCapacityKva} kVA Limit Exceeded)`,
      detailedAnalysis: `Peak measured load of ${(peak / 1000).toFixed(1)} kW exceeded the system rated inverter threshold of ${(ratedWatts / 1000).toFixed(1)} kW by ${overPercent}%. Inductive surges from simultaneous high-draw appliances (e.g., pumping machine + 1.5HP AC + pressing iron) triggered safety cutoff.`,
      timestampOccurred: telemetry.timestamp,
      metricsSnapshot: {
        peakLoadWatts: peak,
        ratedCapacityWatts: ratedWatts,
        inverterTempCelsius: telemetry.inverterTempCelsius,
        batterySocPercent: telemetry.batterySocPercent,
        activeErrorCode: telemetry.errorCode
      },
      recommendedActions: [
        "Educate customer on appliance interleaving (ironing vs. pumping water)",
        "Recommend upgrading inverter capacity to next tier",
        "Verify breaker ratings on sub-distribution panel"
      ],
      customerAdviceSms: `GreenerAfrik Alert: Your inverter experienced an overload at ${(peak / 1000).toFixed(1)} kW (rated limit ${(ratedWatts / 1000).toFixed(1)} kW). Please switch off pressing irons or water heaters before starting the air conditioner.`
    };
  }

  // 2. Check for Hardware Fault / Over-temperature
  if (telemetry.inverterTempCelsius >= 75 || telemetry.errorCode?.includes("FAN") || system.status === "hardware_fault") {
    return {
      cause: "HARDWARE_FAULT",
      confidence: 98,
      headline: "Inverter Thermal Warning & Fan Stall (Fault Code E04)",
      detailedAnalysis: `Internal heatsink temperature has reached ${telemetry.inverterTempCelsius}°C (critical threshold is 75°C). Cooling fan RPM sensor registers zero rotation, indicating a jammed rotor or dust ingress.`,
      timestampOccurred: telemetry.timestamp,
      metricsSnapshot: {
        inverterTempCelsius: telemetry.inverterTempCelsius,
        activeErrorCode: telemetry.errorCode || "E04_FAN_STALL"
      },
      recommendedActions: [
        "Dispatch field technician to inspect cooling fan assembly",
        "Clear dust buildup from bottom heatsink air intake",
        "Advise customer to reduce heavy loads until service is completed"
      ],
      customerAdviceSms: `URGENT GreenerAfrik Notice: Your inverter is running unusually warm (${telemetry.inverterTempCelsius}°C) due to a cooling fan obstruction. Our technical team has been notified. Please minimize power usage.`
    };
  }

  // 3. Check for Offline
  if (system.status === "offline" || telemetry.errorCode?.includes("DATALOGGER")) {
    return {
      cause: "OFFLINE",
      confidence: 99,
      headline: "Remote Telemetry Datalogger Offline",
      detailedAnalysis: "No heartbeat telemetry packet has been received from the cellular/Wi-Fi datalogger for over 30 minutes. Inverter local AC power may still be functioning, but remote tracking is currently suspended.",
      timestampOccurred: telemetry.timestamp,
      metricsSnapshot: {
        lastSeenMinutesAgo: 260,
        activeErrorCode: "COM_LOST_DATALOGGER"
      },
      recommendedActions: [
        "Check cellular SIM subscription balance on datalogger stick",
        "Power-cycle Wi-Fi router / cellular antenna",
        "Request customer verify blue indicator LED status on datalogger"
      ],
      customerAdviceSms: "GreenerAfrik Notice: Your solar monitoring stick is currently offline. Please check if your home Wi-Fi or router is active, or unplug and re-insert the blue datalogger stick."
    };
  }

  // 4. Check for Under-Charged Battery
  if (telemetry.batterySocPercent < 30 || system.status === "low_battery" || telemetry.errorCode?.includes("LOW_BATTERY")) {
    return {
      cause: "UNDER_CHARGED",
      confidence: 94,
      headline: "Persistent Battery Depletion / Inadequate Solar Harvest",
      detailedAnalysis: `Battery state of charge is at ${telemetry.batterySocPercent}% with sustained deficits over recent cycles. Solar array output is insufficient to replenish overnight consumption from heavy continuous baseloads (deep freezers, constant pumping).`,
      timestampOccurred: telemetry.timestamp,
      metricsSnapshot: {
        batterySocPercent: telemetry.batterySocPercent,
        sustainedLowSocDays: 3,
        inverterTempCelsius: telemetry.inverterTempCelsius,
        activeErrorCode: telemetry.errorCode
      },
      recommendedActions: [
        "Inspect rooftop solar panels for heavy harmattan dust or tree shading",
        "Enable auxiliary grid charging during nighttime off-peak window",
        "Advise customer to power down non-essential chest freezers after midnight"
      ],
      customerAdviceSms: `GreenerAfrik Advisory: Your battery is currently at ${telemetry.batterySocPercent}% due to low solar charging and high night loads. Please turn off deep freezers overnight or allow grid charging.`
    };
  }

  // 5. Normal
  return {
    cause: "NORMAL",
    confidence: 100,
    headline: "System Operating at Peak Efficiency",
    detailedAnalysis: `All operational parameters within standard tolerances. Solar generation is tracking projected solar irradiance curve and battery LiFePO4 cells are balanced at ${telemetry.batterySocPercent}% SOC.`,
    timestampOccurred: telemetry.timestamp,
    metricsSnapshot: {
      batterySocPercent: telemetry.batterySocPercent,
      inverterTempCelsius: telemetry.inverterTempCelsius
    },
    recommendedActions: ["Maintain routine quarterly panel dust cleaning schedule"],
    customerAdviceSms: "GreenerAfrik Status: Your solar system is healthy and operating normally."
  };
}
