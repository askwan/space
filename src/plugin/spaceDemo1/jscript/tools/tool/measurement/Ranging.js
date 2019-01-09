import map from "../../../cesiumMap/map.js";

import Line from './model/Line'
import Label from './model/Label'
import MeasurementEvent from './MeasurementEvent'
/* 
测距
 */

class Ranging extends MeasurementEvent {
  constructor() {
    super()
    this.start = false; //是否开始
    this.coordinate = []; //笛卡尔
    this.model = '' //线
    this.label = '' //标签
    this.labelTemporary = '' //临时标签

    this.long = 0 //总长度
  }
  getName() {
    return 'Ranging'
  }
  mouseLeftClick(eve) {
    let ray = map.viewer.scene.camera.getPickRay(eve.position)
    if (ray) {
      this.start = true;
      let position = map.viewer.scene.globe.pick(ray, map.viewer.scene);
      let coordinates = map.viewer.scene.globe.ellipsoid.cartesianToCartographic(position);
      this.coordinate.push(position)
    }
    if (this.coordinate.length < 2) {
      this.model = new Line(this.coordinate)
    } else {
      this.model.update(this.coordinate)
      let one = Cesium.Cartographic.fromCartesian(this.coordinate[this.coordinate.length - 2])
      let two = Cesium.Cartographic.fromCartesian(this.coordinate[this.coordinate.length - 1])
      let long = Cesium.Cartesian3.distance(this.coordinate[this.coordinate.length - 2], this.coordinate[this.coordinate.length - 1]);
      let longs = parseFloat(long + this.long)
      this.long = parseFloat(longs.toFixed(1));
    }
    this.label = new Label(this.coordinate[this.coordinate.length - 1], this.long + '米')
  }
  mouseRightClick(eve) {
    console.log('右键取消')
    if (this.coordinate.length > 1) {
      this.model.update(this.coordinate)
      this.label.update(this.coordinate[this.coordinate.length - 1], this.long + '米')
      map.measurementLabel.remove(this.labelTemporary.label)
    }
    this.start = false
    this.labelTemporary = ''
    this.coordinate = [];
    this.long = 0;
  }
  mouseMoveClick(eve) {
    let ep = map.viewer.scene.camera.getPickRay(eve.endPosition)
    if (ep && this.start) {
      let position = map.viewer.scene.globe.pick(ep, map.viewer.scene);
      let one = Cesium.Cartographic.fromCartesian(this.coordinate[this.coordinate.length - 1])
      let two = Cesium.Cartographic.fromCartesian(position)
      let long = Cesium.Cartesian3.distance(this.coordinate[this.coordinate.length - 1], position);
      let longs = parseFloat(long + this.long)
      longs = parseFloat(longs.toFixed(1));
      let arr = [];
      this.coordinate.forEach((n, i) => {
        arr.push(n)
      })
      arr.push(position)
      this.model.update(arr)
      if (!this.labelTemporary) {
        this.labelTemporary = new Label(position, longs + '米')
      } else {
        this.labelTemporary.update(position, longs + '米')
      }
    }
  }
  clear(){
      this.mouseRightClick()
  }
}
export default Ranging
