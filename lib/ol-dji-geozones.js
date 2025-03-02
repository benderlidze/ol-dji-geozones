/*!
 * ol-dji-geozones - v2.2.2
 * https://github.com/GastonZalba/ol-dji-geozones#readme
 * Built: Mon Sep 04 2023 13:12:05 GMT-0300 (hora estándar de Argentina)
*/
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Feature from 'ol/Feature.js';
import Overlay from 'ol/Overlay.js';
import { transform, transformExtent } from 'ol/proj.js';
import { getDistance } from 'ol/sphere.js';
import Polygon, { fromExtent } from 'ol/geom/Polygon.js';
import MultiPolygon from 'ol/geom/MultiPolygon.js';
import Point from 'ol/geom/Point.js';
import Circle from 'ol/geom/Circle.js';
import BaseEvent from 'ol/events/Event.js';
import Style from 'ol/style/Style.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Icon from 'ol/style/Icon.js';
import Control from 'ol/control/Control.js';
import { asArray, asString } from 'ol/color.js';
import { buffer, getCenter, getBottomLeft, getTopRight, getBottomRight, getTopLeft } from 'ol/extent.js';
import { unByKey } from 'ol/Observable.js';

var levelsParams = [
	{
		id: 0,
		color: "#FFCC00",
		zIndex: 11,
		markerIcon: "https://www1.djicdn.com/dps/6734f5340f66c7be37db48c8889392bf.png",
		markerCircle: "https://www2.djicdn.com/assets/images/flysafe/geo-system/warning-98a8a2c8d6768e22957488ce962d77c3.png?from=cdnMap"
	},
	{
		id: 1,
		color: "#1088F2",
		zIndex: 13,
		markerIcon: "https://www1.djicdn.com/dps/fbbea9e33581907cac182adb4bcd0c94.png",
		markerCircle: "https://www4.djicdn.com/assets/images/flysafe/geo-system/authorization-878e879982c9555bcaab7bb6bce3c6ca.png?from=cdnMap"
	},
	{
		id: 2,
		color: "#DE4329",
		zIndex: 15,
		markerIcon: "https://www1.djicdn.com/dps/d47dfe9f089f259631fbed99610b8b5a.png",
		markerCircle: "https://www5.djicdn.com/assets/images/flysafe/geo-system/restricted-e0ce1467a8df2d07ec6a33cf11f4279e.png?from=cdnMap"
	},
	{
		id: 3,
		color: "#EE8815",
		zIndex: 12,
		markerIcon: "https://www1.djicdn.com/dps/df822149e1e6e9e804e177813e044238.png",
		markerCircle: "https://www4.djicdn.com/assets/images/flysafe/geo-system/enhanced_warning-623fea05bff2f83f3c0ff5a65a41a1df.png?from=cdnMap"
	},
	{
		id: 4,
		color: "#37C4DB",
		zIndex: 11,
		markerIcon: "https://www1.djicdn.com/dps/53b33783709b6ed06bc3afdd21ac2a81.png",
		markerCircle: "https://www4.djicdn.com/assets/images/flysafe/geo-system/recommended-e92f991d039ae145c9b1c72ad62b26b2.png?from=cdnMap"
	},
	{
		id: 5,
		color: "#00BE00",
		zIndex: 11,
		markerIcon: "https://www1.djicdn.com/dps/53b33783709b6ed06bc3afdd21ac2a81.png",
		markerCircle: "https://www4.djicdn.com/assets/images/flysafe/geo-system/recommended-e92f991d039ae145c9b1c72ad62b26b2.png?from=cdnMap"
	},
	{
		id: 6,
		color: "#979797",
		zIndex: 10,
		markerIcon: "https://www1.djicdn.com/dps/f5961991d664e130fcf9ad01b1f28043.png",
		markerCircle: "https://www1.djicdn.com/assets/images/flysafe/geo-system/Oval-34907c1071d63a3f1fffdc739b0943d9.png?from=cdnMap"
	},
	{
		id: 7,
		color: "#00BE00",
		zIndex: 11,
		markerIcon: "https://www1.djicdn.com/dps/9d922ae5fbd80d3166a844a9e249ceb3.png",
		markerCircle: "https://www1.djicdn.com/assets/images/flysafe/geo-system/regulations-2dfeef5b11017811dcaa720c86c49406.png?from=cdnMap"
	},
	{
		id: 8,
		color: "#00BE00",
		zIndex: 11,
		markerIcon: "https://www1.djicdn.com/dps/53b33783709b6ed06bc3afdd21ac2a81.png",
		markerCircle: "https://www1.djicdn.com/dps/a968914208241c3f6a5a3c64c221b8ff.png"
	},
	{
		id: 9,
		color: "#DE4329",
		zIndex: 15,
		markerIcon: "https://www1.djicdn.com/dps/d47dfe9f089f259631fbed99610b8b5a.png",
		markerCircle: "https://www5.djicdn.com/assets/images/flysafe/geo-system/restricted-e0ce1467a8df2d07ec6a33cf11f4279e.png?from=cdnMap"
	}
];

var dronesList = [
	{
		id: "dji-flycart-30",
		label: "DJI FlyCart 30"
	},
	{
		id: "dji-air-3",
		label: "DJI Air 3"
	},
	{
		id: "m350-rtk",
		label: "M350 RTK"
	},
	{
		id: "dji-mavic-3-pro",
		label: "DJI Mavic 3 Pro"
	},
	{
		id: "inspire-3",
		label: "Inspire 3"
	},
	{
		id: "dji-mini-3",
		label: "DJI Mini 3"
	},
	{
		id: "dji-mavic-3-classic",
		label: "DJI Mini 3 Classic"
	},
	{
		id: "industry-260",
		label: "Mavic 3E/3T"
	},
	{
		id: "dji-avata",
		label: "Avata"
	},
	{
		id: "dji-mini-3-pro",
		label: "Mini 3 Pro"
	},
	{
		id: "dji-mavic-3",
		label: "Mavic 3"
	},
	{
		id: "dji-mini-se",
		label: "Mavic Mini SE"
	},
	{
		id: "dji-air-2s",
		label: "Air 2s"
	},
	{
		id: "dji-fpv",
		label: "FPV"
	},
	{
		id: "mavic-mini-2",
		label: "Mavic Mini 2"
	},
	{
		id: "mavic-mini",
		label: "Mavic Mini"
	},
	{
		id: "mavic-2-enterprise",
		label: "Mavic 2 Enterprise"
	},
	{
		id: "mavic-2",
		label: "Mavic 2"
	},
	{
		id: "mavic-air",
		label: "Mavic Air"
	},
	{
		id: "mavic-air-2",
		label: "Mavic Air 2"
	},
	{
		id: "mavic-pro",
		label: "Mavic Pro"
	},
	{
		id: "spark",
		label: "Spark"
	},
	{
		id: "phantom-4-pro",
		label: "Phantom 4 Pro"
	},
	{
		id: "phantom-4-advanced",
		label: "Phantom 4 Advanced"
	},
	{
		id: "phantom-4",
		label: "Phantom 4"
	},
	{
		id: "phantom-4-rtk",
		label: "Phantom 4 RTK"
	},
	{
		id: "phantom-4-multispectral",
		label: "Phantom 4 Multispectral"
	},
	{
		id: "phantom-3-pro",
		label: "Phantom 3 Pro"
	},
	{
		id: "phantom-3-advanced",
		label: "Phantom 3 Advanced"
	},
	{
		id: "phantom-3-standard",
		label: "Phantom 3 Standard"
	},
	{
		id: "phantom-3-4K",
		label: "Phantom 3 4K"
	},
	{
		id: "phantom-3-se",
		label: "Phantom 3 SE"
	},
	{
		id: "inspire-2",
		label: "Inspire 2"
	},
	{
		id: "inspire-1-series",
		label: "Inspire 1 Series"
	},
	{
		id: "m200-series",
		label: "M200 Series"
	},
	{
		id: "m300-series",
		label: "M300 Series"
	},
	{
		id: "m600-series",
		label: "M600 Series"
	},
	{
		id: "m100",
		label: "M100"
	},
	{
		id: "mg1p",
		label: "MG 1S/1A/1P/1P RTK/T10/T16/T20/T30"
	},
	{
		id: "dji-mini-2",
		label: "DJI Mini 2"
	}
];

