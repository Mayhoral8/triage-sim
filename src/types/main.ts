export type Severity = "critical" | "urgent" | "stable";
export type CaseType = "Cardiac" | "Trauma" | "Respiratory" | "Neurological" | "Other";
export type CasePriority = "P1" | "P2" | "P3";
export type SimulationStatus = "STOPPED" | "RUNNING" | "PAUSED";
export interface CaseFeedItem {
  id: string;
  title: string;
  type: CaseType;
  priority: CasePriority;
  severity: Severity;
  staff: string;
  description: string;
  timestamp: string;
}
export interface ActivityLogItem {
  id: string;
  title: string;
  severity: Severity;
  staff: string;
  details: string;
  timestamp: string;
  source: "seed" | "auto" | "manual";
}
export interface ManualInjectPayload {
  type: CaseType;
  priority: CasePriority;
  staff: string;
  description: string;
}
export interface SimulationState {
  status: SimulationStatus;
  elapsedSeconds: number;
  feedItems: CaseFeedItem[];
  logItems: ActivityLogItem[];
  seedFeed: CaseFeedItem[];
  seedLog: ActivityLogItem[];
}
export type SimulationAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESET" }
  | { type: "TICK" }
  | { type: "AUTO_APPEND_CASE"; payload: CaseFeedItem }
  | { type: "MANUAL_INJECT_CASE"; payload: ManualInjectPayload };