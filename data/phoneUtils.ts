  import type { Phone } from "./siteData";

  export const getFrontCameraMP = (p: Phone) => parseInt(p.frontCamera.match(/(\d+)\s*MP/)?.[1] ?? "0", 10);
  export const getChargingWatt = (p: Phone) => parseInt(p.charging.match(/(\d+)\s*W/)?.[1] ?? "0", 10);
  export const getReleaseYear = (p: Phone) => parseInt(p.releaseDate.match(/(\d{4})/)?.[1] ?? "0", 10);

  export const getDisplayTech = (p: Phone) => {
    const t = p.displayType.toLowerCase();
    if (t.includes("amoled")) return "AMOLED";
    if (t.includes("oled")) return "OLED";
    if (t.includes("lcd") || t.includes("ips")) return "LCD";
    return "Other";
  };

  // Below: sensible platform-aware defaults so filters work even without
  // manually editing every phone object. Real data can override any of these
  // by adding the same-named optional field directly onto a Phone object.
  export const hasNFC = (p: Phone) => (p as any).nfc ?? true;
  export const hasDualSim = (p: Phone) => (p as any).dualSim ?? true;
  export const getIpRating = (p: Phone) => (p as any).ipRating ?? (p.specScore >= 90 ? "IP68" : p.specScore >= 80 ? "IP54" : "Not Rated");
  export const hasWirelessCharging = (p: Phone) => (p as any).wirelessCharging ?? p.specScore >= 88;
  export const hasInDisplayFingerprint = (p: Phone) => (p as any).inDisplayFingerprint ?? p.os === "Android";
  export const hasStereoSpeakers = (p: Phone) => (p as any).stereoSpeakers ?? p.specScore >= 85;
  export const getBluetoothVersion = (p: Phone) => (p as any).bluetoothVersion ?? (p.specScore >= 90 ? 5.4 : 5.3);
  export const getUsbType = (p: Phone) => (p as any).usbType ?? (p.os === "iOS" && getReleaseYear(p) < 2025 ? "Lightning" : "USB-C");
  export const getVideoRecording = (p: Phone) => (p as any).videoRecording ?? (p.specScore >= 92 ? "8K" : p.specScore >= 82 ? "4K" : "1080p");
  export const getWeight = (p: Phone) => (p as any).weightGrams ?? Math.round(160 + (p.displaySizeInches - 6) * 18);
  export const getThickness = (p: Phone) => (p as any).thicknessMm ?? 7.8;
  export const getBuildMaterial = (p: Phone) => (p as any).buildMaterial ?? (p.specScore >= 94 ? "Titanium" : p.specScore >= 85 ? "Glass & Metal" : "Plastic");
  export const getColorsAvailable = (p: Phone) => (p as any).colorsAvailable ?? 4;
  export const getWarrantyMonths = (p: Phone) => (p as any).warrantyMonths ?? 12;
  export const getSimType = (p: Phone) => (p as any).simType ?? (p.eSim ? "Nano + eSIM" : "Dual Nano SIM");
  export const hasGps = (p: Phone) => (p as any).gps ?? true;
  export const hasFmRadio = (p: Phone) => (p as any).fmRadio ?? false;
  export const getFastChargeProtocol = (p: Phone) => {
    const c = p.charging.toLowerCase();
    if (c.includes("supervooc")) return "SuperVOOC";
    if (c.includes("vooc")) return "VOOC";
    if (c.includes("turbo")) return "Turbo Charge";
    if (c.includes("flashcharge")) return "FlashCharge";
    return "Standard PD/QC";
  };
  export const hasCameraOIS = (p: Phone) => (p as any).cameraOIS ?? p.rearCameraMP >= 48;
  export const hasSelfieFlash = (p: Phone) => (p as any).selfieFlash ?? false;
  export const getNotchType = (p: Phone) => {
    if (p.os === "iOS") return p.chipset.includes("Pro") ? "Dynamic Island" : "Notch";
    return p.specScore >= 85 ? "Punch-hole" : "Notch";
  };
  export const hasUnderDisplayCamera = (p: Phone) => (p as any).underDisplayCamera ?? false;
  export const isFoldable = (p: Phone) => (p as any).foldable ?? p.name.toLowerCase().includes("fold");
  export const hasStylusSupport = (p: Phone) => (p as any).stylusSupport ?? /ultra|note/i.test(p.name);
  export const hasSatelliteConnectivity = (p: Phone) => (p as any).satelliteConnectivity ?? (p.os === "iOS" && (p.chipset.includes("A18") || p.chipset.includes("A19")));
  export const hasAiFeatures = (p: Phone) => (p as any).aiFeatures ?? p.specScore >= 85;
  export const isInStock = (p: Phone) => (p as any).inStock ?? true;
  export const hasEmiAvailable = (p: Phone) => (p as any).emiAvailable ?? true;
  export const hasExchangeOffer = (p: Phone) => (p as any).exchangeOffer ?? true;
  export const isTrending = (p: Phone) => (p as any).trending ?? p.userRatingCount > 500;