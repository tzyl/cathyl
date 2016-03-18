var transparent = true;
var map;

$(document).ready(function() {
    // Initialize scrollspy for navbar.
    $('body').scrollspy({target: ".navbar", offset: 70});

    // Smooth scrolling when navbar link clicked.
    $('nav a, a.scroll-arrow').on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;

        $('html, body').animate({
            scrollTop: $(hash).offset().top - 50
        }, 1000, 'easeInOutCubic');
    });
});

$(window).on('scroll', function() {
    animations.checkNavbarAnimation();
});

$(window).load(function() {
    // Initialize animations.
    animations.initAnimationWaypoints()
});

function initMap() {
    var myLatLng = new google.maps.LatLng(51.50735, -0.12776);
    var mapOptions = {
        center: myLatLng,
        zoom: 12,
        scrollwheel: false
    };

    map = new google.maps.Map(document.getElementById('contact-us-map'), mapOptions);
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
