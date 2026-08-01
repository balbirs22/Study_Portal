import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, BookOpen, FileText } from "lucide-react";

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
      className="group flex min-h-52 cursor-pointer flex-col justify-between rounded-[26px] border border-[#dfe5de] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className="w-fit rounded-full border-[#cfe1d5] bg-[#edf6f0] px-3 py-1 text-[11px] font-bold text-[#276044]"
        >
          {code}
        </Badge>
        <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:text-[#184d36]" />
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
          {title}
        </h2>

        <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-500">
          {hasPdf && (
            <span className="inline-flex items-center gap-1">
              <FileText className="h-4 w-4" />
              PDFs
            </span>
          )}
          {hasVideo && <span className="inline-flex items-center gap-1"><BookOpen className="h-4 w-4" />Resources</span>}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm font-semibold text-slate-500">
          {fileCount ?? 0} files
        </span>
        <span className="text-sm font-bold text-[#184d36]">Open subject →</span>
      </div>
    </Card>
  );
}

export default CourseCard;
