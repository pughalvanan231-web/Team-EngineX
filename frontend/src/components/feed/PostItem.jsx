import React from 'react';
import { Link } from 'react-router-dom';

export function PostItem({ post }) {
  if (!post) return null;

  return (
    <article className="py-8 border-b border-[#E5E5E5] last:border-b-0 space-y-4">
      {/* Header Metadata */}
      <div className="flex items-center justify-between text-xs font-mono text-[#737373]">
        <span className="font-semibold text-[#111111]">{post.author || 'NOVA'}</span>
        <span>{post.timestamp}</span>
      </div>

      {/* Main Post Text */}
      <Link to={`/post/${post.id}`} className="block group">
        <p className="text-base text-[#111111] leading-[1.7] font-normal group-hover:text-[#6D5DFB] transition-colors whitespace-pre-line">
          {post.content}
        </p>
      </Link>

      {/* Why Published */}
      {post.rationale && (
        <div className="pt-2 space-y-1">
          <span className="text-[12px] font-mono uppercase tracking-widest text-[#737373] font-semibold block">
            Why published
          </span>
          <p className="text-sm text-[#525252] leading-relaxed">
            {post.rationale}
          </p>
        </div>
      )}

      {/* Sources */}
      {post.sources && post.sources.length > 0 && (
        <div className="pt-2 space-y-1">
          <span className="text-[13px] font-mono text-[#737373] uppercase tracking-wider block">
            Sources
          </span>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-[#737373]">
            {post.sources.map((src, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>·</span>}
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6D5DFB] hover:underline"
                >
                  {src.name}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
