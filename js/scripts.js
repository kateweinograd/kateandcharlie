/* jshint browser: true, devel: true, strict: true, undef: true, unused: true */
/* global _: true, jQuery: true, Modernizr: true */

var kateAndCharlieDotCom = function($, window, document, undefined) {
  'use strict';

  var $window = $('window'),
      $html        = $('html'),
      $body        = $('body'),
      $modals      = $('.js-modal'),
      $navLinks    = $('.js-scroll-to a'),
      $overlay     = $('.overlay.overlay-slidedown'),
      $titleBox    = $('.js-fade-on-scroll'),
      $triggerBttn = $('.js-overlay-trigger'),
      $closeBttn   = $('.overlay-close'),
      transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
      },
      transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

  function toggleOverlay() {
    $body.toggleClass('overlay-open');

    if ( $overlay.hasClass('open') ) {
      $overlay.removeClass('open');
      $overlay.addClass('close');
      var onEndTransitionFn = function(event) {
        if ( Modernizr.csstransitions ) {
          if ( event.propertyName !== 'visibility' ) return;
          this.removeEventListener( transEndEventName, onEndTransitionFn );
        }
        $overlay.removeClass('close');
      };
      if( Modernizr.csstransitions ) {
        $overlay[0].addEventListener( transEndEventName, onEndTransitionFn );
      }
      else {
        onEndTransitionFn();
      }
    }
    else if( ! $overlay.hasClass('close') ) {
      $overlay.addClass('open');
    }
  }

  function navScrollToInit() {
    $navLinks.on('click', function(e){
      e.preventDefault();
      var windowHeight = $(window).height(),
          scrollLink   = $(this).attr('href'),
          scrollHere;

      if ( scrollLink === "#home" ) {
        scrollHere = 0;
      } else {
        if ( Modernizr.touch ) {
          scrollHere = $(scrollLink).position().top;
        } else {
          scrollHere = $(scrollLink).position().top + windowHeight;
        }
      }
      $('html,body').animate(
        { scrollTop: scrollHere },
        400,
        'swing',
        function() {
          $body.removeClass('overlay-open');
          $overlay.removeClass('open');
        }
      );
    });
  }

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
        contentAreaTop   = Math.max($html.scrollTop(),$body.scrollTop());

    if ( contentAreaTop >= windowHeight - 150 ) {
      $body.addClass('below-the-fold');
    } else {
      $body.removeClass('below-the-fold');
    }

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

  function fancyBoxInit() {
    $modals.fancybox({
      fixed: false
    });
  }

  return {
    init: function() {
      fadeTitleOnLoad();
      fancyBoxInit();
      navScrollToInit();
      $triggerBttn.click(toggleOverlay);
      $closeBttn.click(toggleOverlay);

      if ( ! Modernizr.touch ) {
        $(window).scroll( _.throttle(fadeTitleOnScroll, 10) );
        $(window).resize( _.throttle(fadeTitleOnScroll, 100) );
      }
    },
    initAfterLoad: function() {
      console.log('May you live as long as you want and never want as long as you live.');
    }
  };
}(jQuery, window, document);

// fire when the DOM is ready
jQuery(document).ready(function() {
  'use strict';
  kateAndCharlieDotCom.init();
});

// fire when page if fully loaded
jQuery(window).load(function() {
  'use strict';
  kateAndCharlieDotCom.initAfterLoad();
});

