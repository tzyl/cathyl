var transparent = true;
var map;

$(document).ready(function() {
    // Initialize scrollspy for navbar.
    $('body').scrollspy({target: ".navbar", offset: 70});

    // Smooth scrolling when navbar link clicked.
    $('nav a, a.scroll-arrow').on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;

        $('html, body').animate({scrollTop: $(hash).offset().top}, 1000);
    });

    // Set up instafeed.
    var feed = new Instafeed({
        //clientId: '97ae5f4c024c4a91804f959f43f2635f',
        accessToken: '1011689.59d140c.ecff7995981f4b529358c18fbaec8abc',
        target: 'instafeed',
        get: 'user',
        userId: '191438231',
        //tagName: 'photographyportfolio',
        links: true,
        limit: 8,
        sortBy: 'most-recent',
        resolution: 'standard_resolution',
        template: '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 add-animation"><a href="{{link}}" target="_blank"><div class="photo-box"><div class="image-wrap"><img src="{{image}}"></div><div class="description"><div class="caption">{{caption}}</div><span class="date">{{model.created_time}}</span><div class="likes-comments-container"><span class="likes"><span class="glyphicon glyphicon-heart"></span>&nbsp;{{likes}}</span><span class="comments"><span class="glyphicon glyphicon-comment"></span>&nbsp;{{comments}}</span></div></div></div></a></div>',
        after: convertDates
    });
    feed.run();
});

$(window).on('scroll', function() {
    animations.checkNavbarAnimation();
});

$(window).load(function() {
    // Initialize animations.
    animations.initAnimationWaypoints()
});

// Initialize Google Map.
function initMap() {
    var myLatLng = new google.maps.LatLng(51.50735, -0.12776);
    var mapOptions = {
        center: myLatLng,
        zoom: 12,
        scrollwheel: false
    };

    map = new google.maps.Map(document.getElementById('contact-us-map'), mapOptions);
}

// Converts the date timestamps from instafeed to human readable dates.
function convertDates() {
    $(".date").each(function() {
        var d = new Date($(this).html() * 1000);
        $(this).html(d.toDateString());
    });
}

animations = {
    initAnimationWaypoints: function() {
        $(".add-animation").each(function() {
            var waypoints = $(this).waypoint(function(direction) {
                // console.log(this.element.id + ' triggers at ' + this.triggerPoint);
                if(direction == 'down'){
                        $(this.element).removeClass('slide-out').addClass('slide-in');
                    } else {
                        $(this.element).removeClass('slide-in').addClass('slide-out');
                    }
                }, {
                    offset: function () {
                        return Waypoint.viewportHeight() - 50
                    }
           });
        });
    },

    checkNavbarAnimation: debounce(function() {
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
    }, 25)
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
