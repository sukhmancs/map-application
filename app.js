// StAuth10244: I Sukhmanjeet Singh, 000838215 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.
// Constants for the default zoom and center of the map
const DEFAULT_ZOOM = 12;
const DEFAULT_CENTER = { lat: 43.24253090997355, lng: -79.82865564529897 };

// Global variables
var map;                // Variable to hold the map
var markers = [];       // Array to hold your markers
var infoWindows = [];   // Array to hold your info windows
var defaultIcon = null; // Variable to hold the default icon

var currentInfoWindow = null; // Variable to hold the current open InfoWindow
var selectedMarker = null;    // Variable to hold the selected marker
var userMarker = null;               // Variable to hold the user marker

// Array of locations with lat, lng, type, title, and info
// lat and lng: coordinates of the location
// type: falls or museum
// title: name of the location
// info: address of the location
var locations = [
    { lat: 43.246077878267265, lng: -79.82973513524018, type: 'falls', title: "Gage Park", info: "Name: Gage Park, Address: 1000 Main St E, Hamilton, ON L8M 1N2, Canada" }, // Gage Park
    { lat: 43.24957893159927, lng: -79.74424777450373, type: 'falls', title: "Wild Waterworks", info: "Name: Wild Waterworks, Address: 680 Waterfront Trail, Hamilton, ON L8E 3L8, Canada" },  // Wild Waterworks
    { lat: 43.20505055411433, lng: -79.78166995249678, type: 'falls', title: "Felker's Falls Conservation Area", info: "Name: Felker's Falls Conservation Area, Address: Ackland St, Stoney Creek, ON L8J 1R3, Canada" },  // Felker's Falls Conservation Area
    { lat: 43.205801301876846, lng: -79.81977877595762, type: 'falls', title: "Albion Falls", info: "Name: Albion Falls, Address: 885 Mountain Brow Blvd, Hamilton, ON L8W 1R6, Canada" }, // Albion Falls
    { lat: 43.261330996009754, lng: -79.77137027048035, type: 'museum', title: "Hamilton Museum of Steam and Technology", info: "Name: Hamilton Museum of Steam and Technology, Address: 900 Woodward Ave, Hamilton, ON L8H 7N2, Canada" }, // Hamilton Museum of Steam and Technology
    { lat: 43.16199223261048, lng: -79.89977297295196, type: 'museum', title: "Canadian Warplane Heritage Museum", info: "Name: Canadian Warplane Heritage Museum, Address: 9280 Airport Rd, Mount Hope, ON L0R 1W0, Canada" },  // Canadian Warplane Heritage Museum
    { lat: 43.26020929150842, lng: -79.87144896626828, type: 'museum', title: "Art Gallery of Hamilton", info: "Name: Art Gallery of Hamilton, Address: 123 King St W, Hamilton, ON L8P 4S8, Canada" },  // Art Gallery of Hamilton
    { lat: 43.270209446215965, lng: -79.88483855288965, type: 'museum', title: "The Hamilton Military Museum", info: "Name: The Hamilton Military Museum, Address: 610 York Blvd, Hamilton, ON L8R 3H1, Canada" }, // The Hamilton Military Museum
    { lat: 43.27620875050663, lng: -79.85496947504197, type: 'museum', title: "31 Service Battalion Museum", info: "Name: 31 Service Battalion Museum, Address: 650 Catherine Street North | 2nd Floor, Building 1:, Catharine St N, Hamilton, ON L8L 4V7, Canada" },  // 31 Service Battalion Museum
    { lat: 43.24458076108503, lng: -79.81634566748033, type: 'museum', title: "The Hamilton Toy Museum", info: "Name: The Hamilton Toy Museum, Address: 1231 Main St E, Hamilton, ON L8K 1A5, Canada" }   // The Hamilton Toy Museum
];

/**
 * Function to initialize the map
 */
