import type { Phone } from "./siteData";
import * as U from "./phoneUtils";

export type FilterDef =
  | { type: "multi"; key: string; label: string; options: (string | number)[]; getValue: (p: Phone) => string | number }
  | { type: "minThreshold"; key: string; label: string; thresholds: number[]; unit: string; getValue: (p: Phone) => number }
  | { type: "maxThreshold"; key: string; label: string; thresholds: number[]; unit: string; getValue: (p: Phone) => number }
  | { type: "boolean"; key: string; label: string; getValue: (p: Phone) => boolean };

export const filterConfig: FilterDef[] = [
  { type: "multi", key: "brand", label: "Brand", options: [], getValue: (p) => p.brand },
  { type: "multi", key: "ram", label: "RAM", options: [], getValue: (p) => p.ram },
  { type: "multi", key: "storage", label: "Storage", options: [], getValue: (p) => p.storage },
  { type: "multi", key: "processorBrand", label: "Processor", options: [], getValue: (p) => p.processorBrand },
  { type: "minThreshold", key: "minCameraMP", label: "Rear Camera", thresholds: [12, 48, 64, 108, 200], unit: "MP & Above", getValue: (p) => p.rearCameraMP },
  { type: "minThreshold", key: "minFrontCameraMP", label: "Front Camera", thresholds: [12, 16, 32, 50], unit: "MP & Above", getValue: (p) => U.getFrontCameraMP(p) },
  { type: "minThreshold", key: "minBattery", label: "Battery", thresholds: [4000, 5000, 6000], unit: "mAh & Above", getValue: (p) => p.battery },
  { type: "minThreshold", key: "minChargingWatt", label: "Charging Speed", thresholds: [20, 27, 45, 65, 80], unit: "W & Above", getValue: (p) => U.getChargingWatt(p) },
  { type: "multi", key: "refreshRate", label: "Refresh Rate", options: [], getValue: (p) => p.refreshRate },
  { type: "multi", key: "displayTech", label: "Display Technology", options: [], getValue: (p) => U.getDisplayTech(p) },
  { type: "multi", key: "os", label: "Operating System", options: [], getValue: (p) => p.os },
  { type: "boolean", key: "only5G", label: "5G", getValue: (p) => p.is5G },
  { type: "boolean", key: "quickCharging", label: "Quick Charging", getValue: (p) => p.quickCharging },
  { type: "boolean", key: "eSim", label: "eSIM", getValue: (p) => p.eSim },
  { type: "minThreshold", key: "minReleaseYear", label: "Release Year", thresholds: [2024, 2025, 2026], unit: "& Newer", getValue: (p) => U.getReleaseYear(p) },
  { type: "minThreshold", key: "minUserRating", label: "User Rating", thresholds: [4, 4.5], unit: "★ & Above", getValue: (p) => p.userRating },
  { type: "minThreshold", key: "minExpertRating", label: "Expert Rating", thresholds: [7, 8, 9], unit: "/10 & Above", getValue: (p) => p.expertRating },
  { type: "minThreshold", key: "minSpecScore", label: "Spec Score", thresholds: [80, 90, 95], unit: "% & Above", getValue: (p) => p.specScore },
  { type: "boolean", key: "nfc", label: "NFC", getValue: U.hasNFC },
  { type: "boolean", key: "dualSim", label: "Dual SIM", getValue: U.hasDualSim },
  { type: "multi", key: "ipRating", label: "Water Resistance", options: [], getValue: U.getIpRating },
  { type: "boolean", key: "wirelessCharging", label: "Wireless Charging", getValue: U.hasWirelessCharging },
  { type: "boolean", key: "inDisplayFingerprint", label: "In-Display Fingerprint", getValue: U.hasInDisplayFingerprint },
  { type: "boolean", key: "stereoSpeakers", label: "Stereo Speakers", getValue: U.hasStereoSpeakers },
  { type: "multi", key: "bluetoothVersion", label: "Bluetooth Version", options: [], getValue: U.getBluetoothVersion },
  { type: "multi", key: "usbType", label: "USB Type", options: [], getValue: U.getUsbType },
  { type: "multi", key: "videoRecording", label: "Video Recording", options: [], getValue: U.getVideoRecording },
  { type: "maxThreshold", key: "maxWeight", label: "Weight", thresholds: [180, 200, 220], unit: "g & Under", getValue: U.getWeight },
  { type: "maxThreshold", key: "maxThickness", label: "Thickness", thresholds: [7, 8, 9], unit: "mm & Under", getValue: U.getThickness },
  { type: "multi", key: "buildMaterial", label: "Build Material", options: [], getValue: U.getBuildMaterial },
  { type: "minThreshold", key: "minColors", label: "Colors Available", thresholds: [2, 4, 6], unit: "+ Colors", getValue: U.getColorsAvailable },
  { type: "minThreshold", key: "minWarranty", label: "Warranty", thresholds: [6, 12, 24], unit: "Months & Above", getValue: U.getWarrantyMonths },
  { type: "multi", key: "simType", label: "SIM Type", options: [], getValue: U.getSimType },
  { type: "boolean", key: "gps", label: "GPS Support", getValue: U.hasGps },
  { type: "boolean", key: "fmRadio", label: "FM Radio", getValue: U.hasFmRadio },
  { type: "multi", key: "fastChargeProtocol", label: "Fast Charge Protocol", options: [], getValue: U.getFastChargeProtocol },
  { type: "boolean", key: "cameraOIS", label: "Camera OIS", getValue: U.hasCameraOIS },
  { type: "boolean", key: "selfieFlash", label: "Selfie Flash", getValue: U.hasSelfieFlash },
  { type: "multi", key: "notchType", label: "Notch Type", options: [], getValue: U.getNotchType },
  { type: "boolean", key: "underDisplayCamera", label: "Under-Display Camera", getValue: U.hasUnderDisplayCamera },
  { type: "boolean", key: "foldable", label: "Foldable", getValue: U.isFoldable },
  { type: "boolean", key: "stylusSupport", label: "Stylus Support", getValue: U.hasStylusSupport },
  { type: "boolean", key: "satelliteConnectivity", label: "Satellite Connectivity", getValue: U.hasSatelliteConnectivity },
  { type: "boolean", key: "aiFeatures", label: "AI Features", getValue: U.hasAiFeatures },
  { type: "boolean", key: "inStock", label: "In Stock", getValue: U.isInStock },
  { type: "boolean", key: "emiAvailable", label: "EMI Available", getValue: U.hasEmiAvailable },
  { type: "boolean", key: "exchangeOffer", label: "Exchange Offer", getValue: U.hasExchangeOffer },
  { type: "boolean", key: "trending", label: "Trending", getValue: U.isTrending },
];
// That's 48 config-driven filters + Price (handled separately, always present) = 49.
// Rear Camera + Front Camera count as 2 → total 50 including Price.