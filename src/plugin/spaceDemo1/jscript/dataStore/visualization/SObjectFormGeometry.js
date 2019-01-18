// import StyleCtrl from './StyleCtrl'
import colorList from './colorList'
class SObjectFormGeometry {
  constructor(form, sobject) {
    this.sobject = sobject
    this.form = form
    this.id = sobject.id
    this.uuid = sobject.uuid
    this._primitive = null
    this._primitiveLabel = null
    this.color = ''
    this.isload = false
    this.pitch = false // 是否被选中
    this.createGeometry(this.form)
  }
  update(frameState) {
    let primitive = this._primitive
    if (primitive != null) {
      primitive.update(frameState)
    }
    let primitiveLabel = this._primitiveLabel
    if (primitiveLabel != null) {
      primitiveLabel.update(frameState)
    }
  }
  updateModelMatrix(modelMatrix) {
    if (this._primitive) {
      this._primitive.modelMatrix = modelMatrix
    }
  }
  showLabel() {
    if (this._primitiveLabel != null && this.isload) {
      this._primitiveLabel.show = true
    }
  }
  hideLabel() {
    if (this._primitiveLabel != null && !this.isload) {
      this._primitiveLabel.show = false
    }
  }
  /**
  显示选择样式
   */
  showSelectStyle() {
    if (this._primitive) {
      if (this._primitive.appearance) {
        this.color = this._primitive.appearance.material.uniforms.color
      }
      if (this.form.type == 21) {
        // 选择的是点对象
      } else if (this.form.type == 22 || this.cesiumStyle.type == 'line') {
        this._primitive.appearance = new Cesium.PolylineMaterialAppearance({
          material: Cesium.Material.fromType('Color', {
            color: new Cesium.Color(1.0, 0.0, 0.0, 1.0)
          })
        })
      } else if (this.form.type == 23) {
        this._primitive.appearance = new Cesium.MaterialAppearance({
          material: new Cesium.Material({
            fabric: {
              type: 'Color',
              uniforms: {
                color: new Cesium.Color(1.0, 0.0, 0.0, this.color.alpha)
              }
            }
          })
        })
      }
      this.pitch = true
    }
  }
  /**
  清除选中样式
   */
  clearSelectStyle() {
    if (this.form.type == 21) {} else if (this.form.type == 22 || this.cesiumStyle.type == 'line') {
      this._primitive.appearance = new Cesium.PolylineMaterialAppearance({
        material: Cesium.Material.fromType('Color', {
          color: new Cesium.Color(this.color.red, this.color.green, this.color.blue, this.color.alpha)
        })
      })
    } else if (this.form.type == 23) {
      this._primitive.appearance = new Cesium.MaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: 'Color',
            uniforms: {
              color: new Cesium.Color(this.color.red, this.color.green, this.color.blue, this.color.alpha)
            }
          }
        })
      })
    }
    this.pitch = false
  }
  createGeometry(form) {
   
    try {
      // this.cesiumStyle = StyleCtrl.getGeomFormStyle(this.sobject, this.form)
      // console.log(this.sobject, this.form)
      // console.log(this.cesiumStyle,StyleCtrl.styleList)
      // let c=colorList.getColor(this.sobject)
      this.cesiumStyle=colorList.getColor(this.sobject)
      // this.cesiumStyle.color=c.color
      // this.cesiumStyle.opacity=c.opacity
      // console.log(this.cesiumStyle)
      // console.log(getColor.getColor(this.sobject))

      if (form.type == 21) {
        this._primitiveLabel = this.createLabel(form)
        this._primitive = this.createPoint(form)
      } else if (form.type == 22) {
        this._primitive = this.createLine(form, this.cesiumStyle)
      } else if (form.type == 23) {
        if (this.cesiumStyle.type == 'line') {
          this._primitive = this.createLine(form, this.cesiumStyle)
        } else {
          this._primitive = this.createPolygon(form, this.cesiumStyle)
        }
      }
      if (this._primitive) {
        if (this._primitive.appearance) {
          this.color = this._primitive.appearance.material.uniforms.color
        }
      }
    } catch (ex) {
      // console.log('几何数据错误')
      console.log(ex, form, '几何数据错误')
    }
    this.isload = true
  }
  createLabel(form) {
    let geom = form.geom
    if (geom == null) {
      return null
    }
    let primitiveLabel = new Cesium.LabelCollection() // 广告牌
    if (geom.coordinates && typeof geom.coordinates[0] != 'number') {
      return null
    }
    primitiveLabel.add({
      position: Cesium.Cartesian3.fromDegrees(geom.coordinates[0], geom.coordinates[1]),
      text: this.sobject.name,
      fillColor: Cesium.Color.WHITE,
      font: '18px 宋体',
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(8.0, 8.0),
      id: this.sobject.id + '-' + this.sobject.uuid,
      show: true
    })
    return primitiveLabel
  }
  createPoint(form) {

    let geom = form.geom

    if (geom == null) {
      return null
    }
    if (geom.coordinates && typeof geom.coordinates[0] != 'number') {
      return null
    }
    let point = {
      position: Cesium.Cartesian3.fromDegrees(geom.coordinates[0], geom.coordinates[1]),
      image: '/img/redmarker.png',
      height: 16,
      width: 16,
      color: Cesium.Color.WHITE,
      id: this.sobject.id + '-' + this.sobject.uuid
    }
    let billboards = new Cesium.BillboardCollection()
    billboards.add(point)
    return billboards
  }

  createLineByPosition(positions, cesiumStyle) {
    return new Cesium.GeometryInstance({
      geometry: new Cesium.PolylineGeometry({
        positions: positions,
        width: cesiumStyle.width,
        vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
      }),
      id: this.sobject.id + '-' + this.sobject.uuid
    })
  }
  concatCoordinates(coordinates) {
    let posis = []
    coordinates.forEach(n => {
      posis = posis.concat(n)
    })

    let positions = Cesium.Cartesian3.fromDegreesArray(posis)
    return positions
  }
  createLine(form, cesiumStyle) {
    let geometry = []
    let geom = form.geom
    if (geom == null) {
      return null
    }
    if (form.type == 22) {
      if (geom.type == 'MultiLineString') {
        for (let i = 0; i < geom.coordinates.length; i++) {
          let coordinates = geom.coordinates[i]
          let positions = this.concatCoordinates(coordinates)
          geometry.push(this.createLineByPosition(positions, cesiumStyle))
        }
      } else {
        let positions = this.concatCoordinates(geom.coordinates)
        geometry.push(this.createLineByPosition(positions, cesiumStyle))
      }
    } else if (form.type == 23) {
      if (geom.type == 'MultiPolygon') {
        for (let i = 0; i < geom.coordinates.length; i++) {
          for (let j = 0; j < geom.coordinates[i].length; j++) {
            for (let k = 0; k < geom.coordinates[i][k].length; k++) {
              let coordinates = geom.coordinates[i][k]
              let positions = this.concatCoordinates(coordinates)
              geometry.push(this.createLineByPosition(positions, cesiumStyle))
            }
          }
        }
      } else {
        for (let i = 0; i < geom.coordinates.length; i++) {
          for (let j = 0; j < geom.coordinates[i].length; j++) {
            let coordinates = geom.coordinates[i]
            let positions = this.concatCoordinates(coordinates)
            geometry.push(this.createLineByPosition(positions, cesiumStyle))
          }
        }
      }
      /*
            geom.coordinates.forEach(n => {
              let posis = []
              n.forEach((q, p) => {
                if (geom.type == 'MultiPolygon') {
                  q.forEach(w => {
                    posis = posis.concat(w)
                  })
                }else {
                  posis = posis.concat(q)
                }
              })
              geometry.push(new Cesium.GeometryInstance({
                geometry: new Cesium.PolylineGeometry({
                  positions: Cesium.Cartesian3.fromDegreesArray(posis),
                  width: cesiumStyle.width,
                  vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
                }),
                id: this.sobject.id + '-' + this.sobject.uuid
              }))
            })*/
    } else {
      console.log('type是线，但是样式是line')
    }

    let primitive = new Cesium.Primitive({
      geometryInstances: geometry,
      appearance: new Cesium.PolylineMaterialAppearance({
        material: Cesium.Material.fromType('Color', {
          color: cesiumStyle.color
        })
      })
    })
    primitive.sobjectForm = this
    return primitive
  }
  getRidOf(arr, tile) {
    if (Math.abs(arr[0] - tile[0]) >= 0.000001 && Math.abs(arr[0] - tile[1]) >= 0.000001 && Math.abs(arr[1] - tile[2]) >= 0.000001 && Math.abs(arr[1] - tile[3]) >= 0.000001) {
      return arr
    } else {
      return []
    }
  }
  getHeight(sobject) {
    for (let i in sobject.attributes) {
      let sobj = sobject.attributes[i]
      if (sobj.name == 'height') {
        return parseFloat(sobj.value)
      }
    }
    return 0
  }
  getMinHeight(sobject) {
    for (let i in sobject.attributes) {
      let sobj = sobject.attributes[i]
      if (sobj.name == 'min_height'||sobj.name == 'minheight') {
        return parseFloat(sobj.value)
      }
    }
    return 0
  }
  createPolygon(form, cesiumStyle) {
    let geom = form.geom
    if (geom == null) {
      return null
    }
    let height = this.getHeight(this.sobject)
    let minheight = this.getMinHeight(this.sobject)
    height=height?height:0
    minheight=minheight?minheight:0
    if (geom.type == 'Polygon') {
      // return
      let posiss = []

      geom.coordinates.forEach(n => {
        n.forEach(q => {
          posiss = posiss.concat(q)
        })
      })
      // posiss = posiss.reverse()
      let polygon = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(posiss)
        ),
        height: height, // 拔高
        extrudedHeight:minheight // 拔高
      })
      let geometry = []
      // geometry.push(Cesium.PolygonGeometry.createGeometry(polygon))
      geometry.push(polygon)
      return this.createPrimitive(geometry, cesiumStyle.color)
    } else if (geom.type == 'MultiPolygon') {
      let hierarchy = []
      geom.coordinates.forEach((n, i) => {
        let arr = []
        n.forEach((q, p) => {
          let arrs = []
          q.forEach((w) => {
            arrs = arrs.concat(w)
          })
          arr.push(arrs)
        })
        hierarchy.push(arr)
      })
      // console.log(hierarchy)
      function poly(hierarchy, num) {
        let poly = ''
        let other = []
        let arr = []
        hierarchy.forEach((q, p) => {
          if (p == 0) {
            poly = new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(q), arr)
          } else if (p == 1) {
            arr.push(new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(q), other))
          } else {
            arr.push(new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(q)))
          }
        })

        return poly
      }
      let geometry = []
      hierarchy.forEach((n, i) => {
        let polygon = new Cesium.PolygonGeometry({
          polygonHierarchy: poly(n),
          height: height, // 拔高
          extrudedHeight:minheight // 拔高
        })
        // geometry.push(Cesium.PolygonGeometry.createGeometry(polygon))
        geometry.push(polygon)
      })
      // cesiumStyle.color=new Cesium.Color(0.0,0.0, 1.0, 0.5)
      return this.createPrimitive(geometry, cesiumStyle.color)
    } else {
      console.log('wwwwwwww', form)
    }
  }
  createPrimitive(geometry, styleColor) {
  
    let primitive = []
    geometry.forEach((n, i) => {
      primitive.push(new Cesium.GeometryInstance({
        geometry: n,
        id: this.sobject.id + '-' + this.sobject.uuid,
        // attributes: {
        //   color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5))
        // }
      }))
    })

    let model = new Cesium.Primitive({
      geometryInstances: primitive,
      // asynchronous: false,
      // appearance: new Cesium.PerInstanceColorAppearance({
      //   translucent: false,
      // })
      appearance: new Cesium.MaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: 'Color',
            uniforms: {
              color: styleColor
            }
          }
        })
      })
    })

    model.sobjectForm = this
    return model
  }
}
export default SObjectFormGeometry
