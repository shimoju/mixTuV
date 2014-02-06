var player;
var users;
var usersUrl = 'users.json';

var onYouTubeIframeAPIReady = function() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    playerVars: {'rel': 0},
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};

var onPlayerReady = function(event) {
  console.log('YouTube Player ready.');
  getUsers();
};

var onPlayerStateChange = function(event) {
  if (event.data == YT.PlayerState.ENDED) {
    console.log('Play ended. Go next video.');
    loadVideo();
  }
};

var getUsers = function() {
  console.log('Loading users list... => ' + usersUrl);
  $.ajax({
    url: usersUrl,
    dataType: 'json',
    success: function(data) {
      console.log('Done.');
      users = data;
      loadVideo();
    },
    error: function(xhr) {
      console.log('Error: ' + xhr.status + ' ' + xhr.statusText);
      setTimeout(function() {
        console.log('Retry...');
        getUsers();
      }, 5000);
    }
  });
};

var loadVideo = function() {
  var user = shuffle(users)[0];
  var uploads = uploadsUrl(user['youtube']);
  console.log('Selected user: ' + user['name']);
  console.log('Loading uploads list... => ' + uploads);
  $.ajax({
    url: uploads,
    dataType: 'xml',
    success: function(data) {
      console.log('Done.');
      var url = shuffle(parseVideo(data))[0];
      console.log('Selected video: ' + url);
      console.log('Loading video... => ' + url);
      player.loadVideoByUrl(url);
    },
    error: function(xhr) {
      console.log('Error: ' + xhr.status + ' ' + xhr.statusText);
      setTimeout(function() {
        console.log('Retry...');
        loadVideo();
      }, 5000);
    }
  });
};

var uploadsUrl = function(username) {
  return 'http://gdata.youtube.com/feeds/api/users/' + username + '/uploads'
};

var parseVideo = function(xml) {
  // Or 'content[yt\\:format=5]'
  return $(xml).find('content').map(function() {
    if ($(this).attr('yt:format') == 5) {
      return $(this).attr('url');
    }
  });
};

var shuffle = function(array) {
  // Fisher–Yates Shuffle
  // http://bost.ocks.org/mike/shuffle/
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};
