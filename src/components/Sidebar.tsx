import { Button } from './ui/button'
import { Activity, ClipboardList, Moon, LayoutDashboard, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';


const Sidebar: React.FC<{ sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }> = ({ sidebarOpen, setSidebarOpen }) => {
  const navItems = [
  { label: "Overview", path: "/overview", icon: LayoutDashboard },
  { label: "Control Room", path: "/control-room", icon: Activity },
  { label: "Activity Log", path: "/activity-log", icon: ClipboardList },
] as const;
  return (
     <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r  border-slate-200 bg-white px-4 py-4 transition-transform duration-200 md:translate-x-0 flex flex-col justify-between",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <section className="flex w-full flex-col">
          <div className="mb-4 flex items-center justify-between px-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                TriageSim
              </p>
              <p className="text-sm text-slate-500">A&amp;E Operations</p>
            </div>
            <Button
              aria-label="Close navigation"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                  )
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </section>
        <div className="mt-auto space-y-3 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
              <span className="text-xs font-semibold">DB</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Damilola Bayo</p>
              <p className="truncate text-xs text-slate-500">
                Admin
              </p>
            </div>
            <Button
              aria-label="Toggle dark mode"
              variant="ghost"
              size="icon"
              className="size-8"
            >
              <Moon className="size-4" />
            </Button>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            <span className="font-semibold">System status:</span> Operational
          </div>
        </div>
      </aside>
  )
}

export default Sidebar