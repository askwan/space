import Form from './Form'
import GeoBox from './GeoBox'
import OType from './OType'
import Version from './Version'
export default class SObject {
  constructor(options={}){
    let base = {
      id:'',
      code:'',
      datas:{},
      forms:[],
      geoBox:new GeoBox(),
      name:'',
      otype:new OType(),
      parents:[],
      realTime:'',
      srs:{},
      uuid:null,
      version:new Version()
    };
    Object.assign(base,options);
    base.geoBox = new GeoBox(base.geoBox);
    base.forms.map(form=>new Form(form));
    base.otype = new OType(base.otype);
    base.version = new Version(base.version);
    Object.assign(this,base);
  }
  getCenter(){
    let geoBox = this.geoBox;
    return [average(geoBox.minx,geoBox.maxx),average(geoBox.miny,geoBox.maxy),average(geoBox.minz,geoBox.maxz)]
  }
  getOtype(){
    return Object.assign({},this.otype);
  }
}

const average = (a,b)=>{
  return (a+b)/2;
}

