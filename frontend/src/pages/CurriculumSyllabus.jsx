import React, { useState } from 'react';
import { BookOpen, Award, Clock, Code, ChevronRight } from 'lucide-react';

const syllabusDays = [
  { day: 1, title: "VS Code & Python Environment Setup", desc: "Configure virtual environments, pip, and extensions for efficient AI application development.", tools: ["VS Code", "Python 3.11", "Virtualenv"] },
  { day: 2, title: "Local LLM & AI Coding Assistant Setup", desc: "Install Ollama, run local models like Llama3, and integrate coding assistants to enable offline prototyping.", tools: ["Ollama", "Llama 3", "Continue.dev"] },
  { day: 3, title: "First AI Project, React Frontend & GitHub", desc: "Initialize a full-stack project, connect React with Vite, and establish clean source control branching.", tools: ["React", "Vite", "Git", "GitHub"] },
  { day: 4, title: "Reading & Processing Structured Data", desc: "Parse CSV, JSON, and database records using Pandas to build structured inputs for vector retrieval.", tools: ["Pandas", "SQLite", "JSON"] },
  { day: 5, title: "Reading & Processing Unstructured Data", desc: "Extract and clean text from PDFs, HTML, and documents with chunking strategies for vector indexing.", tools: ["PyPDF", "BeautifulSoup", "Regex"] },
  { day: 6, title: "Building the Knowledge Base", desc: "Architect raw datastores and document pipelines that feed candidate curriculum data to the AI assessor.", tools: ["Data Pipelines", "File Store", "SQLite"] },
  { day: 7, title: "Embeddings Explained", desc: "Deep dive into dense vector representations, distance metrics, and dimensionality reduction techniques.", tools: ["Sentence-Transformers", "HuggingFace"] },
  { day: 8, title: "Vector Databases Overview", desc: "Configure database schemas, upload text embeddings, and run high-concurrency similarity queries.", tools: ["ChromaDB", "Pinecone"] },
  { day: 9, title: "Semantic Search Implementation", desc: "Build semantic search queries with metadata filtering to locate relevant candidate focus areas.", tools: ["ChromaDB", "Python API"] },
  { day: 10, title: "The Retrieval & Matching Engine", desc: "Combine keyword search with semantic retrieval to construct a hybrid matching router.", tools: ["Rank Fusion", "BM25", "ChromaDB"] },
  { day: 11, title: "RAG End-to-End & LLM API Basics", desc: "Assemble complete Retrieval-Augmented Generation workflows querying commercial APIs.", tools: ["OpenAI API", "RAG Pipeline"] },
  { day: 12, title: "Prompt Engineering Fundamentals", desc: "Design system instructions, utilize few-shot prompts, and handle token window limits dynamically.", tools: ["Prompt Templates", "System Prompts"] },
  { day: 13, title: "Function Calling & Structured Outputs", desc: "Force language models to return strict, parser-compliant JSON payloads for automated assessment.", tools: ["Pydantic", "JSON Schema"] },
  { day: 14, title: "LLM Parameters & Tokenization", desc: "Tune temperature, top_p, and penalties while monitoring output latency and token counts.", tools: ["Tiktoken", "LLM APIs"] },
  { day: 15, title: "Fine-Tuning Foundations", desc: "Format training datasets, run fine-tuning jobs, and evaluate customized domain performance.", tools: ["OpenAI CLI", "Dataset Prep"] },
  { day: 16, title: "Chatbot Application Build", desc: "Write backend endpoints with FastAPI and connect stateful web sockets to stream response data.", tools: ["FastAPI", "WebSockets"] },
  { day: 17, title: "Memory & Chat History Persistence", desc: "Store conversation transcripts in SQLite to let candidate interview sessions survive refreshes.", tools: ["SQLite", "Session Stores"] },
  { day: 18, title: "Streaming Responses in APIs", desc: "Implement Server-Sent Events (SSE) to push token streams to the candidate frontend UI in real-time.", tools: ["FastAPI Streaming", "SSE"] },
  { day: 19, title: "UI Optimization & Message Parsing", desc: "Render markdown, syntax highlighted code blocks, and adaptive widgets inside live chat sessions.", tools: ["Markdown Parser", "Tailwind CSS"] },
  { day: 20, title: "Vector Database Scaling", desc: "Optimize vector database performance using indexes, caching, and concurrent query pools.", tools: ["HNSW Indexing", "Connection Pooling"] },
  { day: 21, title: "LangChain Agents", desc: "Use LangChain frameworks to build reasoning loops that dynamically choose tools and solve missions.", tools: ["LangChain", "Tool Calling"] },
  { day: 22, title: "Multi-Agent Orchestration", desc: "Create multiple specialized agents that coordinate to conduct complex candidate interviews.", tools: ["LangGraph", "State Management"] },
  { day: 23, title: "Model Context Protocol (MCP)", desc: "Integrate standardized protocols to safely share database context with local LLM runtimes.", tools: ["MCP Servers", "Context Protocol"] },
  { day: 24, title: "Tool Calling Agents", desc: "Empower agents to read curriculum logs, execute checks, and submit evaluations autonomously.", tools: ["ReAct Loop", "Agent Execution"] },
  { day: 25, title: "Evaluation & Ground Truth Datasets", desc: "Design evaluation criteria and benchmark datasets to verify AI assessor grading accuracy.", tools: ["Ragas", "Evaluation Suites"] },
  { day: 26, title: "Security & Guardrails", desc: "Prevent prompt injections, sanitize user inputs, and enforce content safety policies.", tools: ["Llama Guard", "Input Filtering"] },
  { day: 27, title: "CI/CD Pipelines for AI Apps", desc: "Set up automated test pipelines to evaluate prompt changes and model updates continuously.", tools: ["GitHub Actions", "Unit Testing"] },
  { day: 28, title: "Docker & Kubernetes Deployment", desc: "Containerize the frontend/backend and orchestrate deployments for high-availability scaling.", tools: ["Docker", "Kubernetes", "YAML"] },
  { day: 29, title: "Monitoring, Logging & Observability", desc: "Trace LLM calls, log response latencies, and monitor operational costs inside production dashboards.", tools: ["LangSmith", "Prometheus"] },
  { day: 30, title: "Cost & Latency Optimization", desc: "Optimize model context windows, implement smart caching, and analyze cost trade-offs.", tools: ["Prompt Caching", "API Budgets"] },
  { day: 31, title: "Capstone Project & Final Demo", desc: "Deliver a production-ready, fully evaluated adaptive assessor application to the cohort panel.", tools: ["Presentation", "Live Demo"] }
];

