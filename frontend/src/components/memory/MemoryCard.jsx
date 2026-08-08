import React from 'react';
import { BookmarkCheck, ExternalLink, Calendar, Radio } from 'lucide-react';
import { Badge } from '../common/Badge';

export function MemoryCard({ item }) {
  return (
    <div className="p-4 rounded-xl bg-[#101014] border border-[#24242B] hover:border-[#8B5CF6]/40 transition-all flex items-center justify-between gap-4 group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#A78BFA] shrink-0">
          <BookmarkCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Badge variant="purple" size="sm">
              PUBLISHED
            </Badge>
            <span className="text-[11px] font-mono text-[#92929D]">{item.date}</span>
          </div>
          <h4 className="text-sm font-semibold text-[#F5F5F5] font-mono group-hover:text-[#A78BFA] transition-colors">
            {item.topic}
          </h4>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="text-xs font-mono text-[#92929D] group-hover:text-[#F5F5F5] transition-colors inline-flex items-center gap-1">
          Memory Index #{item.id}
        </span>
      </div>
    </div>
  );
}
