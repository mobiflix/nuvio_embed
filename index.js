/**
 * Nuvio Multi-Embed Provider
 * Streams from multiple embed sources using TMDB IDs.
 */

const MOVIE_ENDPOINTS = [
  'https://vidlink.pro/movie/',
  'https://vidsrc.dev/embed/movie/',
  'https://111movies.com/movie/',
  'https://vidjoy.pro/embed/movie/',
  'https://vidsrc.io/embed/movie/',
  'https://vidsrc.cc/v2/embed/movie/',
  'https://vidsrc.xyz/embed/movie/',
  'https://www.2embed.cc/embed/',
  'https://moviesapi.club/movie/'
];

const SERIES_ENDPOINTS = [
  'https://vidlink.pro/tv/',
  'https://vidsrc.vip/embed/tv/',
  'https://111movies.com/tv/',
  'https://vidsrc.dev/embed/tv/',
  'https://vidjoy.pro/embed/tv/',
  'https://vidsrc.me/embed/tv/',
  'https://vidsrc.cc/v2/embed/tv/',
  'https://vidsrc.xyz/embed/tv/',
  'https://www.2embed.cc/embedtvfull/',
  'https://moviesapi.club/tv/'
];

/**
 * Builds embed URLs based on media type and TMDB ID.
 * @param {string|number} tmdbId - The TMDB ID of the movie or TV show.
 * @param {string} mediaType - "movie" or "tv".
 * @param {number} [season] - Season number (for TV shows).
 * @param {number} [episode] - Episode number (for TV shows).
 * @returns {Array<{source: string, url: string, quality: string}>}
 */
function buildStreams(tmdbId, mediaType, season = 1, episode = 1) {
  const streams = [];

  if (mediaType === 'movie') {
    MOVIE_ENDPOINTS.forEach((endpoint, i) => {
      streams.push({
        source: extractDomain(endpoint),
        url: `${endpoint}${tmdbId}`,
        quality: 'HD',
        type: 'iframe'
      });
    });
  } else if (mediaType === 'tv') {
    SERIES_ENDPOINTS.forEach((endpoint) => {
      // Handle endpoints that need season/episode
      if (endpoint.includes('2embed.cc/embedtvfull')) {
        streams.push({
          source: '2Embed (Full)',
          url: `${endpoint}${tmdbId}`,
          quality: 'HD',
          type: 'iframe'
        });
      } else if (endpoint.includes('vidsrc.me')) {
        streams.push({
          source: 'VidSrc.me',
          url: `${endpoint}${tmdbId}/${season}/${episode}`,
          quality: 'HD',
          type: 'iframe'
        });
      } else {
        streams.push({
          source: extractDomain(endpoint),
          url: `${endpoint}${tmdbId}/${season}/${episode}`,
          quality: 'HD',
          type: 'iframe'
        });
      }
    });
  }

  return streams;
}

/**
 * Extracts a readable name from a URL.
 */
function extractDomain(url) {
  try {
    const host = new URL(url).hostname.replace('www.', '');
    return host.split('.')[0].charAt(0).toUpperCase() + host.split('.')[0].slice(1);
  } catch {
    return 'Unknown';
  }
}

/**
 * Nuvio entry point.
 * @param {Object} params - { tmdbId, mediaType, season, episode }
 * @returns {Promise<Array>} - List of stream objects.
 */
async function getStreams({ tmdbId, mediaType, season, episode }) {
  try {
    const streams = buildStreams(tmdbId, mediaType, season, episode);

    if (!streams.length) {
      return [];
    }

    return streams.map((s, index) => ({
      name: s.source,
      title: `${s.source} — ${s.quality}`,
      url: s.url,
      quality: s.quality,
      type: s.type,
      headers: {
        'Referer': s.url,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      provider: 'MultiEmbed',
      index
    }));
  } catch (err) {
    console.error('[MultiEmbed] Error:', err);
    return [];
  }
}

// Export for Nuvio
module.exports = { getStreams };