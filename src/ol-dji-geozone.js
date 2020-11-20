import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { transform, transformExtent } from 'ol/proj';
import { getDistance } from 'ol/sphere';
import { Polygon, MultiPolygon, Point, Circle } from 'ol/geom';
import { Style, Fill, Stroke, Icon } from 'ol/style';
import { Control } from 'ol/control';
import { asArray, asString } from 'ol/color';
import { fromExtent } from 'ol/geom/Polygon';
import { getTopRight, getTopLeft, getBottomRight, getCenter, getBottomLeft } from 'ol/extent';

import levelParams from './level-params.json';
import droneList from './drone-list.json';

const API_AREAS_ENDPOINT = 'www-api.dji.com/api/geo/areas';
const API_INFO_ENDPOINT = 'www-api.dji.com/api/geo/point-info';

const MIN_ZOOM = 9; // >= 9 or breaks the API
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
 * @param {Array} opt_options.level DJI API parameter
 * @param {Array} opt_options.levelParams Controller labels, names, icons and color for each level
 * @param {Boolean} opt_options.control Add Open Layers Controller to the map
 * @param {HTMLElement | string} opt_options.targetControl // Specify a target if you want the control to be rendered outside of the map's viewport.
 */
export default class DjiGeozone {

    constructor(map, url_proxy, opt_options = {}) {

        // API PARAMETERS
        this.drone = opt_options.drone || 'spark';
        this.zones_mode = opt_options.zonesMode || 'total';
        this.country = opt_options.country || 'US';
        this.level = opt_options.level || [0, 1, 2, 3, 4, 6, 7];

        this.levelParams = (!opt_options.levelParams) ? levelParams : { ...levelParams, ...opt_options.levelParams };

        this.url_proxy = url_proxy;

        // MAP 
        let addControl = ('control' in opt_options) ? opt_options.control : true;
        let targetControl = opt_options.targetControl || null;

        this.map = map;
        this.view = map.getView();
        this.projection = this.view.getProjection();
        this.isVisible = (this.view.getZoom() < MIN_ZOOM);

        this.source = null;
        this.layer = null;
        this.divControl = null;
        this.idAreasRequest = 0;
        this.idInfoRequest = 0;
        this.areaDownloaded = null;

        this.createLayer();
        this.addMapEvents();

        if (addControl)
            this.addMapControl(targetControl);

    }

    createLayer() {

        const styleFunction = feature => {

            let geomType = feature.getGeometry().getType();

            let style;

            if (geomType === 'Polygon' || geomType === 'Circle') {

                let height = feature.get('height');
                let color = feature.get('color');

                style = new Style({
                    fill: new Fill({
                        color: colorWithAlpha(color, 0.3)
                    }),
                    stroke: new Stroke({
                        color: color,
                        width: 1
                    }),
                    zIndex: height
                })

            } else if (geomType === 'Point') {
                style = new Style({
                    image: new Icon({
                        src: this.levelParams[feature.get('level')].icon,
                        scale: 0.35,
                        anchor: [0.5, 0.9]
                    }),
                    zIndex: 300
                })
            }

            return style;

        }

        this.source = new VectorSource({
            attributions: '<a href="https://www.dji.com/flysafe/geo-map" rel="nofollow noopener noreferrer" target="_blank">DJI GeoZoneMap</a>'
        });

        this.layer = new VectorLayer({
            zIndex: 99,
            name: 'ol-dji-geozone',
            source: this.source,
            style: styleFunction
        });

        this.map.addLayer(this.layer);
    }

