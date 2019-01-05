const otypes = {};
export default {
  // otypes:{},
  getOtypeById(id){
    return otypes[id];
  },
  getOtypeByName(name){
    let result;
    for(let id in otypes){
      let otype = otypes[id];
      if(otype.name===name){
        result = otype;
        break;
      }
    }
    return result;
  },
  setOtypes(lists){
    lists.forEach(diagram=>{
      diagram.otypes.forEach(otype=>{
        otypes[otype.id] = otype;
      })
    })
  }
}