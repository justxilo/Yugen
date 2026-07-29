/**
 * AniList Metadata Provider Placeholder (Frontend).
 * 
 * Note: Per PROJECT.md architecture, the frontend communicates strictly
 * with the FastAPI backend gateway. This file serves as a placeholder interface
 * for future contract definitions if needed. Direct connections to AniList from
 * the browser are strictly forbidden.
 */

export interface AniListProviderPlaceholder {
  readonly providerName: 'AniList';
}

export const ANILIST_PROVIDER_NAME = 'AniList';