    /**
     * 
     * @param {HTMLElement | string} targetControl 
     */
    addMapControl(targetControl) {

        /**
          * Show or hides the control
          * @param {Boolean} visible 
          */
        this.setControlVisible = (visible) => {

            if (visible)
                this.divControl.classList.addClass('ol-dji-geozone--ctrl-hidden');
            else
                this.divControl.classList.removeClass('ol-dji-geozone--ctrl-hidden');

        }

        const createDroneSelector = _ => {

            const handleChange = ({ target }) => {
                this.drone = (target.value || target.options[target.selectedIndex].value);
                this.getAreasFromView(/* clear = */ true);
            }

            let droneSelector = document.createElement('div');
            droneSelector.className = 'ol-dji-geozone--drone-selector';

            let select = document.createElement('select');
            select.onchange = handleChange;

            let disabled = (!this.isVisible) ? 'disabled' : '';

            let options = '';

            droneList.forEach(drone => {
                let selected = (this.drone === drone.value) ? 'selected' : '';
                options += `<option value="${drone.value}" ${selected} ${disabled}>${drone.name}</option>`
            })

            select.innerHTML = options;

            droneSelector.append(select);

            return droneSelector;

        }

        const createLevelSelector = _ => {

            const handleClick = ({ target }) => {

                let value = Number(target.value);

                if (target.checked === true) {
                    this.level = [...this.level, value];
                } else {
                    let index = this.level.indexOf(value);
                    if (index !== -1) {
                        this.level.splice(index, 1);
                    }
                }

                this.getAreasFromView(/* clear = */ true);
            }

            const createLegend = color => {
                let span = document.createElement('span');
                span.className = 'ol-dji-geozone--mark'
                span.style.border = `1px ${color} solid`;
                span.style.backgroundColor = colorWithAlpha(color, 0.4);

                return span;
            }

            const createLabel = (label, name, color) => {
                let labelEl = document.createElement('label');
                labelEl.htmlFor = name;
                labelEl.append(createLegend(color));
                labelEl.append(label);

                return labelEl;
            }

            const createCheckbox = (name, value, disabled) => {
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = name;
                checkbox.id = name;
                checkbox.value = value;

                checkbox.onclick = handleClick;

                if (this.level.indexOf(value) !== -1)
                    checkbox.checked = 'checked';

                if (disabled)
                    checkbox.disabled = 'disabled';

                return checkbox;
            }

            const createLevelItem = (value, { name, desc, color }) => {

                let disabled = !this.isVisible;
                let id = 'level' + value;

                let divContainer = document.createElement('div');
                divContainer.className = `ol-dji-geozone--item ol-dji-geozone--item-${value}`;
                divContainer.title = desc;
                divContainer.setAttribute('data-level', value);
                divContainer.append(createCheckbox(id, value, disabled));
                divContainer.append(createLabel(name, id, color));

                return divContainer;
            }

            // Use the same DJI order
            let level2 = createLevelItem(2, this.levelParams[2]);
            let level6 = createLevelItem(6, this.levelParams[6]);
            let level1 = createLevelItem(1, this.levelParams[1]);
            let level0 = createLevelItem(0, this.levelParams[0]);
            let level3 = createLevelItem(3, this.levelParams[3]);
            let level4 = createLevelItem(4, this.levelParams[4]);
            let level7 = createLevelItem(7, this.levelParams[7]);

            let levelSelector = document.createElement('div');
            levelSelector.className = 'ol-dji-geozone--level-selector';

            // Use the same DJI order
            levelSelector.append(level2);
            levelSelector.append(level6);
            levelSelector.append(level1);
            levelSelector.append(level0);
            levelSelector.append(level3);
            levelSelector.append(level4);
            levelSelector.append(level7);

            return levelSelector;

        }

        let divControl = document.createElement('div');
        divControl.className = 'ol-dji-geozone ol-control ol-dji-geozone--ctrl-disabled';
        divControl.innerHTML = `
        <div>
            <h3>DJI Geo Zone</h3>
            <span class="ol-dji-geozone--loading">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </span>
            <span class="ol-dji-geozone--advice">(Zoom in)</span>
        </div>`;

        let droneSelector = createDroneSelector();
        divControl.append(droneSelector);

        let levelSelector = createLevelSelector();
        divControl.append(levelSelector);

        this.divControl = divControl;

        let options = {
            element: divControl
        };

        if (targetControl) {
            options.target = target;
        }

        this.control = new Control(options)

        this.map.addControl(this.control);

    }