const es = {
    labels: {
        djiGeoZones: 'Zonas Geo DJI',
        level: 'Nivel',
        type: 'Tipo',
        startTime: 'Horario de apertura',
        endTime: 'Horario de cierre',
        timeTips: 'Sistema horario: 24 horas',
        maxAltitude: 'Altitud máxima',
        address: 'Dirección',
        tips: 'Consejos',
        link: 'Enlace',
        learnMore: 'Leer más',
        helperZoom: 'Acerque la vista para ver las Zonas Geo',
        expand: 'Expandir',
        collapse: 'Colapsar',
        hideGeozones: 'Ocultar Zonas Geo',
        showHide: 'Mostrar/Ocultar Zonas Geo'
    },
    levels: [
        {
            id: 0,
            name: 'Zonas de advertencia',
            desc: 'En estas Zonas, que pueden no aparecer necesariamente en el mapa DJI GO, los usuarios recibirán un mensaje de advertencia. Ejemplo de zona de advertencia: espacio aéreo de clase E'
        },
        {
            id: 1,
            name: 'Zonas de autorización',
            desc: 'En estas Zonas, que aparecen en azul en el mapa DJI GO, los usuarios recibirán una advertencia y el vuelo está limitado por defecto. Las zonas de autorización pueden ser desbloqueadas por usuarios autorizados mediante una cuenta verificada por DJI.'
        },
        {
            id: 2,
            name: 'Zonas restringidas',
            desc: 'En estas Zonas, que aparecen en rojo en la aplicación DJI GO, los usuarios recibirán una advertencia y se impedirá el vuelo. Si cree que tiene la autorización para operar en una Zona restringida, comuníquese con flysafe@dji.com o Desbloqueo en línea.'
        },
        {
            id: 3,
            name: 'Zonas de advertencia ampliadas',
            desc: 'En estas Zonas, GEO le pedirá en el momento del vuelo que desbloquee la zona siguiendo los mismos pasos que en una Zona de autorización, pero no necesita una cuenta verificada o una conexión a Internet en el momento de su vuelo.'
        },
        {
            id: 4,
            name: 'Zonas reglamentarias restringidas',
            desc: 'Debido a las regulaciones y políticas locales, los vuelos están prohibidos dentro del alcance de algunas áreas especiales. (Ejemplo: prisión)'
        },
        {
            id: 5,
            name: 'Zonas recomendadas',
            desc: ''
        },
        {
            id: 6,
            name: 'Zonas de altiutud',
            desc: 'Las zonas de altitud aparecerán en gris en el mapa. Los usuarios reciben advertencias en DJI GO o DJI GO 4 y la altitud de vuelo es limitada.'
        },
        {
            id: 7,
            name: 'Zonas recomendadas',
            desc: 'Esta área se muestra en verde en el mapa. Se recomienda que elija estas áreas para los arreglos de vuelo.'
        },
        {
            id: 8,
            name: 'Zonas aprobadas para VANTs livianos (China)',
            desc: 'Para las zonas aprobadas, los pilotos de vehículos aéreos no tripulados ligeros que vuelan a una altitud de 120 mo menos no están obligados a obtener permiso para volar. Los pilotos que planean volar UAV de tamaño mediano en Zonas Aprobadas a una altitud superior a 120 m, o en Zonas GEO distintas de las Zonas Aprobadas, deben obtener permiso a través de UTMISS antes de despegar.'
        },
        {
            id: 9,
            name: 'Áreas densamente pobladas',
            desc: 'Esta área se muestra en rojo en el mapa. En circunstancias normales, la población de esta zona está más concentrada, así que no sobrevuele esta zona. (Ejemplo: bloque comercial)'
        }
    ],
    types: [
        {
            id: 0,
            name: 'Aeropuerto'
        },
        {
            id: 1,
            name: 'Zona especial'
        },
        {
            id: 2,
            name: 'Zona Militar'
        },
        {
            id: 4,
            name: 'Zona recomendada'
        },
        {
            id: 10,
            name: 'Aeropuerto'
        },
        {
            id: 13,
            name: 'Aeropuerto recreacional'
        },
        {
            id: 14,
            name: 'Aeropuerto recreacional'
        },
        {
            id: 15,
            name: 'Espacio aéreo clase B'
        },
        {
            id: 16,
            name: 'Espacio aéreo clase C'
        },
        {
            id: 17,
            name: 'Espacio aéreo clase D'
        },
        {
            id: 18,
            name: 'Espacio aéreo clase E'
        },
        {
            id: 19,
            name: 'Helipuerto'
        },
        {
            id: 23,
            name: 'Planta de energía'
        },
        {
            id: 24,
            name: 'Prisión'
        },
        {
            id: 26,
            name: 'Estadio'
        },
        {
            id: 27,
            name: 'Espacio aéreo prohibido'
        },
        {
            id: 28,
            name: 'Espacio aéreo restringido'
        },
        {
            id: 29,
            name: 'Restricción de vuelo temporal'
        },
        {
            id: 30,
            name: 'Planta de energía nuclear'
        },
        {
            id: 31,
            name: 'Aeropuertos sin pavimentar'
        },
        {
            id: 32,
            name: 'Zonas especiales'
        },
        {
            id: 33,
            name: 'Zonas militares'
        },
        {
            id: 34,
            name: 'Helipuerto'
        },
        {
            id: 35,
            name: 'Base de hidroaviones'
        },
        {
            id: 36,
            name: 'Restricción de vuelo temporal'
        },
        {
            id: 39,
            name: 'Zonas aprobadas para VANTs livianos'
        },
        {
            id: 41,
            name: 'Zonas reglamentarias restringidas para VANTs livianos'
        }
    ]
};

