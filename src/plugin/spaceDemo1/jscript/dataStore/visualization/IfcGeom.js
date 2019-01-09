var ifcEntityTypeColor = {
  'IfcWindow': [125 / 255, 208 / 255, 239 / 255, 0.5], // 窗户的玻璃
  'IfcDoor': [77 / 255, 44 / 255, 28 / 255, 1], // 门
  //   "IfcSlab": [255 / 255, 100 / 255, 100 / 255, 1], //墙板
  'IfcStairFlight': [226 / 255, 245 / 255, 255 / 255, 1], // 楼梯的边
  //   "IfcMember": [255 / 255, 1 / 255, 1 / 255, 1], //窗框
  //   "IfcPlate": [1 / 255, 255 / 255, 1 / 255, 1], //窗户不透明的
  //   "IfcBeam": [1 / 255, 1 / 255, 255 / 255, 1], //楼梯墙的边
  //   "IfcColumn": [111 / 255, 1 / 255, 255 / 255, 1], //柱状体
  //   "IfcWallStandardCase": [111 / 255, 111 / 255, 255 / 255, 1], //楼梯围墙
  //   "IfcBuildingElementPart": [1 / 255, 255 / 255, 1 / 255, 1], //外围墙体
  //   "IfcRailing": [1 / 255, 255 / 255, 1 / 255, 1], //护栏
  //   "IfcCovering": [1 / 255, 255 / 255, 1 / 255, 1], //顶层遮盖的
  //   "IfcFooting": [1 / 255, 255 / 255, 1 / 255, 1], //底座

}
class IfcGeom {
  constructor(sobject, form) {
    this.sobject = sobject
    this.createMesh(sobject, form)
  }
  createPosition(vertices, matrix) { // 处理顶点
    if (vertices.length) {
      let positions = new Float64Array(vertices.length)
      var matrix4 = Cesium.Matrix4.fromColumnMajorArray(matrix)
      vertices.forEach((position, i, arr) => {
        if (i % 3 === 0) {
          var res = Cesium.Matrix4.multiplyByPoint(matrix4, Cesium.Cartesian3.fromArray(arr, i), new Cesium.Cartesian3())
          positions[i] = res.x
          positions[i + 1] = res.y
          positions[i + 2] = res.z
        }
      })
      return positions
    }
    return

  }
  createMaterials(form, sobject) { // 把颜色处理成对象
    let colors = form.materials
    let idx = 0
    let materials = {}
    if (colors != null && colors.length > 0) {
      for (let i = 0; i < colors.length; i += 4) {
        if (ifcEntityTypeColor[sobject.otype.name]) {
          // materials[idx] = [colors[i], colors[i + 1], colors[i + 2], 0.6]
          materials[idx] = ifcEntityTypeColor[sobject.otype.name]
        } else if (colors[i] == 1 && colors[i + 1] == 1 && colors[i + 2] == 1 && colors[i + 3] == 1) {
          materials[idx] = [207 / 255, 207 / 255, 207 / 255, 1]
        } else {
          materials[idx] = [colors[i], colors[i + 1], colors[i + 2], colors[i + 3]]
        }
        idx++
      }
    } else {
      materials[idx] = [207 / 255, 207 / 255, 207 / 255, 1]

    }
    return materials


  }
  createMesh(sobject, form) {
    let geomData = form; // data.forms[0]
    let materials = this.createMaterials(form, sobject)
    let indicesColor = new Uint8Array(geomData.vertices.length / 3 * 4)
    let materialIndices = geomData.materialIndices
    for (let i = 0; i < materialIndices.length; i++) {
      let n = materialIndices[i]
      let material = []
      if (materials[n]) {
        material = materials[n]
      } else {
        material = materials['0']
      }
      for (let j = 0; j < 3 * 4; j++) {
        indicesColor[(3 * 4 * i) + j] = material[j % 4] * 255
      }
    }
    let positions = this.createPosition(geomData.vertices, geomData.matrix)
    let attributes = new Cesium.GeometryAttributes({
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: positions
      }),
      color: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.UNSIGNED_BYTE,
        componentsPerAttribute: 4,
        normalize: true,
        values: indicesColor

      }),
      normal: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        componentsPerAttribute: 3,
        values: new Float32Array(geomData.normals)

      })
    })
    let geometry = new Cesium.GeometryPipeline.computeNormal(new Cesium.Geometry({
      attributes: attributes,
      indices: new Uint16Array(geomData.indices),
      // primitiveType: Cesium.PrimitiveType.TRIANGLES,
      boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
    }))
    this.attributes = geometry.attributes
    this.indices = geometry.indices
    this.primitiveType = geometry.primitiveType
    this.boundingSphere = geometry.boundingSphere
    this.maxHeight = this.contrast(positions)
  }
  contrast(data) {
    let num = data[2]
    for (let i = 2; i < data.length; i += 3) {
      if (data[i] > num) {
        num = data[i]
      }
    }
    return num
  }
}

export default IfcGeom
