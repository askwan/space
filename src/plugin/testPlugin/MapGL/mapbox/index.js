import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Operate from './Operate'
import Manager from './Manager'

import 

export default class MapBoxGL extends Operate {
  /**
   * 创建mapbox
   * @param {object} options 
   */
  constructor(options){
    super();
    this.manage = new Manager();
    mapboxgl.accessToken = 'pk.eyJ1IjoieHRwZ2t4ayIsImEiOiJSUEhldmhZIn0.dJzz5bXztrZRAViAdmQvyQ';
    Object.assign(this.manage.mapconfig,options);
    this.initMap(options);
  }
  initMap(options={}){
    Object.assign(this.manage.mapconfig,options);
    this.map = new mapboxgl.Map(this.manage.mapconfig);
    this.initEvent();
  }
  setSdomain(sdomain){
    this.manage.sdomain = sdomain;
    this.clear();
    this.initMap();
  }
}
