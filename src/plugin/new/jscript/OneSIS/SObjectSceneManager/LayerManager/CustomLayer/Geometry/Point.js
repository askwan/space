import publicFun from './publicFun'

class Point extends publicFun {
  constructor() {
    super()
  }
  create(lonlat, sobject, node, pick) {
    let floorObj = new THREE.Group();
    floorObj.name=sobject.name
    floorObj.sobject=sobject
    let obj = this.getDataObj(lonlat, sobject, node)

    // let color = this.getColors(sobject.data)

    let lonlatArr = []
    lonlatArr = this.getPlace(sobject.lonlat, lonlat)
    let vColor = 0xffff00
    if (pick) {
      vColor = new THREE.Color().setHex(pick)
    } else {}
    let geometry = new THREE.CircleBufferGeometry(0.1, 32);
    let material = new THREE.MeshPhongMaterial({
      color: vColor
    });
    let circle = new THREE.Mesh(geometry, material);

    circle.position.x += lonlatArr.x
    circle.position.y += lonlatArr.y
    circle.position.z += Number(obj.minHeight) + 0.1
    floorObj.add(circle);
    return floorObj
  }
}
export default Point