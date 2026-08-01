import TopNavbar from "./TopNavbar";

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#17201b]">
      <TopNavbar />
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="space-y-7">{children}</div>
      </main>
      <footer className="border-t border-[#dfe5de] bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-lg font-black text-[#173f2d]"><BookOpenMark /> StudyBase</div>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">The student-powered academic shelf for everything worth passing down.</p>
          </div>
          <div className="sm:text-right">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-sm font-black text-rose-700">Made with <span aria-label="love">♥</span> by BB &amp; MJ</p>
            <div className="mt-3 flex flex-wrap gap-2 sm:justify-end">
              <a href="https://www.linkedin.com/in/balbirsinghbhatia/" target="_blank" rel="noreferrer" className="rounded-full border border-[#dfe5de] bg-white px-3 py-1.5 text-xs font-bold text-[#184d36] hover:border-[#184d36]">Balbir on LinkedIn ↗</a>
              <a href="https://www.linkedin.com/in/manik-jain123/" target="_blank" rel="noreferrer" className="rounded-full border border-[#dfe5de] bg-white px-3 py-1.5 text-xs font-bold text-[#184d36] hover:border-[#184d36]">Manik on LinkedIn ↗</a>
            </div>
            <p className="mt-2 text-xs text-slate-500">Balbir × Manik · From our campus to yours.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BookOpenMark() {
  return <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#184d36] text-sm text-white">SB</span>;
}

export default AppShell;
