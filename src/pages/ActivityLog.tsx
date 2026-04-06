import { AlertCircle, ChevronDown, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useSimulation } from "../context/simulation-context";
import { cn, formatDateTime } from "../lib/utils";
import type { Severity } from "../types/main";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ActivityLog = () => {
  const { state } = useSimulation();

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<
    "all" | "critical" | "urgent" | "stable"
  >("all");
  
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const severityDotClasses: Record<Severity, string> = {
    critical: "bg-red-500",
    urgent: "bg-orange-300",
    stable: "bg-emerald-500",
  };
  
  const severityBadgeClasses: Record<Severity, string> = {
    critical: "border-red-200 bg-red-50 text-red-700",
    urgent: "border-orange-200 bg-orange-50 text-orange-700",
    stable: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  

  const filteredLogs = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = state.logItems.filter((entry) => {
      const matchesSeverity =
        severity === "all" ? true : entry.severity === severity;
      const matchesSearch =
        term.length === 0
          ? true
          : [entry.title, entry.staff, entry.details].some((field) =>
              field.toLowerCase().includes(term),
            );
      return matchesSeverity && matchesSearch;
    });

    return result.sort((a, b) => {
      const left = new Date(a.timestamp).getTime();
      const right = new Date(b.timestamp).getTime();
      return sort === "newest" ? right - left : left - right;
    });
  }, [search, severity, sort, state.logItems]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">Activity Log</h1>
        <p className="mt-1 text-sm text-slate-500">
          Complete case history and staff actions
        </p>
      </div>

      <Card>
        <CardContent className="grid gap-3 pt-5 md:grid-cols-[1fr_180px_180px_auto]">
          <label className="sr-only" htmlFor="search-log">
            Search log entries
          </label>
          <input
            id="search-log"
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
            placeholder="Search by case, staff, or details..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <label className="sr-only" htmlFor="severity-filter">
            Severity filter
          </label>
          <div className="relative">
            <select
              id="severity-filter"
              className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm"
              value={severity}
              onChange={(event) =>
                setSeverity(
                  event.target.value as
                    | "all"
                    | "critical"
                    | "urgent"
                    | "stable",
                )
              }
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="urgent">Urgent</option>
              <option value="stable">Stable</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>

          <label className="sr-only" htmlFor="sort-order">
            Sort order
          </label>
          <div className="relative">
            <select
              id="sort-order"
              className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>

          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredLogs.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="pt-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        severityDotClasses[entry.severity],
                      )}
                    />
                    <h2 className="truncate text-base font-semibold">
                      {entry.title}
                    </h2>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full border px-2 py-1 text-xs font-medium",
                    severityBadgeClasses[entry.severity],
                  )}
                >
                  {entry.severity[0].toUpperCase() + entry.severity.slice(1)}
                </span>
              </div>

              <dl className="mt-3 grid gap-1 text-sm text-slate-700">
                <div>
                  <dt className="inline text-slate-500">Staff: </dt>
                  <dd className="inline font-semibold">{entry.staff}</dd>
                </div>
                <div>
                  <dt className="inline text-slate-500">Time: </dt>
                  <dd className="inline">{formatDateTime(entry.timestamp)}</dd>
                </div>
                <div>
                  <dt className="inline text-slate-500">Details: </dt>
                  <dd className="inline">{entry.details}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-6 text-sm text-slate-500">
            <AlertCircle className="size-4" />
            No activity entries match your current filters.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default ActivityLog;
