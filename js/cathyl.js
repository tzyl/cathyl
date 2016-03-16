var transparent = true

$(document).ready(function(){
    $('body').scrollspy({target: ".navbar", offset: 50});

    $('nav a').on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;

        $('html, body').animate(
            {scrollTop: $(hash).offset().top}, 800
            );

        /*
        e.preventDefault();
        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");
        */

        /*
        var currentAttrValue = $(this).attr('href').split('#')[1];
        $.fn.moveTo(currentAttrValue);
        // Change/remove current tab to activatetive
        $(this).parent('li').addClass('active').siblings().removeClass('active');
        */
    });

    /*
    $('.carousel').slick({
        autoplay: true,
        fade: true,
        pauseOnHover: false,
        dots: true,
    });

    $(".main").onepage_scroll({
         sectionContainer: "section",     // sectionContainer accepts any kind of selector in case you don't want to use section
         easing: "ease",                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
                                                                            // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
         animationTime: 1000,             // AnimationTime let you define how long each section takes to animate
         pagination: true,                // You can either show or hide the pagination. Toggle true for show, false for hide.
         updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
         beforeMove: function(index) {
            $('nav a[href="#' + index + '"]').parent('li').addClass('active').siblings().removeClass('active');
         },  // This option accepts a callback function. The function will be called before the page moves.
         afterMove: function(index) {},   // This option accepts a callback function. The function will be called after the page moves.
         loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
         keyboard: true,                  // You can activate the keyboard controls
         responsiveFallback: false,        // You can fallback to normal page scroll by defining the width of the browser in which
                                                                            // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
                                                                            // the browser's width is less than 600, the fallback will kick in.
         direction: "vertical"            // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".
    });

    $('#about-text-container').children("h2:first").css('margin-top', 0)
    $('#classes-text-container').children("h2:first").css('margin-top', 0)
    */
});

$(window).on('scroll', function(){
    if ($(document).scrollTop() > 560) {
        if (transparent) {
            transparent = false;
            $('.navbar').removeClass('navbar-transparent');
            }
    } else {
        if (!transparent) {
            transparent = true;
            $('.navbar').addClass('navbar-transparent');
        }
    }
});
