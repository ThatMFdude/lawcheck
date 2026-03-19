import React from 'react';

const VerdictBadge = ({ verdict }) => {
  const config = {
    LEGAL: {
      icon: '✅',
      label: 'LEGAL',
      bg: 'bg-green-100',
      border: 'border-green-500',
      text: 'text-green-800',
      glow: 'shadow-green-200',
      subtext: 'This appears to be lawful under applicable laws',
    },
    ILLEGAL: {
      icon: '🚫',
      label: 'ILLEGAL',
      bg: 'bg-red-100',
      border: 'border-red-500',
      text: 'text-red-800',
      glow: 'shadow-red-200',
      subtext: 'This appears to violate applicable laws',
    },
    'GRAY AREA': {
      icon: '⚠️',
      label: 'GRAY AREA',
      bg: 'bg-yellow-100',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      glow: 'shadow-yellow-200',
      subtext: 'This scenario has legal complexities — consult an attorney',
    },
  };

  const c = config[verdict] || config['GRAY AREA'];

  return (
    <div className={`${c.bg} border-4 ${c.border} rounded-2xl p-6 text-center shadow-lg ${c.glow} mb-4`}>
      <div className="text-6xl mb-2">{c.icon}</div>
      <div className={`text-3xl font-black ${c.text} tracking-wide`}>{c.label}</div>
      <div className={`text-sm font-medium mt-2 ${c.text} opacity-80`}>{c.subtext}</div>
    </div>
  );
};

export default VerdictBadge;