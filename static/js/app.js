var map, infoWindow, marker, bounds;

var markers = [];
var defaultIcon, clickedIcon, highlightedIcon;


function initMap() {
    'use strict';
    // function to initialise the map with given coordinates
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 55.6761, lng: 12.5683 },
        zoom: 12,
        mapTypeControl: true,
        mapTypeControlOptions: {
               style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
               position: google.maps.ControlPosition.TOP_CENTER
           }

    });

    defaultIcon = makeMarkerIcon('4B0082'); // color of default icon
    clickedIcon = makeMarkerIcon('FF8C00'); // color of  clicked icon
    highlightedIcon = makeMarkerIcon('9ACD32');// color of  highlighted icon


    // variable that stores infowindow
    var infoWindow = new google.maps.InfoWindow();
    // variable that stores bounds
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < locations.length; i++) {
        // Get the information from location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var website = locations[i].website;
        var venue_id = locations[i].VENUE_ID;
        // Create a markers array
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            website: website,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i,
            venue_id: venue_id
        });

        locations[i].markerRef = marker;
        // Push marker to an array of markers
        markers.push(marker);
        // onClick event that opens a infowindow for each marker
        marker.addListener('click', openInfoWindow);
        // Event listener to change the color of the highlighted icon
        marker.addListener('mouseover', mouseOver);
        // Event listener to change the color of the icon back to default
        marker.addListener('mouseout', mouseOut);
    }

    /*jshint validthis: true */
    function openInfoWindow(){
        this.setIcon(clickedIcon);
        populateInfoWindow(this, infoWindow);

    }
    function mouseOver(){
        this.setIcon(highlightedIcon);
    }
    function mouseOut(){
        this.setIcon(defaultIcon);
    }
    // Creates a new marker icon with the input color.
    function makeMarkerIcon(color) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ color +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));
        return markerImage;
    }

    function AppViewModel() {
        var self = this;
        // Hides and displays sidebar
        self.ListValue = ko.observable("Show List");
        self.visible = ko.observable(0);
        self.List = function(){
            if (self.ListValue() == "Hide List"){
                self.ListValue("Show List");
                self.visible(0);
            }
            else if(self.ListValue() == "Show List"){
                self.ListValue("Hide List");
                self.visible(1);
            }
        };

        self.locations = ko.observableArray(locations);
        
        // opens info window and marker when item is clicked on the list
        self.listClick = function (location){
            for (i in locations) {
                locations[i].markerRef.setIcon(defaultIcon);
            }
            location.markerRef.setIcon(clickedIcon);
            populateInfoWindow(location.markerRef,infoWindow);
            self.ListValue("Show List");
            self.visible(0);

        };

        self.filter = ko.observable('');
        self.filteredItems = ko.computed(function(){
            // Filters locations based on the input from user
            var filter = self.filter().toLowerCase();
            // When there is not filter, show all locations
            if(!filter){
                for (marker in self.locations()){
                    self.locations()[marker].markerRef.setVisible(true);
                }
                return self.locations();
            }
            // Only show filtered items
            else {
                return ko.utils.arrayFilter(self.locations(), function(location) {
                    var result =  search(location.title.toLowerCase(), filter);
                    location.markerRef.setVisible(result);
                    return result;
                });
            }
        });
    }
    // Activate knockout.js
    ko.applyBindings(new AppViewModel());



    // Populate the infowindow when the marker is clicked
    function populateInfoWindow (marker, infowindow) {
       
        var forsquareTimeOut = setTimeout(function () {
               console.log('Failed to load Foursquare.');
        },5000);

        // setup Foursquare for infowindow
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/'+ marker.venue_id,
            type: 'GET',
            dataType: 'json',
            data: {
                client_id: 'CPGB0W1CHA5D3RGETWGAQTZ1UFIJRLAOCKJT45BFIZKUF2SJ',
                client_secret: 'WTXBJH44YFI52K0IUEGZT5TILRU2RXYYBPO144QC25GIPWIG',
                v: '20170801',
                async: true
                },

            success: function(results) {
                infowindow.open(map, marker);
                var details = results.response.venue;
                var name = details.name || 'No name provided';
                var rating = details.rating || 'No rating provided';
                var contact = details.contact.phone || 'No contact provided';
                var url = details.url || 'No website provided';

                var contentString = '<h4>' + name + '</h4>' + '<h5>' + 
                    'Contact: ' +  contact + '</h5><h5>' + 'Rating: ' + rating + 
                    '</h5><h5>' + 'Website: ' + url + '</h5>';
                infowindow.setContent(contentString);
                clearTimeout(forsquareTimeOut);
            }, 


        });
 
    }
}

// Filter Search
function search(string, keyword) {
    return (string.indexOf(keyword) >= 0);
}

// Google fallback function
function googleError() {
  var msg = "Failed to load Google Map";
  addMessage(msg);
}

function addMessage(msg) {
  var p = '<p>' + msg + '</p>';
  $('#map').append(p);
}



// array of locations in Copenhagen
var locations = [
    {   title: 'Den Lille Havfrue',
        website: '',
        location: {lat: 55.692861, lng: 12.599266},
        markerRef: null,
        VENUE_ID: '51ff9f15e4b0dfd0a183c91a'
    },
    // {   title: 'Copenhagen Street Food',
    //     website: 'copenhagenstreetfood.dk',
    //     location: {lat: 55.679346, lng: 12.598258},
    //     markerRef: null
    // },
    {   title: 'Nyhavn',
        location: {lat: 55.680158, lng: 12.590017},
        markerRef: null,
        VENUE_ID: '4adcdafdf964a520b05d21e3'
    },
    {   title: 'Tivoli Gardens',
        location: {lat: 55.673665, lng: 12.568170},
        markerRef: null,
        VENUE_ID: '52e7718f498e6472a6d7cd8d'
    },
    {   title: 'Bakken',
        location: {lat: 55.775142, lng: 12.577761},
        markerRef: null,
        VENUE_ID: '5545fe4a498e4234631c42c5'
    },
    {   title: 'Fælledparken',
        location: {lat: 55.700729, lng: 12.568956},
        markerRef: null,
        VENUE_ID: '4adcdafdf964a520bf5d21e3'
    },
    {   title: 'Langelinie',
        location: {lat: 55.699277, lng: 12.600176},
        markerRef: null,
        VENUE_ID: '4da0317b4977236a6ca9bd96'
    },
    {   title: 'Rosenborg Castle',
        location: {lat: 55.685788, lng: 12.577269},
        markerRef: null,
        VENUE_ID: '4adcdafdf964a520bb5d21e3'
    },
    {   title: 'Ny Carlsberg Glyptotek',
        location: {lat: 55.672750, lng: 12.572522},
        markerRef: null,
        VENUE_ID: '4adcdafdf964a520bb5d21e3'
    },
    {   title: 'Amager Strandpark',
        location: {lat: 55.654393, lng: 12.649607 },
        markerRef: null,
        VENUE_ID: '4b76c469f964a520af5d2ee3'
    },

];
