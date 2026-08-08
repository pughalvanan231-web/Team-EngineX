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
import { Candidates } from './pages/Candidates';
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
      if (state?.interview_id || state?.sessionId) {
        localStorage.setItem(STORAGE_SESSION_KEY, state.interview_id || state.sessionId);
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
    const activeSessionId = interviewState?.interview_id || interviewState?.sessionId;
    if (!activeSessionId) return;
    setLoading(true);
    setError(null);
    try {
      const newState = await submitInterviewAnswer(activeSessionId, answerText);
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
    const activeSessionId = interviewState?.interview_id || interviewState?.sessionId;
    if (!activeSessionId) return;
    setLoading(true);
    setError(null);
    try {
      const finalState = await finishInterviewSession(activeSessionId);
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
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 space-y-4 font-mono text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        <div className="text-slate-500">Loading Interview Agent...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-transparent text-white font-sans antialiased flex flex-col selection:bg-white/30 selection:text-white relative overflow-hidden">
        {/* Soft elegant glows matching the sage theme */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-100/5 blur-[130px] pointer-events-none z-0" />
        <div className="absolute top-[40%] right-[20%] w-[35%] h-[35%] rounded-full bg-emerald-100/5 blur-[100px] pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col min-h-screen w-full">
          {/* Top Global Header */}
          <Header 
            activeSession={interviewState} 
            healthStatus={healthStatus}
            onResetSession={handleResetSession}
          />

        {/* Subtle premium layout wrapper */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-3 text-center text-xs font-mono text-red-600 flex items-center justify-center gap-4">
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
        <main className="flex-1 w-full px-4 sm:px-8 lg:px-16 py-6 relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage onStart={handleStartInterview} />} />
            
            <Route 
              path="/candidates" 
              element={
                <Candidates 
                  candidates={candidates}
                  onSelectCandidate={setSelectedCandidate}
                />
              } 
            />

            <Route 
              path="/candidates/:candidateId" 
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
              path="/interview/:sessionId" 
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
              path="/interview/:sessionId/result" 
              element={
                <FeedbackReport 
                  state={interviewState}
                  onReset={handleResetSession}
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
        </div>
      </div>
    </BrowserRouter>
  );
}
