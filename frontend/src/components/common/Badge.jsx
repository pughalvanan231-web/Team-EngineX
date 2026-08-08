import React from 'react';

export function Badge({ children, variant = 'purple', pulse = false, size = 'md', className = '' }) {
  const baseStyles = 'inline-flex items-center font-mono font-medium rounded-md tracking-tight transition-all';
  
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-xs px-3 py-1 gap-2'
  };

  const variantStyles = {
    purple: 'bg-[#F3F0FF] text-[#6D5DFB] border border-[#6D5DFB]/20',
    green: 'bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/20',
    warning: 'bg-[#FFFBEB] text-[#D97706] border border-[#D97706]/20',
    error: 'bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/20',
    neutral: 'bg-[#F8F8FA] text-[#6B7280] border border-[#E5E7EB]'
  };

  const dotColors = {
    purple: 'bg-[#6D5DFB]',
    green: 'bg-[#16A34A]',
    warning: 'bg-[#D97706]',
    error: 'bg-[#DC2626]',
    neutral: 'bg-[#6B7280]'
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
