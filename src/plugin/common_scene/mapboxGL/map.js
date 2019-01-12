import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
// import '../scss/style.scss'
import axios from 'axios'
import Evented from '@/script/utils/evented'
mapboxgl.accessToken = 'pk.eyJ1IjoieHRwZ2t4ayIsImEiOiJSUEhldmhZIn0.dJzz5bXztrZRAViAdmQvyQ';

import {getCenter} from './utils'

class MapBoxGL extends Evented {
  constructor(){
    super();
  }
  async initLayer(map){
    return new Promise((resolve,reject)=>{

      axios.get('http://bt1.geosts.ac.cn/api/dae/geoservice/rest/v0.1.0/datastore/slave/geoservice/stylePreview/sourceLayers').then(function (res) {
        for (let i = 0; i < res.data.length; i++) {
          let layer = res.data[i]
          if (layer.type) {
            map.addLayer(layer)
          }
        }
        resolve(map);
      })

    })
  }
  async initMap(container,obj){
    let str = "&sdomains="+obj.id;
    this.map = new mapboxgl.Map({
      container: container,
      style: {
        version: 8,
        'sprite': 'http://116.62.28.103:8000/creator/static/mapbox/sprite',
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'http://www.google.cn/maps/vt?lyrs=s@781&gl=cn&x={x}&y={y}&z={z}'
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 22
          },
          'vector-tiles': {
            'type': 'vector',
            'tiles': [
              `http://bt1.geosts.ac.cn/api/dae/geoservice/rest/v0.1.0/datastore/slave/geoservice/vectortile?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`,
            ],
            'minzoom': 4,
            'maxzoom': 20
          }
        },
        layers: [{
          id: 'raster-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 22
        }]
      },
      center: [103.6249284647, 34.7472541716],
      zoom: 16
    });

    await this.initLayer(this.map);
    this.listen();
  }
  getCenter(bbox){
    return getCenter(bbox)
  }
  setCenter(center){
    this.map.setCenter([center.y,center.x]);
  }
  listen(){
    this.map.on('click',(e)=>{
      let bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
      let features = this.map.queryRenderedFeatures(bbox);
      // console.log(features)
      if(this.map.getLayer('hightLight')) this.map.removeLayer('hightLight');
      if(features[0]){
        this.fire('select',features[0].properties);
        this._setHighLight(features[0])
      }else{

      }
    })
  }
  _setHighLight(feature){
    // console.log(feature.geometry)
    this.map.addLayer({
      id:'hightLight',
      type:'fill',
      source:'vector-tiles',
      'source-layer':feature.layer['source-layer'],
      paint:{
        'fill-color':'#ff0',
        'fill-opacity':0.8
      },
      'filter': ['in', 'oid', feature.properties.oid]
    });
  }
}

export default MapBoxGL