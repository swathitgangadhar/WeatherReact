import React from "react";
export default function StatCard({ theme, title, value, footer, progressWidth, progressClassName = "bg-blue-400", children }) {
  return (
    <div className={`${theme.card} backdrop-blur-md rounded-2xl p-3 border ${theme.border}`}>
      <p className="text-white/50 text-xs mb-1">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {progressWidth !== undefined && (
        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${progressClassName}`} style={{ width: progressWidth }} />
        </div>
      )}
      {footer ? <p className="text-white/50 text-xs mt-1">{footer}</p> : null}
      {children}
    </div>
  );
}
