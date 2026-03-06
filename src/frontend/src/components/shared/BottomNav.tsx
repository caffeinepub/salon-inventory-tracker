import { BarChart2, List, PlusCircle, Settings2 } from "lucide-react";

type Tab = "entry" | "history" | "reports" | "manage";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "entry", label: "Entry", icon: PlusCircle },
  { id: "history", label: "History", icon: List },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "manage", label: "Manage", icon: Settings2 },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              data-ocid={`nav.${id}.tab`}
              onClick={() => onTabChange(id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 min-h-[56px] transition-colors duration-150 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform duration-150 ${
                  isActive ? "scale-110" : ""
                }`}
              />
              <span
                className={`text-xs font-medium leading-none ${
                  isActive ? "text-primary" : ""
                }`}
              >
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-10 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
