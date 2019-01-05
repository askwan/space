export default class GeoBox {
  constructor(options={}){
    this.minx = 0;
    this.maxx = 0;
    this.miny = 0;
    this.maxy = 0;
    this.minz = 0;
    this.maxz = 0;
    Object.assign(this,options);
  }
}