import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileQuestion } from "lucide-react";

function EmptyState({
  title = "Nothing to show yet",
  description = "There is no data available for this section.",
  icon: Icon = FileQuestion,
}) {
  return (
    <div className="py-6">
      <Alert className="border-dashed border-slate-200 bg-slate-50/80">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <AlertTitle className="text-sm font-semibold text-slate-800">
              {title}
            </AlertTitle>
            <AlertDescription className="text-xs text-slate-500 mt-1">
              {description}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}

export default EmptyState;
