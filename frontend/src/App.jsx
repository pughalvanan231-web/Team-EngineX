import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AgentProvider } from './context/AgentContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { InitModal } from './components/common/InitModal';

import { Dashboard } from './pages/Dashboard';
import { Feed } from './pages/Feed';
import { Activity } from './pages/Activity';
import { Sources } from './pages/Sources';
import { Memory } from './pages/Memory';

export default function App() {
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);

  return (
    <AgentProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#07070A] text-[#F5F5F5] font-sans antialiased flex flex-col md:flex-row">
          {/* Desktop Fixed Sidebar */}
          <Sidebar onOpenInitModal={() => setIsInitModalOpen(true)} />

          {/* Main Layout Area */}
          <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/sources" element={<Sources />} />
                <Route path="/memory" element={<Memory />} />
              </Routes>
            </main>

            {/* Mobile Navigation */}
            <MobileNav />
          </div>

          {/* Persona Initialization Modal */}
          <InitModal
            isOpen={isInitModalOpen}
            onClose={() => setIsInitModalOpen(false)}
          />
        </div>
      </BrowserRouter>
    </AgentProvider>
  );
}
