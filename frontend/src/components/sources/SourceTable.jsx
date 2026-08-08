import React from 'react';
import { ExternalLink } from 'lucide-react';

export function SourceTable({ sources = [] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] bg-[#FFFFFF]">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#F8F8FA] text-xs font-mono text-[#6B7280]">
            <th className="py-3 px-4 font-semibold uppercase">Source</th>
            <th className="py-3 px-4 font-semibold uppercase">Topics</th>
            <th className="py-3 px-4 font-semibold uppercase">Last Checked</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {sources.map((source) => (
            <tr key={source.id} className="hover:bg-[#F8F8FA] transition-colors">
              <td className="py-3 px-4 font-medium text-[#111827]">
                <a
                  href={`https://${source.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#6D5DFB] hover:underline font-mono"
                >
                  <span>{source.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </td>
              <td className="py-3 px-4 font-mono text-[#111827]">
                {source.topicsDiscovered}
              </td>
              <td className="py-3 px-4 font-mono text-[#6B7280]">
                {source.lastChecked}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