function initMap() {

    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM
    });
    
    // Large icon to be used when a marker is selected
    var largeIcon = {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // url
        scaledSize: new google.maps.Size(50, 50), // size
    };

    // Add 10 markers to the map
    for (var i = 0; i < 10; i++) {        
        var location = locations[i];  // Get the location from the array

        // Create a marker and set its position and type
        var marker = new google.maps.Marker({
            position: {lat: location.lat, lng: location.lng},
            map: map,
            type: location.type
        });

        markers.push(marker);           // Store the marker in the markers array
        defaultIcon = marker.getIcon(); // Default icon to be used when a marker is deselected

        // Create an info window for the marker
        var infoWindow = new google.maps.InfoWindow({
            content: location.info
        });
        infoWindows.push(infoWindow);  // Store the info window in the infoWindows array

        // Use an IIFE to create a new scope
        (function(marker, infoWindow) {
            // Add a click event listener to the marker for clicking on it
            google.maps.event.addListener(marker, 'click', function() {
                if (selectedMarker) {  // If there's a selected marker
                    selectedMarker.setIcon(selectedMarker.defaultIcon); // Reset the icon of the previously selected marker
                }
                selectedMarker = this;   // Set the new marker as the selected one
                this.setIcon(largeIcon); // Set the icon of the selected marker

                if (currentInfoWindow) { // If there's an open InfoWindow
                    currentInfoWindow.close(); // Close it
                }
                infoWindow.open(map, marker);   // Open the InfoWindow
                currentInfoWindow = infoWindow; // Set the new InfoWindow as the current one

                // Set the destination dropdown to the selected marker
                document.getElementById('destination').value = markers.indexOf(marker);
            });
        })(marker, infoWindow); // Pass the marker and infoWindow to the IIFE
    }

    // Add Options to the destination element
    locations.forEach(function(location, index) {  // Loop through the locations array
        var option = document.createElement('option');
        option.value = index;         // Set the value of the option to the index
        option.text = location.title; // Use the title from the locations array
        document.getElementById('destination').appendChild(option);  // Append the option to the destination element
    });

    // Listen for changes on the destination element
    document.getElementById('destination').addEventListener('change', function() {
        var selectedIndex = this.value;  // Get the selected index

        // Deselect the previously selected marker
        if (selectedMarker) {
            selectedMarker.setIcon(selectedMarker.defaultIcon); // Reset the icon of the previously selected marker
        }

        // Select the new marker and set its icon
        selectedMarker = markers[selectedIndex];
        selectedMarker.setIcon(largeIcon);
    });
}


/**
 * Function to deselect a marker by setting its icon to the default icon
 * @param marker The marker to deselect
 */
function deselectMarker(marker) {
    marker.setIcon(defaultIcon);
}

/**
 * This function will filter the markers based on the type provided and hide the rest
 * @param type The type of marker to show (falls or museum)
 */
function filterMarkers(type) {
    for (var i = 0; i < markers.length; i++) {  // Loop through the markers array
        // Check if the current marker is not the user marker  
        if (markers[i].type === "home") {     // If the marker is the user marker
            continue;  // Skip the rest of the loop and continue with the next iteration
        }

        // Set the visibility of the marker based on the type
        if (markers[i].type == type) { 
            markers[i].setVisible(true); 
        } else { // If the marker type is not the same as the type provided
            markers[i].setVisible(false);
        }        
    }
}

/**
 * This function will update the dropdown based on the visible markers
 */
function updateDropdown() {
    // Get the destination element
    var dropdown = document.getElementById('destination');
    dropdown.innerHTML = ''; // Clear dropdown

    // Add visible markers to dropdown
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].getVisible() && locations[i]) { // If the marker is visible and there's a location
            var option = document.createElement('option');  // Create a new option element
            option.text = locations[i].title; // Use title from locations array
            option.value = i;     // Set the index to the current marker's index
            dropdown.add(option); // Add the option to the dropdown
        }
    }
}

// Add event listener to filter buttons to filter markers based on type (falls or museum)
// and update the dropdown based on the visible markers
document.getElementById('filter2').addEventListener('click', function() {
    filterMarkers('museum');    
    updateDropdown()
});

document.getElementById('filter1').addEventListener('click', function() {
    filterMarkers('falls');
    updateDropdown()
});

