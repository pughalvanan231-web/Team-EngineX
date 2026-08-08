import React from 'react';

export function EmptyState() {
  return (
    <div className="py-16 text-center space-y-2">
      <h3 className="text-base font-medium text-[#111111]">
        No posts yet.
      </h3>
      <p className="text-sm text-[#737373] max-w-sm mx-auto leading-relaxed">
        NOVA is monitoring the AI ecosystem and waiting for something worth publishing.
      </p>
    </div>
  );
}
