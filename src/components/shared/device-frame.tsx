"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type DeviceMode = "phone" | "desktop";

interface DeviceFrameContextValue {
  mode: DeviceMode;
  setMode: (mode: DeviceMode) => void;
}

const DeviceFrameContext = createContext<DeviceFrameContextValue>({
  mode: "phone",
  setMode: () => {},
});

export function useDeviceMode() {
  return useContext(DeviceFrameContext);
}

const STORAGE_KEY = "banksia-device-mode";

/**
 * DeviceFrame — wraps the app in a phone-shaped container on desktop.
 *
 * Behaviour:
 * - Real mobile (touch + narrow viewport): renders fullscreen, no frame.
 * - Desktop: defaults to phone frame; user can toggle to fullscreen desktop.
 * - Marketing landing (`/`): always full-bleed on desktop.
 * - Preference persisted in localStorage across sessions.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const [mode, setModeState] = useState<DeviceMode>(() => {
    if (typeof window === "undefined") return "phone";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "desktop" || saved === "phone") return saved as DeviceMode;
    } catch {
      // localStorage unavailable
    }
    return "phone";
  });
  const [isRealMobile, setIsRealMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsRealMobile(
      window.matchMedia("(max-width: 768px)").matches &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0),
    );
    setMounted(true);
  }, []);

  const setMode = useCallback((next: DeviceMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const handleToggle = useCallback(() => {
    setMode(mode === "phone" ? "desktop" : "phone");
  }, [mode, setMode]);

  if (!mounted || isRealMobile) {
    return (
      <DeviceFrameContext.Provider value={{ mode: "desktop", setMode }}>
        {children}
      </DeviceFrameContext.Provider>
    );
  }

  if (isLanding) {
    return (
      <DeviceFrameContext.Provider value={{ mode: "desktop", setMode }}>
        {children}
      </DeviceFrameContext.Provider>
    );
  }

  if (mode === "desktop") {
    return (
      <DeviceFrameContext.Provider value={{ mode, setMode }}>
        <DeviceToggle mode={mode} onToggle={handleToggle} />
        {children}
      </DeviceFrameContext.Provider>
    );
  }

  return (
    <DeviceFrameContext.Provider value={{ mode, setMode }}>
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-100 overflow-hidden p-4">
        <div
          className="relative w-[390px] max-w-full"
          style={{ aspectRatio: "390 / 844", maxHeight: "calc(100vh - 2rem)" }}
        >
          <div className="relative overflow-hidden rounded-[3rem] border-[8px] border-neutral-800 bg-neutral-800 shadow-2xl w-full h-full">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 z-[100] -translate-x-1/2">
              <div className="h-[30px] w-[120px] rounded-b-2xl bg-neutral-800" />
            </div>

            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 z-[99] flex items-center justify-between px-8 pt-[8px]">
              <span className="text-[11px] font-semibold text-white select-none">
                9:41
              </span>
              <div className="flex items-center gap-1.5">
                <svg width="15" height="10" viewBox="0 0 15 10" className="opacity-80">
                  <rect x="0" y="7" width="2.5" height="3" rx="0.5" fill="white" />
                  <rect x="4" y="4.5" width="2.5" height="5.5" rx="0.5" fill="white" />
                  <rect x="8" y="2" width="2.5" height="8" rx="0.5" fill="white" />
                  <rect x="12" y="0" width="2.5" height="10" rx="0.5" fill="white" opacity="0.35" />
                </svg>
                <svg width="14" height="10" viewBox="0 0 14 10" className="opacity-80">
                  <path d="M7 8.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" fill="white" />
                  <path d="M4 6.5a4.5 4.5 0 0 1 6 0" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                  <path d="M1.5 4a8 8 0 0 1 11 0" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                </svg>
                <svg width="24" height="10" viewBox="0 0 24 10" className="opacity-80">
                  <rect x="0.5" y="0.5" width="20" height="9" rx="2" stroke="white" strokeWidth="1" fill="none" />
                  <rect x="2" y="2" width="14" height="6" rx="1" fill="white" />
                  <path d="M22 3.5v3a1.5 1.5 0 0 0 0-3z" fill="white" opacity="0.4" />
                </svg>
              </div>
            </div>

            <div
              className="absolute inset-0 bg-white"
              style={{
                borderRadius: "calc(3rem - 8px)",
                transform: "translateZ(0)",
              }}
            >
              <div
                className="h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide"
                style={{ paddingTop: 44 }}
              >
                {children}
              </div>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-[6px] left-1/2 z-[100] -translate-x-1/2">
              <div className="h-[5px] w-[134px] rounded-full bg-white/30" />
            </div>
          </div>
        </div>

        <DeviceToggle mode={mode} onToggle={handleToggle} />
      </div>
    </DeviceFrameContext.Provider>
  );
}

function DeviceToggle({
  mode,
  onToggle,
}: {
  mode: DeviceMode;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "fixed z-[200] flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105",
        mode === "phone" ? "bottom-6 right-6" : "bottom-4 right-4",
      )}
      type="button"
      aria-label={mode === "phone" ? "Switch to desktop layout" : "Switch to phone layout"}
      title={mode === "phone" ? "Switch to desktop layout" : "Switch to phone layout"}
    >
      {mode === "phone" ? (
        <>
          <Monitor size={18} className="text-[var(--banksia-subtext)]" />
          <span className="text-sm font-medium text-[var(--banksia-dark)]">Desktop</span>
        </>
      ) : (
        <>
          <Smartphone size={18} className="text-[var(--banksia-subtext)]" />
          <span className="text-sm font-medium text-[var(--banksia-dark)]">Phone</span>
        </>
      )}
    </button>
  );
}
