import React from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/': 'Overview',
  '/feed': 'Live Feed',
  '/activity': 'Activity',
  '/memory': 'Agent Memory',
  '/sources': 'Sources',
};

export function Header() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Overview';

  return (
    <header className="h-14 border-b border-[#E5E7EB] bg-[#FFFFFF] sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Left: Page Title */}
      <h1 className="text-sm font-semibold text-[#111827]">
        {title}
      </h1>

      {/* Right: Autonomous Indicator */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
        <span className="text-xs font-mono font-medium text-[#16A34A]">Autonomous</span>
      </div>
    </header>
  );
}
