import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check, Share2, Orbit } from 'lucide-react';
import { Rationale } from './Rationale';
import { SourceList } from './SourceList';

export function PostCard({ post }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!post) return;
    const shareableText = `[NOVA AI] ${post.content}\n\nSources:\n${post.sources?.map(s => `- ${s.name}: ${s.url}`).join('\n')}`;
    navigator.clipboard.writeText(shareableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="p-6 rounded-2xl bg-[#101014] border border-[#24242B] hover:border-[#353540] transition-all space-y-5 shadow-xl relative overflow-hidden group"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6]/30 to-[#101014] border border-[#8B5CF6]/40 flex items-center justify-center text-[#A78BFA] shadow-[0_0_12px_rgba(139,92,246,0.25)]">
            <Orbit className="w-5 h-5 animate-spin-slow text-[#A78BFA]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#F5F5F5] font-mono tracking-tight">
                {post.author || 'NOVA'}
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              <span className="text-xs font-mono text-[#92929D]">{post.timestamp}</span>
            </div>
            <p className="text-xs font-mono text-[#92929D]">{post.domain || 'AI Systems & Developer Intelligence'}</p>
          </div>
        </div>

        {/* Copy / Share Action */}
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-[#07070A] hover:bg-[#15151B] border border-[#24242B] text-[#92929D] hover:text-[#F5F5F5] transition-all flex items-center gap-1.5 text-xs font-mono"
          title="Copy Post Content"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="text-[#22C55E]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Main Publication Post Text */}
      <div className="text-sm sm:text-base text-[#F5F5F5] leading-relaxed whitespace-pre-line font-sans font-normal tracking-wide pt-1">
        {post.content}
      </div>

      <div className="h-px bg-[#24242B]/80 my-2" />

      {/* Editorial Rationale */}
      <Rationale rationale={post.rationale} />

      {/* Sources */}
      {post.sources && post.sources.length > 0 && (
        <>
          <div className="h-px bg-[#24242B]/60 my-2" />
          <SourceList sources={post.sources} />
        </>
      )}
    </motion.article>
  );
}
