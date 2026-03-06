import { BarChart2, List, PlusCircle, Settings2 } from "lucide-react";

type Tab = "entry" | "history" | "reports" | "manage";

interface SideNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const navItems: {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "entry", label: "Entry", icon: PlusCircle },
  { id: "history", label: "History", icon: List },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "manage", label: "Manage", icon: Settings2 },
];

export function SideNav({ activeTab, onTabChange }: SideNavProps) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 z-50 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo / Title */}
      <div className="px-5 pt-6 pb-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
            <span className="text-primary-foreground text-base font-bold">
              S
            </span>
          </div>
          <div>
            <p className="font-display font-bold text-base text-sidebar-foreground leading-tight">
              Salon Tracker
            </p>
            <p className="text-xs text-muted-foreground font-outfit mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              data-ocid={`sidebar.${id}.link`}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon
                className={`h-4.5 w-4.5 shrink-0 transition-transform duration-150 ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}
              />
              <span>{label}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground opacity-70" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors leading-snug block"
        >
          Built with ♥ using caffeine.ai
        </a>
      </div>
    </aside>
  );
}
