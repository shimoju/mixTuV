// YouTube

var uploadsUrl = function(username) {
  return 'http://gdata.youtube.com/feeds/api/users/' + username + '/uploads'
};

var extractEntries = function(xml) {
  return $(xml).find('entry');
};

var parseVideo = function(xml) {
  var entry = $(xml);
  var title = entry.find('title')[0];
  var mediaContent = entry.find('content[yt\\:format=5]')[0];
  var mediaPlayer = entry.find('player')[0];

  return {
    title: $(title).text(),
    url: {content: $(mediaContent).attr('url'), player: $(mediaPlayer).attr('url')}
  };
};

var videoId = function(url) {
  var urlObj = $('<a>', {href: url})[0];

  // Player URL: http://www.youtube.com/watch?v=VIDEOID
  if (/^\/watch/.test(urlObj.pathname)) {
    var query = urlObj.search.substr(1).split('&');
    var id;
    $.each(query, function(i) {
      if (/^v=/.test(this)) {
        id = this.split('=')[1];
        return false;
      }
    });
    return id;
  // Content URL: http://www.youtube.com/v/VIDEOID
  } else if (/^\/v\//.test(urlObj.pathname)) {
    return urlObj.pathname.split('/')[2];
  }
};
