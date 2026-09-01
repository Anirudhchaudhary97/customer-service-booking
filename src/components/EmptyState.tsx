import "./StateViews.css";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="state-view">
      <p className="state-view-title">{title}</p>
      <p className="state-view-text">{message}</p>
      {action}
    </div>
  );
}
