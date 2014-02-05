var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  loadVideo();
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    loadVideo();
  }
}

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

var loadVideo = function() {
  $.ajax({
    url: 'http://gdata.youtube.com/feeds/api/users/kzlivetune/uploads',
    dataType: 'xml',
    success: function(data) {
      var url = shuffle(parseVideo(data))[0];
      console.log(parseVideo(data));
      console.log(url);
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
