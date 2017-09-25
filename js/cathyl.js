$(document).ready(function() {
    // Initialize scrollspy for navbar.
    $('body').scrollspy({target: '.navbar', offset: 70});

    // Smooth scrolling when navbar link clicked.
    $('.nav.navbar-nav.navbar-right a, .navbar-brand, a.scroll-arrow').on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;

        //$('html, body').stop().animate({scrollTop: $(hash).offset().top}, 1000);
        $(hash).velocity('stop').velocity('scroll', 1000);
    });

    // Initialize parallax for cover page.
    $('.cover').parallax({imageSrc: 'images/cover.jpg', speed: 0.5});

    // Initialize animations so they can start on elements before page fully loaded.
    initAnimationWaypoints();

    // Set up instafeed.
    var feed = new Instafeed({
        // clientId: '97ae5f4c024c4a91804f959f43f2635f',
        // accessToken: '1011689.59d140c.ecff7995981f4b529358c18fbaec8abc',
        accessToken: '191438231.63adf44.d95e0c98f8134d67ac5952705ca94a41',
        target: 'instafeed',
        get: 'user',
        userId: '191438231',
        // tagName: 'photographyportfolio',
        links: true,
        limit: 8,
        sortBy: 'most-recent',
        resolution: 'low_resolution',
        template: '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 add-animation"><div class="photo-box"><a href="{{link}}" target="_blank"><div class="image-wrap"><img src="{{image}}"></div><div class="description"><div class="caption">{{caption}}</div><span class="date">{{model.created_time}}</span><div class="likes-comments-container"><span class="likes"><span class="glyphicon glyphicon-heart" aria-hidden="true"></span>&nbsp;{{likes}}</span><span class="comments"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span>&nbsp;{{comments}}</span></div></div></a></div></div>',
        after: instafeedCallback
    });
    feed.run();
});

$(window).load(function() {
    // Reinitialize waypoints for elements which did not load yet.
    Waypoint.destroyAll();
    initAnimationWaypoints();
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
var infoWindow;
// var infoWindows = [];
var locations = [
    ['King\'s College London', {lat: 51.5046914, lng: -0.0898922}, '<div><b>King\'s College London</b><br>Tuesday + Thursday 12:00 - 13:00 (all levels)</div>'],
    ['Imperial College London - South Kensington Campus', {lat: 51.4987997, lng: -0.1761291}, '<div><b>Imperial College London - South Kensington Campus</b><br>Tuesday 18:30 - 19:30 (advanced)</div>'],
    ['Imperial College London - St Mary\'s Campus', {lat: 51.517158, lng: -0.1748028}, '<div><b>Imperial College London - St Mary\'s Campus</b><br>Thursday 18:45 - 19:45 (all levels)</div>'],
    // ['Gymbox Westfield Stratford', {lat: 51.5429803, lng: -0.0095808}, '<div><b>Gymbox Westfield Stratford</b><br>Wednesday 19:00 - 19:45 (all levels)</div>'],
    // ['King\'s College London', {lat: 51.4979351, lng: -0.0915826}, '<div><b>King\'s College London</b><br>Tuesday 07:30 - 08:30 (all levels)</div>'],
    // ['Arch Climbing Wall (Yoga Mezzanine @Biscuit)', {lat: 51.494561, lng: -0.062203}, '<div><b>Arch Climbing Wall (Yoga Mezzanine @Biscuit)</b><br>18:45 - 19:45 (all levels)</div>']
];

function initMap() {
    // var london = new google.maps.LatLng(51.52582084706302, -0.08948728535153272);
    // var london = new google.maps.LatLng(51.50648967955005, -0.12809097353514431);
    var london = new google.maps.LatLng(51.50764083752618, -0.11293627407216622);
    var mapOptions = {
        center: london,
        zoom: 12,
        scrollwheel: false
    };

    map = new google.maps.Map(document.getElementById('contact-us-map'), mapOptions);
    infoWindow = new google.maps.InfoWindow();
}

function getMapCenter() {
    return map.getCenter();
}

function drop() {
    clearMarkers();

    for (var i = 0; i < locations.length; i++) {
        addMarkerWithTimeout(locations[i][0], locations[i][1], locations[i][2], i*400);
    }

    window.setTimeout(function() {
        google.maps.event.trigger(markers[markers.length - 1], 'click');
    }, locations.length * 400)
}

// function dropHorizontal() {
//     clearMarkers();

//     for (var i = 0; i < locations.length; i++) {
//         if (i == 0) {
//             addMarkerWithTimeout(locations[i][0], locations[i][1], locations[i][2], true, i * 400);
//         } else {
//             addMarkerWithTimeout(locations[i][0], locations[i][1], locations[i][2], false, i * 400);
//         }
//     }

//     window.setTimeout(function() {
//         // Open the InfoWindows at the end of the marker drop animations.
//         for (var i = 0; i < locations.length; i++) {
//             google.maps.event.trigger(markers[i], 'click');
//         }

//         // Convert first InfoWindow to point out to the right.
//         infoWindows[0].setOptions({pixelOffset: new google.maps.Size(220, 90)})
//         var $map = $('#contact-us-map');
//         if ($map.find('.gm-style-iw-container').length === 0) {
//             $map.find('.gm-style-iw:first') .parent().addClass('gm-style-iw-container');
//         }
//     }, locations.length * 400)

// };

function addMarkerWithTimeout(title, position, content, timeout) {
    window.setTimeout(function() {
        var marker = new google.maps.Marker({
            title: title,
            position: position,
            animation: google.maps.Animation.DROP,
        });

        marker.setMap(map);
        marker.addListener('click', function() {
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        });

        markers.push(marker);
        infoWindows.push(infoWindow);
    }, timeout)
};

function addMarkerWithTimeoutHorizontal(title, position, content, horizontal, timeout) {
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
        if (horizontal) {
            infoWindow.setOptions({pixelOffset: new google.maps.Size(220, 90)})
            marker.addListener('click', function() {
                infoWindow.open(map, marker);
                $('.gm-horizontal').parent().parent().parent().parent().addClass('gm-style-iw-container');
            });
        } else {
            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });
        }
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
};

/* ANIMATIONS */
function initAnimationWaypoints() {
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
        element: document.getElementById('home'),
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
};
