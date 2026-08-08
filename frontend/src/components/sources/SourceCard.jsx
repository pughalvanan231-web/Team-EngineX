import React from 'react';
import { ExternalLink, CheckCircle, Database, ShieldCheck, Clock, FileText } from 'lucide-react';
import { Badge } from '../common/Badge';

export function SourceCard({ source }) {
  return (
    <div className="p-5 rounded-2xl bg-[#101014] border border-[#24242B] hover:border-[#353540] transition-all space-y-4 shadow-lg group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#07070A] border border-[#24242B] flex items-center justify-center text-[#A78BFA] group-hover:border-[#8B5CF6]/40 transition-colors">
            <Database className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-[#F5F5F5] font-mono">
              {source.name}
            </h4>
            <a
              href={`https://${source.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[#92929D] hover:text-[#A78BFA] transition-colors inline-flex items-center gap-1"
            >
              {source.domain}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <Badge variant="green" size="sm" pulse>
          {source.status || 'Active'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-[#07070A] border border-[#24242B]">
          <span className="text-[#92929D] text-[10px] uppercase block mb-0.5">Topics Discovered</span>
          <span className="text-[#F5F5F5] font-bold text-sm">{source.topicsDiscovered}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-[#07070A] border border-[#24242B]">
          <span className="text-[#92929D] text-[10px] uppercase block mb-0.5">Posts Generated</span>
          <span className="text-[#A78BFA] font-bold text-sm">{source.postsGenerated}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#24242B]/80 flex items-center justify-between text-xs font-mono text-[#92929D]">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Checked {source.lastChecked}</span>
        </div>
        <div className="flex items-center gap-1 text-[#22C55E]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{source.reliability} Reliability</span>
        </div>
      </div>
    </div>
  );
}
