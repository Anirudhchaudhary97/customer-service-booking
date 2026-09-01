import "./StateViews.css";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/**
 * Generic error display. Errors here speak in the interface's voice: what
 * happened and what to do next, never an apology or a raw stack trace.
 */
export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-view state-view-error" role="alert">
      <p className="state-view-title">{title}</p>
      <p className="state-view-text">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
