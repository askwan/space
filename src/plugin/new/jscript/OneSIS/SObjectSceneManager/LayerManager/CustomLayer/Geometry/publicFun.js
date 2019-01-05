import mercatorProj from '../manage/mercatorProj'
import getColor from '../manage/getColor'

class publicFun {
  constructor() {

  }
  getDataObj(lonlat, sobject, node) {
    let obj = {}
    let multiple

    let topNum=sobject.floor//楼层数
    obj.topLength = topNum < 0 || !topNum ? 0 : topNum * 16
    let heightLength = this.getAttributes(sobject.data.attributes, 'height')

    // let heightLength = sobject.height-sobject.min_height
    // obj.topLength = sobject.min_height ? sobject.min_height : 0

    let lonlatArr = []
    for (let q = 0; q < node.nodes.length; q++) {
      let coor = node.nodes[q]
      lonlatArr.push(this.getPlace(coor, lonlat))
      if (sobject.height != sobject.min_height) {
        lonlatArr.push(this.getLinePlace(coor, lonlat, sobject.height, sobject.min_height))
      }
    }
    obj.lonlatArr = lonlatArr
    if (sobject.isfloor) {
      obj.transparent = true
      multiple = 4
    } else {
      obj.transparent = false
      multiple = 2.5
    }
    obj.height = heightLength ? heightLength * multiple : 0.1

    return obj
  }
  getColors(object) {
    return getColor.getColor(object)
  }

  getPlace(lonLat, lonlatNow) {
    let old = mercatorProj.lonLat2Mercator(lonLat[0], lonLat[1])
    let newd = mercatorProj.lonLat2Mercator(lonlatNow[0], lonlatNow[1])
    let v = new THREE.Vector3(old.x - newd.x, old.y - newd.y, 0)
    return v
  }
  getLinePlace(lonLat, lonlatNow, height, min_height) {
    let old = mercatorProj.lonLat2Mercator(lonLat[0], lonLat[1])
    let newd = mercatorProj.lonLat2Mercator(lonlatNow[0], lonlatNow[1])
    let v = new THREE.Vector3(old.x - newd.x, old.y - newd.y, height - min_height)
    return v
  }
  getAttributes(list, name) {
    for (let i = 0; i < list.length; i++) {
      let l = list[i]
      if (l.name == name) {
        return l.value
      }
    }
    return null
  }
}
export default publicFun
