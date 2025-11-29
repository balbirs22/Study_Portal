import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load the data. Please try again.",
  onRetry,
}) {
  return (
    <div className="py-6">
      <Alert variant="destructive" className="bg-rose-50/80 border-rose-200">
        <div className="flex items-start gap-3">
          <TriangleAlert className="h-5 w-5 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <AlertTitle className="text-sm font-semibold text-rose-700">
              {title}
            </AlertTitle>
            <AlertDescription className="text-xs text-rose-600 mt-1">
              {description}
            </AlertDescription>

            {onRetry && (
              <Button
                size="sm"
                variant="outline"
                className="mt-3 h-7 border-rose-200 text-rose-700 hover:bg-rose-100"
                onClick={onRetry}
              >
                Try again
              </Button>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
}

export default ErrorState;
