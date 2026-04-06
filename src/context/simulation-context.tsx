import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { toast } from "sonner";
import { type CasePriority, type CaseType, type Severity } from "@/types/main";
import {
  type CaseFeedItem,
  type ManualInjectPayload,
  type ActivityLogItem,
  type SimulationState,
  type SimulationAction,
} from "@/types/main";

const CASE_TEMPLATES: Array<
  Pick<CaseFeedItem, "title" | "type" | "priority" | "severity" | "description">
> = [
  {
    title: "Cardiac Arrest",
    type: "Cardiac",
    priority: "P1",
    severity: "critical",
    description: "67-year-old male, unresponsive on arrival",
  },
  {
    title: "Trauma - RTA",
    type: "Trauma",
    priority: "P1",
    severity: "critical",
    description: "Multiple fractures after road traffic collision",
  },
  {
    title: "Chest Pain",
    type: "Cardiac",
    priority: "P2",
    severity: "urgent",
    description: "Acute onset chest pain, possible STEMI",
  },
  {
    title: "Respiratory Distress",
    type: "Respiratory",
    priority: "P2",
    severity: "urgent",
    description: "COPD history with oxygen saturation at 88%",
  },
  {
    title: "Laceration - Hand",
    type: "Other",
    priority: "P3",
    severity: "stable",
    description: "Deep laceration requiring suturing",
  },
  {
    title: "Neurological Assessment",
    type: "Neurological",
    priority: "P2",
    severity: "urgent",
    description: "Sudden dizziness and unilateral weakness",
  },
];

const STAFF_POOL = [
  "Dr. Amara Osei",
  "Dr. Ngozi Eze",
  "Nurse Femi Adeyemi",
  "Nurse Taiwo Bello",
];

