import React, { useState } from 'react';
import VerdictBadge from './VerdictBadge';
import StatuteCard from './StatuteCard';

const Section = ({ title, icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left active:bg-slate-50"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="font-bold text-slate-800 text-base">{title}</span>
        </div>
        <span className="text-slate-400 text-xl font-bold">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3">
          {children}
        </div>
      )}
    </div>
  );
};

const AnalysisResult = ({ result, scenario }) => {
  return (
    <div className="mt-2">
      {/* Scenario echo */}
      <div className="bg-slate-100 rounded-xl p-3 mb-4 text-sm text-slate-600 italic">
        <span className="font-semibold text-slate-700 not-italic">Your scenario: </span>
        {scenario}
      </div>

      {/* Verdict Badge */}
      <VerdictBadge verdict={result.verdict} />

      {/* Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
        <p className="text-base font-semibold text-slate-800 leading-relaxed">{result.summary}</p>
      </div>

      {/* Explanation */}
      <Section title="Full Explanation" icon="📋" defaultOpen={true}>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{result.explanation}</p>
      </Section>

      {/* Federal Analysis */}
      <Section title="Federal Law Analysis" icon="🏛️">
        <p className="text-sm text-slate-700 leading-relaxed">{result.federal_analysis}</p>
      </Section>

      {/* State Analysis */}
      <Section title="Missouri State Law Analysis" icon="⚖️">
        <p className="text-sm text-slate-700 leading-relaxed">{result.state_analysis}</p>
      </Section>

      {/* Statutes */}
      <Section title={`Applicable Statutes & Laws (${result.statutes?.length || 0})`} icon="📚" defaultOpen={true}>
        {result.statutes && result.statutes.length > 0 ? (
          result.statutes.map((statute, index) => (
            <StatuteCard key={index} statute={statute} index={index} />
          ))
        ) : (
          <p className="text-sm text-slate-500 italic">No specific statutes identified.</p>
        )}
      </Section>

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <Section title="Important Warnings" icon="⚠️" defaultOpen={true}>
          <ul className="space-y-2">
            {result.warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 rounded-xl p-3">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-800 rounded-2xl p-4 mb-6">
        <p className="text-xs text-slate-300 leading-relaxed text-center">{result.disclaimer}</p>
      </div>
    </div>
  );
};

export default AnalysisResult;