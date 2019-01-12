import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Operate from './Operate'
import Manager from './Manager'

export default class MapBoxGL extends Operate {
  /**
   * 创建mapbox
   * @param {object} options 
   */
  constructor(options){
    super();
    this.manage = new Manager();
    mapboxgl.accessToken = 'pk.eyJ1IjoieHRwZ2t4ayIsImEiOiJSUEhldmhZIn0.dJzz5bXztrZRAViAdmQvyQ';
    this.initMap(options);
    this.manage.mapconfig = options;
  }
  initMap(options){
    let defaultOptions = {
      style:'mapbox://styles/mapbox/streets-v9',
      center:[133,34],
      zoom:9,
    };
    Object.assign(defaultOptions,options);
    this.map = new mapboxgl.Map(options);
    this.initEvent();
  }
  setSdomain(sdomain){
    this.manage.sdomain = sdomain;
    this.clear();
    this.initMap();
  }
}