// Add event listener to geolocation button to get user's location
document.getElementById('geolocation').addEventListener('click', function() {
    if (navigator.geolocation) { // Check if geolocation is supported by the browser

        // Get the user's location. If successful, create a marker and set its position
        navigator.geolocation.getCurrentPosition(function(position) { 
            var location = { // Create a location object with lat and lng
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Check if userMarker already exists
            if (userMarker) {
                // If it does, update its position
                userMarker.setPosition(location);
            } else {  // If it doesn't exist create a new marker
                userMarker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Use a different icon,
                    type: "home"
                });                
                markers.push(userMarker); // Keep track of the user marker
            }

            // Convert the user's location to an address
            // And set the address input value to the formatted address
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'location': location }, function(results, status) { // Use the geocoder to get the address
                if (status === 'OK') {  // If the geocoder was successful means that the entered location is a valid number
                    if (results[0]) {   // GeoCoder was able to find the address
                        document.getElementById('address').value = results[0].formatted_address; // Set the address input value to the formatted address
                    } else {  // Alert the user if no results were found
                        alert('No results found');
                    }
                } else {  // Alert the user if the geocoder failed
                    alert('Geocoder failed due to: ' + status);
                }
            });            
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

// Add event listener to get-directions button to get directions from user's location to the selected destination
// and display the route on the map using the DirectionsService and DirectionsRenderer
document.getElementById('get-directions').addEventListener('click', function() {
    // Get the destination index from the dropdown and get the destination position 
    // from the markers array
    var destinationIndex = document.getElementById('destination').value;
    var destination = markers[destinationIndex].position; 

    var address = document.getElementById('address').value; // Get the address from the input
    
    // Use the geocoder to get the user's location from the address
    // It will return status ok if the address is valid and the location is found 
    // otherwise it will return an error status
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status == 'OK') { // Geocoder was successful
            var location = results[0].geometry.location;  // Get the user's location

            // Check if userMarker already exists
            if (userMarker) {
                // If it does, update its position
                userMarker.setPosition(location);
            } else {  // If it doesn't exist create a new marker
                userMarker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Use a different icon,
                    type: "home"
                });                
                markers.push(userMarker); // Keep track of the user marker
            }

            // DirectionsService to get the route from the user's location to the destination            
            var directionsService = new google.maps.DirectionsService();

            // DirectionsRenderer to display the route on the map
            // Check if directionsRenderer already exists
            if (window.directionsRenderer) {
                // Clear previous directions
                window.directionsRenderer.setDirections({ routes: [] });
            } else {
                // Create new directionsRenderer
                window.directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
                window.directionsRenderer.setMap(map);
            }

            // Directions request to get the route from the user's location to the destination
            // This will return a response with the route and status
            directionsService.route({
                origin: location,
                destination: destination,
                travelMode: 'DRIVING'
            }, function(response, status) { // Callback function to handle the response
                if (status === 'OK') {  // If request was successful, render the route on the map
                    window.directionsRenderer.setDirections(response); 
                } else {
                    alert('Directions request failed due to ' + status);
                }
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
});

// Add event listener to reset button to reset the markers, dropdown, address, and directions
// It will also reset the zoom and center of the map
document.getElementById('reset').addEventListener('click', function() {

    // Remove "home" markers from the map and the array
    markers = markers.filter(function(marker) {
        if (marker.type === "home") {
            marker.setMap(null);
            userMarker = null;
            return false;
        } else {
            marker.setVisible(true);
            return true;
        }
    });

    // Reset dropdown to default
    var dropdown = document.getElementById('destination');
    dropdown.innerHTML = '';
    for (var i = 0; i < locations.length; i++) {
        var option = document.createElement('option');
        option.text = locations[i].title;
        option.value = i;
        dropdown.add(option);
    }

    // Reset current location
    document.getElementById('address').value = '';

    // Reset directions using directionsRenderer
    if (window.directionsRenderer) {
        window.directionsRenderer.setDirections({ routes: [] });
    }

    // Reset zoom and center
    map.setZoom(DEFAULT_ZOOM);
    map.setCenter(DEFAULT_CENTER);
});

// Disable right click on the game board
document.addEventListener('contextmenu', event => event.preventDefault());

// Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, and Ctrl+U
document.onkeydown = function(e) {
    if(e.code === "F12") {
      return false;
    }
    if(e.ctrlKey && e.shiftKey && e.code === 'KeyI'){
      return false;
    }
    if(e.ctrlKey && e.shiftKey && e.code === 'KeyJ'){
      return false;
    }
    if(e.ctrlKey && e.code === 'KeyU'){
      return false;
    }
}