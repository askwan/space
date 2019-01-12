class Sobject{
  constructor(sobj){
    this.sobj=sobj
    this.id=sobj.id
    this.uuid=sobj.uuid
    this.forms=sobj.forms
    this.actions=sobj.actions
    this.attributes=sobj.attributes
    this.children=sobj.children
    this.geoBox=sobj.geoBox
    this.name=sobj.name
    this.network=sobj.network
    this.otype=sobj.otype
    this.parents=sobj.parents
    this.version=sobj.version
  }
  getSobjectNowPosition(){
    let location=null
    if(this.currentPos){
      return this.currentPos
    }else{
      for (let i = 0; i < this.forms.length; i++) {
        let form = this.forms[i]
        let geom = form.geom
        if (geom && geom.type == 'Point') {
          // 点的位置
          location = [geom.coordinates[0], geom.coordinates[1]]
        } else if (geom && geom.type == 'LineString') {
          let length = geom.coordinates.length;
          if (length % 2 == 0) {
            let one = geom.coordinates[length / 2 - 1]
            let two = geom.coordinates[length / 2]
            location = [(one[0] + two[0]) / 2, (one[1] + two[1]) / 2]
            // this.currentPos = one
          } else {
            location = geom.coordinates[(length - 1) / 2]

          }
        }
      }
      if (!location) {
        let x = (this.geoBox.maxx + this.geoBox.minx) / 2
        let y = (this.geoBox.maxy + this.geoBox.miny) / 2
        location = [x, y]
      }
      return location
    }
  }
}
export default Sobject