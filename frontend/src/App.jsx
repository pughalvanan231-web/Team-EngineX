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
import { Memory } from './pages/Memory';
import { Sources } from './pages/Sources';

export default function App() {
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);

  return (
    <AgentProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#FFFFFF] text-[#111827] font-sans antialiased flex flex-col md:flex-row">
          {/* Desktop Left Sidebar */}
          <Sidebar onOpenInitModal={() => setIsInitModalOpen(true)} />

          {/* Main Layout Area */}
          <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            {/* Main Centered Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/memory" element={<Memory />} />
                <Route path="/sources" element={<Sources />} />
              </Routes>
            </main>

            {/* Mobile Bottom Navigation */}
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
