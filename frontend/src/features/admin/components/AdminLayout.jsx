import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout({ children }) {
  return (
    <div className="flex gap-4 lg:gap-6">
      {/* Sidebar (hidden on small screens) */}
      <AdminSidebar />

      {/* Main admin content */}
      <div className="flex-1">
        <AdminTopbar />
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
