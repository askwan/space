import publicFun from './publicFun'


class Polygon extends publicFun {
  constructor() {
    super()
  }

  create(lonlat, sobject, node, pick) {
    let floorObj = new THREE.Object3D();

    let obj = this.getDataObj(lonlat, sobject, node)
    let color = this.getColors(sobject.data)

    let shape = new THREE.Shape(obj.lonlatArr);
    let extrudeSettings = {
      steps: 1,
      depth: obj.height,
      bevelEnabled: false,
      bevelThickness: 0,
      bevelSize: 0,
      bevelSegments: 0
    };
    let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
    let vColor = color.color
    let material
    if (pick) {
      vColor = new THREE.Color().setHex(pick)
      material = new THREE.MeshPhongMaterial({
        color: vColor,
        shininess: 30,
  
      });
      // material.transparent = obj.transparent
      // material.opacity = color.opacity
    } else {
      material = new THREE.MeshPhongMaterial({
        color: vColor,
        shininess: 30,
  
      });
      material.transparent = obj.transparent
      material.opacity = color.opacity
    }
   

    let mesh = new THREE.Mesh(geometry, material);
    floorObj.add(mesh);

    //边线
    let edges = new THREE.EdgesGeometry(geometry);
    let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color: 0xffffff
    }));
    floorObj.add(line);
    floorObj.position.z += obj.topLength

    return floorObj
  }
 
}
export default Polygon