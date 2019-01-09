import map from "../../../../cesiumMap/map.js";

/* 
    量算显示字
*/
class Label {
  constructor(arr, long) {
    this.label = this.create(arr, long)
  }
  create(arr, long) {
    this.model = {
      position: arr,
      text: long,
      fillColor: Cesium.Color.WHITE,
      font: '18px 宋体',
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(8.0, 8.0),


    }
    return map.measurementLabel.add(this.model)
  }
  update(arr, long) {
    if (this.label) {
      this.label.position = arr
      this.label.text = long
      map.viewer.scene.render()

    }
  }
}
export default Label
