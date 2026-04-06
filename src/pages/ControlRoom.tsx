import type { FormEvent } from "react";
import { useState } from "react";
import { useSimulation } from "@/context/simulation-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pause } from "lucide-react";
import { formatTimer } from "@/lib/utils";
import { Play } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { BellPlus } from "lucide-react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type CaseType, type CasePriority } from "@/types/main";
const ControlRoom = () => {
  const { state, start, pause, resume, reset, manualInject } = useSimulation();

  const [injectOpen, setInjectOpen] = useState(false);
  const [caseType, setCaseType] = useState<CaseType>("Cardiac");
  const [priority, setPriority] = useState<CasePriority>("P1");
  const [staff, setStaff] = useState("");
  const [description, setDescription] = useState("");

  const statusDotClass =
    state.status === "RUNNING"
      ? "bg-emerald-500"
      : state.status === "PAUSED"
        ? "bg-orange-500"
        : "bg-slate-400";

  const onInjectSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedStaff = staff.trim();
    const trimmedDescription = description.trim();
    if (!trimmedStaff || !trimmedDescription) return;

    manualInject({
      type: caseType,
      priority,
      staff: trimmedStaff,
      description: trimmedDescription,
    });

    setInjectOpen(false);
    setCaseType("Cardiac");
    setPriority("P1");
    setStaff("");
    setDescription("");
  };

  const metricCards = [
    { title: "Bays Occupied", value: "18", label: "+3 in last 30 min" },
    { title: "Pending Reviews", value: "12", label: "Awaiting consultant" },
    { title: "Cases Resolved", value: "7", label: "Last 60 minutes" },
  ];

  const capacityData = [
    { time: "09:00", critical: 5, stable: 3, discharged: 2, total: 10 },
    { time: "09:30", critical: 6, stable: 4, discharged: 3, total: 13 },
    { time: "10:00", critical: 7, stable: 5, discharged: 3, total: 15 },
    { time: "10:30", critical: 6, stable: 6, discharged: 4, total: 16 },
    { time: "11:00", critical: 5, stable: 7, discharged: 4, total: 16 },
    { time: "11:30", critical: 4, stable: 8, discharged: 5, total: 17 },
    { time: "12:00", critical: 4, stable: 7, discharged: 6, total: 17 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">Control Room</h1>
      </div>
      <Card>
        <CardHeader className="pb-3"></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className={cn("size-2.5 rounded-full", statusDotClass)} />
            <span>SIMULATION {state.status}</span>
            <span className="text-slate-400">•</span>
            <span className="font-mono tabular-nums">
              {formatTimer(state.elapsedSeconds)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {state.status === "RUNNING" ? (
              <Button
                onClick={pause}
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                <Pause className="mr-2 size-4" />
                Pause
              </Button>
            ) : (
              <Button
                onClick={state.status === "PAUSED" ? resume : start}
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                <Play className="mr-2 size-4" />
                {state.status === "PAUSED" ? "Resume" : "Start"}
              </Button>
            )}

            <Button variant="outline" onClick={reset}>
              <RefreshCw className="mr-2 size-4" />
              Reset
            </Button>
          </div>

          <Button
            onClick={() => setInjectOpen(true)}
            className="w-full bg-cyan-700 text-white hover:bg-cyan-800"
          >
            <BellPlus className="mr-2 size-4" />
            Manual Inject
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {metricCards.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <CardTitle>{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{metric.value}</p>
              <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Capacity Progression Chart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {capacityData.map((item) => {
            const critical = (item.critical / item.total) * 100;
            const stable = (item.stable / item.total) * 100;
            const discharged = (item.discharged / item.total) * 100;

            return (
              <div
                key={item.time}
                className="grid grid-cols-[64px_1fr_42px] items-center gap-3 text-xs"
              >
                <span className="font-medium text-slate-600">{item.time}</span>
                <div className="h-4 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  <div className="flex h-full">
                    <div
                      className="bg-red-500"
                      style={{ width: `${critical}%` }}
                      title={`Critical: ${item.critical}`}
                    />
                    <div
                      className="bg-orange-500"
                      style={{ width: `${stable}%` }}
                      title={`Stable: ${item.stable}`}
                    />
                    <div
                      className="bg-emerald-500"
                      style={{ width: `${discharged}%` }}
                      title={`Discharged: ${item.discharged}`}
                    />
                  </div>
                </div>
                <span className="text-right font-medium tabular-nums text-slate-700">
                  {item.total}
                </span>
              </div>
            );
          })}

          <div className="flex flex-wrap gap-4 border-t border-slate-200 pt-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <span className="size-2 rounded-full bg-red-500" />
              Critical
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="size-2 rounded-full bg-orange-500" />
              Stable
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" />
              Discharged
            </span>
          </div>
        </CardContent>
      </Card>

      {injectOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="manual-inject-title"
        >
          <Card className="w-full max-w-xl shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle id="manual-inject-title">
                    Manual Case Inject
                  </CardTitle>
                  <CardDescription>
                    Append a case instantly to feed and activity log
                  </CardDescription>
                </div>
                <Button
                  aria-label="Close dialog"
                  variant="ghost"
                  size="icon"
                  onClick={() => setInjectOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onInjectSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1 text-sm">
                    <span className="font-medium text-slate-700">
                      Case Type
                    </span>
                    <select
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                      value={caseType}
                      onChange={(event) =>
                        setCaseType(event.target.value as CaseType)
                      }
                    >
                      <option>Cardiac</option>
                      <option>Trauma</option>
                      <option>Respiratory</option>
                      <option>Neurological</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label className="space-y-1 text-sm">
                    <span className="font-medium text-slate-700">Priority</span>
                    <select
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                      value={priority}
                      onChange={(event) =>
                        setPriority(event.target.value as CasePriority)
                      }
                    >
                      <option>P1</option>
                      <option>P2</option>
                      <option>P3</option>
                    </select>
                  </label>
                </div>

                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">
                    Attending Staff
                  </span>
                  <input
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                    value={staff}
                    onChange={(event) => setStaff(event.target.value)}
                    placeholder="e.g. Dr. Amara Osei"
                    required
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="font-medium text-slate-700">
                    Brief Description
                  </span>
                  <textarea
                    className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Add a short clinical summary"
                    required
                  />
                </label>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInjectOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-cyan-700 text-white hover:bg-cyan-800"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default ControlRoom;
