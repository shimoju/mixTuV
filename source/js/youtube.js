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
