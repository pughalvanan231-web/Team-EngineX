import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, Activity, Brain, Database } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/feed', label: 'Feed', icon: Radio },
  { path: '/activity', label: 'Activity', icon: Activity },
  { path: '/memory', label: 'Memory', icon: Brain },
  { path: '/sources', label: 'Sources', icon: Database },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E5E7EB] px-2 py-1.5 md:hidden">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-md transition-colors ${
                  isActive
                    ? 'text-[#6D5DFB] font-medium'
                    : 'text-[#6B7280]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px] font-mono">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
