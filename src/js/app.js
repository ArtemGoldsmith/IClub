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

    // fullPage();
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
    $('html,body').animate({ scrollTop: 0 }, 200);
  }); // end of window load

  $(document).on('click', '#leftMenu .close', function(e) {
    e.preventDefault();
    $('.main-wrapper').removeClass('slide-left');
    $('#leftMenu').removeClass('opened');
  });

  $(document).on('click', '#menu-button', function(e) {
    e.preventDefault();
    $('.main-wrapper').addClass('slide-left');
    $('#leftMenu').addClass('opened');
  });

  $(document).on('click', '.tab-panels ul li a', function(e) {
    e.preventDefault();
    $(this).parent('li').siblings('li').removeClass('active');
    $(this).parent('li').addClass('active');
    $(this).closest('ul').next('.tabs').children('.tab').removeClass('active');
    $('#' + $(this).data('type')).addClass('active');
  });

  $(document).on('click', '.toggler-button', function(e) {
    e.preventDefault();
    $(this).siblings('.toggle-content').toggleClass('active');
    $(this).text(function(i, text) {
      return text === "See Details" ? "Close Details" : "See Details";
    });
  });

  $('form.contact-form').validator().submit(function (e) {
    if ( !e.isDefaultPrevented() ) {
      e.preventDefault();
      console.log('success');
    }
  });

  // $('#blog-gallery .blog-info').on('click', '.button', function(e) {
  //   e.preventDefault();
  // });

  $(document).on('click', '.blog-categories .categories li a', function(e) {
    e.preventDefault();

    if ( $(this).data('category') === 'search' ) {
      $('.section-wrapper').addClass('blurred');
      $('header').addClass('search');
    }

  });

  $(document).on('click', 'header .search-field .close-search a', function(e) {
    e.preventDefault();

    $('.section-wrapper').removeClass('blurred');
    $('header').removeClass('search');
  });

  $(document).on('click', 'header .search-field .microphone a', function(e) {
    e.preventDefault();
    recordAction();
  });

  var blogScrollPos = 0,
      loadBlogContent = true;
  $(window).scroll(function(e) {
    console.log('scrolltop', $(this).scrollTop(), 'posts end', blogScrollPos);
    blogScrollPos = $('#blog-gallery').height() - 250;
    if ( $(this).scrollTop() >= blogScrollPos && loadBlogContent ) {
      blogScrollPos = 0;
      loadBlogContent = false;
      var href = $('.loading-text a').attr('href');
      e.preventDefault();
      setTimeout(function() {
        var scrollPos = $(this).scrollTop();
        loadContentSearch(href);
        $('html, body').animate({ scrollTop: scrollPos }, 300);
      }, 1000);
      setTimeout(function() {
        loadBlogContent = true;
      }, 2000);
    }
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
        if ( typeof url !== undefined ) {
          $('#blog-gallery').append(data).hide().fadeIn(200);
          isotopeGallery('destroy');
          isotopeGallery();
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown + ' please, try again later');
      }
    });
  }

  function resetVoice() {
    working = false;
  }

  function recordAction() {
    if (working) {
      speech.stop();
      resetVoice();
    } else {
      working = true;
      document.getElementById("warning").style.display = "none";
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

  function formatVoice(s) {
    return s.replace(/\n/g, '<br>');
  }

  function capitalizeVoice(s) {
    return s.replace(/\S/, function(m) {
      return m.toUpperCase();
    });
  }

  function initializeVoice() {
    speech = new webkitSpeechRecognition();
    speech.continuous = true;
    speech.maxAlternatives = 5;
    speech.interimResults = true;
    speech.lang = "en-US";
    speech.onend = resetVoice;
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

    initializeVoice();
    resetVoice();

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
      document.getElementById("searchInput").value = formatVoice(interim_transcript);
    };

    speech.onend = function(e) {
      document.getElementById("searchInput").value = formatVoice(capitalizeVoice(final_transcript));
    };
  }

  $('#sidebar-navigation ul li').on('click', 'a', function(e) {
    e.preventDefault();

    $(this).parent('li').siblings().children('a').removeClass('active');
    $(this).addClass('active');
  });

  var isAnimating = false,
      newLocation = '',
      firstLoad = false;

  //trigger smooth transition from the actual page to the new one
  $('.main-wrapper').on('click', 'a[data-type="page-transition"]', function(e) {
    e.preventDefault();
    $('html,body').animate({ scrollTop: 0 }, 200);
    //detect which page has been selected
    var newPage = $(this).attr('href');
    //if the page is not already being animated - trigger animation
    if ( !isAnimating ) changePage(newPage, true);
    firstLoad = true;
  });

  //detect the 'popstate' event - e.g. user clicking the back button
  $(window).on('popstate', function() {
    if ( firstLoad ) {
      /*
      Safari emits a popstate event on page load - check if firstLoad is true before animating
      if it's false - the page has just been loaded
      */
      var newPageArray = location.pathname.split('/'),
        //this is the url of the page to be loaded
        newPage = newPageArray[newPageArray.length - 1];

      if ( !isAnimating  &&  newLocation !== newPage ) changePage (newPage, false);
    }
    firstLoad = true;
  });

  function changePage(url, bool) {
    isAnimating = true;
    // trigger page animation
    $('body').addClass('page-is-changing');
    $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
      loadNewContent(url, bool);
      newLocation = url;
      $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
    });
    //if browser doesn't support CSS transitions
    if( !transitionsSupported() ) {
      loadNewContent(url, bool);
      newLocation = url;
    }
  }

  function loadNewContent(url, bool) {
    url = ('' === url) ? 'index.html' : url;
    var newSection = url.replace('.html', '');
    var section = $('<div class="submain-wrapper" data-page="' + newSection + '"></div>');

    // $('.main-wrapper .section-wrapper').removeAttr('class').addClass('section-wrapper ' + newSection);
    // $('header').removeAttr('data-page').attr('data-page', newSection);
    // $('body').removeAttr('data-page').attr('data-page', newSection);
    // $('aside').removeAttr('data-page').attr('data-page', newSection);
    section.load(url + ' .submain-wrapper > *', function() {

      // load new content and replace .section-wrapper content with the new one
      $('.main-wrapper').append(section);
      var submainWrapper = $('.submain-wrapper');
      submainWrapper.eq(0).addClass('slide-down');
      submainWrapper.eq(1).addClass('slide-up');

      // move section
      var submainHeight = $('.submain-wrapper.slide-down').height();
      $('.submain-wrapper.slide-up').css({
        transform: 'translateY(-' + submainHeight + 'px)'
      });
      setTimeout(function() {
        submainWrapper.eq(0).remove();
        $('.submain-wrapper.slide-up').removeClass('slide-up');
        submainWrapper.removeAttr('style');
      }, 500);

      // if browser doesn't support CSS transitions - don't wait for the end of transitions
      var delay = ( transitionsSupported() ) ? 1200 : 0;
      setTimeout(function() {
        // wait for the end of the transition on the loading bar before revealing the new content
        ( section.hasClass('cd-about') ) ? $('body').addClass('cd-about') : $('body').removeClass('cd-about');
        $('body').removeClass('page-is-changing');
        $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
          isAnimating = false;
          $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
        });

        if( !transitionsSupported() ) isAnimating = false;
      }, delay);

      if( url !== window.location && bool ) {
        //add the new page to the window.history
        //if the new page was triggered by a 'popstate' event, don't add it
        window.history.pushState({ path: url }, '', url);
      }

      // reinit js for new page
      // console.log('reinit js');
      owlCarousel();
      setTimeout(function() {
        chartjs('chart-bitcoin', [40, 42, 43, 39, 30, 41, 20, 27, 35, 38, 42, 28]);
        chartjs('chart-ethereum', [30, 30, 43, 39, 42, 30, 30, 43, 20, 35, 42, 28]);
        chartjs('chart-litecoin', [20, 30, 42, 30, 42, 39, 35, 30, 28, 30, 43, 43]);
        chartjs('chart-xem', [43, 42, 35, 42, 43, 30, 20, 30, 30, 28, 39, 30]);
        chartjs('chart-xmr', [42, 20, 43, 39, 30, 30, 43, 30, 30, 28, 42, 35]);
        // console.log('loading charts');
      }, 1000);
      tableFilter();
      isotopeGallery('destroy');
      isotopeGallery();
      $('form.contact-form').validator().submit(function (e) {
        if ( !e.isDefaultPrevented() ) {
          e.preventDefault();
          console.log('success');
        }
      });
    });
  }

  function transitionsSupported() {
    return $('html').hasClass('csstransitions');
  }


})(jQuery);