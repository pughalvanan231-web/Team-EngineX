import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AgentProvider } from './context/AgentContext';
import { Header } from './components/layout/Header';

import { Feed } from './pages/Feed';
import { PostDetail } from './pages/PostDetail';
import { Activity } from './pages/Activity';
import { Memory } from './pages/Memory';
import { Init } from './pages/Init';

export default function App() {
  return (
    <AgentProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-sans antialiased flex flex-col">
          {/* Header */}
          <Header />

          {/* Main 720px Centered Content */}
          <main className="flex-1 w-full max-w-[720px] mx-auto px-4">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/memory" element={<Memory />} />
              <Route path="/init" element={<Init />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AgentProvider>
  );
}
