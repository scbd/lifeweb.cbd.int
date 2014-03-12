  $(function () {
      $.stellar({
          horizontalScrolling: false,
          //verticalOffset: 1600
      });
      $('a[href*=#]:not([href=#])').click(function () {
          if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {

              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
              if (target.length) {
                  $('html,body').animate({
                      scrollTop: target.offset().top + -69
                  }, 500);
                  return false;
              }
          }
      });
  });
