import map from "@/script/map.js";

//跟随
class Follow {
  constructor() {
    this.open = false
    this.id = ''
    this.uuid = ''
    this.height = 15000
  }
  movePlace(primitive) {
    if (primitive) {
      if (primitive.primitive && primitive.primitive.length > 0) {
        for (let i = 0; i < primitive.primitive.length; i++) {
          let model = primitive.primitive[i]
          if (model.type == 50 && model.id == this.id) {
            // console.log(model)
            if (primitive.trajectory.propertyNow) {
              let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(primitive.trajectory.propertyNow)
              let lat = Cesium.Math.toDegrees(cartographic.latitude)
              let lng = Cesium.Math.toDegrees(cartographic.longitude)
              map.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                  lng, lat, this.height
                ),
                duration: 0
              });
            } else {
              let coor = model.form.geom.coordinates
              map.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                  coor[0], coor[1], this.height
                ),
                duration: 0
              });
            }
          }
        }
      }
    }

  }
  getPrimitive() {
    // 获取模型的primite

  }
}
export default Follow
