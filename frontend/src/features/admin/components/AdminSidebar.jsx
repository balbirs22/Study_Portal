import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Layers3,
  BookOpen,
  Files,
} from "lucide-react";

const links = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/branches",
    label: "Branches",
    icon: GraduationCap,
  },
  {
    to: "/admin/years",
    label: "Years",
    icon: Layers3,
  },
  {
    to: "/admin/subjects",
    label: "Subjects",
    icon: BookOpen,
  },
  {
    to: "/admin/materials",
    label: "Materials",
    icon: Files,
  },
];

function AdminSidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-56 shrink-0 rounded-2xl border border-slate-200 bg-white shadow-sm p-3">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Admin Panel
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Manage structure & content
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
