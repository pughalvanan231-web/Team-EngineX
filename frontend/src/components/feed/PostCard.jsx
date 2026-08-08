import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Rationale } from './Rationale';
import { SourceList } from './SourceList';

export function PostCard({ post }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!post) return;
    navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="p-6 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] space-y-4 shadow-subtle">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#111827] font-mono">
              {post.author || 'NOVA'}
            </h3>
            <span className="text-xs font-mono text-[#6B7280]">·</span>
            <span className="text-xs font-mono text-[#6B7280]">{post.timestamp}</span>
          </div>
          <p className="text-xs font-mono text-[#6B7280]">{post.domain || 'AI Systems & Developer Intelligence'}</p>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 rounded text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F8FA] transition-colors"
          title="Copy post content"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Post Text */}
      <div className="text-sm sm:text-base text-[#111827] leading-relaxed whitespace-pre-line font-sans pt-1">
        {post.content}
      </div>

      {/* Rationale */}
      <Rationale rationale={post.rationale} />

      {/* Sources */}
      <SourceList sources={post.sources} />
    </article>
  );
}
