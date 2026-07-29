import React from 'react';
import { Layers, Flame, Film, History, Calendar, HeartHandshake, Clock } from 'lucide-react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { AnimeSection } from '@/components/anime/AnimeSection';
import { AniKotoClient, mapAniKotoItem } from '@/lib/api/anikoto';
import { MOCK_CONTINUE_WATCHING } from '@/lib/mockData';

export const metadata = {
  title: 'YUGENANIME - Home',
};

export default async function Home() {
  // Fetch data directly from AniKoto API
  const [
    homeInfo,
    latestUpdated,
    newRelease
  ] = await Promise.all([
    AniKotoClient.getHomeInfo().catch(() => ({ spotlights: [], trending: [], topAiring: [] })),
    AniKotoClient.getLatestUpdated().catch(() => []),
    AniKotoClient.getNewRelease().catch(() => [])
  ]);

  const spotlights = (homeInfo.spotlights || []).map(mapAniKotoItem);
  const trending = (homeInfo.trending || []).map(mapAniKotoItem);
  const topAiring = (homeInfo.topAiring || []).map(mapAniKotoItem);
  
  const recents = (latestUpdated?.data || latestUpdated || []).map(mapAniKotoItem);
  const newReleases = (newRelease?.data || newRelease || []).map(mapAniKotoItem);

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Hero Banner */}
      <HeroBanner slides={spotlights.length > 0 ? spotlights : MOCK_CONTINUE_WATCHING} />

      {/* 2. Continue Watching (Mock Data for now since it needs user session) */}
      <AnimeSection
        title="Continue Watching"
        items={MOCK_CONTINUE_WATCHING}
        icon={<History className="w-5 h-5 text-[#22c55e]" />}
        showProgress={true}
        aspect="landscape"
      />

      {/* 3. Trending */}
      <AnimeSection
        title="Trending Now"
        items={trending}
        icon={<Flame className="w-5 h-5 text-[#22c55e]" />}
        viewAllHref="/trending"
        aspect="portrait"
      />

      {/* 4. Recently Updated */}
      <AnimeSection
        title="Recently Updated"
        items={recents}
        icon={<Clock className="w-5 h-5 text-[#22c55e]" />}
        viewAllHref="/recents"
        aspect="landscape"
      />

      {/* 5. Recently Released (with SUB/DUB filter tabs) */}
      <AnimeSection
        title="Recently Released"
        items={newReleases}
        icon={<Layers className="w-5 h-5 text-[#22c55e]" />}
        viewAllHref="/recents"
        showTabs={true}
        aspect="landscape"
      />

      {/* 6. Popular Airing Anime */}
      <AnimeSection
        title="Top Airing Anime"
        items={topAiring}
        icon={<Calendar className="w-5 h-5 text-[#22c55e]" />}
        viewAllHref="/trending"
        aspect="landscape"
      />
    </div>
  );
}