export function CurriculumSyllabus() {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div className="w-full min-h-screen bg-[#F7F7F5] text-[#0A0A0A] font-sans py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-12 text-left">
        
        {/* Title Section */}
        <div className="space-y-4 border-b border-[#DCDCDC] pb-8">
          <div className="text-[10px] font-bold font-mono tracking-widest text-[#737373] uppercase flex items-center gap-2">
            <span>02 / COHORT SYLLABUS</span>
            <span className="h-px w-10 bg-[#DCDCDC]" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight leading-[1.05] text-[#0A0A0A]">
            AI Cohort <span className="font-serif italic text-[#111111]">Assessment</span>
          </h1>
          <p className="text-base sm:text-lg text-[#737373] max-w-xl leading-relaxed font-light">
            View the 31-day curriculum topics, tooling, and learn modules built for the cohort.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-[#DCDCDC]">
          <div>
            <span className="block text-[10px] text-[#737373] font-mono uppercase tracking-wider">Duration</span>
            <span className="text-2xl font-bold text-[#0A0A0A] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0A0A0A]" />
              <span>31 Days</span>
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-[#737373] font-mono uppercase tracking-wider">Focus Modules</span>
            <span className="text-2xl font-bold text-[#0A0A0A] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#0A0A0A]" />
              <span>8 Modules</span>
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-[#737373] font-mono uppercase tracking-wider">Hands-on Tools</span>
            <span className="text-2xl font-bold text-[#0A0A0A] flex items-center gap-2">
              <Code className="w-5 h-5 text-[#0A0A0A]" />
              <span>24+ SDKs</span>
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-[#737373] font-mono uppercase tracking-wider">Evaluation Tiers</span>
            <span className="text-2xl font-bold text-[#0A0A0A] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#0A0A0A]" />
              <span>5 Levels</span>
            </span>
          </div>
        </div>

        {/* Syllabus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {syllabusDays.map((item) => (
            <div 
              key={item.day}
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0 12px 30px rgba(0,0,0,0.03)' }}
              className="border border-[#DCDCDC] rounded-2xl p-6 flex flex-col justify-between h-[250px] hover:border-[#111111] hover:-translate-y-1 transition-all duration-300 group text-left relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#F0F0EE] pb-3 mb-4">
                  <span className="text-xs font-mono font-bold text-[#737373]">DAY {item.day}</span>
                  <span className="text-[9px] font-mono text-[#A3A3A3] uppercase tracking-wider truncate max-w-[150px]">
                    {item.tools[0]} &middot; {item.tools[1] || 'Setup'}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-[#0A0A0A] tracking-tight group-hover:text-[#111111] line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#737373] leading-relaxed font-light mt-2 line-clamp-3">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F0F0EE]">
                <button 
                  onClick={() => setSelectedDay(item)}
                  className="text-xs font-bold text-[#0A0A0A] hover:underline flex items-center gap-1"
                >
                  <span>Read more</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedDay && (
          <div className="fixed inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm flex items-center justify-center p-6 z-[100] animate-fadeIn">
            <div className="bg-[#FFFFFF] border border-[#DCDCDC] rounded-2xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative text-left">
              <button 
                onClick={() => setSelectedDay(null)}
                className="absolute top-6 right-6 text-sm font-mono text-[#737373] hover:text-[#0A0A0A]"
              >
                ✕ CLOSE
              </button>
              
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#737373] bg-[#F0F0EE] px-2.5 py-1 rounded">
                  DAY {selectedDay.day}
                </span>
                <h2 className="text-2xl font-bold text-[#0A0A0A] tracking-tight pt-2">
                  {selectedDay.title}
                </h2>
              </div>

              <p className="text-sm text-[#525252] leading-relaxed font-light">
                {selectedDay.desc}
              </p>

              <div className="space-y-2">
                <span className="block text-xs font-mono font-bold text-[#737373] uppercase">Tooling & Environment</span>
                <div className="flex flex-wrap gap-2">
                  {selectedDay.tools.map((t, idx) => (
                    <span key={idx} className="text-xs font-mono bg-[#171717] text-[#FFFFFF] px-3 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
