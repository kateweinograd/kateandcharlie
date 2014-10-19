var kateAndCharlieDotCom = function($, window, document, undefined) {
  'use strict';

  var $window      = $('window'),
  $body        = $('body'),
  $titleBox    = $('.js-fade-on-scroll');

  function fadeTitleOnLoad() {
    if ( $body.scrollTop() === 0 ) {
      $titleBox.animate({ 'opacity': 1 }, 800);
    } else {
      $window.load( fadeTitleOnScroll() );
    }
  }

  // fade and scroll .title-box as .content-area scrolls up
  function fadeTitleOnScroll() {
    var windowHeight     = $(window).height(),
    contentAreaTop   = $body.scrollTop();

    if ( contentAreaTop <= 0 ) {
      // before scrolling
      $titleBox.css({
        'opacity': 1,
        'top'    : 0
      });
    } else if ( contentAreaTop >= windowHeight ) {
      // after .content-area has reached the top of the window
      $titleBox.css({
        'opacity': 0,
        'top'    : windowHeight / 2
      });
    } else {
      // while scrolling .content-area but before reachign top of window
      var titleBoxPosition = $titleBox.position(),
      titleBoxOffset       = $titleBox.offset(),
      percentScrolled      = contentAreaTop/windowHeight,
      // .title-box opacity decreases linearly with distance scrolled
      titleBoxOpacity      = 1 - percentScrolled,
      // .title-box slides up logarithmically with distance scrolled
      titleBoxMovementBase = (titleBoxPosition.top - titleBoxOffset.top) * percentScrolled / 2,
      titleBoxMovementTrig = titleBoxMovementBase * ( Math.cos( Math.PI / 2 * percentScrolled ) ),
      titleBoxTop          = titleBoxMovementBase + titleBoxMovementTrig;

      $titleBox.css({
        'opacity': titleBoxOpacity,
        'top':     titleBoxTop
      });
    }
  }

  return {
    init: function() {
      fadeTitleOnLoad();

      $(window).scroll( _.throttle(fadeTitleOnScroll, 10) );
      $(window).resize( _.throttle(fadeTitleOnScroll, 100) );
    },
    initAfterLoad: function() {

    }
  }

}(jQuery, window, document);

// fire when the DOM is ready
jQuery(document).ready(function() {
  kateAndCharlieDotCom.init();
});

// fire when page if fully loaded
jQuery(window).load(function() {
  kateAndCharlieDotCom.initAfterLoad();
});
