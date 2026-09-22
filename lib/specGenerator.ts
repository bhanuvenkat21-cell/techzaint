  // lib/specGenerator.ts
  // Turns any `Phone` (from data/siteData.ts) into the full spec-sheet shape
  // used by the product details page — real fields where we have them,
  // sensible derived/estimated values everywhere else so every brand's
  // page looks equally complete.

  import type { Phone } from "@/data/siteData";

  export type SpecRow = { label: string; value: string };
  export type SpecSection = Record<string, SpecRow[]>;

  // ─── Helpers ──────────────────────────────────────────────────

  type Tier = "budget" | "mid" | "upperMid" | "flagship" | "ultra";

  function getTier(price: number): Tier {
    if (price < 15000) return "budget";
    if (price < 30000) return "mid";
    if (price < 60000) return "upperMid";
    if (price < 100000) return "flagship";
    return "ultra";
  }

  function slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function estimateWeight(displaySizeInches: number, tier: Tier): string {
    const base = 150 + (displaySizeInches - 6) * 25;
    const materialBump = tier === "ultra" || tier === "flagship" ? 15 : 0;
    return `${Math.round(base + materialBump)} grams`;
  }

  function estimateDimensions(displaySizeInches: number): string {
    const height = (displaySizeInches * 22.3).toFixed(1);
    const width = (displaySizeInches * 10.4).toFixed(1);
    return `${height} x ${width} x 7.9 mm (approx.)`;
  }

  function estimateResolution(displaySizeInches: number, refreshRate: number): string {
    if (displaySizeInches >= 6.7 && refreshRate >= 120) return "1440 x 3200 pixels (QHD+)";
    if (displaySizeInches >= 6.4) return "1080 x 2400 pixels (FHD+)";
    return "1080 x 2340 pixels (FHD+)";
  }

  function estimatePPI(displaySizeInches: number, resLabel: string): string {
    const isQHD = resLabel.includes("1440");
    const ppi = isQHD ? 500 + Math.round((6.8 - displaySizeInches) * 10) : 390 + Math.round((6.8 - displaySizeInches) * 10);
    return `${ppi} ppi`;
  }

  function estimateBrightness(tier: Tier): string {
    const map: Record<Tier, string> = {
      budget: "550 nits (peak)",
      mid: "800 nits (peak)",
      upperMid: "1200 nits (peak)",
      flagship: "1800 nits (peak)",
      ultra: "2600 nits (peak)",
    };
    return map[tier];
  }

  function estimateProtection(tier: Tier): string {
    const map: Record<Tier, string> = {
      budget: "Tempered Glass",
      mid: "Corning Gorilla Glass 5",
      upperMid: "Corning Gorilla Glass Victus",
      flagship: "Corning Gorilla Glass Victus 2",
      ultra: "Corning Gorilla Armor / Ceramic Shield",
    };
    return map[tier];
  }

  function estimateHDR(refreshRate: number, tier: Tier): string {
    if (tier === "budget") return "HDR10";
    if (refreshRate >= 120 && (tier === "flagship" || tier === "ultra")) return "HDR10+, Dolby Vision";
    return "HDR10+";
  }

  function estimateArchitecture(chipset: string): string {
    const c = chipset.toLowerCase();
    if (/(8 elite|9500|a19|tensor g5|exynos 2600)/.test(c)) return "3nm (2nd Gen)";
    if (/(8s elite|9400|a18|dimensity 8[45]00|tensor g4|exynos 1580)/.test(c)) return "4nm";
    if (/(7 gen|6 gen|dimensity 7|dimensity 6|helio|unisoc|exynos 13)/.test(c)) return "6nm";
    return "5nm";
  }

  function estimateGPU(processorBrand: string, chipset: string): string {
    if (processorBrand === "Apple") return "Apple GPU (Integrated)";
    if (processorBrand === "Qualcomm") return "Adreno GPU";
    if (processorBrand === "MediaTek") return "Mali / Immortalis GPU";
    if (processorBrand === "Samsung") return "Xclipse GPU (AMD RDNA)";
    if (processorBrand === "Google") return "Tensor GPU";
    return "Integrated GPU";
  }

  function estimateCores(processorBrand: string): string {
    return processorBrand === "Apple" ? "6 (2 Performance + 4 Efficiency)" : "8 (1+3+4 / 1+5+2 cluster)";
  }

  function estimateVideoRecording(tier: Tier): string {
    if (tier === "ultra" || tier === "flagship") return "8K @ 30fps, 4K @ 60fps";
    if (tier === "upperMid") return "4K @ 30fps, 1080p @ 60fps";
    return "1080p @ 30fps";
  }

  function estimateCameraFeatures(tier: Tier): string {
    if (tier === "ultra" || tier === "flagship") return "Night Mode, OIS, RAW capture, AI Scene Detection";
    if (tier === "upperMid") return "Night Mode, AI Scene Detection";
    return "Night Mode (basic), HDR";
  }

  function estimateTypicalUsage(battery: number): string {
    const hours = Math.round((battery / 5000) * 24);
    return `Up to ${hours} hours video playback`;
  }

  function estimateWirelessCharging(tier: Tier, os: string): string {
    if (os === "iOS") return "25W MagSafe Wireless";
    if (tier === "ultra" || tier === "flagship") return "15W Wireless Charging";
    return "Not Supported";
  }

  function estimateReverseCharging(tier: Tier): string {
    return tier === "ultra" || tier === "flagship" ? "Yes, 5W Reverse Wired/Wireless" : "No";
  }

  function estimateStorageType(tier: Tier): string {
    return tier === "budget" ? "eMMC 5.1 / UFS 2.2" : tier === "mid" ? "UFS 3.1" : "UFS 4.0";
  }

  function estimateWifi(tier: Tier): string {
    return tier === "ultra" || tier === "flagship" ? "Wi-Fi 7 (802.11be)" : tier === "upperMid" ? "Wi-Fi 6E" : "Wi-Fi 5 (802.11ac)";
  }

  function estimateBluetooth(tier: Tier): string {
    return tier === "budget" ? "v5.1" : tier === "mid" ? "v5.2" : "v5.4";
  }

  function estimateNFC(eSim: boolean, tier: Tier): string {
    return eSim || tier !== "budget" ? "Yes" : "No";
  }

  function estimateFingerprint(tier: Tier, os: string): string {
    if (os === "iOS") return "No (Face ID instead)";
    if (tier === "ultra" || tier === "flagship") return "Yes, Ultrasonic In-display";
    if (tier === "upperMid") return "Yes, Optical In-display";
    return "Yes, Side-mounted";
  }

  function estimateFaceUnlock(os: string, tier: Tier): string {
    if (os === "iOS") return "Yes, 3D Face ID";
    return tier === "ultra" || tier === "flagship" ? "Yes, 2D Face Unlock" : "Yes, Basic Face Unlock";
  }

  function estimateBuildMaterial(tier: Tier): string {
    if (tier === "ultra") return "Titanium Frame, Glass Back";
    if (tier === "flagship") return "Aluminum Frame, Glass Back";
    if (tier === "upperMid") return "Aluminum Frame, Glass/Polycarbonate Back";
    return "Polycarbonate Frame and Back";
  }

  function estimateWaterResistance(tier: Tier): string {
    if (tier === "ultra" || tier === "flagship") return "IP68 (1.5m depth, 30 min)";
    if (tier === "upperMid") return "IP65 (Splash Resistant)";
    return "Splash Resistant (No official rating)";
  }

  function estimate35mmJack(tier: Tier): string {
    return tier === "budget" || tier === "mid" ? "Yes" : "No";
  }

  function estimateAudioSupport(tier: Tier): string {
    return tier === "ultra" || tier === "flagship" ? "Dolby Atmos, Spatial Audio" : "Stereo Playback";
  }

  function estimateSecondaryBenchmarks(antutu: number, specScore: number) {
    const geekSingle = Math.round(700 + (antutu / 2700000) * 2700);
    const geekMulti = Math.round(geekSingle * 2.7);
    const dmark = Math.round((antutu / 2700000) * 21000);
    const gfx = Math.round((specScore / 100) * 300);
    return { geekSingle, geekMulti, dmark, gfx };
  }

  // ─── Main generator ───────────────────────────────────────────

  export function generateSpecs(phone: Phone): SpecSection {
    const tier = getTier(phone.price);
    const resolution = estimateResolution(phone.displaySizeInches, phone.refreshRate);
    const { geekSingle, geekMulti, dmark, gfx } = estimateSecondaryBenchmarks(phone.antutu, phone.specScore);

    return {
      General: [
        { label: "Brand", value: phone.brand.charAt(0).toUpperCase() + phone.brand.slice(1) },
        { label: "Model", value: phone.name },
        { label: "Launch Date", value: phone.releaseDate },
        { label: "Operating System", value: phone.os },
        { label: "Custom UI", value: phone.os === "iOS" ? "None" : "Manufacturer Skin (OEM UI)" },
        { label: "Dimensions", value: estimateDimensions(phone.displaySizeInches) },
        { label: "Weight", value: estimateWeight(phone.displaySizeInches, tier) },
        { label: "5G Support", value: phone.is5G ? "Yes" : "No" },
      ],
      Display: [
        { label: "Size", value: phone.displaySize },
        { label: "Type", value: phone.displayType },
        { label: "Resolution", value: resolution },
        { label: "Pixel Density", value: estimatePPI(phone.displaySizeInches, resolution) },
        { label: "Refresh Rate", value: `${phone.refreshRate}Hz` },
        { label: "Brightness", value: estimateBrightness(tier) },
        { label: "Protection", value: estimateProtection(tier) },
        { label: "HDR Support", value: estimateHDR(phone.refreshRate, tier) },
      ],
      Performance: [
        { label: "Processor", value: phone.chipset },
        { label: "Architecture", value: estimateArchitecture(phone.chipset) },
        { label: "Cores", value: estimateCores(phone.processorBrand) },
        { label: "RAM", value: `${phone.ram}GB` },
        { label: "GPU", value: estimateGPU(phone.processorBrand, phone.chipset) },
        { label: "AntuTu Score", value: phone.antutu.toLocaleString() },
      ],
      Camera: [
        { label: "Rear Setup", value: phone.rearCamera },
        { label: "Main Sensor", value: `${phone.rearCameraMP}MP` },
        { label: "Front Camera", value: phone.frontCamera },
        { label: "Video Recording", value: estimateVideoRecording(tier) },
        { label: "Features", value: estimateCameraFeatures(tier) },
      ],
      Battery: [
        { label: "Capacity", value: `${phone.battery} mAh` },
        { label: "Type", value: "Li-Ion / Li-Polymer, Non-removable" },
        { label: "Fast Charging", value: phone.charging },
        { label: "Wireless Charging", value: estimateWirelessCharging(tier, phone.os) },
        { label: "Reverse Charging", value: estimateReverseCharging(tier) },
        { label: "Typical Usage", value: estimateTypicalUsage(phone.battery) },
      ],
      Storage: [
        { label: "Internal", value: `${phone.storage}GB` },
        { label: "Type", value: estimateStorageType(tier) },
        { label: "Expandable", value: phone.os === "iOS" || tier === "flagship" || tier === "ultra" ? "No" : "Up to 1TB (microSD)" },
        { label: "USB OTG", value: phone.os === "iOS" ? "No" : "Yes" },
      ],
      Network: [
        { label: "SIM", value: phone.eSim ? "Dual SIM (Nano + eSIM)" : "Dual SIM (Nano)" },
        { label: "5G", value: phone.is5G ? "Yes, Sub-6GHz" : "No" },
        { label: "4G VoLTE", value: "Yes" },
        { label: "Wi-Fi", value: estimateWifi(tier) },
        { label: "Bluetooth", value: estimateBluetooth(tier) },
      ],
      Connectivity: [
        { label: "USB", value: phone.os === "iOS" ? "USB Type-C 3.0" : "USB Type-C 2.0" },
        { label: "NFC", value: estimateNFC(phone.eSim, tier) },
        { label: "GPS", value: "GPS, GLONASS, Galileo" },
        { label: "Infrared", value: tier === "flagship" || tier === "ultra" ? "Yes" : "No" },
        { label: "FM Radio", value: tier === "budget" ? "Yes" : "No" },
      ],
      Sensors: [
        { label: "Fingerprint", value: estimateFingerprint(tier, phone.os) },
        { label: "Face Unlock", value: estimateFaceUnlock(phone.os, tier) },
        { label: "Accelerometer", value: "Yes" },
        { label: "Gyroscope", value: "Yes" },
        { label: "Barometer", value: tier === "flagship" || tier === "ultra" ? "Yes" : "No" },
        { label: "Proximity", value: "Yes" },
        { label: "Ambient Light", value: "Yes" },
      ],
      Design: [
        { label: "Build Material", value: estimateBuildMaterial(tier) },
        { label: "Water Resistance", value: estimateWaterResistance(tier) },
        { label: "Buttons", value: "Volume, Power" },
        { label: "Colors Available", value: "Multiple finishes available" },
      ],
      Multimedia: [
        { label: "Speakers", value: tier === "budget" ? "Single Speaker" : "Stereo Speakers" },
        { label: "3.5mm Jack", value: estimate35mmJack(tier) },
        { label: "Audio Support", value: estimateAudioSupport(tier) },
        { label: "Video Formats", value: "MP4, MOV, HEVC, H.264" },
      ],
      Security: [
        { label: "Biometric Unlock", value: `${estimateFingerprint(tier, phone.os)} + ${estimateFaceUnlock(phone.os, tier)}` },
        { label: "Secure Enclave / TEE", value: "Yes" },
        { label: "App Lock", value: "Yes" },
        { label: "Device Finder", value: phone.os === "iOS" ? "Find My" : "Find My Device" },
      ],
      Benchmarks: [
        { label: "AnTuTu v10", value: phone.antutu.toLocaleString() },
        { label: "Geekbench 6 Single", value: geekSingle.toLocaleString() },
        { label: "Geekbench 6 Multi", value: geekMulti.toLocaleString() },
        { label: "3DMark Wild Life", value: dmark.toLocaleString() },
        { label: "GFXBench Manhattan", value: `${gfx} fps` },
      ],
    };
  }

  export { getTier, slugify };