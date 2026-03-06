import { EntryPage } from "@/components/pages/EntryPage";
import { HistoryPage } from "@/components/pages/HistoryPage";
import { ManagePage } from "@/components/pages/ManagePage";
import { ReportsPage } from "@/components/pages/ReportsPage";
import { BottomNav } from "@/components/shared/BottomNav";
import { SideNav } from "@/components/shared/SideNav";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

type Tab = "entry" | "history" | "reports" | "manage";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("entry");

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar — hidden on mobile */}
      <SideNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Mobile top header — hidden on desktop */}
      <header className="lg:hidden sticky top-0 z-40 bg-card border-b border-border shadow-xs">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">
                S
              </span>
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              Salon Tracker
            </span>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-60 pb-24 lg:pb-0 min-h-screen">
        {/* Desktop page header bar */}
        <div className="hidden lg:flex items-center h-14 px-8 border-b border-border bg-card sticky top-0 z-30">
          <h2 className="font-display font-bold text-lg text-foreground capitalize tracking-tight">
            {activeTab === "entry"
              ? "Quick Entry"
              : activeTab === "history"
                ? "Usage History"
                : activeTab === "reports"
                  ? "Reports"
                  : "Manage"}
          </h2>
        </div>

        {/* Page content */}
        <div className="lg:max-w-none">
          {activeTab === "entry" && <EntryPage />}
          {activeTab === "history" && <HistoryPage />}
          {activeTab === "reports" && <ReportsPage />}
          {activeTab === "manage" && <ManagePage />}
        </div>
      </main>

      {/* Mobile footer — hidden on desktop (footer is in sidebar for desktop) */}
      <footer className="lg:hidden max-w-lg mx-auto px-4 py-3 text-center pb-28">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </footer>

      {/* Mobile bottom navigation — hidden on desktop */}
      <div className="lg:hidden">
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Toast notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}
