'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Check, Layers } from 'lucide-react';
import { EpisodeItem } from '@/lib/mockData';

interface EpisodeSidebarProps {
  animeId: string;
  episodes: EpisodeItem[];
  currentEpNumber: number;
}

export function EpisodeSidebar({
  animeId,
  episodes,
  currentEpNumber,
}: EpisodeSidebarProps) {
  return (
    <div className="bg-[#181818] border border-[#262626] rounded-2xs flex flex-col h-full max-h-[560px]">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
        <div className="flex items-center gap-1.5 font-bold text-xs text-white uppercase tracking-tight">
          <Layers className="w-4 h-4 text-[#22c55e]" />
          <span>Episodes ({episodes.length})</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">Select Episode</span>
      </div>

      {/* Scrollable Episode List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#242832] p-1 space-y-1">
        {episodes.map((ep) => {
          const isCurrent = ep.number === currentEpNumber;

          return (
            <Link
              key={ep.number}
              href={`/watch/${animeId}/${ep.number}`}
              className={`flex items-center gap-3 p-2 rounded-2xs transition-colors group ${
                isCurrent
                  ? 'bg-[#22c55e]/15 text-white border-l-2 border-l-[#22c55e]'
                  : 'hover:bg-[#1f1f1f] text-gray-300'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-20 aspect-[16/9] bg-[#121212] rounded-2xs overflow-hidden flex-shrink-0 border border-[#2a2a2a]">
                <Image
                  src={ep.thumbnail}
                  alt={`Episode ${ep.number}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                {isCurrent && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-4 h-4 text-[#22c55e] fill-[#22c55e]" />
                  </div>
                )}
                <div className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-bold text-white px-1 py-0.2 rounded-2xs">
                  {ep.duration}
                </div>
              </div>

              {/* Episode Title & Metadata */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className={isCurrent ? 'text-[#22c55e]' : 'text-gray-400'}>
                    EP {ep.number}
                  </span>
                  {ep.isWatched && (
                    <span title="Watched">
                      <Check className="w-3 h-3 text-[#22c55e] stroke-[3]" />
                    </span>
                  )}
                </div>
                <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'group-hover:text-white'}`}>
                  {ep.title}
                </h4>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
