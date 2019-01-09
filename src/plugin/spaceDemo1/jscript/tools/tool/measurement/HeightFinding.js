import map from "../../../cesiumMap/map.js";

import Line from './model/Line'
import Label from './model/Label'
import MeasurementEvent from './MeasurementEvent'

/* 
    测高
*/
class HeightFinding extends MeasurementEvent {
  constructor() {
    super()

    this.start = false; //是否开始
    this.coordinate = []; //笛卡尔
    this.model = '' //线
    this.label = '' //标签
    this.labelTemporary = new Label([], '') //临时标签
    this.modelTemporary = new Line([], true) //临时线
    this.heightLabel = '' //测高的label
  }
  getName() {
    return 'HeightFinding'
  }
  mouseLeftClick( eve) {
    let ray = map.viewer.scene.camera.getPickRay(eve.position)
    if (ray) {
      this.start = true;
      let position = map.viewer.scene.globe.pick(ray, map.viewer.scene);
      let coordinates = map.viewer.scene.globe.ellipsoid.cartesianToCartographic(position);
      this.coordinate.push(position)
    }
    if (this.coordinate.length < 2) {
      this.heightLabel = '高' + 0 + '米，水平距离' + 0 + '米，空间距离' + 0 + '米'
      this.labelTemporary.update(this.coordinate[0], this.heightLabel)
    } else {
      let one = Cesium.Cartographic.fromCartesian(this.coordinate[0])
      let two = Cesium.Cartographic.fromCartesian(this.coordinate[1])
      let three = ''
      if (one.height > two.height) {
        three = new Cesium.Cartographic(two.longitude, two.latitude, one.height)
      } else {
        three = new Cesium.Cartographic(one.longitude, one.latitude, two.height)

      }

      this.coordinate.push(Cesium.Cartographic.toCartesian(three))
      this.model = new Line(this.coordinate, true)
      this.label = new Label(Cesium.Cartographic.toCartesian(three), this.heightLabel)

      this.start = false
      this.coordinate = [];
      this.heightLabel = '';
      this.modelTemporary.update([])
      this.labelTemporary.update(Cesium.Cartographic.toCartesian(three), '')
    }
  }
  mouseRightClick( eve) {
    console.log('右键取消')
    let e = new Cesium.Cartesian2(0, 0)
    let ray = map.viewer.scene.camera.getPickRay(e)
    let position = map.viewer.scene.globe.pick(ray, map.viewer.scene);

    this.start = false
    this.coordinate = [];
    this.heightLabel = '';
    if (this.modelTemporary) {
      this.modelTemporary.update([])
    }
    if (this.labelTemporary) {
      this.labelTemporary.update(position, '')
    }
  }
  mouseMoveClick(eve) {
    if (!this.modelTemporary) {
      this.modelTemporary = new Line([], true)
    }
    if (!this.labelTemporary) {
      this.labelTemporary = new Label([], '')
    }
    let ray = map.viewer.scene.camera.getPickRay(eve.endPosition)
    if (ray && this.start) {
      let position = map.viewer.scene.globe.pick(ray, map.viewer.scene);
      let one = Cesium.Cartographic.fromCartesian(this.coordinate[0])
      let two = Cesium.Cartographic.fromCartesian(position)
      let long = Cesium.Cartesian3.distance(this.coordinate[0], position);
      let three = ''
      let height = 0
      let lve = 0;
      if (one.height > two.height) {
        height = one.height - two.height
        three = new Cesium.Cartographic(two.longitude, two.latitude, one.height)
        lve = new Cesium.EllipsoidGeodesic(one, three).surfaceDistance;
      } else {
        height = two.height - one.height
        three = new Cesium.Cartographic(one.longitude, one.latitude, two.height)
        lve = new Cesium.EllipsoidGeodesic(two, three).surfaceDistance;
      }
      let arr = [];
      this.coordinate.forEach((n, i) => {
        arr.push(n)
      })
      arr.push(position)
      arr.push(Cesium.Cartographic.toCartesian(three))
      this.modelTemporary.update(arr)
      height = parseFloat(height.toFixed(1));
      lve = parseFloat(lve.toFixed(1));
      long = parseFloat(long.toFixed(1));
      this.heightLabel = '高' + height + '米，水平距离' + lve + '米，空间距离' + long + '米'
      this.labelTemporary.update(Cesium.Cartographic.toCartesian(three), this.heightLabel)
    }
  }
  clear() {
    this.mouseRightClick()
    this.labelTemporary = ''
    this.modelTemporary = ''

  }
}
export default HeightFinding
