import publicFun from './publicFun'

class Line extends publicFun {
  constructor() {
    super()

  }
  create(lonlat, sobject, node, pick) {
    let floorObj = new THREE.Object3D();
    floorObj.name=sobject.name
    floorObj.sobject=sobject
    let obj = this.getDataObj(lonlat, sobject, node)

    let vColor = 0x00ff00
    if (pick) {
      vColor = new THREE.Color().setHex(pick)
    } else {}

    let geometry = new THREE.BufferGeometry().setFromPoints(obj.lonlatArr);
    let material = new THREE.LineBasicMaterial({
      color: vColor,
    });
    let line = new THREE.Line(geometry, material);
    floorObj.add(line);
    floorObj.position.z += Number(obj.height)+0.15

    return floorObj
  }
}
export default Line