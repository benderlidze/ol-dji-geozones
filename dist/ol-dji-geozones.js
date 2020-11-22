(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol/layer/Vector'), require('ol/source/Vector'), require('ol/Feature'), require('ol/Overlay'), require('ol/proj'), require('ol/sphere'), require('ol/geom'), require('ol/style'), require('ol/control'), require('ol/color'), require('ol/geom/Polygon'), require('ol/extent')) :
  typeof define === 'function' && define.amd ? define(['ol/layer/Vector', 'ol/source/Vector', 'ol/Feature', 'ol/Overlay', 'ol/proj', 'ol/sphere', 'ol/geom', 'ol/style', 'ol/control', 'ol/color', 'ol/geom/Polygon', 'ol/extent'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DjiGeozones = factory(global.ol.layer.Vector, global.ol.source.Vector, global.ol.Feature, global.ol.Overlay, global.ol.proj, global.ol.sphere, global.ol.geom, global.ol.style, global.ol.control, global.ol.color, global.ol.geom.Polygon, global.ol.extent));
}(this, (function (VectorLayer, VectorSource, Feature, Overlay, proj, sphere, geom, style, control, color, Polygon, extent) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var VectorLayer__default = /*#__PURE__*/_interopDefaultLegacy(VectorLayer);
  var VectorSource__default = /*#__PURE__*/_interopDefaultLegacy(VectorSource);
  var Feature__default = /*#__PURE__*/_interopDefaultLegacy(Feature);
  var Overlay__default = /*#__PURE__*/_interopDefaultLegacy(Overlay);

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var levelParams = {
  	"0": {
  	name: "Warning Zones",
  	desc: "In these Zones, which may not necessarily appear on the DJI GO map, users will be prompted with a warning message. Example Warning Zone: Class E airspace",
  	color: "#FFCC00",
  	zIndex: 1,
  	markerIcon: "https://www1.djicdn.com/dps/6734f5340f66c7be37db48c8889392bf.png",
  	markerCircle: "https://www2.djicdn.com/assets/images/flysafe/geo-system/warning-98a8a2c8d6768e22957488ce962d77c3.png?from=cdnMap"
  },
  	"1": {
  	name: "Authorization Zones",
  	desc: "In these Zones, which appear blue in the DJI GO map, users will be prompted with a warning and flight is limited by default. Authorization Zones may be unlocked by authorized users using a DJI verified account.",
  	color: "#1088F2",
  	zIndex: 2,
  	markerIcon: "https://www1.djicdn.com/dps/fbbea9e33581907cac182adb4bcd0c94.png",
  	markerCircle: "https://www4.djicdn.com/assets/images/flysafe/geo-system/authorization-878e879982c9555bcaab7bb6bce3c6ca.png?from=cdnMap"
  },
  	"2": {
  	name: "Restricted Zones",
  	desc: "In these Zones, which appear red the DJI GO app, users will be prompted with a warning and flight is prevented. If you believe you have the authorization to operate in a Restricted Zone, please contact flysafe@dji.com or Online Unlocking.",
  	color: "#DE4329",
  	zIndex: 3,
  	markerIcon: "https://www1.djicdn.com/dps/d47dfe9f089f259631fbed99610b8b5a.png",
  	markerCircle: "https://www5.djicdn.com/assets/images/flysafe/geo-system/restricted-e0ce1467a8df2d07ec6a33cf11f4279e.png?from=cdnMap"
  },
  	"3": {
  	name: "Enhanced Warning Zones",
  	desc: "In these Zones, you will be prompted by GEO at the time of flight to unlock the zone using the same steps as in an Authorization Zone, but you do not require a verified account or an internet connection at the time of your flight.",
  	color: "#EE8815",
  	zIndex: 2,
  	markerIcon: "https://www1.djicdn.com/dps/df822149e1e6e9e804e177813e044238.png",
  	markerCircle: "https://www4.djicdn.com/assets/images/flysafe/geo-system/enhanced_warning-623fea05bff2f83f3c0ff5a65a41a1df.png?from=cdnMap"
  },
  	"4": {
  	name: "Regulatory Restricted Zones",
  	desc: "Due to local regulations and policies, flights are prohibited within the scope of some special areas. (Example：Prison)",
  	color: "#37C4DB",
  	zIndex: 1,
  	markerIcon: "https://www1.djicdn.com/dps/53b33783709b6ed06bc3afdd21ac2a81.png",
  	markerCircle: "https://www4.djicdn.com/assets/images/flysafe/geo-system/recommended-e92f991d039ae145c9b1c72ad62b26b2.png?from=cdnMap"
  },
  	"5": {
  	name: "Recommended Zones",
  	color: "#00BE00",
  	zIndex: 1,
  	markerIcon: "https://www1.djicdn.com/dps/53b33783709b6ed06bc3afdd21ac2a81.png",
  	markerCircle: "https://www4.djicdn.com/assets/images/flysafe/geo-system/recommended-e92f991d039ae145c9b1c72ad62b26b2.png?from=cdnMap"
  },
  	"6": {
  	name: "Altitude Zones",
  	desc: "Altitude zones will appear in gray on the map. Users receive warnings in DJI GO, or DJI GO 4 and flight altitude is limited.",
  	color: "#979797",
  	zIndex: 1,
  	markerIcon: "https://www1.djicdn.com/dps/f5961991d664e130fcf9ad01b1f28043.png",
  	markerCircle: "https://www1.djicdn.com/assets/images/flysafe/geo-system/Oval-34907c1071d63a3f1fffdc739b0943d9.png?from=cdnMap"
  },
  	"7": {
  	name: "Recommended Zones",
  	desc: "This area is shown in green on the map. It is recommended that you choose these areas for flight arrangements.",
  	color: "#00BE00",
  	zIndex: 1,
  	markerIcon: "https://www1.djicdn.com/dps/9d922ae5fbd80d3166a844a9e249ceb3.png",
  	markerCircle: "https://www1.djicdn.com/assets/images/flysafe/geo-system/regulations-2dfeef5b11017811dcaa720c86c49406.png?from=cdnMap"
  },
  	"8": {
  	name: "Approved Zones for Light UAVs(China)",
  	desc: "For Approved Zones, pilots of light UAVs flying at an altitude of 120 m or less are not required to obtain permission to fly. Pilots who are planning to fly medium-sized UAVs in Approved Zones at an altitude higher than 120 m, or in GEO Zones other than Approved Zones, must obtain permission via UTMISS before taking off",
  	color: "#00BE00",
  	zIndex: 1,
  	markerIcon: "https://www1.djicdn.com/dps/53b33783709b6ed06bc3afdd21ac2a81.png",
  	markerCircle: "https://www1.djicdn.com/dps/a968914208241c3f6a5a3c64c221b8ff.png"
  },
  	"9": {
  	name: "Densely Populated Area",
  	desc: "This area is shown in red on the map. Under normal circumstances, the population of this area is more concentrated, so please do not fly over this area. (Example: Commercial Block)",
  	color: "#DE4329",
  	zIndex: 1,
  	markerIcon: "https://www1.djicdn.com/dps/d47dfe9f089f259631fbed99610b8b5a.png",
  	markerCircle: "https://www5.djicdn.com/assets/images/flysafe/geo-system/restricted-e0ce1467a8df2d07ec6a33cf11f4279e.png?from=cdnMap"
  }
  };

  var droneList = [
  	{
  		value: "mavic-mini",
  		name: "Mavic Mini"
  	},
  	{
  		value: "mavic-2-enterprise",
  		name: "Mavic 2 Enterprise"
  	},
  	{
  		value: "mavic-2",
  		name: "Mavic 2"
  	},
  	{
  		value: "mavic-air",
  		name: "Mavic Air"
  	},
  	{
  		value: "mavic-air-2",
  		name: "Mavic Air 2"
  	},
  	{
  		value: "mavic-pro",
  		name: "Mavic Pro"
  	},
  	{
  		value: "spark",
  		name: "Spark"
  	},
  	{
  		value: "phantom-4-pro",
  		name: "Phantom 4 Pro"
  	},
  	{
  		value: "phantom-4-advanced",
  		name: "Phantom 4 Advanced"
  	},
  	{
  		value: "phantom-4",
  		name: "Phantom 4"
  	},
  	{
  		value: "phantom-4-rtk",
  		name: "Phantom 4 RTK"
  	},
  	{
  		value: "phantom-4-multispectral",
  		name: "Phantom 4 Multispectral"
  	},
  	{
  		value: "phantom-3-pro",
  		name: "Phantom 3 Pro"
  	},
  	{
  		value: "phantom-3-advanced",
  		name: "Phantom 3 Advanced"
  	},
  	{
  		value: "phantom-3-standard",
  		name: "Phantom 3 Standard"
  	},
  	{
  		value: "phantom-3-4K",
  		name: "Phantom 3 4K"
  	},
  	{
  		value: "phantom-3-se",
  		name: "Phantom 3 SE"
  	},
  	{
  		value: "inspire-2",
  		name: "Inspire 2"
  	},
  	{
  		value: "inspire-1-series",
  		name: "Inspire 1 Series"
  	},
  	{
  		value: "m200-series",
  		name: "M200 Series"
  	},
  	{
  		value: "m300-series",
  		name: "M300 Series"
  	},
  	{
  		value: "m600-series",
  		name: "M600 Series"
  	},
  	{
  		value: "m100",
  		name: "M100"
  	},
  	{
  		value: "mg1p",
  		name: "MG 1S/1A/1P/1P RTK/T10/T16/T20/T30"
  	},
  	{
  		value: "dji-mini-2",
  		name: "DJI Mini 2"
  	}
  ];

  var typeList = {
  	"0": {
  	name: "Airport"
  },
  	"1": {
  	name: "Special Zone"
  },
  	"2": {
  	name: "Military Zone"
  },
  	"4": {
  	name: "Recommended Zones"
  },
  	"10": {
  	name: "Airport"
  },
  	"13": {
  	name: "Recreational airport"
  },
  	"14": {
  	name: "Recreational airport"
  },
  	"15": {
  	name: "Class B Airspace"
  },
  	"16": {
  	name: "Class C Airspace"
  },
  	"17": {
  	name: "Class D Airspace"
  },
  	"18": {
  	name: "Class E Airspace"
  },
  	"19": {
  	name: "Heliport"
  },
  	"23": {
  	name: "Power plant"
  },
  	"24": {
  	name: "Prison"
  },
  	"26": {
  	name: "Stadium"
  },
  	"27": {
  	name: "Prohibited Airspace"
  },
  	"28": {
  	name: "Restricted Airspace"
  },
  	"29": {
  	name: "Temporary Flight Restriction"
  },
  	"30": {
  	name: "Nuclear Power Plant"
  },
  	"31": {
  	name: "Unpaved Airports"
  },
  	"32": {
  	name: "Special Zones"
  },
  	"33": {
  	name: "Military Zones"
  },
  	"34": {
  	name: "Heliport"
  },
  	"35": {
  	name: "Seaplane Base"
  },
  	"36": {
  	name: "Temporary Flight Restriction"
  },
  	"39": {
  	name: "Approved Zones for Light UAVs"
  },
  	"41": {
  	name: "Regulatory Restricted Zones for Light UAVs"
  }
  };

  var API_AREAS_ENDPOINT = 'www-api.dji.com/api/geo/areas';
  var API_INFO_ENDPOINT = 'www-api.dji.com/api/geo/point-info';
  var API_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // request all the levels, we filter later to avoid some api problems

  var LOADING_ELEMENT = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
  var MIN_ZOOM = 9; // > 9 breaks the API

  /**
   * OpenLayers DJI Geozone Layer.
   * See [the examples](./examples) for usage.
   * @constructor
   * @param {Object} map Class Map
   * @param {String} url_proxy Proxy 
   * @param {Object} opt_options Control options adding:
   * @param {String} opt_options.drone DJI API parameter
   * @param {String} opt_options.zonesMode DJI API parameter
   * @param {String} opt_options.country DJI API parameter
   * @param {Array} opt_options.levelsToDisplay DJI API parameter
   * @param {Array} opt_options.levelsActivated DJI API parameter
   * @param {Array} opt_options.levelParams Controller labels, names, icons and color for each level
   * @param {Boolean} opt_options.control Add Open Layers Controller to the map
   * @param {HTMLElement | string} opt_options.targetControl // Specify a target if you want the control to be rendered outside of the map's viewport.
   */

  class DjiGeozones {
    constructor(map, url_proxy) {
      var opt_options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      // API PARAMETERS
      this.drone = opt_options.drone || 'spark';
      this.zones_mode = opt_options.zonesMode || 'total';
      this.country = opt_options.country || 'US';
      this.levelsToDisplay = opt_options.levelsToDisplay || [2, 6, 1, 0, 3, 4, 7];
      this.levelsActivated = opt_options.levelsActivated || [2, 6, 1, 0, 3, 4, 7]; // Get the colors, info, icons and more from each level

      this.levelParams = !opt_options.levelParams ? levelParams : _objectSpread2(_objectSpread2({}, levelParams), opt_options.levelParams);
      this.url_proxy = url_proxy; // We can use the features properties to show in the popup, or make an extra request to the Info API.
      // The original DJI map makes extras requests to this API to get these values, but I don't understand why:
      // It's more slow and requieres extra requests to an already downloaded data.
      // Either way, this extra API calls are supported.

      this.useApiForPopUp = false; // MAP 

      var addControl = 'control' in opt_options ? opt_options.control : true;
      var targetControl = opt_options.targetControl || null;
      this.map = map;
      this.view = map.getView();
      this.projection = this.view.getProjection();
      this.isVisible = this.view.getZoom() < MIN_ZOOM;
      this.layers = [];
      this.divControl = null;
      this.areaDownloaded = null;
      this.initiated = false;
      this.init(addControl, targetControl);
    }

    init(addControl, targetControl) {
      var createVectorLayers = () => {
        var styleFunction = feature => {
          var geomType = feature.getGeometry().getType();
          var style$1;
          var level = feature.get('level');

          if (geomType === 'Polygon' || geomType === 'Circle') {
            var color = feature.get('color');
            style$1 = new style.Style({
              fill: new style.Fill({
                color: colorWithAlpha(color, 0.3)
              }),
              stroke: new style.Stroke({
                color: color,
                width: 1
              }),
              zIndex: this.levelParams[level].zIndex
            });
          } else if (geomType === 'Point') {
            style$1 = new style.Style({
              image: new style.Icon({
                src: this.levelParams[level].markerIcon,
                scale: 0.35,
                anchor: [0.5, 0.9]
              }),
              zIndex: this.levelParams[level].zIndex * 2
            });
          }

          return style$1;
        };

        API_LEVELS.forEach(level => {
          var layer = new VectorLayer__default['default']({
            zIndex: this.levelParams[level].zIndex * 2,
            name: 'ol-dji-geozones',
            level: level,
            visible: this.levelsActivated.includes(level) ? true : false,
            source: new VectorSource__default['default']({
              attributions: '<a href="https://www.dji.com/flysafe/geo-map" rel="nofollow noopener noreferrer" target="_blank">DJI GeoZoneMap</a>'
            }),
            style: styleFunction
          });
          this.map.addLayer(layer);
          this.layers.push(layer);
        });
      };

      var createPopUpOverlay = () => {
        var popupContainer = document.createElement('div');
        popupContainer.id = 'ol-dji-geozones--popup';
        popupContainer.className = 'ol-popup ol-dji-geozones--ol-popup';
        this.popupContent = document.createElement('div');
        this.popupContent.id = 'ol-dji-geozones--popup-content';
        this.popupContent.className = 'ol-dji-geozones--ol-popup-content';
        var popupCloser = document.createElement('a');
        popupCloser.id = 'ol-dji-geozones--popup-closer';
        popupCloser.className = 'ol-dji-geozones--ol-popup-closer';
        popupCloser.href = '#';

        popupCloser.onclick = () => {
          this.overlay.setPosition(undefined);
          popupCloser.blur();
          return false;
        };

        popupContainer.append(popupCloser);
        popupContainer.append(this.popupContent);
        this.overlay = new Overlay__default['default']({
          element: popupContainer,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        });
        this.map.addOverlay(this.overlay);
      };
      /**
       * 
       * @param {HTMLElement | string} targetControl 
       */


      var addMapControl = targetControl => {
        var createDroneSelector = _ => {
          var handleChange = (_ref) => {
            var {
              target
            } = _ref;
            this.drone = target.value || target.options[target.selectedIndex].value;
            this.getInfoFromView(
            /* clear = */
            true);
          };

          var droneSelector = document.createElement('div');
          droneSelector.className = 'ol-dji-geozones--drone-selector';
          var select = document.createElement('select');
          select.onchange = handleChange;
          if (!this.isVisible) select.setAttribute('disabled', 'disabled');
          var options = '';
          droneList.forEach(drone => {
            var selected = this.drone === drone.value ? 'selected' : '';
            options += "<option value=\"".concat(drone.value, "\" ").concat(selected, ">").concat(drone.name, "</option>");
          });
          select.innerHTML = options;
          droneSelector.append(select);
          return droneSelector;
        };

        var createLevelSelector = _ => {
          var handleClick = (_ref2) => {
            var {
              target
            } = _ref2;
            var value = Number(target.value);
            var bool;

            if (target.checked === true) {
              this.levelsActivated = [...this.levelsActivated, value];
              bool = true;
            } else {
              var index = this.levelsActivated.indexOf(value);

              if (index !== -1) {
                this.levelsActivated.splice(index, 1);
              }

              bool = false;
            }

            var layer = this.getLayerByLevel(value);
            layer.setVisible(bool);
          };

          var createLegend = color => {
            var span = document.createElement('span');
            span.className = 'ol-dji-geozones--mark';
            span.style.border = "1px ".concat(color, " solid");
            span.style.backgroundColor = colorWithAlpha(color, 0.4);
            return span;
          };

          var createLabel = (label, name, color) => {
            var labelEl = document.createElement('label');
            labelEl.htmlFor = name;
            labelEl.append(createLegend(color));
            labelEl.append(label);
            return labelEl;
          };

          var createCheckbox = (name, value, disabled) => {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = name;
            checkbox.id = name;
            checkbox.value = value;
            checkbox.onclick = handleClick;
            if (this.levelsActivated.indexOf(value) !== -1) checkbox.checked = 'checked';
            if (disabled) checkbox.disabled = 'disabled';
            return checkbox;
          };

          var createLevelItem = (value, _ref3) => {
            var {
              name,
              desc,
              color
            } = _ref3;
            var disabled = !this.isVisible;
            var id = 'level' + value;
            var divContainer = document.createElement('div');
            divContainer.className = "ol-dji-geozones--item-ctl ol-dji-geozones--item-ctl-".concat(value);
            divContainer.title = desc;
            divContainer.setAttribute('data-level', value);
            divContainer.append(createCheckbox(id, value, disabled));
            divContainer.append(createLabel(name, id, color));
            return divContainer;
          };

          var levelSelector = document.createElement('div');
          levelSelector.className = 'ol-dji-geozones--level-selector';
          this.levelsToDisplay.forEach(lev => {
            var level = createLevelItem(lev, this.levelParams[lev]);
            levelSelector.append(level);
          });
          return levelSelector;
        };

        var divControl = document.createElement('div');
        divControl.className = 'ol-dji-geozones ol-control ol-dji-geozones--ctrl-disabled';
        divControl.innerHTML = "\n        <div>\n            <h3>DJI Geo Zone</h3>\n            <span class=\"ol-dji-geozones--loading\">\n                ".concat(LOADING_ELEMENT, "\n            </span>\n            <span class=\"ol-dji-geozones--advice\">(Zoom in)</span>\n        </div>");
        var droneSelector = createDroneSelector();
        divControl.append(droneSelector);
        var levelSelector = createLevelSelector();
        divControl.append(levelSelector);
        this.divControl = divControl;
        var options = {
          element: divControl
        };

        if (targetControl) {
          options.target = target;
        }

        this.control = new control.Control(options);
        this.map.addControl(this.control);
      };

      var addMapEvents = () => {
        /**
         * Enable or disable the inputs and the select in the control
         * @param {Boolean} enabled 
         */
        var setControlEnabled = enabled => {
          var changeState = array => {
            array.forEach(el => {
              if (enabled) el.removeAttribute('disabled');else el.disabled = 'disabled';
            });
          };

          if (enabled) this.divControl.classList.remove('ol-dji-geozones--ctrl-disabled');else this.divControl.classList.add('ol-dji-geozones--ctrl-disabled');
          changeState(this.divControl.querySelectorAll('input'));
          changeState(this.divControl.querySelectorAll('select'));
        };

        var handleZoomEnd = _ => {
          var setVisible = bool => {
            this.layers.forEach(layer => {
              if (!bool) {
                layer.setVisible(bool);
              } else if (bool && this.levelsActivated.includes(layer.get('level'))) {
                layer.setVisible(bool);
              }
            });
          };

          if (this.currentZoom < MIN_ZOOM) {
            // Hide the layer and disable the control
            if (this.isVisible) {
              setVisible(false);
              this.isVisible = false;
              setControlEnabled(false);
            }
          } else {
            // Show the layers and enable the control
            if (!this.isVisible) {
              setVisible(true);
              this.isVisible = true;
              setControlEnabled(true);
            } else {
              // If the view is closer, don't do anything, we already had the features
              if (this.currentZoom > this.lastZoom) return;
            }

            this.getInfoFromView();
          }
        };

        var handleDragEnd = _ => {
          if (!this.isVisible) return;
          this.getInfoFromView();
        };

        var clickHandler = evt => {
          var type = this.useApiForPopUp ? 'useApiForPopUp' : 'useFeatures';
          this.getPointInfoFromClick(evt, type);
        };

        this.map.on('moveend', _ => {
          this.currentZoom = this.view.getZoom();
          if (this.currentZoom !== this.lastZoom) handleZoomEnd();else handleDragEnd();
          this.lastZoom = this.currentZoom;
        });
        this.map.on('singleclick', clickHandler);
      };

      if (this.initiated) return;
      this.initiated = true;
      createVectorLayers();
      createPopUpOverlay();
      addMapEvents();
      if (addControl) addMapControl(targetControl);
    }

    getPointInfoFromClick(evt, type) {
      var _this = this;

      return _asyncToGenerator(function* () {
        var infoKeys = ['name', 'level', 'type', 'height', 'shape', 'start_at', 'end_at', 'url', 'address', 'description'];
        var idInfoRequest = 0;

        var getInfoFromApiLatLng = /*#__PURE__*/function () {
          var _ref4 = _asyncToGenerator(function* (coordinate) {
            // Prevent multiples requests
            idInfoRequest += 1;
            var request = idInfoRequest;
            return new Promise((resolve, reject) => {
              setTimeout( /*#__PURE__*/function () {
                var _ref5 = _asyncToGenerator(function* (_) {
                  if (request !== idInfoRequest) return;
                  var center4326 = proj.transform(coordinate, _this.projection, 'EPSG:4326');
                  var clickLatLng = {
                    lat: center4326[1],
                    lng: center4326[0]
                  };
                  var apiJson = yield _this.getApiGeoData('info', clickLatLng);
                  var areas = apiJson.areas;
                  if (!areas.length) resolve(false);
                  var featuresProps = [];

                  for (var area of areas) {
                    featuresProps.push(area);
                  }

                  resolve(featuresProps);
                });

                return function (_x2) {
                  return _ref5.apply(this, arguments);
                };
              }(), 100);
            });
          });

          return function getInfoFromApiLatLng(_x) {
            return _ref4.apply(this, arguments);
          };
        }();

        var getInfoFromFeatures = features => {
          var featuresProps = [];
          features.forEach(feature => {
            var props = {};
            infoKeys.forEach(key => props[key] = feature.get(key));
            featuresProps.push(props);
          });
          return featuresProps;
        };

        var showGeozoneDataInPopUp = (geozonesData, coordinates) => {
          var parseDataToHtml = (_ref6) => {
            var {
              name,
              level,
              type,
              height,
              description,
              begin_at,
              end_at,
              address,
              url
            } = _ref6;
            return "\n                <div class=\"ol-dji-geozones--item\">\n                    <div class=\"ol-dji-geozones--marker\">\n                        <img src=\"".concat(levelParams[level].markerCircle, "\">\n                    </div>\n                    <div class=\"ol-dji-geozones--main\">\n                    <h3 class=\"ol-dji-geozones--title\">").concat(name, "</h3>\n                        <p class=\"level\">Level: ").concat(levelParams[level].name, "</p>\n                        <p class=\"type\">Type: ").concat(typeList[type].name, "</p>\n                        ").concat(begin_at ? "<p class=\"start_time\">End Time: ".concat(begin_at, "</p>") : '', "\n                        ").concat(end_at ? "<p class=\"end_time\">End Time: ".concat(end_at, "</p><p class=\"time_tips\">Time: 24-hour clock</p>") : '', "         \n                        ").concat(height ? "<p class=\"height\">Max. Altitude (m): ".concat(height, "</p>") : '', " \n                        ").concat(address ? "<p class=\"address\">Address: ".concat(address, "</p>") : '', "\n                        ").concat(description ? "<p class=\"desc\">Tips: ".concat(description, "</p>") : '', "\n                        ").concat(url ? "<p class=\"url\">Link: <a href=\"".concat(url, "\">Learn More</a></p>") : '', "\n                    </div>\n                </div> ");
          };

          var html = [];
          var preventDuplicates = [];
          geozonesData = Array.isArray(geozonesData) ? geozonesData : [geozonesData];
          geozonesData.forEach(geozoneProps => {
            var htmlItem = parseDataToHtml(geozoneProps); // The oficial DJI map show duplicates, but we don't want that

            if (preventDuplicates.indexOf(htmlItem) === -1) {
              preventDuplicates.push(htmlItem);
              html.push(htmlItem);
            }
          });
          _this.popupContent.innerHTML = html.join('<hr>');

          _this.overlay.setPosition(coordinates);
        };

        try {
          if (!_this.isVisible) {
            _this.overlay.setPosition(undefined);

            return;
          }

          var opt_options = {
            layerFilter: layer => layer.get('name') === 'ol-dji-geozones'
          };
          var data; // Call the API  to download the information

          if (type === 'useApiForPopUp') {
            if (_this.map.hasFeatureAtPixel(evt.pixel, opt_options)) {
              _this.popupContent.innerHTML = LOADING_ELEMENT;

              _this.overlay.setPosition(evt.coordinate);

              data = yield getInfoFromApiLatLng(evt.coordinate);
            } // Use the previously downloaded features information

          } else {
            var features = _this.map.getFeaturesAtPixel(evt.pixel, opt_options);

            data = getInfoFromFeatures(features);
          }

          if (data && data.length) showGeozoneDataInPopUp(data, evt.coordinate);else _this.overlay.setPosition(undefined);
        } catch (err) {
          console.log(err);
        }
      })();
    }

    getInfoFromView() {
      var _this2 = this;

      var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var idAreasRequest = 0;
      /**
       * The level parameter returned by the API is wrong, so wee need to fixed using the color
       * @param {*} feature 
       */

      var fixLevelValue = feature => {
        var color = feature.get('color');
        var level = Object.keys(this.levelParams).find(key => this.levelParams[key].color === color);
        feature.set('level', level);
        return feature;
      };

      var apiResponseToFeatures = djiJson => {
        var areas = djiJson.areas;
        if (!areas || !areas.length) return false;
        var features = [];

        var _loop = function _loop(area) {
          // If the feature already exists, continue
          if (_this2.getFeatureById(area.area_id)) {
            return "continue";
          }

          var featureProps = {
            address: area.address,
            begin_at: area.begin_at,
            color: area.color,
            city: area.city,
            country: area.country,
            data_source: area.data_source,
            description: area.description,
            end_at: area.end_at,
            height: area.height,
            level: area.level,
            name: area.name,
            radius: area.radius,
            shape: area.shape,
            type: area.type,
            url: area.url,
            lng: area.lng,
            lat: area.lat
          }; // Only a few of "areas" come with polygons

          if (area.polygon_points) {
            var featureExtra = new Feature__default['default'](_objectSpread2(_objectSpread2({}, featureProps), {}, {
              geometry: new geom.Polygon(area.polygon_points).transform('EPSG:4326', _this2.projection)
            }));
            featureExtra.setId(area.area_id + "_poly");
            features.push(fixLevelValue(featureExtra));
          }

          var feature = new Feature__default['default'](_objectSpread2(_objectSpread2({}, featureProps), {}, {
            geometry: new geom.Point([area.lng, area.lat]).transform('EPSG:4326', _this2.projection)
          })); // Store the id to avoid duplicates

          feature.setId(area.area_id);
          features.push(fixLevelValue(feature));

          if (area.sub_areas) {
            area.sub_areas.forEach(sub_area => {
              var subFeature;

              if (sub_area.polygon_points) {
                subFeature = new Feature__default['default']({
                  color: sub_area.color,
                  height: sub_area.height,
                  level: sub_area.level,
                  name: area.name,
                  radius: sub_area.radius,
                  shape: sub_area.shape,
                  type: area.type,
                  lng: sub_area.lng,
                  lat: sub_area.lat,
                  geometry: new geom.Polygon(sub_area.polygon_points).transform('EPSG:4326', _this2.projection)
                });
              } else {
                subFeature = new Feature__default['default']({
                  color: sub_area.color,
                  height: sub_area.height,
                  level: sub_area.level,
                  name: area.name,
                  radius: sub_area.radius,
                  shape: sub_area.shape,
                  type: area.type,
                  lng: sub_area.lng,
                  lat: sub_area.lat,
                  geometry: new geom.Circle([sub_area.lng, sub_area.lat], sub_area.radius / 100000).transform('EPSG:4326', _this2.projection)
                });
              }

              subFeature.setId(sub_area.area_id);
              features.push(fixLevelValue(subFeature));
            });
          }
        };

        for (var area of areas) {
          var _ret = _loop(area);

          if (_ret === "continue") continue;
        }

        return features;
      };

      var showLoading = bool => {
        if (bool) this.divControl.classList.add('ol-dji-geozones--isLoading');else this.divControl.classList.remove('ol-dji-geozones--isLoading');
      }; // Prevent multiples requests


      idAreasRequest += 1;
      var request = idAreasRequest; // Original DJI map same behavior to prevent multiples requests

      setTimeout( /*#__PURE__*/function () {
        var _ref7 = _asyncToGenerator(function* (_) {
          if (request !== idAreasRequest) return;

          try {
            showLoading(true);

            var center = _this2.view.getCenter();

            var center4326 = proj.transform(center, _this2.projection, 'EPSG:4326');
            var viewLatLng = {
              lat: center4326[1],
              lng: center4326[0]
            };

            if (clear) {
              _this2.areaDownloaded = null; // Remove area already downloaded
            }

            var data = yield _this2.getApiGeoData('areas', viewLatLng);
            if (!data) throw new Error();
            if (clear) _this2.clearFeatures();
            var features = apiResponseToFeatures(data);

            _this2.addFeatures(features);

            showLoading(false); // console.log(data);
          } catch (err) {
            if (err.message) console.error(err);
            showLoading(false);
          }
        });

        return function (_x3) {
          return _ref7.apply(this, arguments);
        };
      }(), 300);
    }

    getApiGeoData(typeApiRequest, latLng) {
      var _this3 = this;

      return _asyncToGenerator(function* () {
        var apiRequest = /*#__PURE__*/function () {
          var _ref9 = _asyncToGenerator(function* (type, _ref8, searchRadius) {
            var {
              lng,
              lat
            } = _ref8;
            var api_endpoint = type === 'areas' ? API_AREAS_ENDPOINT : API_INFO_ENDPOINT; // If not proxy is passed, make a direct request
            // Maybe in the future the api will has updated CORS restrictions

            var url = new URL(_this3.url_proxy ? _this3.url_proxy + api_endpoint : 'https://' + api_endpoint);
            var queryObj = {
              'drone': _this3.drone,
              'zones_mode': _this3.zones_mode,
              'country': _this3.country,
              'level': API_LEVELS,
              'lng': lng,
              'lat': lat,
              'search_radius': searchRadius
            };
            Object.keys(queryObj).forEach(key => url.searchParams.append(key, queryObj[key]));
            var response = yield fetch(url);
            if (!response.ok) throw new Error("HTTP-Error: " + response.status);
            return yield response.json();
          });

          return function apiRequest(_x4, _x5, _x6) {
            return _ref9.apply(this, arguments);
          };
        }();

        var getPointInfo = /*#__PURE__*/function () {
          var _ref10 = _asyncToGenerator(function* (latLng, searchRadius) {
            var data = yield apiRequest('info', latLng, searchRadius);
            return data;
          });

          return function getPointInfo(_x7, _x8) {
            return _ref10.apply(this, arguments);
          };
        }();

        var getAreas = /*#__PURE__*/function () {
          var _ref11 = _asyncToGenerator(function* (centerLatLng, searchRadius) {
            var extent$1 = _this3.view.calculateExtent();

            var polygon = Polygon.fromExtent(extent$1);

            if (_this3.areaDownloaded) {
              if (_this3.areaDownloaded.intersectsCoordinate(extent.getCenter(extent$1)) && _this3.areaDownloaded.intersectsCoordinate(extent.getBottomLeft(extent$1)) && _this3.areaDownloaded.intersectsCoordinate(extent.getTopRight(extent$1)) && _this3.areaDownloaded.intersectsCoordinate(extent.getBottomRight(extent$1)) && _this3.areaDownloaded.intersectsCoordinate(extent.getTopLeft(extent$1))) {
                // whe already have the data, do nothing
                return;
              }
            } else {
              _this3.areaDownloaded = new geom.MultiPolygon({});
            }

            _this3.areaDownloaded.appendPolygon(polygon);

            var data = yield apiRequest('areas', centerLatLng, searchRadius);
            return data;
          });

          return function getAreas(_x9, _x10) {
            return _ref11.apply(this, arguments);
          };
        }(); // adapted from https://stackoverflow.com/questions/44575654/get-radius-of-the-displayed-openlayers-map


        var getMapRadius = (_ref12) => {
          var {
            lng,
            lat
          } = _ref12;
          var center = [lng, lat];

          var size = _this3.map.getSize();

          var extent = _this3.view.calculateExtent(size);

          extent = proj.transformExtent(extent, _this3.projection, 'EPSG:4326');
          var posSW = [extent[0], extent[1]];
          var centerToSW = sphere.getDistance(center, posSW);
          return parseInt(centerToSW);
        };

        if (!_this3.isVisible) return;
        var searchRadius = getMapRadius(latLng);
        var data;

        if (typeApiRequest === 'areas') {
          data = yield getAreas(latLng, searchRadius);
        } else {
          data = yield getPointInfo(latLng, searchRadius);
        }

        return data;
      })();
    }
    /**
     * Show or hides the control
     * @param {Boolean} visible 
     */


    setControlVisible(visible) {
      if (visible) this.divControl.classList.addClass('ol-dji-geozones--ctrl-hidden');else this.divControl.classList.removeClass('ol-dji-geozones--ctrl-hidden');
    }

    clearFeatures() {
      this.layers.forEach(layer => {
        layer.getSource().clear();
      });
    }

    getFeatureById(id) {
      var feature;

      for (var layer of this.layers) {
        feature = layer.getSource().getFeatureById(id);
        if (feature) break;
      }

      return feature;
    }

    getLayerByLevel(level) {
      var find;

      for (var layer of this.layers) {
        if (layer.get('level') != undefined && layer.get('level') == level) {
          find = layer;
          break;
        }
      }
      return find;
    }

    addFeatures(features) {
      features.forEach(feature => {
        var level = feature.get('level');
        var layer = this.getLayerByLevel(level);
        layer.getSource().addFeature(feature);
      });
    }

  } // https://stackoverflow.com/questions/28004153/setting-vector-feature-fill-opacity-when-you-have-a-hexadecimal-color

  function colorWithAlpha(color$1) {
    var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var [r, g, b] = Array.from(color.asArray(color$1));
    return color.asString([r, g, b, alpha]);
  }

  return DjiGeozones;

})));