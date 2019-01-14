import Evented from '../utils/Evented';

export default class Operate extends Evented {
  constructor(){
    super();
  }
  setCenter(){
    this.map.setCenter()
  }
  clear(){
    this.map.remove();
  }
  setStyle(style){
    this.map.setStyle(style)
  }
  getStyle(id){
    return this.map.setStyle(id)
  }
  addLayer(layer){
    // console.log(this.map.addLayer,'map')
    this.map.addLayer(layer);
  }
  removeLayer(layerId){
    this.map.remove.removeLayer(layerId);
  }
  /**
   * 通过id获取layer
   * @param {string} id 
   */
  getLayer(id){
    return this.map.getLayer(id)
  }
  initEvent(){
    //点击事件
    this.map.on('click',e=>{
      var bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
      ];
      var features = this.map.queryRenderedFeatures(bbox)
      this.fire('select',{features:features});
    });

    this.map.on('load',event=>{
      console.log('load');
    });

    this.map.on('mouseup',()=>{
      // var bbox = [[-79, 43], [-73, 45]];
      this.fire('mouseup',{
        center:this.getCenter()
      })
    });

  }
  getCenter(){
    return this.map.getCenter();
  }
  setCenter(position){
    this.map.setCenter([position.lng,position.lat])
  }
  fitBbox(bbox){
    let box = [[bbox.minx,bbox.miny],[bbox.maxx,bbox.maxy]];
    this.map.fitBounds(box);
  }
}