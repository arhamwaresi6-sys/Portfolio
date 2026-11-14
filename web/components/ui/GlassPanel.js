export function GlassPanel({ children, className = "" }) {
  return (
    <div className={`glass-panel ${className}`.trim()}>{children}</div>
  );
}
