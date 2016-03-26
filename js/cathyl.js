$(document).ready(function() {
    // Initialize scrollspy for navbar.
    $('body').scrollspy({target: '.navbar', offset: 70});

    // Smooth scrolling when navbar link clicked.
    $('.nav.navbar-nav.navbar-right a, .navbar-brand, a.scroll-arrow').on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;

        $('html, body').stop().animate({scrollTop: $(hash).offset().top - 25}, 1000);
    });

    // Initialize parallax for cover page.
    $('.cover').parallax({imageSrc: 'images/carousel-3.jpg', speed: 0.5});

    // Initialize animations so they can start on elements before page fully loaded.
    animations.initAnimationWaypoints()

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
        template: '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 add-animation"><a href="{{link}}" target="_blank"><div class="photo-box"><div class="image-wrap"><img src="{{image}}"></div><div class="description"><div class="caption">{{caption}}</div><span class="date">{{model.created_time}}</span><div class="likes-comments-container"><span class="likes"><span class="glyphicon glyphicon-heart" aria-hidden="true"></span>&nbsp;{{likes}}</span><span class="comments"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span>&nbsp;{{comments}}</span></div></div></div></a></div>',
        after: instafeedCallback
    });
    feed.run();
});

$(window).on('scroll', function() {
    //animations.checkNavbarAnimation();
});

$(window).load(function() {
    // Reinitialize waypoints for elements which did not load yet.
    Waypoint.destroyAll();
    animations.initAnimationWaypoints();
});

function instafeedCallback() {
    // Converts the date timestamps from instafeed to human readable dates.
    $('.photo-box .description .date').each(function() {
        var d = new Date($(this).html() * 1000);
        $(this).html(d.toDateString());
    });

    // Change the columns to show fewer images at smaller screens.
    $('#instafeed > .col-xs-12').slice(-4).addClass('visible-lg-block').slice(0, 2).addClass('visible-md-block');
}

/* GOOGLE MAPS */
var map;
var markers = [];
var infoWindows = [];
var locations = [
    ['Imperial College London - South Kensington Campus', {lat: 51.4987997, lng: -0.1761291}, '<div><b>Imperial College London - South Kensington Campus</b><br>Tuesday 18:30 - 19:30 (advanced)</div>'],
    ['Gymbox Westfield Stratford', {lat: 51.5429803, lng: -0.0095808}, '<div><b>Gymbox Westfield Stratford</b><br>Wednesday 19:00 - 19:45 (all levels)</div>'],
    ['Imperial College London - St Mary\'s Campus', {lat: 51.517158, lng: -0.1748028}, '<div><b>Imperial College London - St Mary\'s Campus</b><br>Thursday 18:45 - 19:45 (all levels)</div>']
];

// Initialize Google Map.
function initMap() {
    var london = new google.maps.LatLng(51.52582084706302, -0.08948728535153272);
    var mapOptions = {
        center: london,
        zoom: 12,
        scrollwheel: false
    };

    map = new google.maps.Map(document.getElementById('contact-us-map'), mapOptions);
}

function center() {
    return map.getCenter();
}

function drop() {
    clearMarkers();

    for (var i = 0; i < locations.length; i++) {
        addMarkerWithTimeout(locations[i][0], locations[i][1], locations[i][2], i * 400);
    }

    window.setTimeout(function() {
        for (var i = 0; i < locations.length; i++) {
            infoWindows[i].open(map, markers[i])
        }

        // Convert first InfoWindow to point out to the right.
        infoWindows[0].setOptions({pixelOffset: new google.maps.Size(220, 90)})
        var $map = $('#contact-us-map');
        if ($map.find('.gm-style-iw-container').length === 0) {
            $map.find('.gm-style-iw:first') .parent().addClass('gm-style-iw-container');
        }
    }, locations.length * 400)

};

function addMarkerWithTimeout(title, position, content, timeout) {
    window.setTimeout(function() {
        var marker = new google.maps.Marker({
            title: title,
            position: position,
            animation: google.maps.Animation.DROP,
        });

        var infoWindow = new google.maps.InfoWindow({
            content: content,
            //pixelOffset: new google.maps.Size(left, top)
        });

        marker.setMap(map);
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
        //infoWindow.open(map, marker);
        markers.push(marker);
        infoWindows.push(infoWindow);
    }, timeout)
};

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        infoWindows[i].close();
    }
    markers = [];
    infoWindows = [];
}
/* END GOOGLE MAPS */

animations = {
    transparent: true,

    initAnimationWaypoints: function() {
        $('.add-animation').each(function() {
            var waypoints = $(this).waypoint(function(direction) {
                // console.log(this.element.id + ' triggers at ' + this.triggerPoint);
                if (direction == 'down') {
                    $(this.element).removeClass('slide-out').addClass('slide-in');
                } else {
                    $(this.element).removeClass('slide-in').addClass('slide-out');
                }
            }, {
                offset: function() {
                    return Waypoint.viewportHeight() - 50
                }
            });
        });

        // Navbar animation.
        var waypoint = new Waypoint({
            element: document.getElementById('section1'),
            handler: function(direction) {
                //console.log(this.element.id + ' triggers at ' + this.triggerPoint);
                if (direction == 'down') {
                    $('.navbar').removeClass('navbar-transparent');
                } else {
                    $('.navbar').addClass('navbar-transparent');
                }
            },
            offset: function() {
                return 200 - this.element.clientHeight
            }
        });

        // Map marker initialization animation.
        var waypoint = new Waypoint({
            element: document.getElementById('contact-us-map'),
            handler: function(direction) {
                //console.log(this.element.id + ' triggers at ' + this.triggerPoint);
                if (direction == 'down') {
                    drop();
                }
            },
            offset: function() {
                return Waypoint.viewportHeight() - 50
            }
        });
    },

    checkNavbarAnimation: debounce(function() {
        if ($(document).scrollTop() > 560) {
            if (animations.transparent) {
                animations.transparent = false;
                $('.navbar').removeClass('navbar-transparent');
                }
        } else {
            if (!animations.transparent) {
                animations.transparent = true;
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
