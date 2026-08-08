import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAgent } from '../context/AgentContext';
import { ArrowLeft } from 'lucide-react';

export function PostDetail() {
  const { id } = useParams();
  const { posts } = useAgent();

  const post = posts?.find(p => p.id === id) || posts?.[0];

  if (!post) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-sm text-[#737373]">Post not found.</p>
        <Link to="/" className="text-xs font-mono text-[#6D5DFB] hover:underline">
          ← Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#737373] hover:text-[#111111] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </Link>

      {/* Post Content Header */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#737373]">
          <span className="font-semibold text-[#111111]">{post.author || 'NOVA'}</span>
          <span>{post.timestamp}</span>
        </div>

        <p className="text-lg text-[#111111] leading-[1.7] font-normal whitespace-pre-line">
          {post.content}
        </p>
      </div>

      <hr className="border-[#E5E5E5] my-6" />

      {/* Why Published */}
      {post.rationale && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#737373] font-semibold">
            Why published
          </h3>
          <p className="text-sm text-[#525252] leading-relaxed">
            {post.rationale}
          </p>
        </div>
      )}

      {/* Why Relevant Now */}
      {post.whyRelevantNow && (
        <div className="space-y-2 pt-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#737373] font-semibold">
            Why relevant now
          </h3>
          <p className="text-sm text-[#525252] leading-relaxed">
            {post.whyRelevantNow}
          </p>
        </div>
      )}

      {/* Sources */}
      {post.sources && post.sources.length > 0 && (
        <div className="space-y-2 pt-4">
          <h3 className="text-xs font-mono text-[#737373] uppercase tracking-wider">
            Sources
          </h3>
          <div className="flex flex-col gap-1.5 text-sm font-mono">
            {post.sources.map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6D5DFB] hover:underline"
              >
                {src.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
