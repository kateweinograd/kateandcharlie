/*!
 * Avoid `console` errors in browsers that lack a console.
 * https://github.com/h5bp/html5-boilerplate/blob/master/dist/js/plugins.js
 */
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

  'use strict';

  // class helper functions from bonzo https://github.com/ded/bonzo

  function classReg( className ) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  var hasClass, addClass, removeClass;

  if ( 'classList' in document.documentElement ) {
    hasClass = function( elem, c ) {
      return elem.classList.contains( c );
    };
    addClass = function( elem, c ) {
      elem.classList.add( c );
    };
    removeClass = function( elem, c ) {
      elem.classList.remove( c );
    };
  }
  else {
    hasClass = function( elem, c ) {
      return classReg( c ).test( elem.className );
    };
    addClass = function( elem, c ) {
      if ( !hasClass( elem, c ) ) {
        elem.className = elem.className + ' ' + c;
      }
    };
    removeClass = function( elem, c ) {
      elem.className = elem.className.replace( classReg( c ), ' ' );
    };
  }

  function toggleClass( elem, c ) {
    var fn = hasClass( elem, c ) ? removeClass : addClass;
    fn( elem, c );
  }

  var classie = {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };

  // transport
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( classie );
  } else {
    // browser global
    window.classie = classie;
  }

})( window );


/**
 * Overlay Demo1
 */

(function() {
  var triggerBttn = document.getElementsByClassName( 'js-overlay-trigger' )[0],
  overlay = document.querySelector( 'div.overlay' ),
  closeBttn = overlay.querySelector( 'button.overlay-close' );
  transEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd',
    'transition': 'transitionend'
  },
  transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
  support = { transitions : Modernizr.csstransitions };

  function toggleOverlay() {
    $('body').toggleClass('overlay-open');
    if( classie.has( overlay, 'open' ) ) {
      classie.remove( overlay, 'open' );
      classie.add( overlay, 'close' );
      var onEndTransitionFn = function( ev ) {
        if( support.transitions ) {
          if( ev.propertyName !== 'visibility' ) return;
          this.removeEventListener( transEndEventName, onEndTransitionFn );
        }
        classie.remove( overlay, 'close' );
      };
      if( support.transitions ) {
        overlay.addEventListener( transEndEventName, onEndTransitionFn );
      }
      else {
        onEndTransitionFn();
      }
    }
    else if( !classie.has( overlay, 'close' ) ) {
      classie.add( overlay, 'open' );
    }
  }

  triggerBttn.addEventListener( 'click', toggleOverlay );
  closeBttn.addEventListener( 'click', toggleOverlay );
})();


/*
 * Custom scripts for kateandcarlie.com
 */

var kateAndCharlieDotCom = function($, window, document, undefined) {
  'use strict';

  var $window = $('window'),
  $html       = $('html'),
  $body       = $('body'),
  $modals     = $('.js-modal'),
  $navLinks   = $('.js-scroll-to a'),
  $overlay    = $('.overlay.overlay-slidedown'),
  $titleBox   = $('.js-fade-on-scroll');

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
      if ( ! Modernizr.touch ) {
        $(window).scroll( _.throttle(fadeTitleOnScroll, 10) );
        $(window).resize( _.throttle(fadeTitleOnScroll, 100) );
      }
    },
    initAfterLoad: function() {
      console.log('May you live as long as you want and never want as long as you live.');
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
