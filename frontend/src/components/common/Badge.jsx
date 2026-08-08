import React from 'react';

export function Badge({ children, variant = 'purple', pulse = false, size = 'md', className = '' }) {
  const baseStyles = 'inline-flex items-center font-mono font-medium rounded-full tracking-wide transition-all';
  
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3 py-1.5 gap-2.5'
  };

  const variantStyles = {
    purple: 'bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30',
    green: 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
    error: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
    neutral: 'bg-[#24242B]/60 text-[#92929D] border border-[#24242B]',
    glowing: 'bg-[#8B5CF6]/20 text-[#F5F5F5] border border-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.5)]'
  };

  const dotColors = {
    purple: 'bg-[#A78BFA]',
    green: 'bg-[#22C55E]',
    warning: 'bg-[#F59E0B]',
    error: 'bg-[#EF4444]',
    neutral: 'bg-[#92929D]',
    glowing: 'bg-[#8B5CF6]'
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant] || 'bg-current'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant] || 'bg-current'}`} />
        </span>
      )}
      {children}
    </span>
  );
}
