import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, FileText, PlayCircle } from "lucide-react";

function CourseCard({
  code,
  title,
  fileCount,
  hasPdf = true,
  hasVideo = true,
  onClick,
}) {
  return (
    <Card
      onClick={onClick}
      className="flex items-stretch justify-between rounded-2xl border-0 bg-white/90 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer px-5 py-5"
    >
      <div className="flex flex-col gap-2 pr-4">
        <Badge
          variant="outline"
          className="border-indigo-100 bg-indigo-50 text-[11px] font-semibold text-indigo-700 w-fit px-3 py-1 rounded-md shadow-[0_4px_12px_rgba(79,70,229,0.08)]"
        >
          {code}
        </Badge>

        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
          {title}
        </h2>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-1">
          {hasPdf && (
            <span className="inline-flex items-center gap-1">
              <FileText className="h-4 w-4" />
              PDFs
            </span>
          )}
          {hasVideo && (
            <span className="inline-flex items-center gap-1">
              <PlayCircle className="h-4 w-4" />
              Videos
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between ml-4">
        <span className="text-sm text-slate-500 mb-3">
          {fileCount ?? 0} files
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}

export default CourseCard;
