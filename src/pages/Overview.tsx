import { useSimulation } from "@/context/simulation-context";
import { formatTimeOnly } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileUser, Timer, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Severity } from "@/types/main";
import { getGreeting } from "@/lib/utils";

const Overview = () => {
  const { state } = useSimulation();
  const greeting = getGreeting();
  const severityDotClasses: Record<Severity, string> = {
    critical: "bg-red-500",
    urgent: "bg-orange-400",
    stable: "bg-emerald-500",
  };

  const statCards = [
    {
      title: "Active Cases",
      value: "12",
      label: "+3 from last hour",
      accent: "bg-red-100 text-red-700",
      icon: FileUser,
      dot: "bg-red-500",
    },
    {
      title: "Avg Triage Time",
      value: "184s",
      label: "Across all cases",
      accent: "bg-orange-100 text-orange-700",
      icon: Timer,
      dot: "bg-orange-500",
    },
    {
      title: "On-Duty Staff",
      value: "18",
      label: "14 currently active",
      accent: "bg-emerald-100 text-emerald-700",
      icon: Users,
      dot: "bg-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">
            {greeting}, Damilola
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s the current state of your A&amp;E simulation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            Last 24h
          </Button>
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{card.title}</CardTitle>
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    card.accent,
                  )}
                >
                  <card.icon className="size-5" />
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Live Case Feed</CardTitle>
          <CardDescription>Real-time patient intake</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-115 space-y-3 overflow-y-auto pr-1">
            {state.feedItems.map((entry) => (
              <article
                key={entry.id}
                className="rounded-lg border border-slate-200 bg-white p-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        severityDotClasses[entry.severity],
                      )}
                    />
                    <p className="truncate text-sm font-semibold">
                      {entry.title}
                    </p>
                  </div>
                  <p className="text-xs tabular-nums text-slate-500">
                    {formatTimeOnly(entry.timestamp)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-slate-500">{entry.staff}</p>
                <p className="mt-1 text-sm text-slate-700">
                  {entry.description}
                </p>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Overview;
