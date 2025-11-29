import TopNavbar from "./TopNavbar";
import { Separator } from "@/components/ui/separator";

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top nav */}
      <TopNavbar />

      {/* Separator below nav */}
      <Separator className="bg-slate-200" />

      {/* Main content area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {children}
      </main>
    </div>
  );
}

export default AppShell;
