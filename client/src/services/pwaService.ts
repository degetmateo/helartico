import { registerSW } from "virtual:pwa-register";

let deferredPrompt: any = null;

registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("[Helartico PWA] Nueva versión disponible.");
  },
  onOfflineReady() {
    console.log("[Helartico PWA] Aplicación lista para uso offline.");
  },
});

window.addEventListener("beforeinstallprompt", (e: Event) => {
  e.preventDefault();
  deferredPrompt = e;
  window.dispatchEvent(new CustomEvent("pwa-prompt-ready"));
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  window.dispatchEvent(new CustomEvent("pwa-installed"));
});

export interface DeviceInfo {
  os: "ios" | "android" | "windows" | "mac" | "other";
  browser: "safari" | "chrome" | "edge" | "firefox" | "samsung" | "other";
  isStandalone: boolean;
}

export class PwaService {
  public static getDeferredPrompt(): any {
    return deferredPrompt;
  }

  public static async install(): Promise<boolean> {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome === "accepted";
  }

  public static getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    // Detect OS
    let os: DeviceInfo["os"] = "other";
    if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      os = "ios";
    } else if (/Android/i.test(ua)) {
      os = "android";
    } else if (/Win/i.test(ua)) {
      os = "windows";
    } else if (/Mac/i.test(ua)) {
      os = "mac";
    }

    // Detect Browser
    let browser: DeviceInfo["browser"] = "other";
    if (/SamsungBrowser/i.test(ua)) {
      browser = "samsung";
    } else if (/Edg([A-Z]|iOS)?\//i.test(ua)) {
      browser = "edge";
    } else if (/Chrome|CriOS/i.test(ua)) {
      browser = "chrome";
    } else if (/Firefox|FxiOS/i.test(ua)) {
      browser = "firefox";
    } else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) {
      browser = "safari";
    }

    return { os, browser, isStandalone };
  }
}
