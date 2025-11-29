import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsPill from "./StatsPill";
import { ChevronRight } from "lucide-react";

const gradientByIndex = [
  "from-indigo-500 to-sky-500",
  "from-fuchsia-500 to-pink-500",
  "from-orange-500 to-amber-500",
  "from-emerald-500 to-teal-500",
];

function YearCard({
  index = 0,
  title,
  courseCount,
  onClick,
}) {
  const gradient = gradientByIndex[index % gradientByIndex.length];

  return (
    <Card
      onClick={onClick}
      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Color strip + number */}
      <div
        className={`flex items-center gap-3 px-5 py-4 bg-gradient-to-r ${gradient}`}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-slate-900 text-base font-semibold">
          {index + 1}
        </div>
        <div className="flex flex-col text-white">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-[11px] text-white/80">
            Choose your courses for this year
          </span>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex items-center justify-between px-5 py-4 bg-white">
        <StatsPill label={`${courseCount ?? 0} courses available`} />
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-2"
        >
          <span className="text-xs font-medium mr-1.5">View Courses</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default YearCard;
