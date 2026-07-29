import React from 'react';
import { Layers, HeartHandshake, History } from 'lucide-react';
import { AniKotoClient } from '@/lib/api/anikoto';
import { MOCK_TRENDING, MOCK_RECOMMENDATIONS, MOCK_CONTINUE_WATCHING } from '@/lib/mockData';
import { VideoPlayerContainer } from '@/components/player/VideoPlayerContainer';
import { PlayerInfoBar } from '@/components/player/PlayerInfoBar';
import { EpisodeList } from '@/components/anime/EpisodeList';
import { AnimeSection } from '@/components/anime/AnimeSection';
import { EmptyState } from '@/components/ui/EmptyState';

import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string; episode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, episode } = await params;
  try {
    const animeData = await AniKotoClient.getAnimeInfo(id);
    const title = animeData?.title ? `${animeData.title} Episode ${episode}` : `Episode ${episode}`;
    return { title };
  } catch {
    return { title: `Episode ${episode}` };
  }
}

export default async function EpisodePlayerPage({ params }: PageProps) {
  const { id, episode } = await params;
  const currentEpNumber = parseInt(episode, 10) || 1;

  try {
    // 1. Fetch Anime Info, Episodes, and Watch Data concurrently
    const [animeData, episodesData, watchData] = await Promise.all([
      AniKotoClient.getAnimeInfo(id).catch(() => null),
      AniKotoClient.getEpisodes(id).catch(() => null),
      AniKotoClient.getWatchPage(id, currentEpNumber).catch(() => null),
    ]);

    if (!animeData && !watchData) {
      return (
        <div className="py-12">
          <EmptyState
            title="Episode Stream Not Found"
            description="The requested anime episode could not be located in the catalog."
          />
        </div>
      );
    }

    // 2. Map Anime Details
    const animeDetails = {
      id: id,
      title: watchData?.title || animeData?.title || 'Anime Details',
      romajiTitle: watchData?.japaneseTitle || animeData?.japaneseTitle || '',
      poster: watchData?.poster || animeData?.poster || '',
      banner: watchData?.backgroundImage || animeData?.backgroundImage || animeData?.poster || watchData?.poster || '',
      synopsis: watchData?.synopsis || animeData?.synopsis || '',
      type: watchData?.type || animeData?.type || '',
      status: watchData?.status || animeData?.status || '',
      rating: watchData?.rating || animeData?.malScore || '',
      studio: watchData?.studios?.[0] || animeData?.studios?.[0] || '',
      season: animeData?.premiered || '',
      episodes: watchData?.episodes || animeData?.episodes || '',
      duration: watchData?.duration || animeData?.duration || '',
      genres: watchData?.genres || animeData?.genres || [],
    };

    // 3. Extract Episodes List
    const rawEpisodes = episodesData?.episodes || [];
    let episodesList = rawEpisodes.map((ep: any) => ({
      id: ep.id,
      number: ep.episode_no,
      title: ep.title || `Episode ${ep.episode_no}`,
      thumbnail: animeDetails.poster,
      duration: animeDetails.duration || '24m',
      airDate: '',
    }));

    if (episodesList.length === 0 && animeDetails.episodes) {
      const total = parseInt(animeDetails.episodes, 10) || 0;
      for (let i = 1; i <= total; i++) {
        episodesList.push({
          id: `${id}-ep-${i}`,
          number: i,
          title: `Episode ${i}`,
          thumbnail: animeDetails.poster,
          duration: animeDetails.duration || '24m',
          airDate: '',
        });
      }
    }

    // 4. Resolve Servers & Stream URL
    let availableServers: Array<{ linkId: string; name: string; type: string }> = [];
    let initialStreamUrl = '';

    if (watchData?.servers && watchData.servers.length > 0) {
      availableServers = watchData.servers.map((s: any) => ({
        linkId: s.linkId || s.link_id,
        name: s.name || 'Server',
        type: s.type || 'sub',
      }));
    }

    if (availableServers.length === 0 && rawEpisodes.length > 0) {
      const targetEpisode = rawEpisodes.find((ep: any) => ep.episode_no == currentEpNumber);
      if (targetEpisode?.server_ids) {
        const rawServers = await AniKotoClient.getServerList(targetEpisode.server_ids).catch(() => []);
        const serverArray = Array.isArray(rawServers) ? rawServers : [];
        availableServers = serverArray.map((s: any) => ({
          linkId: s.link_id || s.linkId,
          name: s.name || 'Server',
          type: s.type || 'sub',
        }));
      }
    }

    // Try resolving initial stream from available servers
    if (availableServers.length > 0) {
      for (const server of availableServers) {
        if (server.linkId) {
          const streamInfo = await AniKotoClient.getStreamInfo(server.linkId).catch(() => null);
          if (streamInfo?.url) {
            initialStreamUrl = streamInfo.url;
            break;
          }
        }
      }
    }

    return (
      <div className="space-y-6 pb-12 w-full max-w-[1400px] mx-auto">
        {/* 1. Full-Width Video Player Viewport with Server Switcher */}
        <VideoPlayerContainer
          poster={animeDetails.banner || animeDetails.poster}
          title={animeDetails.title}
          episodeNumber={currentEpNumber}
          servers={availableServers}
          initialStreamUrl={initialStreamUrl}
        />

        {/* 2. Side-by-Side Cards */}
        <PlayerInfoBar anime={animeDetails} currentEpNumber={currentEpNumber} />

        {/* 3. Full Episode List Grid */}
        <EpisodeList animeId={animeDetails.id} episodes={episodesList} />

        {/* 4. Continue Watching */}
        <AnimeSection
          title="Continue Watching"
          items={MOCK_CONTINUE_WATCHING}
          icon={<History className="w-5 h-5 text-[#22c55e]" />}
          showProgress={true}
          aspect="landscape"
        />

        {/* 5. Related Anime */}
        <AnimeSection
          title="Related Anime"
          items={MOCK_TRENDING}
          icon={<Layers className="w-5 h-5 text-[#22c55e]" />}
          aspect="portrait"
        />

        {/* 6. Recommendations */}
        <AnimeSection
          title="You Might Also Like"
          items={MOCK_RECOMMENDATIONS}
          icon={<HeartHandshake className="w-5 h-5 text-[#22c55e]" />}
          aspect="portrait"
        />
      </div>
    );
  } catch (error) {
    console.error("Watch Page Error:", error);
    return (
      <div className="py-12">
        <EmptyState
          title="Error Loading Stream"
          description="There was an error loading the video stream. Please try again later."
        />
      </div>
    );
  }
}
