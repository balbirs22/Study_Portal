import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      className="flex flex-col justify-between rounded-[20px] border-0 bg-white/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />

      <div className="px-5 pt-5 pb-3 flex items-start gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white text-lg font-bold shadow-[0_10px_24px_rgba(51,94,250,0.25)]`}
        >
          {index + 1}
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition">
            {title}
          </h3>
          <p className="text-base text-slate-500 mt-1">
            {courseCount ?? 0} courses available
          </p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <Button
          size="lg"
          className="w-full justify-between rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200"
        >
          <span className="text-sm font-semibold">View Courses</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default YearCard;
