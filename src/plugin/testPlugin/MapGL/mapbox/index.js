// import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Operate from './Operate'
import Manager from './Manager'
// import '../../../../../../public/js/mapbox/mapbox-gl.css'
// import THREE from '../utils/threejs/three.js'
// const sss = require('../utils/threejs/three.js')
import '../utils/require.js';

export default class MapBoxGL extends Operate {
  /**
   * 创建mapbox
   * @param {object} options 
   */
  constructor(options){
    super();
    
    requirejs(["/js/mapbox/mapbox-gl_g.js","/js/threejs/three.js"],(mapboxgl,threejs)=>{
      console.log(mapboxgl);
      this.manage = new Manager();
      mapboxgl.accessToken = 'pk.eyJ1IjoieHRwZ2t4ayIsImEiOiJSUEhldmhZIn0.dJzz5bXztrZRAViAdmQvyQ';
      window.mapboxgl = mapboxgl;
      Object.assign(this.manage.mapconfig,options);
      this.initMap(options);
    })
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