const toIsoFromDDMMYYYY = (value: string): string => {
  const [datePart, timePart] = value.split(", ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds).toISOString();
};

const seedFeed: CaseFeedItem[] = [
  {
    id: "seed-case-1",
    title: "Cardiac Arrest",
    type: "Cardiac",
    priority: "P1",
    severity: "critical",
    staff: "Dr. Amara Osei",
    description: "67-year-old male, unresponsive on arrival",
    timestamp: toIsoFromDDMMYYYY("10/03/2024, 09:14:22"),
  },
  {
    id: "seed-case-2",
    title: "Trauma - RTA",
    type: "Trauma",
    priority: "P1",
    severity: "critical",
    staff: "Dr. Ngozi Eze",
    description: "Multiple fractures, road traffic accident",
    timestamp: toIsoFromDDMMYYYY("10/03/2024, 09:16:31"),
  },
  {
    id: "seed-case-3",
    title: "Chest Pain",
    type: "Cardiac",
    priority: "P2",
    severity: "urgent",
    staff: "Nurse Femi Adeyemi",
    description: "Acute onset, possible STEMI",
    timestamp: toIsoFromDDMMYYYY("10/03/2024, 09:18:07"),
  },
  {
    id: "seed-case-4",
    title: "Respiratory Distress",
    type: "Respiratory",
    priority: "P2",
    severity: "urgent",
    staff: "Dr. Amara Osei",
    description: "History of COPD, O2 sats at 88%",
    timestamp: toIsoFromDDMMYYYY("10/03/2024, 09:21:42"),
  },
  {
    id: "seed-case-5",
    title: "Laceration - Hand",
    type: "Other",
    priority: "P3",
    severity: "stable",
    staff: "Nurse Taiwo Bello",
    description: "Deep laceration, requires suturing",
    timestamp: toIsoFromDDMMYYYY("10/03/2024, 09:24:15"),
  },
];

const seedLog: ActivityLogItem[] = [
  {
    id: "seed-log-1",
    title: "Critical Case Admitted",
    severity: "critical",
    staff: "Dr. Amara Osei",
    details: "Cardiac Arrest admitted to resuscitation bay.",
    timestamp: toIsoFromDDMMYYYY("10/03/2024, 09:14:22"),
    source: "seed",
  },
  {
    id: "seed-log-2",
    title: "Staff Action Logged",
    severity: "stable",
    staff: "Nurse Femi Adeyemi",
    details: "Initial vitals recorded and ECG requested.",
    timestamp: toIsoFromDDMMYYYY("10/03/2024, 09:18:07"),
    source: "seed",
  },
  {
    id: "seed-log-3",
    title: "Priority Escalation",
    severity: "urgent",
    staff: "Dr. Ngozi Eze",
    details: "Chest pain case escalated from P3 to P2.",
    timestamp: toIsoFromDDMMYYYY("10/03/2024, 09:31:45"),
    source: "seed",
  },
  {
    id: "seed-log-4",
    title: "Bay Assignment Updated",
    severity: "stable",
    staff: "Nurse Taiwo Bello",
    details: "Patient moved to monitored high-dependency bay.",
    timestamp: toIsoFromDDMMYYYY("10/03/2024, 09:44:10"),
    source: "seed",
  },
  {
    id: "seed-log-5",
    title: "Critical Case - Stabilised",
    severity: "critical",
    staff: "Dr. Amara Osei",
    details: "Hemodynamics stabilized after intervention.",
    timestamp: toIsoFromDDMMYYYY("10/03/2024, 10:02:33"),
    source: "seed",
  },
];

const initialState: SimulationState = {
  status: "STOPPED",
  elapsedSeconds: 0,
  feedItems: seedFeed,
  logItems: seedLog,
  seedFeed,
  seedLog,
};

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const priorityToSeverity = (priority: CasePriority): Severity => {
  if (priority === "P1") return "critical";
  if (priority === "P2") return "urgent";
  return "stable";
};

const buildInjectedTitle = (type: CaseType, priority: CasePriority): string => {
  if (priority === "P1") return `${type} - Critical Case Admitted`;
  if (priority === "P2") return `${type} - Priority Escalation`;
  return `${type} - Case Logged`;
};

const buildAutoCase = (): CaseFeedItem => {
  const template =
    CASE_TEMPLATES[Math.floor(Math.random() * CASE_TEMPLATES.length)];
  return {
    id: makeId(),
    title: template.title,
    type: template.type,
    priority: template.priority,
    severity: template.severity,
    staff: STAFF_POOL[Math.floor(Math.random() * STAFF_POOL.length)],
    description: template.description,
    timestamp: new Date().toISOString(),
  };
};

const reducer = (
  state: SimulationState,
  action: SimulationAction,
): SimulationState => {
  switch (action.type) {
    case "START":
      return { ...state, status: "RUNNING" };
    case "PAUSE":
      return { ...state, status: "PAUSED" };
    case "RESUME":
      return { ...state, status: "RUNNING" };
    case "RESET":
      return {
        ...state,
        status: "STOPPED",
        elapsedSeconds: 0,
        feedItems: state.seedFeed,
        logItems: state.seedLog,
      };
    case "TICK":
      return { ...state, elapsedSeconds: state.elapsedSeconds + 1 };
    case "AUTO_APPEND_CASE": {
      const nextLog: ActivityLogItem = {
        id: makeId(),
        title: `${action.payload.title} Received`,
        severity: action.payload.severity,
        staff: action.payload.staff,
        details: action.payload.description,
        timestamp: action.payload.timestamp,
        source: "auto",
      };
      return {
        ...state,
        feedItems: [action.payload, ...state.feedItems],
        logItems: [nextLog, ...state.logItems],
      };
    }
    case "MANUAL_INJECT_CASE": {
      const severity = priorityToSeverity(action.payload.priority);
      const timestamp = new Date().toISOString();
      const title = buildInjectedTitle(
        action.payload.type,
        action.payload.priority,
      );

      const caseItem: CaseFeedItem = {
        id: makeId(),
        title,
        type: action.payload.type,
        priority: action.payload.priority,
        severity,
        staff: action.payload.staff,
        description: action.payload.description,
        timestamp,
      };

      const logItem: ActivityLogItem = {
        id: makeId(),
        title: `Manual Inject - ${action.payload.type}`,
        severity,
        staff: action.payload.staff,
        details: action.payload.description,
        timestamp,
        source: "manual",
      };

      return {
        ...state,
        feedItems: [caseItem, ...state.feedItems],
        logItems: [logItem, ...state.logItems],
      };
    }
    default:
      return state;
  }
};

interface SimulationContextValue {
  state: SimulationState;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  manualInject: (payload: ManualInjectPayload) => void;
}

const SimulationContext = createContext<SimulationContextValue | undefined>(
  undefined,
);

export const SimulationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.status !== "RUNNING") return;
    const id = window.setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => window.clearInterval(id);
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "RUNNING") return;
    const id = window.setInterval(() => {
      dispatch({ type: "AUTO_APPEND_CASE", payload: buildAutoCase() });
    }, 10000);
    return () => window.clearInterval(id);
  }, [state.status]);

  const value = useMemo<SimulationContextValue>(
    () => ({
      state,
      start: () => {
        dispatch({ type: "START" });
        toast.success("Simulation started", {
          description:
            "Timer is running and auto-injections are now active on Overview and Activity Log.",
        });
      },
      pause: () => {
        dispatch({ type: "PAUSE" });
        toast.warning("Simulation paused", {
          description:
            "Timer is frozen and auto-injections are paused on Overview and Activity Log.",
        });
      },
      resume: () => {
        dispatch({ type: "RESUME" });
        toast.success("Simulation resumed", {
          description:
            "Timer resumed and auto-injections have restarted on Overview and Activity Log.",
        });
      },
      reset: () => {
        dispatch({ type: "RESET" });
        toast.info("Simulation stopped and reset", {
          description:
            "Timer reset and feed/log were restored to seed data. Auto-injections stopped.",
        });
      },
      manualInject: (payload) => {
        dispatch({ type: "MANUAL_INJECT_CASE", payload });
        toast.success("Manual case injected", {
          description:
            "Case added to Live Case Feed and Activity Log.",
        });
      },
    }),
    [state],
  );

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextValue => {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error("useSimulation must be used within SimulationProvider");
  }
  return ctx;
};


