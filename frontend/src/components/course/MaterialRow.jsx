import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Video, Download } from "lucide-react";

const typeConfig = {
  pdf: {
    icon: FileText,
    bg: "bg-white/90",
    ring: "border border-slate-200/70",
    iconBg: "bg-blue-100 text-blue-600",
  },
  video: {
    icon: Video,
    bg: "bg-rose-50",
    ring: "border border-rose-100",
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
    bg: "bg-white/90",
    ring: "border border-slate-200/70",
    iconBg: "bg-slate-100 text-slate-700",
  };
  const Icon = config.icon;

  return (
    <Card className={`hover:shadow-md transition-shadow ${config.bg} ${config.ring} rounded-2xl`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={`mt-0.5 flex h-12 w-12 items-center justify-center rounded-lg ${config.iconBg}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                {size && <span>{size}</span>}
                {date && <span>{date}</span>}
                <span className="capitalize">{type}</span>
              </div>
            </div>
          </div>

          <Button
            size="sm"
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 h-10"
            onClick={onDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Download
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default MaterialRow;
