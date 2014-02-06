// YouTube

var uploadsUrl = function(username) {
  return 'http://gdata.youtube.com/feeds/api/users/' + username + '/uploads'
};

var extractEntries = function(xml) {
  return $(xml).find('entry');
};

var parseVideo = function(xml) {
  entry = $(xml);
  var title = entry.find('title')[0];
  var content = entry.find('content[yt\\:format=5]')[0];

  return {
    title: $(title).text(),
    url: $(content).attr('url'),
  };
};
