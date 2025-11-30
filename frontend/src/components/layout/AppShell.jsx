import TopNavbar from "./TopNavbar";

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900">
      <TopNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="space-y-8">{children}</div>
      </main>
    </div>
  );
}

export default AppShell;
