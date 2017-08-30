console.log('app.js has loaded!');

;(function($) {
  "use strict";

  // modules
  var fullPage = require('./fullPage');
  var owlCarousel = require('./owlCarousel');
  var chartjs = require('./chartJs');
  var tableFilter = require('./tableFilter');
  var isotopeGallery = require('./isotopeGallery');

  // document ready functions
  $(document).ready(function() {

    fullPage();
    $('#fp-nav').appendTo('.sidebar');
    $('header .navbar .navbar-left .market-pulse').hide();
    owlCarousel();
    chartjs('chart-bitcoin', [40, 42, 43, 39, 30, 41, 20, 27, 35, 38, 42, 28]);
    chartjs('chart-ethereum', [30, 30, 43, 39, 42, 30, 30, 43, 20, 35, 42, 28]);
    chartjs('chart-litecoin', [20, 30, 42, 30, 42, 39, 35, 30, 28, 30, 43, 43]);
    chartjs('chart-xem', [43, 42, 35, 42, 43, 30, 20, 30, 30, 28, 39, 30]);
    chartjs('chart-xmr', [42, 20, 43, 39, 30, 30, 43, 30, 30, 28, 42, 35]);
    tableFilter();

  }); // end of document ready


  // window load functions
  $(window).on('load', function() {
    isotopeGallery();

    $(window).scroll(function(event) {
      // console.log($(this).scrollTop());
      // console.log('1')
      // if ( $(this).scrollTop() >= $('.section[data-anchor="news"]').offset().top ) {
      // console.log($(this).scrollTop());
      // if ( $('.section[data-anchor="news"] .loading-text').isInViewport() ) {
      //   var href = $('.loading-text a').href;
      //   event.preventDefault();
      //   setTimeout(function() {
      //     loadContentSearch(href);
      //     console.log('content loaded');
      //   }, 2000);
      // }
    });

    // $('body').mCustomScrollbar({
    //   scrollbarPosition: "outside"
    // });

  }); // end of window load

  $('#leftMenu .close').on('click', function(e) {
    e.preventDefault();
    $('.main-wrapper').removeClass('slide-left');
    $('#leftMenu').removeClass('opened');
  });

  $('#menu-button').on('click', function(e) {
    e.preventDefault();
    $('.main-wrapper').addClass('slide-left');
    $('#leftMenu').addClass('opened');
  });

  $('.tab-panels ul li a').on('click', function(e) {
    e.preventDefault();
    $(this).parent('li').siblings('li').removeClass('active');
    $(this).parent('li').addClass('active');
    $(this).closest('ul').next('.tabs').children('.tab').removeClass('active');
    $('#' + $(this).data('type')).addClass('active');
  });

  $('.toggler-button').on('click', function(e) {
    e.preventDefault();
    $(this).siblings('.toggle-content').toggleClass('active');
    $(this).text(function(i, text) {
      return text === "See Details" ? "Close Details" : "See Details";
    });
    $.fn.fullpage.reBuild();
  });

  $('form.contact-form').validator().submit(function (e) {
    if ( !e.isDefaultPrevented() ) {
      e.preventDefault();
      console.log('success');
    }
  });

  $('#blog-gallery .blog-info .button').on('click', function(e) {
    e.preventDefault();
    $.fn.fullpage.moveTo('news', 1);
  });

  $('.blog-categories .categories li a').on('click', function(e) {
    e.preventDefault();

    if ( $(this).data('category') === 'search' ) {
      $('#fullpage').addClass('blurred');
      $('header').addClass('search');
    }

  });

  $('header .search-field .close-search a').on('click', function(e) {
    e.preventDefault();

    $('#fullpage').removeClass('blurred');
    $('header').removeClass('search');
  });

  $('header .search-field .microphone a').on('click', function(e) {
    e.preventDefault();
    recordAction();
  });

  // Ajax setup
  $.ajaxSetup({
    cache: false
  });

  function loadContentSearch(url) {
    $.ajax({
      url: url,
      type: 'GET',
      beforeSend: function() {
      },
      success: function(data) {
        console.log('sent');
        // $('.main-wrapper .content-wrapper .check').append(data);
        // $('.main-wrapper .content-wrapper .check .grid').removeClass('placeholder-show');
        // if ( !$('.main-wrapper .content-wrapper .check .grid:first-child').hasClass('list-view') ) {
        //   $('.main-wrapper .content-wrapper .check .grid:last-child').removeClass('list-view');
        // }
        // if ( $('#reviews .review-block_comments').length ) {
        //   if ( !$('#reviews .review-block_comments').hasClass('mCustomScrollbar') ) {
        //     $('#reviews .review-block_comments').append(data);
        //     $('#reviews .review-block_comments').mCustomScrollbar({
        //       scrollbarPosition: "outside"
        //     });
        //   } else {
        //     $('#reviews .review-block_comments.mCustomScrollbar .mCustomScrollBox .mCSB_container').append(data);
        //   }
        // }
        // $('.stars-hotel').stars();
        // $('.rate').rate();
        // $('.ui.sticky').sticky({
        //   context: '#sticky-wrap',
        //   silent: true
        // });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown + ' please, try again later');
      }
    });
  }

  function reset() {
    working = false;
    // document.getElementById("status").style.display = "none";
    // document.getElementById("btn").innerHTML = "Start Dictation";
  }

  function recordAction() {
    if (working) {
      speech.stop();
      reset();
    } else {
      working = true;
      // document.getElementById("status").style.display = "block";
      document.getElementById("warning").style.display = "none";
      // document.getElementById("btn").innerHTML = "Stop Listening";
      speech.start();
    }
  }

  $('#searchInput').on('input', function() {
    var text = $(this).val();
    if ( text !== localStorage['transcript'] ) {
      localStorage['transcript'] = text;
      final_transcript = text;
      interim_transcript = text;
    }
  });

  function format(s) {
    return s.replace(/\n/g, '<br>');
  }

  function capitalize(s) {
    return s.replace(/\S/, function(m) {
      return m.toUpperCase();
    });
  }

  function initialize() {
    speech = new webkitSpeechRecognition();
    speech.continuous = true;
    speech.maxAlternatives = 5;
    speech.interimResults = true;
    speech.lang = "en-US";
    speech.onend = reset;
  }

  var working, speech, final_transcript = "";

  if (!('webkitSpeechRecognition' in window)) {
    $('header .search-field .microphone').hide();
  } else {

    localStorage['transcript'] = localStorage['transcript'] || "";
    document.getElementById("searchInput").value = localStorage['transcript'];
    final_transcript = localStorage['transcript'];

    setInterval(function() {
      var text = document.getElementById("searchInput").value;
      if (text !== localStorage['transcript']) {
        localStorage['transcript'] = text;
      }
    }, 5000);

    initialize();
    reset();

    speech.onerror = function(e) {
      var msg = e.error + " error";
      if (e.error === 'no-speech') {
        msg =
          "No speech was detected. Please turn on the microphone and try again.";
      } else if (e.error === 'audio-capture') {
        msg =
          "Please ensure that your microphone is connected to the computer and turned on.";
      } else if (e.error === 'not-allowed') {
        msg =
          "Cannot access your microphone. Please go to chrome://settings/contentExceptions#media-stream and allow Microphone access to this website.";
      }
      document.getElementById("warning").innerHTML = "<p>" + msg + "</p>";
      setTimeout(function() {
        document.getElementById("warning").innerHTML = "";
      }, 5000);
    };

    var interim_transcript = '';
    speech.onresult = function(e) {
      interim_transcript = '';
      final_transcript = '';
      if (typeof(e.results) === 'undefined') {
        reset();
        return;
      }
      for (var i = e.resultIndex; i < e.results.length; ++i) {
        var val = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          final_transcript += " " + val;
        } else {
          interim_transcript += " " + val;
        }
      }
      document.getElementById("searchInput").value = format(interim_transcript);
    };

    speech.onend = function(e) {
      document.getElementById("searchInput").value = format(capitalize(final_transcript));
    };
  }


})(jQuery);