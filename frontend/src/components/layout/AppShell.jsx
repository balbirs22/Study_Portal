import TopNavbar from "./TopNavbar";

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#17201b]">
      <TopNavbar />
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="space-y-7">{children}</div>
      </main>
      <footer className="border-t border-[#dfe5de] bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-semibold text-[#26342c]">StudyBase · Built by students, for students.</p>
          <p>Organised notes. Reliable resources. Less searching.</p>
        </div>
      </footer>
    </div>
  );
}

export default AppShell;
