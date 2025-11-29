import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

function TopNavbar() {
  return (
    <header className="w-full bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo + title */}
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-slate-900">Course Portal</span>
            <span className="text-xs text-slate-500">
              Your Academic Resource Hub
            </span>
          </div>
        </div>

        {/* Right: Placeholder for future (admin link etc.) */}
        <div className="flex items-center gap-3">
          {/* You can later link this to /admin/login */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex border-slate-300"
          >
            Admin Login
          </Button>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
