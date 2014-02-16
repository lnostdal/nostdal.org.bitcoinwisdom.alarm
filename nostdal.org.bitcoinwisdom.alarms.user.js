// ==UserScript==
// @name Bitcoinwisdom price alarms
// @match http://bitcoinwisdom.com/*
// @updateURL https://github.com/lnostdal/nostdal.org.bitcoinwisdom.alarm/raw/master/nostdal.org.bitcoinwisdom.alarms.user.js
// @version 1.0
// ==/UserScript==


var main = function(){


  var beep = (function (){
    var ctx = new(window.AudioContext ||
                  window.webkitAudioContext ||
                  window.mozAudioContext ||
                  window.oAudioContext ||
                  window.msAudioContext);
    return function (duration, freq, type){
      duration = +duration;

      type = (type % 5) || 0;

      var osc = ctx.createOscillator();

      osc.type = type;
      osc.frequency.value = freq;

      osc.connect(ctx.destination);
      osc.start(0);

      setTimeout(function(){ osc.stop(0); }, duration);
    };
  })();



  (function($){
    $.qs = (function(a){
      if (a == "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i){
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
      return b;
    })(window.location.search.substr(1).split('&'));
  })(jQuery);



  $("#periods").append("<li class='sep'></li> <li>Low alarm: <input id='low_alarm' type='text' style='width: 4em;'></li> <li>High alarm: <input id='high_alarm' type='text' style='width: 4em;'></li>");



  // On page (re)load fetch values from URL.
  $("#low_alarm").val($.qs["low_alarm"]);
  $("#high_alarm").val($.qs["high_alarm"]);



  var low_alarm = window.setInterval(function(){
    if(parseFloat($("#price").html()) <= parseFloat($("#low_alarm").val())){
      beep(500, 440, 0);
    }
    window.history.replaceState(null, '', '?low_alarm=' + $("#low_alarm").val() + "&high_alarm=" + $("#high_alarm").val());
  },
                                     1000);



  var high_alarm = window.setInterval(function(){
    if(parseFloat($("#price").html()) >= parseFloat($("#high_alarm").val())){
      beep(500, 880, 0);
    }
  },
                                      1000);


};



var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);
