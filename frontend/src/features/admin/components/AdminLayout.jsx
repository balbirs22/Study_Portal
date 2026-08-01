import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { NavLink } from "react-router-dom";

const mobileLinks = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/branches", "Branches"],
  ["/admin/years", "Years"],
  ["/admin/subjects", "Subjects"],
  ["/admin/materials", "Materials"],
];

function AdminLayout({ children }) {
  return (
    <div className="flex gap-4 lg:gap-6">
      {/* Sidebar (hidden on small screens) */}
      <AdminSidebar />

      {/* Main admin content */}
      <div className="flex-1">
        <AdminTopbar />
        <nav className="mb-5 flex gap-2 overflow-x-auto pb-2 md:hidden" aria-label="Admin sections">
          {mobileLinks.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${isActive ? "bg-[#184d36] text-white" : "border border-slate-200 bg-white text-slate-600"}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-2 space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
