var player;
var users;

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
  getUsers();
};

var onPlayerStateChange = function(event) {
  if (event.data == YT.PlayerState.ENDED) {
    loadVideo();
  }
};

var getUsers = function() {
  $.ajax({
    url: 'users.json',
    dataType: 'json',
    success: function(data) {
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
  user = shuffle(users)[0];
  $.ajax({
    url: uploadsUrl(user['youtube']),
    dataType: 'xml',
    success: function(data) {
      var url = shuffle(parseVideo(data))[0];
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
