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
      className="flex items-stretch justify-between rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer px-5 py-4"
    >
      {/* Left main content */}
      <div className="flex flex-col gap-2">
        <Badge
          variant="outline"
          className="border-indigo-100 bg-indigo-50 text-xs font-medium text-indigo-700 w-fit px-2.5 py-1 rounded-lg"
        >
          {code}
        </Badge>

        <h2 className="text-base sm:text-lg font-medium text-slate-900">
          {title}
        </h2>

        <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-1">
          {hasPdf && (
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              PDFs
            </span>
          )}
          {hasVideo && (
            <span className="inline-flex items-center gap-1">
              <PlayCircle className="h-3.5 w-3.5" />
              Videos
            </span>
          )}
        </div>
      </div>

      {/* Right side: file count + arrow */}
      <div className="flex flex-col items-end justify-between ml-4">
        <span className="text-xs text-slate-500 mb-2">
          {fileCount ?? 0} files
        </span>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </div>
    </Card>
  );
}

export default CourseCard;
