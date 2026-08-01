import { useNavigate } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import { BookMarked, Coffee, FolderOpen, Heart, Sparkles, Users, Video, Zap } from "lucide-react";
import PortalSearch from "@/components/search/PortalSearch";

import YearCard from "@/components/course/YearCard";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import { useYears } from "../hooks/useYears";

function YearSelectionPage() {
  const navigate = useNavigate();
  const { years, loading, error, refetch } = useYears();

  const handleYearClick = (year) => {
    // You can navigate however your routes are designed.
    // Example: /year/:id
    navigate(`/year/${year._id || year.id}`, { state: { yearName: year.label } });
  };

  return (
    <AppShell>
      <section className="hero-grid relative overflow-hidden rounded-[36px] bg-[#173f2d] px-6 py-14 text-white sm:px-10 lg:px-14 lg:py-20">
        <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border-[52px] border-[#efb54a]/15" />
        <div className="absolute -bottom-24 right-[18%] h-48 w-48 rounded-full bg-[#4f9b70]/20 blur-3xl" />
        <div className="absolute right-8 top-8 hidden rotate-6 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-[#f6d38c] backdrop-blur lg:block">No gatekeeping ✦</div>
        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#d9efdf]"><Sparkles className="h-3.5 w-3.5" />Made on campus, for students</div>
          <h1 className="text-4xl font-black leading-[1.02] tracking-[-.05em] sm:text-6xl lg:text-7xl">Study smarter.<br/><span className="text-[#f1be5b]">Share louder.</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#cfe2d5] sm:text-lg">Your seniors found it. Your friends shared it. We put it all in one place—notes, PYQs, videos and Drive folders that actually help.</p>
          <PortalSearch className="mt-8 max-w-2xl" />
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-[#b8d0c0]"><span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Student curated</span><span className="flex items-center gap-1.5"><Zap className="h-4 w-4" /> Zero clutter</span><span className="flex items-center gap-1.5"><Heart className="h-4 w-4" /> Built by BB &amp; MJ</span></div>
        </div>
      </section>

      <div className="ticker overflow-hidden rounded-2xl bg-[#efb54a] py-3 text-[#33250d]">
        <div className="ticker-track flex w-max items-center gap-8 whitespace-nowrap text-xs font-black uppercase tracking-[.18em]">
          {[0, 1].map((copy) => <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}><span>Notes before noise</span><span>✦</span><span>PYQs before panic</span><span>✦</span><span>Made on campus</span><span>✦</span><span>Powered by students</span><span>✦</span><span>Share what you know</span><span>✦</span></div>)}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Feature icon={<BookMarked className="h-5 w-5" />} title="Notes & PYQs" copy="Exam-ready resources" />
        <Feature icon={<Video className="h-5 w-5" />} title="Video lessons" copy="Learn at your pace" />
        <Feature icon={<FolderOpen className="h-5 w-5" />} title="Drive folders" copy="Curated collections" />
      </section>

      <section className="grid overflow-hidden rounded-[28px] border border-[#dfe5de] bg-white lg:grid-cols-[1.2fr_.8fr]">
        <div className="p-7 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#2e7753]">Why StudyBase?</p>
          <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-.03em] text-[#17201b] sm:text-4xl">Because the best campus resources shouldn’t disappear in old group chats.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">We’re building the shelf we wish every junior had: organised, searchable and kept alive by students who share what worked.</p>
        </div>
        <div className="flex flex-col justify-center gap-3 bg-[#edf5ef] p-7 sm:p-10">
          <Quote icon={<Coffee className="h-4 w-4" />} text="Made between lectures, deadlines and chai breaks." />
          <Quote icon={<Users className="h-4 w-4" />} text="By students who know the struggle." />
          <Quote icon={<Heart className="h-4 w-4" />} text="BB & MJ — building for our campus." />
        </div>
      </section>

      <section aria-labelledby="campus-memes-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[.2em] text-[#2e7753]">Campus mood board</p><h2 id="campus-memes-title" className="mt-2 text-2xl font-black text-[#17201b]">Painfully relatable. Academically useful.</h2></div>
          <p className="hidden text-sm font-semibold text-slate-500 sm:block">Certified by the group chat ✓</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Meme emoji="😌" setup="Professor: ‘It’s in the syllabus.’" punchline="StudyBase: Say less." tone="bg-[#e9f3ec]" />
          <Meme emoji="🫠" setup="Exam tomorrow. 47 unread messages." punchline="One organised PYQ folder: hero entry." tone="bg-[#fff1d5]" />
          <Meme emoji="🤝" setup="Senior uploads clean notes." punchline="Junior’s CGPA liked this post." tone="bg-[#eef0ff]" />
        </div>
      </section>

      <section id="browse" className="scroll-mt-28 pt-4">
        <p className="text-xs font-black uppercase tracking-[.2em] text-[#2e7753]">Browse the library</p>
        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-3xl font-black tracking-tight text-[#17201b]">Choose your academic year</h2><p className="mt-2 text-slate-500">Start here, then narrow down by branch and semester.</p></div><p className="text-sm font-semibold text-slate-500">{years.length} {years.length === 1 ? "year" : "years"} available</p></div>
      </section>

      {/* Loading state */}
      {loading && <Loader fullPage={false} label="Loading academic years..." />}

      {/* Error state */}
      {!loading && error && (
        <ErrorState
          description={error}
          onRetry={refetch}
        />
      )}

      {/* Empty state */}
      {!loading && !error && years.length === 0 && (
        <EmptyState
          title="No years available"
          description="Once academic years are added by the admin, they will appear here."
        />
      )}

      {/* Grid of YearCards */}
      {!loading && !error && years.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {years.map((year, idx) => (
            <YearCard
              key={year._id || year.id || idx}
              index={idx}
              title={year.label || `Year ${idx + 1}`}
              courseCount={
                year.courseCount ??
                year.coursesCount ??
                year.totalCourses ??
                0
              }
              onClick={() => handleYearClick(year)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}

function Feature({ icon, title, copy }) {
  return <a href="#browse" className="group flex items-center gap-4 rounded-2xl border border-[#dfe5de] bg-white px-5 py-4 text-inherit transition hover:-translate-y-0.5 hover:border-[#7ba38b] hover:text-inherit hover:shadow-md"><div className="rounded-xl bg-[#e7f1ea] p-2.5 text-[#184d36]">{icon}</div><div className="flex-1"><p className="font-bold text-[#26342c]">{title}</p><p className="text-xs text-slate-500">{copy}</p></div><span className="text-sm font-black text-[#184d36] transition group-hover:translate-x-1">→</span></a>;
}

function Quote({ icon, text }) {
  return <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 text-sm font-bold text-[#294033] shadow-sm"><span className="text-[#2e7753]">{icon}</span>{text}</div>;
}

function Meme({ emoji, setup, punchline, tone }) {
  return <article className={`${tone} rounded-[24px] border border-black/5 p-5`}><span className="text-4xl" aria-hidden="true">{emoji}</span><p className="mt-5 text-sm font-semibold text-slate-600">{setup}</p><p className="mt-2 text-lg font-black leading-snug text-[#17201b]">{punchline}</p></article>;
}

export default YearSelectionPage;
