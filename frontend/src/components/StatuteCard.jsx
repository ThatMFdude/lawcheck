import React, { useState } from 'react';

const StatuteCard = ({ statute, index }) => {
  const [expanded, setExpanded] = useState(false);

  const jurisdictionColor = statute.jurisdiction === 'Federal'
    ? 'bg-blue-100 text-blue-700 border-blue-300'
    : 'bg-purple-100 text-purple-700 border-purple-300';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-3 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${jurisdictionColor}`}>
            {statute.jurisdiction}
          </span>
          <span className="text-sm font-bold text-slate-700">{statute.citation}</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-slate-600 text-xl font-bold min-w-[28px] min-h-[28px] flex items-center justify-center"
        >
          {expanded ? '−' : '+'}
        </button>
      </div>

      {/* Title */}
      <div className="text-base font-semibold text-slate-800 mb-1">{statute.title}</div>

      {/* Relevance - always visible */}
      <div className="text-sm text-slate-600 leading-relaxed">{statute.relevance}</div>

      {/* Expanded: URL link */}
      {expanded && statute.url && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <a
            href={statute.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm underline"
          >
            📄 View Full Statute →
          </a>
        </div>
      )}
    </div>
  );
};

export default StatuteCard;