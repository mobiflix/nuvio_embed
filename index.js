// Nuvio Plugin Entry — walang async/await sa top level
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

function extractSource(url) {
  try {
    var host = url.replace('https://', '').replace('http://', '').split('/')[0];
    host = host.replace('www.', '');
    return host.split('.')[0].charAt(0).toUpperCase() + host.split('.')[0].slice(1);
  } catch (e) {
    return 'Unknown';
  }
}

function getStreams(params) {
  var tmdbId = params.tmdbId;
  var mediaType = params.mediaType;
  var season = params.season || 1;
  var episode = params.episode || 1;

  var streams = [];

  if (mediaType === 'movie') {
    for (var i = 0; i < MOVIE_ENDPOINTS.length; i++) {
      var endpoint = MOVIE_ENDPOINTS[i];
      streams.push({
        name: extractSource(endpoint),
        title: extractSource(endpoint) + ' — HD',
        url: endpoint + tmdbId,
        quality: 'HD',
        type: 'iframe',
        provider: 'MultiEmbed'
      });
    }
  } else if (mediaType === 'tv') {
    for (var j = 0; j < SERIES_ENDPOINTS.length; j++) {
      var ep = SERIES_ENDPOINTS[j];
      var url;
      if (ep.indexOf('2embed.cc/embedtvfull') !== -1) {
        url = ep + tmdbId;
      } else if (ep.indexOf('vidsrc.me') !== -1) {
        url = ep + tmdbId + '/' + season + '/' + episode;
      } else {
        url = ep + tmdbId + '/' + season + '/' + episode;
      }
      streams.push({
        name: extractSource(ep),
        title: extractSource(ep) + ' — HD',
        url: url,
        quality: 'HD',
        type: 'iframe',
        provider: 'MultiEmbed'
      });
    }
  }

  return streams;
}

// Export — ito ang hinahanap ng Nuvio
module.exports = {
  getStreams: getStreams
};