    addMapEvents() {

        /**
         * Enable or disable the inputs and the select in the control
         * @param {Boolean} enabled 
         */
        const setControlEnabled = (enabled) => {

            const changeState = array => {
                array.forEach(el => {

                    if (enabled)
                        el.removeAttribute('disabled');
                    else
                        el.disabled = 'disabled';

                });
            }

            if (enabled)
                this.divControl.classList.remove('ol-dji-geozone--ctrl-disabled');
            else
                this.divControl.classList.add('ol-dji-geozone--ctrl-disabled');

            changeState(this.divControl.querySelectorAll('input'));
            changeState(this.divControl.querySelectorAll('select'));

        }

        const handleZoomEnd = _ => {

            if (this.currentZoom < MIN_ZOOM) {

                // Hide the layer and disable the control
                if (this.isVisible) {
                    this.layer.setVisible(false);
                    this.isVisible = false;
                    setControlEnabled(false);
                }

            } else {

                // Show the layers and enable the control
                if (!this.isVisible) {
                    this.layer.setVisible(true);
                    this.isVisible = true;
                    setControlEnabled(true);
                } else {
                    // If the view is closer, don't do anything, we already had the features
                    if (this.currentZoom > this.lastZoom)
                        return;
                }

                this.getAreasFromView();
            }

        }

        const handleDragEnd = _ => {

            this.getAreasFromView();

        }

        this.map.on('moveend', _ => {

            this.currentZoom = this.view.getZoom();

            if (this.currentZoom !== this.lastZoom)
                handleZoomEnd();
            else
                handleDragEnd();

            this.lastZoom = this.currentZoom;

        });

        this.map.on('singleclick', evt => {

            if (!this.isVisible) return;
            
            this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                this.getInfoFromLatLng(evt.coordinate);
                // console.log(feature);
                return true;
            })
        });

    }

    getInfoFromLatLng(latLng) {

        let center4326 = transform(latLng, this.projection, 'EPSG:4326');

        let clickLatLng = {
            lat: center4326[1],
            lng: center4326[0]
        }

        this.getGeoData('info', clickLatLng);

    }

    getAreasFromView(clear = false) {

        let center = this.view.getCenter();
        let center4326 = transform(center, this.projection, 'EPSG:4326');

        let viewLatLng = {
            lat: center4326[1],
            lng: center4326[0]
        }

        this.getGeoData('areas', viewLatLng, clear);

    }

    getGeoData(type, latLng, clear) {

        const showLoading = (bool) => {

            if (bool)
                this.divControl.classList.add('ol-dji-geozone--isLoading');
            else
                this.divControl.classList.remove('ol-dji-geozone--isLoading');

        }

        // adapted from https://stackoverflow.com/questions/44575654/get-radius-of-the-displayed-openlayers-map
        const getMapRadius = ({ lng, lat }) => {
            let center = [lng, lat];
            let size = this.map.getSize();
            let extent = this.view.calculateExtent(size);
            extent = transformExtent(extent, this.projection, 'EPSG:4326');
            let posSW = [extent[0], extent[1]];
            let centerToSW = getDistance(center, posSW);
            return parseInt(centerToSW);
        }

        const apiRequest = async (type, { lng, lat }, searchRadius) => {

            showLoading(true);

            let api_endpoint = (type === 'areas') ? API_AREAS_ENDPOINT : API_INFO_ENDPOINT;

            // If not proxy is passed, make a direct request
            // Maybe in the future the api will has updated CORS restrictions
            let url = new URL((this.url_proxy) ? this.url_proxy + api_endpoint : 'https://' + api_endpoint);

            let queryObj = {
                'drone': this.drone,
                'zones_mode': this.zones_mode,
                'country': this.country,
                'level': this.level,
                'lng': lng,
                'lat': lat,
                'search_radius': searchRadius
            }

            Object.keys(queryObj).forEach(key => url.searchParams.append(key, queryObj[key]))

            let response = await fetch(url);

            showLoading(false);

            if (!response.ok) throw new Error("HTTP-Error: " + response.status);

            return await response.json();

        }

        const apiResponseToFeatures = (djiJson) => {

            let areas = djiJson.areas;
            let features = [];

            if (!areas.length) return false;

            for (let area of areas) {

                // If the feature already exists, continue
                if (this.source.getFeatureById(area.area_id)) {
                    continue;
                }

                const feature = new Feature({
                    name: area.name,
                    shape: area.shape,
                    level: area.level,
                    radius: area.radius,
                    color: area.color,
                    country: area.country,
                    geometry: new Point([area.lng, area.lat]).transform('EPSG:4326', this.projection)
                });

                // Store the id to avoid duplicates
                feature.setId(area.area_id)

                if (area.sub_areas) {

                    area.sub_areas.forEach(sub_area => {

                        let subFeature;

                        if (sub_area.polygon_points) {

                            subFeature = new Feature({
                                radius: sub_area.radius,
                                height: sub_area.height,
                                color: sub_area.color,
                                level: sub_area.level,
                                shape: sub_area.shape,
                                geometry:
                                    new Polygon(
                                        sub_area.polygon_points
                                    ).transform('EPSG:4326', this.projection)
                            });

                        } else {

                            subFeature = new Feature({
                                radius: sub_area.radius,
                                height: sub_area.height,
                                color: sub_area.color,
                                level: sub_area.level,
                                shape: sub_area.shape,
                                geometry:
                                    new Circle(
                                        [sub_area.lng, sub_area.lat],
                                        sub_area.radius / 100000
                                    ).transform('EPSG:4326', this.projection)
                            });

                        }

                        subFeature.setId(sub_area.area_id);
                        features.push(subFeature);

                    })
                }

                features.push(feature);

            }

            return features;
        }

        const getPointInfo = (latLng, searchRadius) => {

            // Prevent multiples requests
            this.idInfoRequest += 1;
            let request = this.idInfoRequest;

            setTimeout(async _ => {

                if (request == this.idInfoRequest) {
                    try {

                        let data = await apiRequest('info', latLng, searchRadius);
                        console.log(data);

                    } catch (err) {
                        showLoading(false);
                        console.error(err);
                    }
                }

            }, 100);

        }

        const getAreas = (centerLatLng, searchRadius, clear) => {

            // Prevent multiples requests
            this.idAreasRequest += 1;
            let request = this.idAreasRequest;

            // Original DJI map same behavior to prevent multiples requests
            setTimeout(async _ => {

                if (request == this.idAreasRequest) {
                    try {

                        if (clear) {
                            this.areaDownloaded = null; // Remove area already downloaded
                        }

                        let extent = this.view.calculateExtent();
                        let polygon = fromExtent(extent);

                        if (this.areaDownloaded) {

                            if (this.areaDownloaded.intersectsCoordinate(getCenter(extent)) &&
                                this.areaDownloaded.intersectsCoordinate(getBottomLeft(extent)) &&
                                this.areaDownloaded.intersectsCoordinate(getTopRight(extent)) &&
                                this.areaDownloaded.intersectsCoordinate(getBottomRight(extent)) &&
                                this.areaDownloaded.intersectsCoordinate(getTopLeft(extent))) {
                                return;
                            }

                        }

                        if (!this.areaDownloaded) {
                            this.areaDownloaded = new MultiPolygon({});
                        }

                        this.areaDownloaded.appendPolygon(polygon);

                        let data = await apiRequest('areas', centerLatLng, searchRadius);

                        if (clear) {
                            this.source.clear(); // Remove features on layer
                        }

                        let features = apiResponseToFeatures(data);
                        this.source.addFeatures(features);
                        // console.log(data);
                        // console.log(features);
                    } catch (err) {
                        showLoading(false);
                        console.error(err);
                    }
                }

            }, 300);
        }

        if (!this.isVisible) return;

        let searchRadius = getMapRadius(latLng);

        if (type === 'areas')
            getAreas(latLng, searchRadius, clear);
        else
            getPointInfo(latLng, searchRadius);

    }

}

// https://stackoverflow.com/questions/28004153/setting-vector-feature-fill-opacity-when-you-have-a-hexadecimal-color
function colorWithAlpha(color, alpha = 1) {
    const [r, g, b] = Array.from(asArray(color));
    return asString([r, g, b, alpha]);
}