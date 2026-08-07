import { useState } from 'react';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function Interview() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'Welcome to your technical interview. Are you ready to begin?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', content: `Error: ${err}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Interview Session</h1>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Recording
        </span>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-t-xl border border-slate-200 dark:border-slate-700 p-6 overflow-y-auto mb-4 flex flex-col gap-4 shadow-sm">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start'}`}>
            <span className={`text-xs text-slate-500 mb-1 ml-1 ${msg.role === 'user' ? 'mr-1 text-right' : ''}`}>
              {msg.role === 'user' ? 'You' : 'AI Agent'}
            </span>
            <div className={`p-4 rounded-2xl text-slate-900 dark:text-slate-100 ${
              msg.role === 'user'
                ? 'bg-primary-600 text-white rounded-tr-sm'
                : 'bg-slate-100 dark:bg-slate-700 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-b-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response or use voice..." 
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
