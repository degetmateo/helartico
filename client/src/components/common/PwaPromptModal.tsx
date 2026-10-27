import React, { useEffect, useState } from "react";
import { Download, Monitor, Share2, Smartphone, X } from "lucide-react";
import { PwaService, type DeviceInfo } from "../../services/pwaService";

interface PwaPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideTarget = "ios-safari" | "ios-chrome" | "android" | "desktop";

export const PwaPromptModal: React.FC<PwaPromptModalProps> = ({ isOpen, onClose }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({ os: "other", browser: "other", isStandalone: false });
  const [canInstall, setCanInstall] = useState<boolean>(false);
  const [activeTarget, setActiveTarget] = useState<GuideTarget>("desktop");

  useEffect(() => {
    const info = PwaService.getDeviceInfo();
    setDeviceInfo(info);
    setCanInstall(!!PwaService.getDeferredPrompt());

    if (info.os === "ios") {
      setActiveTarget(info.browser === "chrome" ? "ios-chrome" : "ios-safari");
    } else if (info.os === "android") {
      setActiveTarget("android");
    } else {
      setActiveTarget("desktop");
    }

    const handlePromptReady = () => setCanInstall(true);
    const handleInstalled = () => { setCanInstall(false); onClose(); };

    window.addEventListener("pwa-prompt-ready", handlePromptReady);
    window.addEventListener("pwa-installed", handleInstalled);
    return () => {
      window.removeEventListener("pwa-prompt-ready", handlePromptReady);
      window.removeEventListener("pwa-installed", handleInstalled);
    };
  }, [isOpen]);

  if (!isOpen || deviceInfo.isStandalone) return null;

  const handleDirectInstall = async () => {
    const success = await PwaService.install();
    if (success) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "var(--color-primary-light)", padding: 8, borderRadius: 10 }}>
              {activeTarget === "desktop" ? <Monitor size={20} color="var(--color-primary)" /> : <Smartphone size={20} color="var(--color-primary)" />}
            </div>
            <h3 style={{ fontSize: "1.05rem" }}>Instalar Helartico PWA</h3>
          </div>
          <button onClick={onClose} style={{ color: "var(--color-text-muted)" }}><X size={20} /></button>
        </div>

        {canInstall && (
          <button
            onClick={handleDirectInstall}
            style={{
              width: "100%",
              background: "var(--color-primary)",
              color: "#fff",
              padding: "12px",
              borderRadius: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 14,
              boxShadow: "var(--shadow-md)",
            }}
          >
            <Download size={18} /> Instalar Aplicación Ahora
          </button>
        )}

        <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
          <button onClick={() => setActiveTarget("ios-safari")} style={{ padding: "6px 10px", borderRadius: 8, fontSize: "0.74rem", fontWeight: 700, background: activeTarget === "ios-safari" ? "var(--color-primary)" : "var(--color-bg)", color: activeTarget === "ios-safari" ? "#fff" : "var(--color-text-muted)" }}>iOS Safari</button>
          <button onClick={() => setActiveTarget("ios-chrome")} style={{ padding: "6px 10px", borderRadius: 8, fontSize: "0.74rem", fontWeight: 700, background: activeTarget === "ios-chrome" ? "var(--color-primary)" : "var(--color-bg)", color: activeTarget === "ios-chrome" ? "#fff" : "var(--color-text-muted)" }}>iOS Chrome</button>
          <button onClick={() => setActiveTarget("android")} style={{ padding: "6px 10px", borderRadius: 8, fontSize: "0.74rem", fontWeight: 700, background: activeTarget === "android" ? "var(--color-primary)" : "var(--color-bg)", color: activeTarget === "android" ? "#fff" : "var(--color-text-muted)" }}>Android</button>
          <button onClick={() => setActiveTarget("desktop")} style={{ padding: "6px 10px", borderRadius: 8, fontSize: "0.74rem", fontWeight: 700, background: activeTarget === "desktop" ? "var(--color-primary)" : "var(--color-bg)", color: activeTarget === "desktop" ? "#fff" : "var(--color-text-muted)" }}>PC / Escritorio</button>
        </div>

        <div style={{ background: "var(--color-bg)", borderRadius: 12, padding: 14, fontSize: "0.82rem", lineHeight: 1.6, marginBottom: 14 }}>
          {activeTarget === "ios-safari" && (
            <ol style={{ paddingLeft: 18 }}>
              <li>Toca el botón <strong>Compartir <Share2 size={13} style={{ display: "inline" }} /></strong> en la barra inferior de Safari.</li>
              <li>Desliza hacia abajo y presiona <strong>"Agregar a pantalla de inicio"</strong>.</li>
              <li>Toca <strong>"Agregar"</strong> arriba a la derecha para finalizar.</li>
            </ol>
          )}

          {activeTarget === "ios-chrome" && (
            <ol style={{ paddingLeft: 18 }}>
              <li>En Chrome para iPhone, toca el ícono de <strong>Compartir</strong> en la barra de URL o el menú de tres puntos (<strong>...</strong>).</li>
              <li>Desplázate hacia abajo y elige <strong>"Agregar a pantalla de inicio"</strong>.</li>
              <li style={{ color: "var(--color-text-muted)", fontSize: "0.76rem", marginTop: 4 }}>
                *Si tu versión de iOS no muestra la opción en Chrome, abre el link en Safari.
              </li>
            </ol>
          )}

          {activeTarget === "android" && (
            <ol style={{ paddingLeft: 18 }}>
              <li>Toca el menú de <strong>tres puntos (⋮)</strong> en la esquina superior derecha del navegador.</li>
              <li>Selecciona <strong>"Instalar aplicación"</strong> o "Agregar a la pantalla principal".</li>
              <li>Confirma la instalación para tener el ícono directo en tu celular.</li>
            </ol>
          )}

          {activeTarget === "desktop" && (
            <ol style={{ paddingLeft: 18 }}>
              <li>En <strong>Chrome o Edge</strong>, busca el ícono de instalación (<strong>⊕</strong> o pantalla con flecha) a la derecha de la barra de direcciones.</li>
              <li>O presiona el menú de <strong>tres puntos (⋮)</strong> &gt; <em>"Guardar y compartir"</em> &gt; <em>"Instalar Helartico"</em>.</li>
              <li>Para que el navegador permita la instalación en PC, asegúrate de acceder vía <code>http://localhost:5173</code>.</li>
            </ol>
          )}
        </div>

        <button onClick={onClose} style={{ width: "100%", padding: 8, color: "var(--color-text-muted)", fontSize: "0.82rem", fontWeight: 600 }}>
          Entendido, cerrar
        </button>
      </div>
    </div>
  );
};
