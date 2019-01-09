import map from "../../../../cesiumMap/map.js";

/* 
    量算提示线
*/
class Line {
  constructor(arr, loop) {
    this.line = this.create(arr, loop)
  }
  create(arr, loop) {
    return map.measurementPolyline.add({
      positions: arr,
      width: 5,
      loop: loop ? true : false,
      material: new Cesium.Material({
        fabric: {
          type: 'PolylineGlow',
          uniforms: {
            color: new Cesium.Color(1.0, 1.0, 0.0, 0.5)
          }
        }
      }),
    })
  }
  update(arr) {

    if (this.line) {
      this.line.positions = arr
      map.viewer.scene.render()

    }
  }
}
export default Line
