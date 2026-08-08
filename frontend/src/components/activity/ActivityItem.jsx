import React from 'react';
import { motion } from 'framer-motion';
import { Send, Search, XCircle, CheckCircle2, AlertTriangle, RefreshCw, Radio } from 'lucide-react';
import { Badge } from '../common/Badge';

export function ActivityItem({ item, index = 0 }) {
  const getIconAndVariant = (type) => {
    switch (type) {
      case 'published':
        return { icon: Send, variant: 'purple', bg: 'bg-[#8B5CF6]/15', text: 'text-[#A78BFA]' };
      case 'accepted':
        return { icon: CheckCircle2, variant: 'green', bg: 'bg-[#22C55E]/15', text: 'text-[#22C55E]' };
      case 'rejected':
        return { icon: XCircle, variant: 'warning', bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]' };
      case 'discovered':
        return { icon: Search, variant: 'neutral', bg: 'bg-cyan-500/15', text: 'text-cyan-400' };
      case 'error':
        return { icon: AlertTriangle, variant: 'error', bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]' };
      case 'cycle_started':
      default:
        return { icon: RefreshCw, variant: 'purple', bg: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]' };
    }
  };

  const { icon: Icon, variant, bg, text } = getIconAndVariant(item.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="flex items-start gap-4 p-4 rounded-xl bg-[#101014] border border-[#24242B] hover:border-[#353540] transition-all group relative overflow-hidden"
    >
      {/* Time & Icon Marker */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-mono font-medium text-[#92929D] min-w-[65px]">
          {item.timestamp}
        </span>
        <div className={`p-2 rounded-xl border border-current/20 ${bg} ${text} transition-transform group-hover:scale-110`}>
          <Icon className={`w-4 h-4 ${item.type === 'cycle_started' ? 'animate-spin-slow' : ''}`} />
        </div>
      </div>

      {/* Main Activity Details */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-[#F5F5F5] font-mono tracking-tight">
            {item.title}
          </h4>
          {item.badge && (
            <Badge variant={variant} size="sm">
              {item.badge}
            </Badge>
          )}
        </div>

        <p className="text-xs text-[#92929D] font-sans leading-relaxed">
          {item.description}
        </p>

        {item.detail && (
          <p className="text-[11px] font-mono text-[#8B5CF6]/80 pt-1">
            {item.detail}
          </p>
        )}
      </div>

      {item.score && (
        <div className="shrink-0 text-right">
          <span className="text-xs font-mono font-semibold text-[#F5F5F5] px-2.5 py-1 rounded-md bg-[#07070A] border border-[#24242B]">
            {item.score}
          </span>
        </div>
      )}
    </motion.div>
  );
}
