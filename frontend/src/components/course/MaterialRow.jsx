import { Button } from "@/components/ui/button";
import { FileText, Video, Download } from "lucide-react";

const typeConfig = {
  pdf: {
    icon: FileText,
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100 text-indigo-700",
  },
  video: {
    icon: Video,
    bg: "bg-rose-50",
    iconBg: "bg-rose-100 text-rose-700",
  },
};

function MaterialRow({
  title,
  size,
  date,
  type = "pdf", // "pdf" | "video" | others
  onDownload,
}) {
  const config = typeConfig[type] || {
    icon: FileText,
    bg: "bg-slate-50",
    iconBg: "bg-slate-100 text-slate-700",
  };
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center justify-between rounded-2xl border border-slate-200 ${config.bg} px-4 py-3 sm:px-5 sm:py-4 shadow-sm`}
    >
      {/* Left: icon + info */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ${config.iconBg}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-900">
            {title}
          </span>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {size && <span>{size}</span>}
            {date && <span>{date}</span>}
            <span className="capitalize">{type}</span>
          </div>
        </div>
      </div>

      {/* Right: Download button */}
      <Button
        size="sm"
        className="ml-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
        onClick={onDownload}
      >
        <Download className="h-4 w-4 mr-1.5" />
        <span className="hidden sm:inline">Download</span>
      </Button>
    </div>
  );
}

export default MaterialRow;
