// import {
//   trajectoryQuery
// } from '../../../psde/objectService'
/**
轨迹
 */
class SObjectTrajectory {
  constructor(dynamicData, sobject, geoWkt) {
    this.sobject = sobject
    this.geoWkt = geoWkt
    this.primitive = new Cesium.PolylineCollection() //生成轨迹
    this.pointArr = new Cesium.PointPrimitiveCollection() //生成节点
    this.property = '' //储存时间坐标
    this.quaternion = '' //四元数
    this.propertyNow = '' //储存时间坐标当前的
    this.dynamicData = dynamicData
    // this.manage()
    this.create()
  }
  update(frameState) {
    if (this.primitive) {
      this.primitive.update(frameState)
    }
    if (this.pointArr.length > 0) {
      this.pointArr.update(frameState)
    }
  }
  manage() {
    // console.log(this.sobject.id,'------------------------')
    if (this.sobject.actions) {
      let length = this.sobject.actions.length
      // console.log(this.sobject)
      for (let i = 0; i < length; i++) {
        let act = this.sobject.actions[i]
        if (act.eTime != act.sTime) {
          let ob = {
            oids: [this.sobject.id],
            tableName: this.sobject.otype.tags,
            startTime: act.sTime,
            endTime: act.eTime,
            geoWkt: this.geoWkt
            // version: this.sobject.version.vid,
          }
          // console.log(ob)
          trajectoryQuery(ob).then(res => {
            if (res.objectDynamicDatasList && res.objectDynamicDatasList[0].objectDynamicDataList && res.objectDynamicDatasList[0].objectDynamicDataList[0]) {
              this.sobject.dynamicData = res.objectDynamicDatasList[0].objectDynamicDataList[0].dynamicData
            }
            this.create()
          }, (err) => {
            console.log('轨迹请求错误', err)
          })
        } else {

        }



      }
      if (length == 1) {

      }

    }

  }
  create() { //生成四元数
    let list = this.dynamicData
    let arr = []
    this.property = new Cesium.SampledPositionProperty()
    for (let i = 0; i < list.length; i++) {
      let d = list[i]
      let a = [d.location.x, d.location.y, 10]
      arr = arr.concat(a)
      this.pointArr.add(this.node(a))
      let time = Cesium.JulianDate.fromDate(new Date(d.currentTime))
      let coor = Cesium.Cartesian3.fromDegrees(a[0], a[1], a[2]);
      this.property.addSample(time, coor)

    }
    let line = this.createTrajectory(arr)
    if (line) {
      this.primitive.add(line)

    }
    // console.log(this.primitive)
    // console.log(this.pointArr)

  }
  node(arr) { //节点圈
    let point = {
      show: true,
      position: Cesium.Cartesian3.fromDegrees(arr[0], arr[1]),
      pixelSize: 5.0,
      color: Cesium.Color.TRANSPARENT,
      outlineColor: Cesium.Color.GOLD,
      outlineWidth: 3.0,
      // id: this.sobject.id + '-' + this.sobject.uuid


    }
    return point
  }
  createTrajectory(arr) { //轨迹线
    if (arr.length < 1) {
      return null
    }
    let line = {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(arr),
      width: 1,
      loop: false,
      material: new Cesium.Material({
        fabric: {
          type: 'Color',
          uniforms: {
            color: new Cesium.Color(1.0, 1.0, 0.3, 1),
          }
        }
      }),
      // id: this.sobject.id + '-' + this.sobject.uuid

    }
    return line
  }

  countCoordinate(t, pri) { //计算当前模型的位置并修改
    let time = Cesium.JulianDate.fromDate(t)
    if (this.property) {
      let propertyNow = this.property.getValue(time)
      if (propertyNow) {
        this.propertyNow = propertyNow
        let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(propertyNow)
        let lat = Cesium.Math.toDegrees(cartographic.latitude)
        let lng = Cesium.Math.toDegrees(cartographic.longitude)
        let hei = cartographic.height
        this.sobject.currentPos = [lng, lat, hei];
        propertyNow = Cesium.Cartesian3.fromDegrees(lng, lat, hei < 0 ? 0 : hei);

        let Velocity = new Cesium.VelocityOrientationProperty(this.property)
        let orientation = Velocity.getValue(time)

        if (orientation) {
          let modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation), propertyNow)
          //mapDataStore  中找到这个primitive
          // let _primitive = historyDataStroe.primitiveAll[this.sobject.id].versions[this.sobject.uuid].pri;
          for (let i = 0; i < pri.length; i++) {
            if (pri[i] && pri[i].type == 50) {
              pri[i].updateModelMatrix(modelMatrix)
            }
          }
        }
      } else {
        this.propertyNow = ''
      }
    }

  }


}
export default SObjectTrajectory
