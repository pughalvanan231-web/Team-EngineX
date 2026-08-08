import React from 'react';
import { motion } from 'framer-motion';

export function StatCard({ title, value, label, icon: Icon, trend, color = 'purple' }) {
  const accentColors = {
    purple: 'text-[#A78BFA] bg-[#8B5CF6]/10 border-[#8B5CF6]/30',
    green: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30',
    amber: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
  };

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="p-5 rounded-2xl bg-[#101014] border border-[#24242B] hover:border-[#353540] transition-all relative overflow-hidden group shadow-lg"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B5CF6]/5 rounded-full blur-2xl group-hover:bg-[#8B5CF6]/10 transition-all pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-medium text-[#92929D] uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${accentColors[color]} transition-transform group-hover:scale-110`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-3xl font-bold text-[#F5F5F5] font-mono tracking-tight">
          {value}
        </h3>
        {trend && (
          <span className="text-[11px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full border border-[#22C55E]/20">
            {trend}
          </span>
        )}
      </div>

      <p className="text-xs text-[#92929D] mt-1.5 font-sans">
        {label}
      </p>
    </motion.div>
  );
}
