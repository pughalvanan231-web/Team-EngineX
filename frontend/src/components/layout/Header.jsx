import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export function Header() {
  const { error } = useAgent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isOnline = !error;

  return (
    <header className="w-full border-b border-[#E5E5E5] bg-[#FFFFFF] sticky top-0 z-30">
      <div className="max-w-[720px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <Link to="/" className="font-bold text-base text-[#111111] tracking-tight font-mono hover:opacity-80">
          NOVA
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'text-[#111111] font-medium' : 'text-[#737373] hover:text-[#111111] transition-colors'
            }
          >
            Feed
          </NavLink>
          <NavLink
            to="/activity"
            className={({ isActive }) =>
              isActive ? 'text-[#111111] font-medium' : 'text-[#737373] hover:text-[#111111] transition-colors'
            }
          >
            Activity
          </NavLink>
          <NavLink
            to="/memory"
            className={({ isActive }) =>
              isActive ? 'text-[#111111] font-medium' : 'text-[#737373] hover:text-[#111111] transition-colors'
            }
          >
            Memory
          </NavLink>
        </nav>

        {/* Far Right: Status Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#16A34A] animate-pulse' : 'bg-[#DC2626]'}`} />
            <span className={isOnline ? 'text-[#16A34A] font-medium' : 'text-[#DC2626]'}>
              {isOnline ? 'Autonomous' : 'Offline'}
            </span>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1 text-[#737373] hover:text-[#111111]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E5E5E5] bg-[#FFFFFF] px-4 py-3 space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block py-1.5 text-sm ${isActive ? 'text-[#111111] font-medium' : 'text-[#737373]'}`
            }
          >
            Feed
          </NavLink>
          <NavLink
            to="/activity"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block py-1.5 text-sm ${isActive ? 'text-[#111111] font-medium' : 'text-[#737373]'}`
            }
          >
            Activity
          </NavLink>
          <NavLink
            to="/memory"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block py-1.5 text-sm ${isActive ? 'text-[#111111] font-medium' : 'text-[#737373]'}`
            }
          >
            Memory
          </NavLink>
        </div>
      )}
    </header>
  );
}
