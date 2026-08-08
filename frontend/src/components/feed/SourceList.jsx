import React from 'react';
import { ExternalLink, Link2, Globe, Github } from 'lucide-react';

export function SourceList({ sources = [] }) {
  if (!sources || sources.length === 0) return null;

  const getSourceIcon = (domain = '') => {
    if (domain.includes('github')) return Github;
    return Globe;
  };

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-mono text-[#92929D] uppercase tracking-wider font-medium">
        SOURCES
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => {
          const Icon = getSourceIcon(source.domain);
          return (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#07070A] hover:bg-[#15151B] text-xs font-mono text-[#A78BFA] hover:text-[#F5F5F5] border border-[#24242B] hover:border-[#8B5CF6]/50 transition-all group"
            >
              <Icon className="w-3.5 h-3.5 text-[#8B5CF6] group-hover:scale-110 transition-transform" />
              <span>{source.name}</span>
              <ExternalLink className="w-3 h-3 text-[#92929D] group-hover:text-[#F5F5F5]" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
