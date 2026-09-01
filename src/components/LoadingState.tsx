import "./StateViews.css";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="state-view" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p className="state-view-text">{label}</p>
    </div>
  );
}
