import map from '../cesiumMap/map'
import GlobalData from '../GlobalData'

import {
  EventAll,
  MapEvent
} from '../event/Event.js'
export default class Location {
  constructor() {

    // this.handler = new Cesium.ScreenSpaceEventHandler(map.viewer.scene.canvas);
    // this.isShow = true;
    // this.createdDom();
    // this.update();
    // this.MOUSE_MOVE = 996;
    // this.MOUSE_WHEEL = 997;
    this.mouseMove()
  }
  mouseMove(eve) {
    EventAll.on(MapEvent.MouseMove, data => {
      let eve = data.eve
      let ellipsoid = map.viewer.scene.globe.ellipsoid;
      let cartesian = map.viewer.camera.pickEllipsoid(eve.endPosition, ellipsoid);
      let longitudeString = ""
      let latitudeString = ""
      if (cartesian) {
        //将笛卡尔坐标转换为地理坐标
        let cartographic = ellipsoid.cartesianToCartographic(cartesian);
        //将弧度转为度的十进制度表示
        longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        latitudeString = Cesium.Math.toDegrees(cartographic.latitude);

        GlobalData.location.lon = this.conversion(longitudeString)
        GlobalData.location.lat = this.conversion(latitudeString)
        
      }
    })


  }
 
  //经纬度转换为时分秒
  conversion(data) {
    if (data) {
      var hourArr = data.toString().split(".");
      var hour = Number(hourArr[0]);
      var minu = hourArr[1];
      var minuVal = Math.pow(10, minu.length);
      var minut = Number(minu) / minuVal;
      var minutVal = minut * 60;
      var minuteArr = minutVal.toString().split(".");
      var minute = Number(minuteArr[0]);
      var sec = minuteArr[1];
      var secVal = Math.pow(10, sec.length);
      var seco = Number(sec) / secVal;
      var second = parseInt(seco * 60);
      var value = hour + '° ' + minute + '′ ' + second + '″';
      return value;
    } else {
      return ''
    }

  }
 

}