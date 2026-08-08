import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, Activity, Database, Brain } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/feed', label: 'Feed', icon: Radio },
  { path: '/activity', label: 'Activity', icon: Activity },
  { path: '/sources', label: 'Sources', icon: Database },
  { path: '/memory', label: 'Memory', icon: Brain },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#07070A]/95 border-t border-[#24242B] backdrop-blur-lg px-2 py-1.5 md:hidden">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1.5 px-3 rounded-lg transition-all ${
                  isActive
                    ? 'text-[#A78BFA] font-medium'
                    : 'text-[#92929D] hover:text-[#F5F5F5]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#A78BFA]' : 'text-[#92929D]'}`} />
                  <span className="text-[10px] font-mono">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
