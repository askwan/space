const getCenter = (bbox)=>{
  let center = {x:0,y:0};
  center.x = (bbox.maxx+bbox.minx)/2;
  center.y = (bbox.maxy+bbox.miny)/2;
  center.z = (bbox.maxz+bbox.minz)/2;
  return center;
}

export {
  getCenter
}