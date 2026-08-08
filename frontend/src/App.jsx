<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import {
  fetchHealth,
  fetchCandidates,
  fetchCurriculum,
  startInterviewSession,
  submitInterviewAnswer,
  fetchInterviewSession,
  finishInterviewSession
} from './services/api';

import { Header } from './components/common/Header';
import { SkeletonLoader } from './components/common/SkeletonLoader';
import { LandingPage } from './pages/LandingPage';
import { CandidateOverview } from './pages/CandidateOverview';
import { InterviewPreparation } from './pages/InterviewPreparation';
import { LiveInterview } from './pages/LiveInterview';
import { InterviewCompletion } from './pages/InterviewCompletion';
import { FeedbackReport } from './pages/FeedbackReport';
import { InterviewHistory } from './pages/InterviewHistory';

const STORAGE_SESSION_KEY = 'interview_agent_session_id';

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  
  const [interviewState, setInterviewState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthStatus, setHealthStatus] = useState({ status: 'healthy', demo_mode: true });

  // Load initial candidates and curriculum from API / root JSON datasets
  useEffect(() => {
    async function initData() {
      setInitialLoading(true);
      try {
        const [h, candList, curr] = await Promise.all([
          fetchHealth(),
          fetchCandidates(),
          fetchCurriculum()
        ]);
        if (h) setHealthStatus(h);
        if (candList && candList.length > 0) {
          setCandidates(candList);
          setSelectedCandidate(candList[0]);
        }
        if (curr) setCurriculum(curr);

        // Restore active session if present in localStorage
        const savedSessionId = localStorage.getItem(STORAGE_SESSION_KEY);
        if (savedSessionId) {
          const restoredState = await fetchInterviewSession(savedSessionId);
          if (restoredState) {
            setInterviewState(restoredState);
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setInitialLoading(false);
      }
    }
    initData();
  }, []);

  // 1. Start Interview Session
  const handleStartInterview = async (candidateId, candidateObj) => {
    setLoading(true);
    setError(null);
    try {
      const state = await startInterviewSession(candidateId, candidateObj);
      setInterviewState(state);
      if (state?.interview_id) {
        localStorage.setItem(STORAGE_SESSION_KEY, state.interview_id);
      }
      return state;
    } catch (err) {
      console.error('Failed to start interview:', err);
      setError('Unable to start interview session. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Answer in Conversation Turn
  const handleSubmitAnswer = async (answerText) => {
    if (!interviewState?.interview_id) return;
    setLoading(true);
    setError(null);
    try {
      const newState = await submitInterviewAnswer(interviewState.interview_id, answerText);
      setInterviewState(newState);
      if (newState?.status === 'completed') {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    } catch (err) {
      console.error('Failed to process answer:', err);
      setError('Failed to evaluate answer. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  // 3. Finish Early
  const handleFinishEarly = async () => {
    if (!interviewState?.interview_id) return;
    setLoading(true);
    setError(null);
    try {
      const finalState = await finishInterviewSession(interviewState.interview_id);
      setInterviewState(finalState);
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (err) {
      console.error('Failed to complete interview:', err);
      setError('Failed to finalize interview assessment.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Reset & Start Over
  const handleResetSession = () => {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setInterviewState(null);
    setError(null);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-agent-bg text-agent-text flex flex-col items-center justify-center p-6 space-y-4 font-mono text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-agent-accent border-t-transparent animate-spin" />
        <div className="text-agent-secondary">Loading Interview Agent...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-agent-bg text-agent-text font-sans antialiased flex flex-col selection:bg-agent-accent/30 selection:text-agent-accentLight">
        
        {/* Top Global Header */}
        <Header 
          activeSession={interviewState} 
          healthStatus={healthStatus}
          onResetSession={handleResetSession}
        />

        {/* Global Error Banner */}
        {error && (
          <div className="bg-agent-error/10 border-b border-agent-error/20 p-3 text-center text-xs font-mono text-agent-error flex items-center justify-center gap-4">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="underline hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page Views Router */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6">
          <Routes>
            <Route path="/" element={<LandingPage onStart={handleStartInterview} />} />
            
            <Route 
              path="/overview" 
              element={
                <CandidateOverview 
                  candidates={candidates}
                  selectedCandidate={selectedCandidate}
                  onSelectCandidate={setSelectedCandidate}
                  curriculum={curriculum}
                />
              } 
            />

            <Route 
              path="/prep" 
              element={
                <InterviewPreparation 
                  candidate={selectedCandidate}
                  onStartInterview={handleStartInterview}
                  loading={loading}
                />
              } 
            />

            <Route 
              path="/interview" 
              element={
                <LiveInterview 
                  state={interviewState}
                  onSubmitAnswer={handleSubmitAnswer}
                  onFinishEarly={handleFinishEarly}
                  loading={loading}
                  candidate={selectedCandidate}
                />
              } 
            />

            <Route 
              path="/complete" 
              element={
                <InterviewCompletion 
                  state={interviewState}
                  onReset={handleResetSession}
                />
              } 
            />

            <Route 
              path="/feedback" 
              element={
                <FeedbackReport 
                  state={interviewState}
                  onReset={handleResetSession}
                />
              } 
            />

            <Route 
              path="/history" 
              element={
                <InterviewHistory 
                  activeSession={interviewState}
                  onSelectSession={setInterviewState}
                />
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Candidates from './pages/Candidates.jsx'
import PreInterview from './pages/PreInterview.jsx'
import Interview from './pages/Interview.jsx'
import Feedback from './pages/Feedback.jsx'
import Navbar from './components/Navbar.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-ink-950">
        <div className="pointer-events-none fixed inset-0 bg-grid-faint bg-size-grid opacity-40" />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-radial-glow" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/pre-interview" element={<PreInterview />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<Landing />} />
        </Routes>
>>>>>>> ef5acd71c8e8fed613b3c93946e4dab1962db1e8
      </div>
    </BrowserRouter>
  )
}
