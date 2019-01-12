export default class Form {
  constructor(form={}){
    let base = {
      dim:null,
      fid:null,
      formref:{},
      geom:{},
      geomref:null,
      geotype:null,
      id:null,
      maxGrain:0,
      minGrain:0,
      style:[],
      type:null
    };
    Object.assign(base,form);
    Object.assign(this,base);
  }
}