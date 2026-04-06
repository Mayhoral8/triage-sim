import { Button } from "@/components/ui/button";
import { SimulationProvider } from "@/context/simulation-context";
import Sidebar from "./components/Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ActivityLog from "@/pages/ActivityLog";
import ControlRoom from "@/pages//ControlRoom";
import Overview from "@/pages/Overview";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cyan-50/50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only left-3 top-3 z-60 rounded-md bg-white px-3 py-2 text-sm shadow focus:not-sr-only focus:fixed"
      >
        Skip to main content
      </a>

      {sidebarOpen ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="md:pl-72">
        <header className="sticky top-0 z-20 flex h-14 items-center border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <Button
            aria-label="Open navigation"
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
          <p className="text-sm text-slate-500">
            Hospital A&amp;E Operations Dashboard
          </p>
        </header>

        <main
          id="main-content"
          className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8"
        >
          <Routes>
            <Route path="/overview" element={<Overview />} />
            <Route path="/control-room" element={<ControlRoom />} />
            <Route path="/activity-log" element={<ActivityLog />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <SimulationProvider>
      <MainLayout />
    </SimulationProvider>
  );
}

export default App;
