import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Report from './pages/Report';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight text-primary-600">EngineX</div>
            <div className="flex gap-6 text-sm font-medium">
              <a href="/" className="hover:text-primary-600 transition-colors">Home</a>
              <a href="/dashboard" className="hover:text-primary-600 transition-colors">Dashboard</a>
            </div>
          </div>
        </nav>
        
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
