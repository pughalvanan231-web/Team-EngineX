import React from 'react';
import { ExternalLink } from 'lucide-react';

export function SourceList({ sources = [] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
      <span className="text-xs font-mono text-[#6B7280] uppercase tracking-wider font-semibold block">
        SOURCES
      </span>
      <div className="flex flex-wrap gap-3">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6D5DFB] hover:underline"
          >
            <span>{source.name}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ))}
      </div>
    </div>
  );
}
