import React from 'react';
import { Layers, HeartHandshake } from 'lucide-react';
import { AniKotoClient, mapAniKotoItem } from '@/lib/api/anikoto';
import { MOCK_TRENDING, MOCK_RECOMMENDATIONS } from '@/lib/mockData';
import { AnimeDetailsHeader } from '@/components/anime/AnimeDetailsHeader';
import { EpisodeList } from '@/components/anime/EpisodeList';
import { AnimeSection } from '@/components/anime/AnimeSection';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnimeItem, EpisodeItem } from '@/lib/mockData';

import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const animeData = await AniKotoClient.getAnimeInfo(id);
    return {
      title: animeData?.title || 'Anime Details',
    };
  } catch {
    return {
      title: 'Anime Details',
    };
  }
}

export default async function AnimeDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const [animeData, episodesData] = await Promise.all([
      AniKotoClient.getAnimeInfo(id).catch(() => null),
      AniKotoClient.getEpisodes(id).catch(() => null)
    ]);

    if (!animeData) {
      return (
        <div className="py-12">
          <EmptyState
            title="Anime Details Not Found"
            description="The requested anime title could not be located in the catalog."
          />
        </div>
      );
    }

    // Map AniKoto API format to frontend AnimeItem format
    const animeDetails: AnimeItem = {
      id: animeData.slug || animeData.animeId?.toString(),
      title: animeData.title,
      romajiTitle: animeData.japaneseTitle,
      nativeTitle: animeData.altNames,
      poster: animeData.poster,
      banner: animeData.backgroundImage || animeData.poster,
      synopsis: animeData.synopsis,
      type: animeData.type,
      status: animeData.status,
      rating: animeData.malScore,
      studio: animeData.studios?.[0],
      season: animeData.premiered,
      episodes: animeData.episodes,
      duration: animeData.duration,
      genres: animeData.genres,
    };

    const episodes: EpisodeItem[] = (episodesData?.episodes || []).map((ep: any) => ({
      id: ep.id,
      number: ep.episode_no,
      title: ep.title || `Episode ${ep.episode_no}`,
      thumbnail: animeData.poster, // Use poster as fallback for episode thumbnail
      duration: animeData.duration || '24m',
      airDate: '', // Can be extracted if available
    }));

    return (
      <div className="space-y-8 pb-10">
        {/* 1. Details Header (Poster on left, details on right) */}
        <AnimeDetailsHeader anime={animeDetails} />

        {/* 2. Episode List Grid (ep list directly under details as per sketch) */}
        <EpisodeList animeId={animeDetails.id} episodes={episodes} />

        {/* 3. Related Anime */}
        <AnimeSection
          title="Related Anime"
          items={MOCK_TRENDING}
          icon={<Layers className="w-5 h-5 text-[#22c55e]" />}
          aspect="portrait"
        />

        {/* 4. Recommendations */}
        <AnimeSection
          title="You Might Also Like"
          items={MOCK_RECOMMENDATIONS}
          icon={<HeartHandshake className="w-5 h-5 text-[#22c55e]" />}
          aspect="portrait"
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading anime details:", error);
    return (
      <div className="py-12">
        <EmptyState
          title="Error Loading Anime"
          description="There was an error loading the anime details. Please try again later."
        />
      </div>
    );
  }
}
