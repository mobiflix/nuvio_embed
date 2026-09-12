/**
 * Nuvio Multi-Embed Provider
 * Hermes-compatible — walang async/await, arrow functions, o const/let.
 */

var MOVIE_ENDPOINTS = [
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

var SERIES_ENDPOINTS = [
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

function extractDomain(url) {
  try {
    var host = url.replace('https://', '').replace('http://', '');
    host = host.split('/')[0];
    host = host.replace('www.', '');
    var name = host.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch (e) {
    return 'Unknown';
  }
}

function buildStreams(tmdbId, mediaType, season, episode) {
  var streams = [];
  var i;
  var endpoint;

  if (typeof season === 'undefined') season = 1;
  if (typeof episode === 'undefined') episode = 1;

  if (mediaType === 'movie') {
    for (i = 0; i < MOVIE_ENDPOINTS.length; i++) {
      endpoint = MOVIE_ENDPOINTS[i];
      streams.push({
        source: extractDomain(endpoint),
        url: endpoint + tmdbId,
        quality: 'HD',
        type: 'iframe'
      });
    }
  } else if (mediaType === 'tv') {
    for (i = 0; i < SERIES_ENDPOINTS.length; i++) {
      endpoint = SERIES_ENDPOINTS[i];

      if (endpoint.indexOf('2embed.cc/embedtvfull') !== -1) {
        streams.push({
          source: '2Embed (Full)',
          url: endpoint + tmdbId,
          quality: 'HD',
          type: 'iframe'
        });
      } else if (endpoint.indexOf('vidsrc.me') !== -1) {
        streams.push({
          source: 'VidSrc.me',
          url: endpoint + tmdbId + '/' + season + '/' + episode,
          quality: 'HD',
          type: 'iframe'
        });
      } else {
        streams.push({
          source: extractDomain(endpoint),
          url: endpoint + tmdbId + '/' + season + '/' + episode,
          quality: 'HD',
          type: 'iframe'
        });
      }
    }
  }

  return streams;
}

function getStreams(params) {
  var tmdbId = params.tmdbId;
  var mediaType = params.mediaType;
  var season = params.season;
  var episode = params.episode;
  var streams = buildStreams(tmdbId, mediaType, season, episode);

  if (!streams.length) {
    return [];
  }

  var result = [];
  for (var i = 0; i < streams.length; i++) {
    var s = streams[i];
    result.push({
      name: s.source,
      title: s.source + ' - ' + s.quality,
      url: s.url,
      quality: s.quality,
      type: s.type,
      headers: {
        'Referer': s.url,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      provider: 'MultiEmbed',
      index: i
    });
  }

  return result;
}

module.exports = {
  getStreams: getStreams
};
