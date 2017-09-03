import {Component, OnInit} from '@angular/core';

const ol_Map = require('ol/map').default;
const ol_layer_Tile = require('ol/layer/tile').default;
const ol_layer_Vector = require('ol/layer/vector').default;

const ol_source_OSM = require('ol/source/osm').default;
const ol_source_Vector = require('ol/source/vector').default;

const ol_View = require('ol/view').default;

const ol_Style_Style = require('ol/style/style').default;
const ol_Style_Stroke = require('ol/style/stroke').default;
const ol_Style_Icon = require('ol/style/icon').default;

//ol.Feature
const ol_Feature = require('ol/feature').default;

//ol.geom.Point
const ol_Geom_Point = require('ol/geom/point').default;

//ol.format.Polyline
const ol_Format_Polyline = require('ol/format/polyline').default;

//ol.proj
const ol_Proj = require('ol/proj').default;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    map: any;
    view: any;
    vectorSource = new ol_source_Vector();
    vectorLayer = new ol_layer_Vector({
        source: this.vectorSource
    });

    public coords: string;

    points: Array<any> = [];
    msg_el: any;

    // OSRM URL
    url_osrm_nearest: string = '//router.project-osrm.org/nearest/v1/driving/';
    url_osrm_route: string = '//router.project-osrm.org/route/v1/driving/';
    // OSR backup route
    // base_osr_url:string = 'https://api.openrouteservice.org/directions?profile=foot-hiking&preference=fastest&units=m&language=en&geometry=true&geometry_format=encodedpolyline&geometry_simplify=false&instructions=true&instructions_format=text&elevation=false&options=%7B%7D'
    // osr_api_key:string = '58d904a497c67e00015b45fcab3b6276dc544c09479e1f123a242179';

    styles = {
        route: new ol_Style_Style({
            stroke: new ol_Style_Stroke({
                width: 6, color: [40, 40, 40, 0.8]
            })
        }),
        icon: new ol_Style_Style({
            image: new ol_Style_Icon({
                anchor: [0.5, 1],
                src: '//cdn.rawgit.com/openlayers/ol3/master/examples/data/icon.png'
            })
        })
    };

    constructor() {
    }

    ngOnInit() {
        // handle le view of the map - center - rotation - resolution
        this.view = new ol_View({
            center: [900000, 8500000],
            zoom: 6
        });
        // the map itself
        this.map = new ol_Map({
            target: 'map',
            layers: [
                new ol_layer_Tile({
                    source: new ol_source_OSM()
                }),
                this.vectorLayer
            ],
            view: this.view
        });

        this.msg_el = document.getElementById('msg');
    }

    ngAfterContentInit() {
        /**
         * bind click event on map to the mapClick function
         */
        this.map.on('click', (event) => {
            this.mapClick(event);
        });

    }

    getNearest(coord) {
        let coord4326 = this.to4326(coord);
        return new Promise((resolve, reject) => {
            //make sure the coord is on street
            fetch(this.url_osrm_nearest + coord4326.join()).then((response) => {
                // Convert to JSON
                return response.json();
            }).then((json) => {
                if (json.code === 'Ok') resolve(json.waypoints[0].location);
                else reject();
            });
        });
    }

    createFeature(coord) {
        let feature = new ol_Feature({
            type: 'place',
            geometry: new ol_Geom_Point(ol_Proj.fromLonLat(coord))
        });
        feature.setStyle(this.styles.icon);
        this.vectorSource.addFeature(feature);
    }

    createRoute(polyline) {
        this.coords = polyline;
        let route = new ol_Format_Polyline({
            factor: 1e5
        }).readGeometry(polyline, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        let feature = new ol_Feature({
            type: 'route',
            geometry: route
        });
        feature.setStyle(this.styles.route);
        this.vectorSource.addFeature(feature);
    }

    to4326(coord) {
        return ol_Proj.transform([
            parseFloat(coord[0]), parseFloat(coord[1])
        ], 'EPSG:3857', 'EPSG:4326');
    }

    mapClick(event) {
        this.getNearest(event.coordinate).then((coord_street) => {
            //let last_point = this.points[this.points.length - 1];
            let points_length = this.points.push(coord_street);

            this.createFeature(coord_street);

            if (points_length >= 2) {
                let coordsString = this.points.map((coord) => coord.join()).join(';');

                let url = this.url_osrm_route + coordsString;

                fetch(url).then((r) => {
                    return r.json();
                }).then((json) => {
                    if (json.code !== 'Ok') {
                        this.msg_el.innerHTML = 'No route found.';
                        return;
                    }
                    this.msg_el.innerHTML = 'Route added';
                    this.createRoute(json.routes[0].geometry);
                });
            } else {
                this.msg_el.innerHTML = 'Click to add another point';
                return;
            }
        });
    };

    saveMap() {
        console.log(this.coords);
    }
}

//------------------------------------//------------------------------------ FallBack for OSRM
//let coordsString = this.points.map((coord) => coord.join()).join('|');
//let url = this.url_osrm_route + '&coordinates=' + coordsString + '&api_key=' + this.osr_api_key
/* to be used for osr request in http
 $http({
 method: 'GET',
 url: '/someUrl'
 }).then(function successCallback(response) {
 // this callback will be called asynchronously
 // when the response is available
 }, function errorCallback(response) {
 // called asynchronously if an error occurs
 // or server returns response with an error status.
 });
 */
//------------------------------------//------------------------------------TEST
/*
 var coords = [[-65.65, 10.10], [13, 18]];
 var lineString = new ol_Geom_Line(coords);
 // transform to EPSG:3857
 lineString.transform('EPSG:4326', 'EPSG:3857');

 // create the feature
 var feature = new ol_Feature({
 geometry: lineString,
 name: 'Line'
 });

 var lineStyle = new ol_Style_Style({
 stroke: new ol_Style_Stroke({
 color: '#ffcc33',
 width: 10
 })
 });

 var source = new ol_source_Vector({
 features: [feature]
 });

 var vector = new ol_layer_Vector({
 source: source,
 style: [lineStyle]
 });
 this.map.addLayer(vector);
 */
//------------------------------------//------------------------------------TEST