const en = {
    labels: {
        djiGeoZones: 'Dji Geo Zones',
        level: 'Level',
        type: 'Type',
        startTime: 'Start Time',
        endTime: 'End Time',
        timeTips: 'Time: 24-hour clock',
        maxAltitude: 'Max. Altitude',
        address: 'Address',
        tips: 'Tips',
        link: 'Link',
        learnMore: 'Learn More',
        helperZoom: 'Zoom in to see the Geo Zones',
        expand: 'Expand',
        collapse: 'Collapse',
        hideGeozones: 'Hide Geo Zones',
        showHide: 'Show/Hide Geo Zones'
    },
    levels: [
        {
            id: 0,
            name: 'Warning Zones',
            desc: 'In these Zones, which may not necessarily appear on the DJI GO map, users will be prompted with a warning message. Example Warning Zone: Class E airspace'
        },
        {
            id: 1,
            name: 'Authorization Zones',
            desc: 'In these Zones, which appear blue in the DJI GO map, users will be prompted with a warning and flight is limited by default. Authorization Zones may be unlocked by authorized users using a DJI verified account.'
        },
        {
            id: 2,
            name: 'Restricted Zones',
            desc: 'In these Zones, which appear red the DJI GO app, users will be prompted with a warning and flight is prevented. If you believe you have the authorization to operate in a Restricted Zone, please contact flysafe@dji.com or Online Unlocking.'
        },
        {
            id: 3,
            name: 'Enhanced Warning Zones',
            desc: 'In these Zones, you will be prompted by GEO at the time of flight to unlock the zone using the same steps as in an Authorization Zone, but you do not require a verified account or an internet connection at the time of your flight.'
        },
        {
            id: 4,
            name: 'Regulatory Restricted Zones',
            desc: 'Due to local regulations and policies, flights are prohibited within the scope of some special areas. (Example：Prison)'
        },
        {
            id: 5,
            name: 'Recommended Zones',
            desc: ''
        },
        {
            id: 6,
            name: 'Altitude Zones',
            desc: 'Altitude zones will appear in gray on the map. Users receive warnings in DJI GO, or DJI GO 4 and flight altitude is limited.'
        },
        {
            id: 7,
            name: 'Recommended Zones',
            desc: 'This area is shown in green on the map. It is recommended that you choose these areas for flight arrangements.'
        },
        {
            id: 8,
            name: 'Approved Zones for Light UAVs(China)',
            desc: 'For Approved Zones, pilots of light UAVs flying at an altitude of 120 m or less are not required to obtain permission to fly. Pilots who are planning to fly medium-sized UAVs in Approved Zones at an altitude higher than 120 m, or in GEO Zones other than Approved Zones, must obtain permission via UTMISS before taking off'
        },
        {
            id: 9,
            name: 'Densely Populated Area',
            desc: 'This area is shown in red on the map. Under normal circumstances, the population of this area is more concentrated, so please do not fly over this area. (Example: Commercial Block)'
        }
    ],
    types: [
        {
            id: 0,
            name: 'Airport'
        },
        {
            id: 1,
            name: 'Special Zone'
        },
        {
            id: 2,
            name: 'Military Zone'
        },
        {
            id: 4,
            name: 'Recommended Zones'
        },
        {
            id: 10,
            name: 'Airport'
        },
        {
            id: 13,
            name: 'Recreational airport'
        },
        {
            id: 14,
            name: 'Recreational airport'
        },
        {
            id: 15,
            name: 'Class B Airspace'
        },
        {
            id: 16,
            name: 'Class C Airspace'
        },
        {
            id: 17,
            name: 'Class D Airspace'
        },
        {
            id: 18,
            name: 'Class E Airspace'
        },
        {
            id: 19,
            name: 'Heliport'
        },
        {
            id: 23,
            name: 'Power plant'
        },
        {
            id: 24,
            name: 'Prison'
        },
        {
            id: 26,
            name: 'Stadium'
        },
        {
            id: 27,
            name: 'Prohibited Airspace'
        },
        {
            id: 28,
            name: 'Restricted Airspace'
        },
        {
            id: 29,
            name: 'Temporary Flight Restriction'
        },
        {
            id: 30,
            name: 'Nuclear Power Plant'
        },
        {
            id: 31,
            name: 'Unpaved Airports'
        },
        {
            id: 32,
            name: 'Special Zones'
        },
        {
            id: 33,
            name: 'Military Zones'
        },
        {
            id: 34,
            name: 'Heliport'
        },
        {
            id: 35,
            name: 'Seaplane Base'
        },
        {
            id: 36,
            name: 'Temporary Flight Restriction'
        },
        {
            id: 39,
            name: 'Approved Zones for Light UAVs'
        },
        {
            id: 41,
            name: 'Regulatory Restricted Zones for Light UAVs'
        }
    ]
};

var languages = /*#__PURE__*/Object.freeze({
    __proto__: null,
    en: en,
    es: es
});

var img$2 = "data:image/svg+xml,%3csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280.18 280.18'%3e%3cdefs%3e%3cstyle%3e.cls-1%7bfill:%23ffce00%3bfill-opacity:0.68%3bstroke:%23ffce00%3b%7d.cls-1%2c.cls-3%2c.cls-5%2c.cls-6%7bstroke-miterlimit:10%3bstroke-width:0.75px%3b%7d.cls-2%7bfill:%23ff7900%3bfill-opacity:0.46%3b%7d.cls-3%7bfill:%231072d6%3bfill-opacity:0.57%3bstroke:%231072d6%3b%7d.cls-4%7bopacity:0.63%3b%7d.cls-5%7bfill:%23bcbcbc%3bstroke:%23666%3b%7d.cls-6%7bfill:%23fc3424%3bfill-opacity:0.4%3bstroke:%23fc3424%3b%7d%3c/style%3e%3c/defs%3e%3cpath class='cls-1' d='M109.79%2c109.23c-44.68%2c44.68-40.36%2c121.45%2c9.66%2c171.47S246.24%2c335%2c290.92%2c290.36s40.36-121.46-9.65-171.48S154.48%2c64.54%2c109.79%2c109.23ZM270.56%2c270c-34.64%2c34.64-94.15%2c31.29-132.92-7.48s-42.12-98.28-7.48-132.92%2c94.14-31.29%2c132.92%2c7.48S305.2%2c235.36%2c270.56%2c270Z' transform='translate(-59.88 -59.29)'/%3e%3cpath class='cls-2' d='M130.16%2c129.59c-34.64%2c34.64-31.29%2c94.15%2c7.48%2c132.92s98.28%2c42.12%2c132.92%2c7.48%2c31.29-94.14-7.48-132.92S164.79%2c95%2c130.16%2c129.59Zm118%2c118c-24%2c24-64.91%2c22.14-91.29-4.23S128.56%2c176.07%2c152.6%2c152s64.91-22.14%2c91.28%2c4.24S272.15%2c223.51%2c248.12%2c247.55Z' transform='translate(-59.88 -59.29)'/%3e%3cellipse class='cls-3' cx='200.36' cy='199.79' rx='61.55' ry='67.54' transform='translate(-142.47 140.9) rotate(-45)'/%3e%3cg id='Layer_3' data-name='Layer 3'%3e%3cg class='cls-4'%3e%3cpolygon class='cls-5' points='166.25 180 236.66 279.6 236.75 279.51 279.51 236.75 279.6 236.66 180 166.25 166.25 180'/%3e%3cpolygon class='cls-5' points='113.92 100.18 43.51 0.58 43.43 0.67 0.67 43.43 0.58 43.51 100.18 113.92 113.92 100.18'/%3e%3c/g%3e%3cpolygon class='cls-6' points='180 113.92 166.25 100.18 140.09 126.34 113.92 100.18 100.18 113.92 126.34 140.09 100.18 166.25 113.92 180 140.09 153.84 166.25 180 180 166.25 153.84 140.09 180 113.92'/%3e%3c/g%3e%3cg id='Layer_3_copy' data-name='Layer 3 copy'%3e%3cg class='cls-4'%3e%3cpolygon class='cls-5' points='100.18 166.25 0.58 236.66 0.67 236.75 43.43 279.51 43.51 279.6 113.92 180 100.18 166.25'/%3e%3cpolygon class='cls-5' points='180 113.92 279.6 43.51 279.51 43.43 236.75 0.67 236.66 0.58 166.25 100.18 180 113.92'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

var img$1 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3ctitle%3e%3c/title%3e%3cpath d='M352.5 288v-64.5h63v64.5h-63zM384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM352.5 544.5v-192h63v192h-63z'%3e%3c/path%3e%3c/svg%3e";

var img = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath d='M384 288q39 0 67.5 28.5t28.5 67.5-28.5 67.5-67.5 28.5-67.5-28.5-28.5-67.5 28.5-67.5 67.5-28.5zM384 544.5q66 0 113.25-47.25t47.25-113.25-47.25-113.25-113.25-47.25-113.25 47.25-47.25 113.25 47.25 113.25 113.25 47.25zM384 144q118.5 0 214.5 66t138 174q-42 108-138 174t-214.5 66-214.5-66-138-174q42-108 138-174t214.5-66z'%3e%3c/path%3e%3c/svg%3e";

