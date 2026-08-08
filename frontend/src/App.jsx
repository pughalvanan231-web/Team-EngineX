import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
  fetchHealth,
  fetchCandidates,
  startInterview,
  submitAnswer,
  fetchInterview,
  finishInterview
} from './services/api';

import { CandidateSetup } from './components/CandidateSetup';
import { InterviewActive } from './components/InterviewActive';
import { CompletionScreen } from './components/CompletionScreen';

const STORAGE_KEY = 'active_interview_id';

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewState, setInterviewState] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [healthStatus, setHealthStatus] = useState({ status: 'online', demo_mode: true });

  // Load Initial Health & Candidates
  useEffect(() => {
    async function loadInitial() {
      const [h, cList] = await Promise.all([fetchHealth(), fetchCandidates()]);
      if (h) setHealthStatus(h);
      if (cList && cList.length > 0) {
        setCandidates(cList);
        setSelectedCandidate(cList[0]);
      }

      // Check localStorage for active session reload recovery
      const savedId = localStorage.getItem(STORAGE_KEY);
      if (savedId) {
        try {
          const savedState = await fetchInterview(savedId);
          if (savedState) {
            setInterviewState(savedState);
          }
        } catch (err) {
          console.warn('Saved interview session expired or invalid:', err);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
    loadInitial();
  }, []);

  // Start New Interview
  const handleStartInterview = async (candidateId) => {
    setLoading(true);
    setError(null);
    try {
      const state = await startInterview(candidateId);
      setInterviewState(state);
      if (state?.interview_id) {
        localStorage.setItem(STORAGE_KEY, state.interview_id);
      }
    } catch (err) {
      console.error('Failed to start interview:', err);
      setError('Could not initialize interview engine. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Answer
  const handleSubmitAnswer = async (answerText) => {
    if (!interviewState?.interview_id) return;
    setLoading(true);
    setError(null);
    try {
      const newState = await submitAnswer(interviewState.interview_id, answerText);
      setInterviewState(newState);
      if (newState?.status === 'completed') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError('Failed to evaluate answer. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  // Finish Early
  const handleFinishEarly = async () => {
    if (!interviewState?.interview_id) return;
    setLoading(true);
    setError(null);
    try {
      const finalState = await finishInterview(interviewState.interview_id);
      setInterviewState(finalState);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to finish interview:', err);
      setError('Failed to complete interview assessment.');
    } finally {
      setLoading(false);
    }
  };

  // Reset & Start Over
  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setInterviewState(null);
    setError(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-sans antialiased flex flex-col">
        {/* Minimal Global Top Header */}
        <header className="w-full border-b border-[#E5E5E5] bg-[#FFFFFF] sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" onClick={handleReset} className="flex items-center gap-2 font-bold text-base text-[#111111] tracking-tight font-mono hover:opacity-80">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6D5DFB]" />
              <span>Interview Agent</span>
            </Link>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span className="text-[#16A34A] font-medium">● Autonomous</span>
              </div>
              {healthStatus.demo_mode && (
                <span className="px-2 py-0.5 rounded bg-[#F8F8FA] border border-[#E5E5E5] text-[#737373]">
                  DEMO MODE
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="bg-[#FEF2F2] border-b border-[#DC2626]/20 p-3 text-center text-xs font-mono text-[#DC2626]">
            {error}
          </div>
        )}

        {/* Main View Area */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4">
          <Routes>
            <Route
              path="*"
              element={
                !interviewState ? (
                  <CandidateSetup
                    candidates={candidates}
                    selectedCandidate={selectedCandidate}
                    onSelectCandidate={setSelectedCandidate}
                    onStart={handleStartInterview}
                    loading={loading}
                  />
                ) : interviewState.status === 'completed' ? (
                  <CompletionScreen
                    feedback={interviewState.final_feedback}
                    candidateName={interviewState.candidate_name}
                    onReset={handleReset}
                  />
                ) : (
                  <InterviewActive
                    state={interviewState}
                    onSubmitAnswer={handleSubmitAnswer}
                    onFinishEarly={handleFinishEarly}
                    loading={loading}
                    candidate={selectedCandidate}
                  />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
