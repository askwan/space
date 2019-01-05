import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../scss/style.scss'
mapboxgl.accessToken = 'pk.eyJ1IjoieHRwZ2t4ayIsImEiOiJSUEhldmhZIn0.dJzz5bXztrZRAViAdmQvyQ';
// mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js')
class MapControl {
  constructor(option){
    this.config = {
      style:'mapbox://styles/mapbox/streets-v9',
      center:[113,33],
      zoom:9
    }
    this.init(option);
  }
  init(obj){
    Object.assign(this.config,obj)
    this.map = new mapboxgl.Map({
      container:this.config.container,
      style:this.config.style,
      center:this.config.center,
      zoom:this.config.zoom
    });
    window.onresize = (event)=>{
      this.resize(event);
    };
  }
  /**
   * 
   * @param {*} event 
   */
  resize(event){
    this.map.resize();
  }
  /**
   * 更改mapbox图层样式
   * @param {string} style 
   */
  setStyle(style){
    this.map.setStyle(style);
  }
  /**
   * 定位
   * @param {
   * center:[number,number],
   * zoom:number
   * } options 
   */
  flyTo(options){
    this.map.flyTo(options)
  }
  setProps(props) {
    const {viewState} = props;

    if (viewState) {
      this.map.jumpTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        bearing: viewState.bearing,
        pitch: viewState.pitch
      });
    }
  }
  
}

export default MapControl