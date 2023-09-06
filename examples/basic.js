var map;
(function () {

  map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'http://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', // Google Satellite imagery
          maxZoom: 18,
          attributions: ['&copy; <a href="https://www.mapbox.com/">Mapbox</a>']
        })
      })
    ],
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:3857',
      center: [-6503744, -4115148],
      zoom: 11
    })
  });


  var opt_options = {
    // You must use a proxy url to avoid CORS restrictions.
    // For testing, you can run `chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security` to
    // use a Google Chrome instance with CORS disabled.
    // In this example, allOrigins is a free and open source javascript (use it only for testing) 
    // For production deploy a custom instance or use yor own proxy.
    urlProxy: 'https://api.allorigins.win/raw?url=',
    buffer: 10000,
    drone: 'mavic-2',
    country: 'AR',
    showGeozoneIcons: false,
    displayLevels: [2, 6, 1, 0, 3, 4, 7],
    activeLevels: [0, 1, 2, 3, 4, 6, 7],
    createPanel: 'full',
    language: 'en',
    startCollapsed: false,
    theme: 'light',
    i18n: {
      labels: {
        djiGeoZones: 'My Geozones'
      }
    }
  };

  var djiGeozones = new DjiGeozones(opt_options);
  map.addControl(djiGeozones);

  djiGeozones.on('error', (err) => {
    // alert('An error ocurred: ' + err.message);
    console.log(err)
  });

  const zoomToUserLocation = document.getElementById('zoomToUserLocation');
  zoomToUserLocation.addEventListener('click', () => {
    //get user location 
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const center = ol.proj.fromLonLat([lng, lat]);
      map.getView().setCenter(center);
      map.getView().setZoom(15);
    })
  });



  const kmlFileInput = document.getElementById('kmlFileInput');
  kmlFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    // Read the KML file
    // Read the KML file
    reader.onload = function (event) {
      const kmlData = event.target.result;

      // Parse the KML data
      const parser = new DOMParser();
      const kmlDocument = parser.parseFromString(kmlData, 'text/xml');

      // Create a vector source and layer for the KML data, specifying the data projection
      const vectorSource = new ol.source.Vector({
        format: new ol.format.KML({
          extractStyles: false
        }),
        features: new ol.format.KML().readFeatures(kmlDocument, {
          dataProjection: 'EPSG:4326', // Assuming KML data is in EPSG:4326
          featureProjection: 'EPSG:3857', // Reproject to EPSG:3857
        }),
      });

      // Define a custom style for KML features
      const customStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 2,
        }),
      });

      // Apply the custom style to all features in the vector source
      vectorSource.getFeatures().forEach((feature) => {
        feature.setStyle(customStyle);
      });

      // Create a vector layer with the vector source
      const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
      });

      map.addLayer(vectorLayer);
      map.getView().fit(vectorSource.getExtent(), map.getSize());
    };


    reader.readAsText(file);
  });


})();


function initMap() {
  const input = document.getElementById('autocomplete-input');
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['geocode'],
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }
    console.log('Selected Place:', place.name, place.formatted_address);
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const center = ol.proj.fromLonLat([lng, lat]);
    map.getView().setCenter(center);
    map.getView().setZoom(15);

  });
}
