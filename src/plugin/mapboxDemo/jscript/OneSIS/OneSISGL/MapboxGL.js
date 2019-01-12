// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css'
import '../../../../../../public/js/mapbox/mapbox-gl.css'
import getColor from '../SObjectSceneManager/LayerManager/CustomLayer/manage/getColor'
import otypeList from '../SObjectSceneManager/LayerManager/CustomLayer/manage/otypeList'

import SObject from '../SObjectSceneManager/LayerManager/CustomLayer/SObject'
import {
  BuildingLayer,
  ModelLayer,
  PipelineLayer,
  OtherLayer
} from '../SObjectSceneManager/LayerManager/CustomLayer/AllLayer'
import axios from 'axios'

const psdeBaseUrl = 'http://bt1.geosts.ac.cn/api';
const str = '&sdomains=461154344960'
class MapboxGL {
  constructor(data) {
    this.container = data.id
    this.center = data.center
    this.SObjectList = []
    this.allLayer = {
      // 'pipelineLayer': new PipelineLayer(),
      'otherLayer': new OtherLayer(),
      // 'modelLayer': new ModelLayer(),
      // 'buildingLayer': new BuildingLayer(),
    }

    this.sobjNum = 1
    this.init(data)
  }
  init(data) {
    if (data.styleList) {
      getColor.setList(data.styleList);
    }
    if (data.otypes) {
      otypeList.setlist(data.otypes);
    }
    this.addMapbox()
  }
  setColorAndOtype(data) {
    if (data.styleList) {
      getColor.setList(data.styleList);
    }
    if (data.otypes) {
      otypeList.setlist(data.otypes);
    }
  }
  addMapbox() {

    this.map = new mapboxgl.Map({
      container: this.container,
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
              // psdeHost + `/service/query?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`,
              psdeBaseUrl + `/dae/geoservice/rest/v0.1.0/datastore/slave/geoservice/vectortile?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`,
              // "http://192.168.1.133:8088/rest/v0.1.0/datastore/slave/geoservice" + `/vectortile?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`
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
        }],
      },
      center: this.center,
      zoom: 16,
    });

    this.map.on("load", () => {
      console.log("mapbox地图加载完");
      axios.get(psdeBaseUrl + '/dae/geoservice/rest/v0.1.0/datastore/slave/geoservice/stylePreview/sourceLayers').then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          let layer = res.data[i]
          if (layer.type) {
            this.map.addLayer(layer)
          }
        }
        for (let i in this.allLayer) {
          let layer = this.allLayer[i]
          this.map.addLayer(layer)
        }
      })
     
      this.map.resize()
    });
  }
  start(data) {
    let obj = data[0]
    let lonlat = [(obj.geoBox.maxx + obj.geoBox.minx) / 2, (obj.geoBox.maxy + obj.geoBox.miny) / 2]
    this.map.flyTo({
      center: lonlat,
      pitch: 45
    });
    for (let i in this.allLayer) {
      let layer = this.allLayer[i]
      layer.remove()
      layer.setLonLat(lonlat)
    }
    this.recursion(data)
  }
  recursion(list, floor) {
    for (let i = 0; i < list.length; i++) {
      let object = list[i]
      let sobject = new SObject(object)
      if (!sobject.floor) {
        sobject.floor = floor ? floor : null
      }
      this.SObjectList.push(sobject)
      if (sobject.layer) {
        this.allLayer[sobject.layer].add(sobject, this.sobjNum)
        this.sobjNum++
      }
      if (object.children.length > 0) {
        this.recursion(object.children, sobject.floor)
      }
    }
  }
}
export default MapboxGL