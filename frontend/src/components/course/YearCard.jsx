import { Card } from "@/components/ui/card";
import { ArrowUpRight, BookOpen, Layers3 } from "lucide-react";

const palette = [
  ["bg-[#e4f2e9]", "text-[#17603e]"],
  ["bg-[#fff0d8]", "text-[#9a5814]"],
  ["bg-[#e7ecfb]", "text-[#4058a5]"],
  ["bg-[#f7e8ed]", "text-[#9b405e]"],
];

function YearCard({
  index = 0,
  title,
  courseCount,
  onClick,
}) {
  const [tone, ink] = palette[index % palette.length];

  return (
    <Card
      onClick={onClick}
      className="group flex min-h-64 cursor-pointer flex-col justify-between overflow-hidden rounded-[28px] border border-[#dfe5de] bg-white p-6 shadow-[0_10px_35px_rgba(25,45,34,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(25,45,34,.12)]"
    >
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone} ${ink}`}><Layers3 className="h-5 w-5" /></div>
          <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#184d36]" />
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-slate-400">Academic year {index + 1}</p>
          <h3 className="text-2xl font-black tracking-tight text-[#17201b] transition group-hover:text-[#184d36]">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">Notes, previous papers, video lessons and curated links.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-600">
        <BookOpen className="h-4 w-4" /><span>{courseCount ?? 0} {(courseCount ?? 0) === 1 ? "subject" : "subjects"} available</span>
      </div>
    </Card>
  );
}

export default YearCard;