/**
 * @protected
 */
const API_AREAS_ENDPOINT = 'https://www-api.dji.com/api/geo/areas';
const API_INFO_ENDPOINT = 'https://www-api.dji.com/api/geo/point-info';
const API_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // request all the levels, we filter later to avoid some api problems
const MIN_ZOOM = 9; // < 9 breaks the API
const HIDDEN_CLASS = 'ol-dji-geozones--ctrl-toggle-hidden';
const DEFAULT_LANGUAGE = 'en';
const controlElement = document.createElement('div');
/**
 * OpenLayers Dji Geozones, creates multiples VectorLayers to
 * display interactives DJI Geo Zones on the map, requesting the
 * data on the fly to an DJI API.
 *
 * Also, add a Control to select levels of interest and drone to filter the results.
 * @fires init
 * @fires error
 * @constructor
 * @extends {ol/control/Control~Control}
 * @param opt_options DjiGeozones options, see [DjiGeozones Options](#options) for more details.
 */
class DjiGeozones extends Control {
    constructor(opt_options) {
        super({
            target: opt_options.target,
            element: controlElement
        });
        this._featuresIdList = new Set();
        this._onError = (err) => {
            this.hide();
            if (err.message)
                console.error(err);
        };
        this._options = Object.assign({ urlProxy: '', buffer: 10000, drone: 'spark', zonesMode: 'total', country: 'US', showGeozoneIcons: true, displayLevels: [2, 6, 1, 0, 3, 4, 7], activeLevels: [2, 6, 1, 0, 3, 4, 7], createPanel: 'full', target: null, startCollapsed: false, startActive: true, dronesToDisplay: dronesList, extent: null, loadingElement: '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>', clickEvent: 'singleclick', language: DEFAULT_LANGUAGE, alert: null }, (opt_options || {}));
        // If language selector is provided and translation exists...
        this._i18n =
            languages[this._options.language in languages
                ? this._options.language
                : DEFAULT_LANGUAGE];
        // Merge custom translations
        this._i18n = deepObjectAssign(this._i18n, opt_options.i18n || {});
        this._paramsLevels = levelsParams;
        // By default, we use the properties features to show in the popup.
        // The official DJI map, makes an extra request to another API to get the data. I don't understand why.
        // It's more slow and requieres extra requests to an already downloaded data...
        // Either way, this extra API calls are supported if you want.
        this._useApiForPopUp = false;
        this._hideGeozones = true;
        this._isVisible = false;
        this._layers = [];
        this.divControl = null;
        this._areaDownloaded = null;
        this.on('error', this._onError);
    }
    /**
     * Remove the control from its current map and attach it to the new map.
     * Pass null to just remove the control from the current map.
     * @param map
     * @public
     */
    setMap(map) {
        super.setMap(map);
        if (map) {
            if (this._options.createPanel) {
                this._createPanel(this._options.createPanel, this._options.startCollapsed);
            }
            if (this._options.startActive) {
                this.show();
            }
        }
        else {
            if (super.getMap()) {
                controlElement.remove();
                this.destroy();
            }
        }
    }
    /**
     * Initialize the layers and events.
     * This function is called once only if the control is activated.
     *
     * @fires init
     * @private
     */
    _initialize() {
        this._map = super.getMap();
        this._view = this._map.getView();
        this._projection = this._view.getProjection();
        /**
         * Create and add a Vector Layer for each level
         * @protected
         */
        const createVectorLayers = () => {
            /**
             * Create the style of each layer acoording to the geometry,
             * level, and color obtained from the API
             *
             * @param feature
             * @protected
             */
            const styleFunction = (feature) => {
                const geom = feature.getGeometry();
                const level = feature.get('level');
                const levelParams = this._getLevelParamsById(level);
                let style;
                if (geom instanceof Polygon || geom instanceof Circle) {
                    const color = feature.get('color');
                    style = new Style({
                        fill: new Fill({
                            color: DjiGeozones.colorWithAlpha(color, 0.3)
                        }),
                        stroke: new Stroke({
                            color: color,
                            width: 1
                        }),
                        zIndex: levelParams.zIndex
                    });
                }
                else if (geom instanceof Point) {
                    style = new Style({
                        image: new Icon({
                            src: levelParams.markerIcon,
                            scale: 0.35,
                            anchor: [0.5, 0.9],
                            crossOrigin: 'anonymous'
                        }),
                        zIndex: levelParams.zIndex * 2
                    });
                }
                return style;
            };
            API_LEVELS.forEach((level) => {
                const source = new VectorSource({
                    attributions: '<a href="https://www.dji.com/flysafe/geo-map" rel="nofollow noopener noreferrer" target="_blank">DJI GeoZoneMap</a>'
                });
                const props = {
                    source,
                    name: 'ol-dji-geozones',
                    level: level,
                    zIndex: this._getLevelParamsById(level).zIndex * 2,
                    visible: this._hideGeozones
                        ? false
                        : this.activeLevels.includes(level)
                            ? true
                            : false,
                    style: styleFunction
                };
                if (this._options.extent)
                    props['extent'] = this._options.extent;
                const layer = new VectorLayer(props);
                source.on('removefeature', ({ feature }) => {
                    const featureId = feature.getId() || feature.get('areaId');
                    this._featuresIdList.delete(String(featureId));
                });
                this._map.addLayer(layer);
                this._layers.push(layer);
            });
        };
        /**
         * Create the PopUp element and add it to an Overlay
         * @protected
         */
        const createPopUpOverlay = () => {
            const popupContainer = document.createElement('div');
            popupContainer.id = 'ol-dji-geozones--popup';
            popupContainer.className = `ol-dji-geozones--ol-popup ol-dji-geozones--${this._options.theme}`;
            this.popupContent = document.createElement('div');
            this.popupContent.id = 'ol-dji-geozones--popup-content';
            this.popupContent.className = 'ol-dji-geozones--ol-popup-content';
            const popupCloser = document.createElement('a');
            popupCloser.id = 'ol-dji-geozones--popup-closer';
            popupCloser.className = 'ol-dji-geozones--ol-popup-closer';
            popupCloser.href = '#';
            popupCloser.onclick = () => {
                this._overlay.setPosition(undefined);
                popupCloser.blur();
                return false;
            };
            popupContainer.append(popupCloser);
            popupContainer.append(this.popupContent);
            this._overlay = new Overlay({
                element: popupContainer,
                autoPan: {
                    animation: {
                        duration: 250
                    }
                }
            });
            this._map.addOverlay(this._overlay);
        };
        createVectorLayers();
        createPopUpOverlay();
        this._initialized = true;
        super.dispatchEvent('init');
    }
    /**
     * Create a control panel in the map
     *
     * @param createPanel
     * @param startCollapsed
     * @private
     */
    _createPanel(createPanel, startCollapsed) {
        /**
         * Add the 'full' control panel to the viewport map or custom target.
         * This displays each level as a layer, with the possibility to activate or deactivate each one,
         * color legends and a drone switcher.
         *
         * @protected
         */
        const addMapControlFull = () => {
            const createDroneSelector = () => {
                const handleChange = ({ target }) => {
                    this.drone =
                        target.value ||
                            target.options[target.selectedIndex].value;
                    this._getInfoFromView(/* clear = */ true);
                };
                const droneSelector = document.createElement('div');
                droneSelector.className = 'ol-dji-geozones--drone-selector';
                const select = document.createElement('select');
                select.onchange = handleChange;
                if (!this._isVisible)
                    select.setAttribute('disabled', 'disabled');
                let options = '';
                this.dronesToDisplay.forEach((drone) => {
                    const selected = this.drone === drone.id ? 'selected' : '';
                    options += `<option value="${drone.id}" ${selected}>${drone.label}</option>`;
                });
                select.innerHTML = options;
                droneSelector.append(select);
                return droneSelector;
            };
            const createLevelSelector = () => {
                const handleClick = ({ target }) => {
                    const level = Number(target.value);
                    if (target.checked) {
                        this.addLevels(level);
                    }
                    else {
                        this.removeLevels(level);
                    }
                };
                const createLegend = (color) => {
                    const span = document.createElement('span');
                    span.className = 'ol-dji-geozones--mark';
                    span.style.border = `1px ${color} solid`;
                    span.style.backgroundColor = DjiGeozones.colorWithAlpha(color, 0.4);
                    return span;
                };
                const createLabel = (label, name, color) => {
                    const labelEl = document.createElement('label');
                    labelEl.htmlFor = name;
                    labelEl.append(createLegend(color));
                    labelEl.append(label);
                    return labelEl;
                };
                const createCheckbox = (name, value, disabled) => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = name;
                    checkbox.id = name;
                    checkbox.value = String(value);
                    checkbox.onclick = handleClick;
                    if (this.activeLevels.indexOf(value) !== -1)
                        checkbox.checked = true;
                    if (disabled)
                        checkbox.disabled = true;
                    return checkbox;
                };
                const createLevelItem = (value, { name, desc, color }) => {
                    const disabled = !this._isVisible;
                    const id = 'level' + value;
                    const divContainer = document.createElement('div');
                    divContainer.className = `ol-dji-geozones--item-ctl ol-dji-geozones--item-ctl-${value}`;
                    divContainer.title = desc;
                    // divContainer.setAttribute('style', `--level-color: ${color}`);
                    // divContainer.setAttribute('data-geotooltip', desc);
                    divContainer.setAttribute('data-level', String(value));
                    divContainer.append(createCheckbox(id, value, disabled));
                    divContainer.append(createLabel(name, id, color));
                    return divContainer;
                };
                const levelSelector = document.createElement('div');
                levelSelector.className = 'ol-dji-geozones--level-selector';
                this._options.displayLevels.forEach((lev) => {
                    const level = createLevelItem(lev, this.getLevelById(lev));
                    levelSelector.append(level);
                });
                return levelSelector;
            };
            const createButtonCollapser = () => {
                const button = document.createElement('button');
                button.className =
                    'ol-dji-geozones--collapse ol-dji-geozones--btn-sm';
                button.title = this._i18n.labels.collapse;
                button.onclick = () => this.setPanelCollapsed(true);
                return button;
            };
            const createButtonVisibility = () => {
                const button = document.createElement('button');
                button.className =
                    'ol-dji-geozones--visibility ol-dji-geozones--btn-sm';
                button.title = this._i18n.labels.hideGeozones;
                button.innerHTML = `<img src="${img}"/>`;
                button.onclick = () => {
                    this.hide();
                };
                return button;
            };
            this.divControl.classList.add('ol-dji-geozones--ctrl-full');
            this.divControl.innerHTML = `
            <header>
                <h3>${this._i18n.labels.djiGeoZones}</h3>
                <span class="ol-dji-geozones--loading">
                    ${this._options.loadingElement}
                </span>
            </header>
            <main>
                <section class="ol-dji-geozones--selectors"></section>
                <section>
                    <div class="ol-dji-geozones--logo" title="${this._i18n.labels.expand}"><img src="${img$2}"/></div>
                    <span class="ol-dji-geozones--advice">${this._i18n.labels.helperZoom}</span>
                </section>
            </main>
            `;
            const droneSelector = createDroneSelector();
            this.divControl
                .querySelector('.ol-dji-geozones--selectors')
                .append(droneSelector);
            const levelSelector = createLevelSelector();
            this.divControl
                .querySelector('.ol-dji-geozones--selectors')
                .append(levelSelector);
            const buttonCollapse = createButtonCollapser();
            this.divControl.querySelector('header').append(buttonCollapse);
            const buttonVisibility = createButtonVisibility();
            this.divControl.querySelector('header').append(buttonVisibility);
            const logo = this.divControl.querySelector('.ol-dji-geozones--logo');
            logo.onclick = () => {
                if (this.divControl.classList.contains(HIDDEN_CLASS)) {
                    this.show();
                }
                this.setPanelCollapsed(false);
            };
        };
        /**
         * Add the 'compact' control panel to the viewport map or custom target.
         * This is a simple Toggler to activate/deactivate the Geozones
         *
         * @param targetPanel If provided, the panel wil be rendered outside the viewport
         * @protected
         */
        const addMapControlCompact = () => {
            this.divControl.classList.add('ol-dji-geozones--ctrl-compact');
            this.divControl.innerHTML = `
            <header>
                <span class="ol-dji-geozones--loading">
                    ${this._options.loadingElement}
                </span>
            </header>
            <main>
                <section>
                    <div class="ol-dji-geozones--logo" title="${this._i18n.labels.showHide}"><img src="${img$2}"/></div>
                </section>
            </main>
            `;
            const logo = this.divControl.querySelector('.ol-dji-geozones--logo');
            logo.onclick = () => {
                const hiddenClass = 'ol-dji-geozones--ctrl-toggle-hidden';
                if (this.divControl.classList.contains(hiddenClass)) {
                    this.show();
                }
                else {
                    this.hide();
                }
            };
        };
        this.divControl = controlElement;
        this.divControl.className = `ol-dji-geozones ol-control ol-dji-geozones--${this._options.theme}`;
        if (this._hideGeozones) {
            this.divControl.classList.add('ol-dji-geozones--ctrl-toggle-hidden');
        }
        else {
            if (!this._isVisible) {
                this.divControl.classList.add('ol-dji-geozones--ctrl-disabled');
            }
        }
        if (startCollapsed) {
            this.divControl.classList.add('ol-dji-geozones--ctrl-collapsed');
        }
        if (createPanel === true || createPanel === 'full') {
            addMapControlFull();
        }
        else if (createPanel === 'compact') {
            addMapControlCompact();
        }
        else {
            return;
        }
    }
    /**
     * @private
     */
    _setLayersVisible(bool) {
        this.layers.forEach((layer) => {
            if (!bool) {
                layer.setVisible(bool);
            }
            else if (bool && this.activeLevels.includes(layer.get('level'))) {
                layer.setVisible(bool);
            }
        });
    }
    /**
     * Enable or disable the inputs and the select in the control
     * @private
     */
    _setControlEnabled(enabled) {
        if (!this.divControl)
            return;
        const changeState = (array) => {
            array.forEach((el) => {
                if (enabled) {
                    el.removeAttribute('disabled');
                }
                else {
                    el.disabled = true;
                }
            });
        };
        if (enabled) {
            this.divControl.classList.remove('ol-dji-geozones--ctrl-disabled');
        }
        else {
            this.divControl.classList.add('ol-dji-geozones--ctrl-disabled');
        }
        const inputs = this.divControl.querySelectorAll('input');
        changeState(inputs);
        const selects = this.divControl.querySelectorAll('select');
        changeState(selects);
    }
    /**
     *
     * @param evt
     * @param type
     * @protected
     */
    async _getPointInfoFromClick(evt, type) {
        const infoKeys = [
            'name',
            'level',
            'type',
            'height',
            'shape',
            'start_at',
            'end_at',
            'url',
            'address',
            'description'
        ];
        let idInfoRequest = 0;
        const getInfoFromApiLatLng = async (coordinate) => {
            // Prevent multiples requests
            idInfoRequest += 1;
            const request = idInfoRequest;
            return new Promise((resolve) => {
                setTimeout(async () => {
                    if (request !== idInfoRequest)
                        return;
                    const center4326 = transform(coordinate, this._projection, 'EPSG:4326');
                    const clickLatLng = {
                        lat: center4326[1],
                        lng: center4326[0]
                    };
                    const apiJson = await this._getApiGeoData('info', clickLatLng);
                    const areas = apiJson.areas;
                    if (!areas.length)
                        resolve(false);
                    const featuresProps = [];
                    for (const area of areas) {
                        featuresProps.push(area);
                    }
                    resolve(featuresProps);
                }, 100);
            });
        };
        /**
         *
         * @param features
         * @protected
         */
        const getInfoFromFeatures = (features) => {
            const featuresProps = [];
            features.forEach((feature) => {
                const props = {};
                infoKeys.forEach((key) => (props[key] = feature.get(key)));
                featuresProps.push(props);
            });
            return featuresProps;
        };
        const showGeozoneDataInPopUp = (geozonesData, coordinates) => {
            const createTooltip = (level) => {
                const getPos = (el) => {
                    return el.getBoundingClientRect();
                };
                let evtKey;
                const showPopUp = () => {
                    infoTooltip.style.position = 'fixed';
                    const position = getPos(iconTooltip);
                    infoTooltip.style.top = position.top + 'px';
                    infoTooltip.style.left = position.left + 'px';
                    infoTooltip.classList.add('ol-dji-geozones--active-tooltip');
                    evtKey = this._map.once('movestart', () => closePopUp());
                    document.body.append(infoTooltip);
                };
                const closePopUp = () => {
                    infoTooltip.classList.remove('ol-dji-geozones--active-tooltip');
                    unByKey(evtKey);
                    container.append(infoTooltip);
                };
                const infoTooltip = document.createElement('span');
                infoTooltip.className = `ol-dji-geozones--info ol-dji-geozones--${this._options.theme}`;
                infoTooltip.innerHTML = `<span class="ol-dji-geozones--info-text">${level.desc}</span><span class="ol-dji-geozones--info-back"></span>`;
                infoTooltip.setAttribute('style', `--level-color: ${level.color}`);
                const iconTooltip = document.createElement('span');
                iconTooltip.className = 'ol-dji-geozones--icon';
                iconTooltip.innerHTML = `<img src="${img$1}">`;
                iconTooltip.onmouseover = () => showPopUp();
                iconTooltip.onclick = () => showPopUp();
                iconTooltip.onmouseout = () => closePopUp();
                const container = document.createElement('div');
                container.className = 'ol-dji-geozones--tooltip';
                container.append(iconTooltip);
                container.append(infoTooltip);
                return container;
            };
            const parseDataToHtml = (responseApiArea) => {
                var _a;
                const { name, level, type, height, description, begin_at, end_at, address, url } = responseApiArea;
                const levelValues = this.getLevelById(level);
                const lbl = this._i18n.labels;
                const typeName = (_a = this._getGeozoneTypeById(type)) === null || _a === void 0 ? void 0 : _a.name;
                const html = `
                    <div class="ol-dji-geozones--marker">
                        <img src="${levelValues.markerCircle}">
                    </div>
                    <div class="ol-dji-geozones--main">
                        <h3 class="ol-dji-geozones--title">${name}</h3>
                        <p class="ol-dji-geozones--level">${lbl.level}: ${levelValues.name} </p>
                    ${typeName
                    ? `<p class="ol-dji-geozones--type">
                        ${lbl.type}: ${typeName}
                    </p>`
                    : ''}                     
                        ${begin_at
                    ? `<p class="ol-dji-geozones--start_time">${lbl.startTime}: ${begin_at}</p>`
                    : ''}
                        ${end_at
                    ? `<p class="ol-dji-geozones--end_time">${lbl.endTime}: ${end_at}</p><p class="ol-dji-geozones--time_tips">${lbl.timeTips}</p>`
                    : ''}         
                        ${height
                    ? `<p class="ol-dji-geozones--height">${lbl.maxAltitude} (m): ${height}</p>`
                    : ''} 
                        ${address
                    ? `<p class="ol-dji-geozones--address">${lbl.address}: ${address}</p>`
                    : ''}
                        ${description
                    ? `<p class="ol-dji-geozones--desc">${lbl.tips}: ${description}</p>`
                    : ''}
                        ${url
                    ? `<p class="ol-dji-geozones--url">${lbl.link}: <a href="${url}">${lbl.learnMore}</a></p>`
                    : ''}
                </div>`;
                const item = document.createElement('div');
                item.className = 'ol-dji-geozones--item';
                item.innerHTML = html;
                item.querySelector('.ol-dji-geozones--level').append(createTooltip(levelValues));
                return item;
            };
            const preventDuplicates = [];
            const arrGeozonesData = Array.isArray(geozonesData)
                ? geozonesData
                : [geozonesData];
            this.popupContent.innerHTML = '';
            arrGeozonesData.forEach((geozoneProps) => {
                const element = parseDataToHtml(geozoneProps);
                // The oficial DJI map show duplicates, but we don't want that
                if (preventDuplicates.indexOf(element.innerHTML) === -1) {
                    preventDuplicates.push(element.innerHTML);
                    this.popupContent.append(element);
                    this.popupContent.append(document.createElement('HR'));
                }
            });
            this._overlay.setPosition(coordinates);
        };
        try {
            if (!this._isVisible) {
                this._overlay.setPosition(undefined);
                return;
            }
            const opt_options = {
                layerFilter: (layer) => layer.get('name') === 'ol-dji-geozones'
            };
            let data;
            // Call the API  to download the information
            if (type === 'useApiForPopUp') {
                if (this._map.hasFeatureAtPixel(evt.pixel, opt_options)) {
                    this.popupContent.innerHTML =
                        this._options.loadingElement.toString();
                    this._overlay.setPosition(evt.coordinate);
                    data = await getInfoFromApiLatLng(evt.coordinate);
                }
                // Use the previously downloaded features information
            }
            else {
                const features = this._map.getFeaturesAtPixel(evt.pixel, opt_options);
                if (features && features.length) {
                    data = getInfoFromFeatures(features);
                }
            }
            if (data && data.length)
                showGeozoneDataInPopUp(data, evt.coordinate);
            else
                this._overlay.setPosition(undefined);
        }
        catch (err) {
            console.log(err);
        }
    }
    /**
     *
     * @param clear
     * @protected
     */
    _getInfoFromView(clear = false) {
        let idAreasRequest = 0;
        /**
         * The level parameter returned by the API is sometimes wrong (2 != 6),
         * so wee need to fixed using the color.
         * Last checked: 2023-04-16
         * @param feature
         * @protected
         */
        const fixLevelValue = (feature) => {
            const color = feature.get('color');
            const level = Object.keys(this._paramsLevels).find((key) => this._paramsLevels[key].color === color);
            feature.set('level', level, /* silent */ true);
            return feature;
        };
        /**
         * Parse the json response of the API an create Open Layers features.
         * @param djiJson
         * @protected
         */
        const apiResponseToFeatures = (djiJson) => {
            const areas = djiJson.areas;
            if (!areas || !areas.length)
                return false;
            const features = [];
            for (const area of areas) {
                // If the feature already exists, continue
                if (this._featuresIdList.has(String(area.area_id))) {
                    continue;
                }
                const featureProps = {
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
                };
                // Only a few of "areas" come with polygons
                if (area.polygon_points) {
                    const featureExtra = new Feature(Object.assign(Object.assign({}, featureProps), { geometry: new Polygon(area.polygon_points).transform('EPSG:4326', this._projection) }));
                    featureExtra.setId(area.area_id + '_poly');
                    features.push(fixLevelValue(featureExtra));
                }
                this._featuresIdList.add(String(area.area_id));
                if (this._options.showGeozoneIcons) {
                    const feature = new Feature(Object.assign(Object.assign({}, featureProps), { geometry: new Point([area.lng, area.lat]).transform('EPSG:4326', this._projection) }));
                    // Store the id to avoid duplicates
                    feature.setId(area.area_id);
                    features.push(fixLevelValue(feature));
                }
                if (area.sub_areas) {
                    area.sub_areas.forEach((sub_area) => {
                        let subFeature;
                        if (sub_area.polygon_points) {
                            subFeature = new Feature({
                                color: sub_area.color,
                                height: sub_area.height,
                                level: sub_area.level,
                                name: area.name,
                                radius: sub_area.radius,
                                shape: sub_area.shape,
                                type: area.type,
                                lng: sub_area.lng,
                                lat: sub_area.lat,
                                geometry: new Polygon(sub_area.polygon_points).transform('EPSG:4326', this._projection)
                            });
                        }
                        else {
                            subFeature = new Feature({
                                color: sub_area.color,
                                height: sub_area.height,
                                level: sub_area.level,
                                name: area.name,
                                radius: sub_area.radius,
                                shape: sub_area.shape,
                                type: area.type,
                                lng: sub_area.lng,
                                lat: sub_area.lat,
                                geometry: new Circle([sub_area.lng, sub_area.lat], sub_area.radius / 100000).transform('EPSG:4326', this._projection)
                            });
                        }
                        subFeature.set('areaId', area.area_id);
                        features.push(fixLevelValue(subFeature));
                    });
                }
            }
            return features;
        };
        /**
         *
         * @param features
         * @protected
         */
        const addFeaturesToEachLevel = (features) => {
            if (!features)
                return;
            features.forEach((feature) => {
                const level = feature.get('level');
                const layer = this.getLayerByLevel(level);
                layer.getSource().addFeature(feature);
            });
        };
        /**
         * Clear all the elements in the Dji Geozones layers
         * @protected
         */
        const clearFeatures = () => {
            this.layers.forEach((layer) => {
                layer.getSource().clear();
            });
        };
        // Prevent multiples requests
        idAreasRequest += 1;
        const request = idAreasRequest;
        // Original DJI map same behavior to prevent multiples requests
        setTimeout(async () => {
            if (request !== idAreasRequest)
                return;
            try {
                this._showLoading(true);
                const center = this._view.getCenter();
                const center4326 = transform(center, this._projection, 'EPSG:4326');
                const viewLatLng = {
                    lat: center4326[1],
                    lng: center4326[0]
                };
                if (clear) {
                    this._areaDownloaded = null; // Remove area already downloaded
                }
                const data = await this._getApiGeoData('areas', viewLatLng);
                if (data) {
                    if (clear)
                        clearFeatures();
                    const features = apiResponseToFeatures(data);
                    if (features)
                        addFeaturesToEachLevel(features);
                    // console.log(data);
                }
            }
            catch (err) {
                this.dispatchEvent(new ErrorEvent(err));
            }
            this._showLoading(false);
        }, 300);
    }
    /**
     * Controller for the API rquests.
     * @param typeApiRequest
     * @param latLng
     * @protected
     */
    async _getApiGeoData(typeApiRequest, latLng) {
        const apiRequest = async (typeApiRequest, { lng, lat }, searchRadius) => {
            const api_endpoint = typeApiRequest === 'areas'
                ? API_AREAS_ENDPOINT
                : API_INFO_ENDPOINT;
            // If not proxy is passed, make a direct request
            // Maybe in the future the api will has updated CORS restrictions
            const url = new URL(api_endpoint);
            const queryObj = {
                drone: this.drone,
                zones_mode: this.zonesMode,
                country: this.country,
                level: API_LEVELS,
                lng: lng,
                lat: lat,
                search_radius: searchRadius
            };
            Object.keys(queryObj).forEach((key) => url.searchParams.append(key, queryObj[key]));
            const finalUrl = this._options.urlProxy
                ? this._options.urlProxy + encodeURIComponent(url.toString())
                : url.toString();
            const response = await fetch(finalUrl);
            if (!response.ok)
                throw new Error('HTTP-Error: ' + response.status);
            return await response.json();
        };
        const getPointInfo = async (latLng, searchRadius) => {
            const data = await apiRequest('info', latLng, searchRadius);
            return data;
        };
        const getAreas = async (centerLatLng, searchRadius) => {
            let extent = this._view.calculateExtent();
            if (this._options.buffer) {
                // Convert the extent to meters
                extent = transform(extent, this._projection, 'EPSG:3857');
                // Apply buffer in meters
                extent = this._options.buffer
                    ? buffer(extent, this._options.buffer)
                    : extent;
                // Restore extent in map projection
                extent = transform(extent, 'EPSG:3857', this._projection);
            }
            const polygon = fromExtent(extent);
            if (this._areaDownloaded) {
                if (this._areaDownloaded.intersectsCoordinate(getCenter(extent)) &&
                    this._areaDownloaded.intersectsCoordinate(getBottomLeft(extent)) &&
                    this._areaDownloaded.intersectsCoordinate(getTopRight(extent)) &&
                    this._areaDownloaded.intersectsCoordinate(getBottomRight(extent)) &&
                    this._areaDownloaded.intersectsCoordinate(getTopLeft(extent))) {
                    // whe already have the data, do nothing
                    return;
                }
                this._areaDownloaded.appendPolygon(polygon);
            }
            else {
                this._areaDownloaded = new MultiPolygon([
                    polygon.getCoordinates()
                ]);
            }
            const data = await apiRequest('areas', centerLatLng, searchRadius);
            return data;
        };
        const getMapRadius = ({ lng, lat }) => {
            const center = [lng, lat];
            const size = this._map.getSize();
            let extent = this._view.calculateExtent(size);
            extent = transformExtent(extent, this._projection, 'EPSG:4326');
            const posSW = [extent[0], extent[1]];
            const centerToSW = getDistance(center, posSW) + this._options.buffer;
            return parseInt(String(centerToSW));
        };
        if (!this._isVisible)
            return;
        const searchRadius = getMapRadius(latLng);
        let data;
        if (typeApiRequest === 'areas') {
            data = await getAreas(latLng, searchRadius);
        }
        else {
            data = await getPointInfo(latLng, searchRadius);
        }
        return data;
    }
    /**
     * Show/hide the loading in the control
     * @param {Boolean} bool
     * @protected
     */
    _showLoading(bool) {
        if (!this.divControl)
            return;
        if (bool)
            this.divControl.classList.add('ol-dji-geozones--isLoading');
        else
            this.divControl.classList.remove('ol-dji-geozones--isLoading');
    }
    /**
     * Show or hides the control panel
     * @param visible
     * @public
     */
    setPanelVisible(visible) {
        if (!this.divControl) {
            return;
        }
        if (visible) {
            this.divControl.classList.remove('ol-dji-geozones--ctrl-hidden');
        }
        else {
            this.divControl.classList.add('ol-dji-geozones--ctrl-hidden');
        }
    }
    /**
     * Collapse/expand the control panel
     * @param collapsed
     * @public
     */
    setPanelCollapsed(collapsed) {
        if (!this.divControl) {
            return;
        }
        if (collapsed) {
            this.divControl.classList.add('ol-dji-geozones--ctrl-collapsed');
        }
        else {
            this.divControl.classList.remove('ol-dji-geozones--ctrl-collapsed');
        }
    }
    /**
     * Get all the layers
     * @public
     */
    get layers() {
        return this._layers;
    }
    /**
     * Get the layer acordding the level
     * @param level
     * @public
     */
    getLayerByLevel(level) {
        let find;
        for (const layer of this.layers) {
            if (layer.get('level') != undefined &&
                layer.get('level') == level) {
                find = layer;
                break;
            }
        }
        return find;
    }
    /**
     * Get the geozone type (airport, heliport, etc) by id
     * @param id
     * @protected
     */
    _getGeozoneTypeById(id = null) {
        return this._i18n.types.find((el) => el.id == id);
    }
    /**
     * Getter for the list with all the supported Drones
     * @protected
     */
    get dronesToDisplay() {
        return this._options.dronesToDisplay;
    }
    /**
     * Setter for API parameter `drone`. Triggers an API request
     * @param drone
     */
    set drone(drone) {
        this._options.drone = drone;
        this._getInfoFromView();
    }
    /**
     * Getter for Api parameter drone
     * @public
     */
    get drone() {
        return this._options.drone;
    }
    /**
     * Setter for API parameter `zonesMode`. Triggers an API request
     * @param zonesMode
     * @public
     */
    set zonesMode(zonesMode) {
        this._options.zonesMode = zonesMode;
        this._getInfoFromView();
    }
    /**
     * Getter for API parameter `zonesMode`
     * @public
     */
    get zonesMode() {
        return this._options.zonesMode;
    }
    /**
     * Setter for API parameter `country`. Triggers an API request
     * @param country
     * @public
     */
    set country(country) {
        this._options.country = country;
        this._getInfoFromView();
    }
    /**
     * Getter for API parameter `country`
     * @public
     */
    get country() {
        return this._options.country;
    }
    /**
     * Get the level parameters, like color, icon, and description
     * @param id
     * @protected
     */
    _getLevelParamsById(id = null) {
        return this._paramsLevels.find((lev) => lev.id == id);
    }
    /**
     * Get all the parameters from a level and the i18n texts
     * @param id
     * @public
     */
    getLevelById(id = null) {
        const params = this._paramsLevels.find((lev) => lev.id == id);
        const texts = this._i18n.levels.find((lev) => lev.id == id);
        return Object.assign(Object.assign({}, params), texts);
    }
    /**
     * Replace the active levels with this values and refresh the view
     * @param levels
     * @public
     */
    set activeLevels(levels) {
        this._options.activeLevels = levels;
        this._options.displayLevels.forEach((lev) => {
            const layer = this.getLayerByLevel(lev);
            if (levels.includes(lev)) {
                layer.setVisible(true);
            }
            else {
                layer.setVisible(false);
            }
        });
    }
    get activeLevels() {
        return this._options.activeLevels;
    }
    /**
     * Add the level/s to the view
     * @param levels
     * @param refresh If true, refresh the view and show the active levels
     * @public
     */
    addLevels(levels, refresh = true) {
        const arrLevels = !Array.isArray(levels) ? [levels] : levels;
        this.activeLevels = [...this.activeLevels, ...arrLevels];
        if (refresh) {
            arrLevels.forEach((lev) => {
                const layer = this.getLayerByLevel(lev);
                layer.setVisible(true);
            });
        }
    }
    /**
     * Remove the level/s from the view
     *
     * @param levels
     * @param refresh If true, refresh the view and show the actived levels
     * @public
     */
    removeLevels(levels, refresh = true) {
        const arrLevels = !Array.isArray(levels) ? [levels] : levels;
        this.activeLevels = this.activeLevels.filter((x) => !arrLevels.includes(x));
        if (refresh) {
            arrLevels.forEach((lev) => {
                const layer = this.getLayerByLevel(lev);
                layer.setVisible(false);
            });
        }
    }
    /**
     * Removes the control, layers, overlays and events from the map
     * @public
     */
    destroy() {
        this.layers.forEach((layer) => {
            this._map.removeLayer(layer);
        });
        this._map.removeOverlay(this._overlay);
        this._removeListeners();
    }
    /**
     * Hide the geoZones and the Control
     * @public
     */
    hide() {
        this._hideGeozones = true;
        this._setLayersVisible(false);
        this._setControlEnabled(false);
        this._removeListeners();
        if (this.divControl) {
            this.divControl.classList.add(HIDDEN_CLASS);
        }
    }
    /**
     * Show the geoZones and the Control
     * @public
     */
    show() {
        if (!this._initialized) {
            this._initialize();
        }
        if (!this._listeners) {
            this._addListeners();
        }
        this._hideGeozones = false;
        this._isVisible = this._view.getZoom() >= MIN_ZOOM;
        this._showLoading(true);
        if (this._isVisible) {
            this._setControlEnabled(true);
            this._getInfoFromView();
            this._setLayersVisible(true);
            if (this.divControl) {
                this.divControl.classList.remove(HIDDEN_CLASS);
            }
        }
        else {
            this._alert(this._i18n.labels.helperZoom);
            this._showLoading(false);
        }
    }
    /**
     * @protected
     */
    _removeListeners() {
        unByKey(this._clickEvtKey);
        unByKey(this._moveendEvtKey);
        this._listeners = false;
    }
    /**
     * @protected
     */
    _addListeners() {
        const handleZoomEnd = () => {
            if (this._currentZoom < MIN_ZOOM) {
                // Hide the layer and disable the control
                if (this._isVisible) {
                    this._setLayersVisible(false);
                    this._isVisible = false;
                    this._setControlEnabled(false);
                }
            }
            else {
                // Show the layers and enable the control
                if (!this._isVisible) {
                    this._setLayersVisible(true);
                    this._isVisible = true;
                    this._setControlEnabled(true);
                    if (this.divControl) {
                        this.divControl.classList.remove(HIDDEN_CLASS);
                    }
                }
                else {
                    // If the view is closer, don't do anything, we already had the features
                    if (!this._lastZoom || this._currentZoom > this._lastZoom)
                        return;
                }
                this._getInfoFromView();
            }
        };
        const handleDragEnd = () => {
            if (!this._isVisible || this._hideGeozones)
                return;
            this._getInfoFromView();
        };
        this._moveendEvtKey = this._map.on('moveend', () => {
            this._currentZoom = this._view.getZoom();
            if (this._currentZoom !== this._lastZoom)
                handleZoomEnd();
            else
                handleDragEnd();
            this._lastZoom = this._currentZoom;
        });
        this._clickEvtKey = this._map.on(this._options.clickEvent, (evt) => {
            const type = this._useApiForPopUp
                ? 'useApiForPopUp'
                : 'useFeaturesForPopUp';
            this._getPointInfoFromClick(evt, type);
        });
        this._listeners = true;
    }
    /**
     * Function to display messages to the user
     *
     * @param msg
     * @private
     */
    _alert(msg) {
        if (typeof this._options.alert === 'function') {
            this._options.alert(msg);
        }
        else {
            // Default and ugly alert message
            alert(msg);
        }
    }
    /**
     *  **_[static]_** - Generate an RGBA color from an hexadecimal
     *
     * Adapted from https://stackoverflow.com/questions/28004153
     * @param color Hexadeciaml color
     * @param alpha Opacity
     * @protected
     */
    static colorWithAlpha(color, alpha = 1) {
        const [r, g, b] = Array.from(asArray(color));
        return asString([r, g, b, alpha]);
    }
}
/**
 * Custom Event to pass error in the dispatchEvent
 */
class ErrorEvent extends BaseEvent {
    constructor(error) {
        super('error');
        this.message = error.message;
        this.stack = error.stack;
    }
}
/**
 *
 * @param target
 * @param sources
 * @returns
 */
const deepObjectAssign = (target, ...sources) => {
    sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
            const s_val = source[key];
            const t_val = target[key];
            target[key] =
                t_val &&
                    s_val &&
                    typeof t_val === 'object' &&
                    typeof s_val === 'object' &&
                    !Array.isArray(t_val) // Don't merge arrays
                    ? deepObjectAssign(t_val, s_val)
                    : s_val;
        });
    });
    return target;
};

export { DjiGeozones as default };
//# sourceMappingURL=ol-dji-geozones.js.map
