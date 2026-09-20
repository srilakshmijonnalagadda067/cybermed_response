export interface AuditLog {
  id: string;
  time: string;
  user: string;
  action: string;
  incident: string;
  result: string;
}

const STORAGE_KEY = "cybermed_audit_logs";

export function getAuditLogs(): AuditLog[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as AuditLog[];
  } catch {
    return [];
  }
}

export function addAuditLog(
  action: string,
  incident: string,
  result: string = "Success"
): void {
  const logs = getAuditLogs();

  const newLog: AuditLog = {
    id: `AUD-${Date.now()}`,
    time: new Date().toLocaleString(),
    user: "Security Analyst",
    action,
    incident,
    result,
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([newLog, ...logs])
  );
}