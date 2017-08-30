// Module FullPage.js
module.exports = function() {
  $('#fullpage').fullpage({
    //Navigation
    anchors: ['homepage', 'membership', 'sale-table', 'market-pulse', 'news', 'services', 'team', 'q-and-a', 'contact-us'],
    menu: '#menu-anchor',
    lockAnchors: false,
    navigation: true,
    navigationPosition: 'left',
    navigationTooltips:
      ['Homepage', 'Exclusive Membership', 'Pre-Sale Table',
        'Market Pulse', 'News', 'ICO Placement Services', 'Team'],
    showActiveTooltip: false,
    slidesNavigation: false,
    slidesNavPosition: 'bottom',

    //Scrolling
    css3: true,
    scrollingSpeed: 700,
    autoScrolling: true,
    fitToSection: true,
    fitToSectionDelay: 1000,
    scrollBar: false,
    // easing: 'easeInOutCubic',
    easingcss3: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
    loopBottom: false,
    loopTop: false,
    loopHorizontal: true,
    continuousVertical: false,
    continuousHorizontal: false,
    scrollHorizontally: false,
    interlockedSlides: false,
    dragAndMove: false,
    offsetSections: false,
    resetSliders: false,
    fadingEffect: false,
    normalScrollElements: '#element1, .element2',
    scrollOverflow: true,
    scrollOverflowOptions: null,
    scrollOverflowReset: false,
    touchSensitivity: 15,
    normalScrollElementTouchThreshold: 5,
    bigSectionsDestination: null,

    //Accessibility
    keyboardScrolling: true,
    animateAnchor: true,
    recordHistory: true,

    //Design
    controlArrows: false,
    verticalCentered: true,
    sectionsColor : ['#fff'],
    paddingTop: '3em',
    paddingBottom: '10px',
    fixedElements: '.header, .footer',
    responsiveWidth: 0,
    responsiveHeight: 0,
    responsiveSlides: false,
    parallax: false,
    parallaxOptions: false,

    //Custom selectors
    sectionSelector: '.section',
    slideSelector: '.slide',

    lazyLoading: true,

    //events
    onLeave: function(index, nextIndex, direction) {
      var leavingSection = $(this);
      var header = $('header');
      var sidebar = $('.sidebar');
      // if ($(this)) {
        // $('.section.active').css({
          // 'opacity': '0',
          // 'filter': 'blur(10px)'
        // });
      // }

      // links back
      $('.sidebar #menu-anchor-back li').addClass('hidden');
      $('.sidebar #menu-anchor-back li[data-slide="' + nextIndex + '"]').removeClass('hidden');

      // links forward
      $('.sidebar #menu-anchor li').addClass('hidden');
      $('.sidebar #menu-anchor li[data-slide="' + nextIndex + '"]').removeClass('hidden');


      // individual section styles resets
      $('header .navbar .navbar-left .page-title').hide();
      header.addClass('bg-white');
      sidebar.removeClass('bg-white');
      $('header .navbar .navbar-left .blog-categories').hide();
      $('header .navbar .navbar-left .blog-filter').hide();
      $('header .navbar .navbar-left .to-news').hide();
      $.fn.fullpage.setAllowScrolling(true, 'up');
      $.fn.fullpage.setAllowScrolling(true, 'down');
      $.fn.fullpage.setAllowScrolling(true, 'left');
      $.fn.fullpage.setAllowScrolling(true, 'right');
      $.fn.fullpage.setKeyboardScrolling(true, 'up');
      $.fn.fullpage.setKeyboardScrolling(true, 'down');
      $.fn.fullpage.setKeyboardScrolling(true, 'left');
      $.fn.fullpage.setKeyboardScrolling(true, 'right');

      // individual section styles
      if ( nextIndex === 1 ) { // Homepage
      } else if ( nextIndex === 2 ) { // Exclusive Membership
      } else if ( nextIndex === 3 ) { // Pre-Sale Table
      } else if ( nextIndex === 4 ) { // Market Pulse
        $('header .navbar .navbar-left .market-pulse').show();
        $.fn.fullpage.setAllowScrolling(true, 'down');
      } else if ( nextIndex === 5 ) { // News
        header.removeClass('bg-white');
        sidebar.addClass('bg-white');
        $('header .navbar .navbar-left .blog-categories').show();
        $('header .navbar .navbar-left .blog-filter').show();
      } else if ( nextIndex === 5 && slideNumber === 1) { // News - Post Page
        $('header .navbar .navbar-left .to-news').show();
      } else if ( nextIndex === 6 ) { // ICO Placement Services
        header.removeClass('bg-white');
      } else if ( nextIndex === 7 ) { // Team
        $('header .navbar .navbar-left .team').show();

        // scroll block
        $.fn.fullpage.setAllowScrolling(false, 'down');
        $.fn.fullpage.setKeyboardScrolling(false, 'down');
      } else if ( nextIndex === 8 ) { // Q&A
        $('header .navbar .navbar-left .q-and-a').show();

        // scroll block
        $.fn.fullpage.setAllowScrolling(false, 'up');
        $.fn.fullpage.setAllowScrolling(false, 'down');
        $.fn.fullpage.setKeyboardScrolling(false, 'up');
        $.fn.fullpage.setKeyboardScrolling(false, 'down');
      } else if ( nextIndex === 9 ) { // Contact Us
        $('header .navbar .navbar-left .contact').show();

        // scroll block
        $.fn.fullpage.setAllowScrolling(false, 'up');
        $.fn.fullpage.setAllowScrolling(false, 'down');
        $.fn.fullpage.setKeyboardScrolling(false, 'up');
        $.fn.fullpage.setKeyboardScrolling(false, 'down');
      }
    },
    afterLoad: function(anchorLink, index) {
      // $('.section').not('.active').css({
        // 'opacity': '1',
        // 'filter': 'blur(0)'
      // });
      var slideNumber = $('.fp-section.active .fp-slide.active').index();

      $('header .navbar .navbar-left .to-news').fadeOut(200);
      if ( index === 5 && slideNumber === 1 ) { // News - Post Page
        $('header .navbar .navbar-left .to-news').fadeIn(200);
      }
    },
    afterRender: function(){},
    afterResize: function(){},
    afterResponsive: function(isResponsive){},
    afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
    onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex) {
      var sectionNumber = $('.fp-section.active').index();
      // console.log('section number', sectionNumber, 'slide number', slideIndex);

      $('header .navbar .navbar-left .to-news').fadeOut(200);
      if ( sectionNumber === 4 && slideIndex === 0 ) { // News - Post Page
        $('header .navbar .navbar-left .to-news').fadeIn(200);
      }
    }
  });

  // function getScroll() {
  //   console.log(this.y);
  //   $('#position').text(this.y);
  // }

};