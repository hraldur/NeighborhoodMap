var map, infoWindow, marker, bounds;

var markers = [];
var defaultIcon, clickedIcon, highlightedIcon;

function initMap() {
    'use strict';
    // function to initialise the map with given coordinates
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 55.6761, lng: 12.5683 },
        zoom: 12
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
        // Create a markers array
      marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        website: website,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i
      });

        locations[i].markerRef = marker;
        // Push marker to an array of markers
        markers.push(marker);
        // onClick event that opens a infowindow for each marker
        marker.addListener('click', function() {
            this.setIcon(clickedIcon);
            populateInfoWindow(this, infoWindow);
        });
          // Event listener to change the color of the highlighted icon
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          // Event listener to change the color of the icon back to default
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
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
}






// Populate the infowindow when the marker is clicked
function populateInfoWindow(marker, infowindow) {
    // if any marker is open change to default color
    if(infowindow.marker){
        infowindow.marker.setIcon(defaultIcon);
    }

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        var setContentInfo = '<h4>' + marker.title + '</h4>' + '<h5>' + marker.website + '</h5>';////SETJA MEIRA INFO!
        infowindow.setContent(setContentInfo);
        infowindow.open(map, marker);

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.marker = null;
            marker.setIcon(defaultIcon);
        });
    }
}

// Filter Search
function search(string, keyword) {
    return (string.indexOf(keyword) >= 0);
}

function googleError(){
    alert("Error");
}



// array of locations in Copenhagen
var locations = [
    {   title: 'Den Lille Havfrue',
        website: '',
        location: {lat: 55.692861, lng: 12.599266},
        markerRef: null
    },
    {   title: 'Copenhagen Street Food',
        website: 'copenhagenstreetfood.dk',
        location: {lat: 55.679346, lng: 12.598258},
        markerRef: null
    },
    {   title: 'Nyhavn',
        website: '',
        location: {lat: 55.680158, lng: 12.590017},
        markerRef: null
    },
    {   title: 'Tivoli Gardens',
        website: 'tivoli.dk',
        location: {lat: 55.673665, lng: 12.568170},
        markerRef: null
    },
    {   title: 'Bakken',
        website: 'bakken.dk',
        location: {lat: 55.775142, lng: 12.577761},
        markerRef: null
    },
    {   title: 'Fælledparken',
        website: '',
        location: {lat: 55.700729, lng: 12.568956},
        markerRef: null
    },
    {   title: 'Langelinie',
        website: '',
        location: {lat: 55.699277, lng: 12.600176},
        markerRef: null
    },
    {   title: 'Rosenborg Castle',
        website: 'kongernessamling.dk',
        location: {lat: 55.685788, lng: 12.577269},
        markerRef: null
    },
    {   title: 'Ny Carlsberg Glyptotek',
        website: 'glyptoteket.dk',
        location: {lat: 55.672750, lng: 12.572522},
        markerRef: null
    },
    {   title: 'Amager Strandpark',
        website: 'svoemkbh.kk.dk',
        location: {lat: 55.654393, lng: 12.649607 },
        markerRef: null
    },

];
