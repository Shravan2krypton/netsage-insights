import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { analyzeConfiguration, type AnalysisResult } from "./engine";
import type { Vendor } from "./demo-configs";

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  configuration: string;
  result: string;
  timestamp: string;
}

interface NetsageState {
  user: string | null;
  login: (email: string) => void;
  logout: () => void;
  current: AnalysisResult | null;
  history: AnalysisResult[];
  aiComplete: boolean;
  setAiComplete: (v: boolean) => void;
  resolved: string[];
  toggleResolved: (id: string) => void;
  audit: AuditEntry[];
  log: (action: string, configuration: string, result: string) => void;
  ingest: (input: { raw: string; fileName: string; vendorHint?: Vendor }) => AnalysisResult;
}

const Ctx = createContext<NetsageState | null>(null);

function ts() {
  return new Date().toISOString();
}

export function NetsageProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [current, setCurrent] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [resolved, setResolved] = useState<string[]>([]);
  const [aiComplete, setAiComplete] = useState(false);
  const [audit, setAudit] = useState<AuditEntry[]>([]);

  const log = useCallback((action: string, configuration: string, result: string) => {
    setAudit((prev) => [
      {
        id: `LOG-${prev.length + 1}`.padStart(3, "0"),
        user: "Admin",
        action,
        configuration,
        result,
        timestamp: ts(),
      },
      ...prev,
    ]);
  }, []);

  const login = useCallback(
    (email: string) => {
      setUser(email);
      log("User Signed In", "—", "Success");
    },
    [log],
  );

  const logout = useCallback(() => setUser(null), []);

  const ingest = useCallback<NetsageState["ingest"]>(
    (input) => {
      const result = analyzeConfiguration(input);
      setCurrent(result);
      setHistory((prev) => [result, ...prev.filter((h) => h.id !== result.id)].slice(0, 12));
      setResolved([]);
      setAiComplete(false);
      log("Configuration Uploaded", result.deviceName, `${result.detection.vendorLabel} detected`);
      return result;
    },
    [log],
  );

  const toggleResolved = useCallback((id: string) => {
    setResolved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      current,
      history,
      aiComplete,
      setAiComplete,
      resolved,
      toggleResolved,
      audit,
      log,
      ingest,
    }),
    [user, login, logout, current, history, aiComplete, resolved, toggleResolved, audit, log, ingest],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNetsage() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNetsage must be used inside NetsageProvider");
  return ctx;
}
