export interface EpisodeItem {
  number: number;
  title: string;
  duration: string;
  thumbnail: string;
  airDate: string;
  isWatched?: boolean;
}

export interface AnimeItem {
  id: string;
  title: string;
  romajiTitle?: string;
  nativeTitle?: string;
  poster: string;
  banner?: string;
  type: 'TV' | 'MOVIE' | 'OVA' | 'SPECIAL';
  episodes?: number;
  currentEpisode?: number;
  rating?: number;
  subDub?: 'SUB' | 'DUB';
  views?: string;
  releaseTime?: string;
  progressPercent?: number;
  synopsis?: string;
  status?: string;
  studio?: string;
  season?: string;
  year?: number;
  duration?: string;
  trailerUrl?: string;
  genres?: string[];
  episodesList?: EpisodeItem[];
}

export const HERO_SLIDES: AnimeItem[] = [];
export const MOCK_EPISODES: EpisodeItem[] = [];
export const MOCK_CONTINUE_WATCHING: AnimeItem[] = [];
export const MOCK_TRENDING: AnimeItem[] = [];
export const MOCK_RECENTLY_UPDATED: AnimeItem[] = [];
export const MOCK_RECENTLY_RELEASED: AnimeItem[] = [];
export const MOCK_AIRING_TODAY: AnimeItem[] = [];
export const MOCK_MOVIES: AnimeItem[] = [];
export const MOCK_RECOMMENDATIONS: AnimeItem[] = [];

export function getAnimeDetails(id: string): AnimeItem {
  return {
    id: id,
    title: 'Loading Anime...',
    romajiTitle: 'Loading...',
    nativeTitle: '',
    poster: '',
    banner: '',
    type: 'TV',
    episodes: 12,
    currentEpisode: 1,
    rating: 8.5,
    subDub: 'SUB',
    status: 'RELEASING',
    studio: 'AniList Studio',
    season: 'Summer',
    year: 2024,
    duration: '24 min/ep',
    genres: ['Anime'],
    synopsis: 'Fetching metadata from AniList GraphQL gateway...',
    episodesList: [],
  };
}
