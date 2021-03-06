import historyDataStroe from '../control/HistoryDataStroe'
import mapDataStore from '../control/MapDataStore'
import GlobalData from "../../GlobalData";

/**
空间对象关系显示
 */
class SObjectRelationPrimitive {
  constructor(sobject) {
    this.sobject = sobject
    this.polylineCollection = new Cesium.PolylineCollection() //关系线

    this.primitive = {}

    // this.color = Cesium.Color.GOLD

    this.show = true;
    this.processingData(sobject)
  }

  update(frameState) {
    if (this.polylineCollection) {

      this.polylineCollection.update(frameState)
    }
  }
  orShow(val) {
    this.show = val
  }

  processingData(sobject) {
    let pt1 = sobject.getSobjectNowPosition()

    for (let i = 0; i < sobject.network.nodes.length; i++) {
      let ronode = sobject.network.nodes[i]
      if (!ronode.point) {
        return
      }
      let pt2 = [ronode.point.x, ronode.point.y, ronode.point.z]
      if (mapDataStore.sobjectData) {
        mapDataStore.sobjectData.forEach((n, q) => {
          if (ronode.relatedObjectId == n.id) {
            pt2 = n.getSobjectNowPosition()
          }
        })
      }
      if (pt1.length < 3) {
        pt1.push(0)
      }
      if (pt2.length < 3) {
        pt2.push(0)
      }

      let rrid = ronode.edge.relation.id
      let colors
      if (GlobalData.relationColor[rrid]) {
        colors = GlobalData.relationColor[rrid]
      } else {
        // let color = Cesium.Color.fromRandom({
        //   alpha: 1.0
        // });
        let color = Cesium.Color.fromRandom({
          maximumRed: 0.75,
          maximumGreen: 0.65,
          maximumBlue: 0.5,
          alpha: 1.0
        });
        GlobalData.relationColor[rrid] = color
        colors = color
      }
      this.primitive[ronode.relatedObjectId] = this.createLine(pt1, pt2, sobject.id, colors)
    }
  }
  createLine(pt1, pt2, id, color) {
    // let posis = pt1.concat(pt2)
    let posis = this.dispose(pt1, pt2)
    let model = {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(posis),
      width: 2,
      granularity: Cesium.Math.RADIANS_PER_DEGREE,
      followSurface: false,
      vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
      material: new Cesium.Material({
        fabric: {
          // type: 'PolylineDash',
          type: 'PolylineDash',
          uniforms: {
            color: color,
            dashLength: 0
          }
        }
      }),
      id: id
    }
    this.polylineCollection.add(model)
    return model
  }
  dispose(arr1, arr2) {
    let x = (arr2[0] - arr1[0]) / 180;
    let y = (arr2[1] - arr1[1]) / 180;
    let z = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromRadians(arr1[0], arr1[1], arr1[2]), Cesium.Cartesian3.fromRadians(arr2[0], arr2[1], arr2[2])) / 1000;
    let all = [];
    for (let i = 0; i < 180; i++) {
      let arr = []
      if (i < 90) {
        arr = [arr1[0] + x * (i + 1), arr1[1] + y * (i + 1), arr1[2] + z * Math.sin(Math.PI / 180 * (i + 1))]
      } else {
        arr = [arr1[0] + x * (i + 1), arr1[1] + y * (i + 1), arr1[2] + z * Math.sin(Math.PI / 180 * (180 - i + 1))]
      }
      arr[2] = arr[2] * 5
      all = all.concat(arr)
    }
    let allArr = arr1.concat(all, arr2)
    return allArr
  }

}

export default SObjectRelationPrimitive