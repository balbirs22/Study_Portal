import { useState } from "react";
import {
  BookOpen,
  Heart,
  LayoutGrid,
  ShieldCheck,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function TopNavbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const browseLibrary = () => {
    if (window.location.pathname === "/") {
      document.getElementById("browse")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    navigate("/");
    window.setTimeout(() => document.getElementById("browse")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const navItems = [
    { label: "Home", icon: Home, action: () => navigate("/") },
    { label: "Browse", icon: LayoutGrid, action: browseLibrary },
    { label: "Admin", icon: ShieldCheck, action: () => navigate("/admin/login") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe5de] bg-[#f7f8f5]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-[#184d36] p-2.5 shadow-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-[#17201b]">StudyBase</p>
              <p className="text-[11px] font-medium text-slate-500">Built on campus, for campus</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex items-center space-x-2 rounded-full px-3 py-2 text-slate-600 transition hover:bg-white hover:text-[#184d36]"
                  onClick={() => item.action?.()}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 py-1.5 text-[11px] font-black text-rose-700 lg:flex">
            <Heart className="h-3.5 w-3.5 fill-current" /> BB × MJ
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            aria-label="Toggle menu"
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg">
          <nav className="px-4 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex items-center space-x-2 text-slate-600 w-full py-2"
                  onClick={() => {
                    item.action?.();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

export default TopNavbar;
