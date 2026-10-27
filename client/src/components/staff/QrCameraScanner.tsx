import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, X } from "lucide-react";

interface QrCameraScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export const QrCameraScanner: React.FC<QrCameraScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    let isMounted = true;
    const scannerId = "helartico-qr-reader";

    // Clear any residual elements in the container
    const container = document.getElementById(scannerId);
    if (container) {
      container.innerHTML = "";
    }

    const scanner = new Html5Qrcode(scannerId);
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            if (isMounted) {
              scanner
                .stop()
                .then(() => {
                  if (isMounted) {
                    setIsScanning(false);
                    scanner.clear();
                    onScanRef.current(decodedText.trim().toUpperCase());
                  }
                })
                .catch(console.error);
            }
          },
          () => {} // Ignore continuous non-detection frames
        );

        if (!isMounted) {
          // Unmounted while start was resolving
          scanner.stop().then(() => scanner.clear()).catch(() => {});
        } else {
          setIsScanning(true);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err?.name === "NotAllowedError"
              ? "Permiso de cámara denegado. Habilita el acceso en tu navegador."
              : "No se encontró cámara disponible en este dispositivo."
          );
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().then(() => scannerRef.current?.clear()).catch(() => {});
        } else {
          try {
            scannerRef.current.clear();
          } catch {}
        }
      }
    };
  }, []); // Run effect once on mount

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid var(--color-border)", padding: 14, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: "0.9rem", color: "var(--color-primary)" }}>
          <Camera size={18} /> Escáner de Cámara {isScanning && <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--color-success)" }}>(En vivo)</span>}
        </div>
        <button onClick={onClose} style={{ color: "var(--color-text-muted)", padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      {error ? (
        <div style={{ background: "var(--color-danger-bg)", color: "var(--color-danger)", padding: 12, borderRadius: 8, fontSize: "0.85rem", textAlign: "center" }}>
          <CameraOff size={24} style={{ margin: "0 auto 6px auto", display: "block" }} />
          {error}
        </div>
      ) : (
        <div>
          <div
            id="helartico-qr-reader"
            style={{ width: "100%", borderRadius: 8, overflow: "hidden", minHeight: 250 }}
          />
          <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: 8 }}>
            Apunta la cámara al código QR que te muestra el cliente en su celular.
          </p>
        </div>
      )}
    </div>
  );
};
