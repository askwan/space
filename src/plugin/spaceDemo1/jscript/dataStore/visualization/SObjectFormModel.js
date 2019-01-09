import GlobalData from "../../GlobalData";
const modelUrl = "http://bt1.geosts.ac.cn/api/dae";
const downloadFile = modelUrl + "/model-service/model/rest/v0.1.0/datastore/slave/model/file/download"


class SObjectFormModel {
  constructor(form, sobject) {
    this.sobject = sobject
    this.form = form
    this._primitive = null
    this.isload = false
    this.color = ''
    this.animations = false
    this.type = 50
    this.id = this.sobject.id
    this.uuid = this.sobject.uuid
    this.pitch = false
    this.nodeRelation = {}

    this.createGltf(this.form)

  }
  update(frameState) {
    // var primitive = this._primitive

    if (this._primitive && this.isload) {
      try {
        this.modelTranslation()
        this._primitive.update(frameState)
      } catch (err) {
        console.log(err)
      }
    }
  }
  modelTranslation() {
    if (!GlobalData.pickModelNode && GlobalData.pickModelId == this.id) {
      let lv = 0
      for (let i in this.nodeRelation) {
        let nodes = this.nodeRelation[i]
        lv++
        for (let i in nodes) {
          let n = nodes[i]
          let nodess = this._primitive.getNode(n.name)
          nodess.matrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3((GlobalData.pickModelTranslation.x - 50) * lv, (GlobalData.pickModelTranslation.y - 50) * lv, (GlobalData.pickModelTranslation.z - 50) * lv));
        }

      }
    }
  }
  createGltf(form) {
    if (form.type == 50 && form.formref.refid > 0) {
      this._primitive = this.createModel(form)
      //this.animation()
      if (this._primitive) {
        this.color = this._primitive.color
      }
      this.isload = true
    }
  }
  createModel(data) {
    let posi = data.geom
    let style = []
    if (posi == null) {
      return null
    }
    let hpRoll = new Cesium.HeadingPitchRoll()
    if (data.style) {
      style = JSON.parse(data.style)[0]
      if (style.x && style.y && style.z) {
        hpRoll = Cesium.HeadingPitchRoll.fromDegrees(style.x ? style.x : 0, style.y ? style.y : 0, style.z ? style.z : 0)
      }
    }
    let modelPos = null
    if (posi.type == "Polygon") {
      let lon = 0
      let lat = 0
      let num = posi.coordinates[0].length
      for (let i = 0; i < num; i++) {
        let arr = posi.coordinates[0][i]
        lon += arr[0]
        lat += arr[1]
      }
      modelPos = Cesium.Cartesian3.fromDegrees(lon / num, lat / num, 0.0)
    } else if (posi.type == "Point") {
      modelPos = Cesium.Cartesian3.fromDegrees(posi.coordinates[0], posi.coordinates[1], parseInt(style.h ? style.h : 0))
    } else {
      return
    }
    let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(modelPos, hpRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west'))
    let url = downloadFile.baseURL + '/' + data.formref.refid
    // console.log(url,"模型地址")
    let model = Cesium.Model.fromGltf({
      url: url,
      modelMatrix: modelMatrix,
      // scale: 100,
      scale: parseFloat(style.scale ? style.scale : 1),
      // minimumPixelSize: parseFloat(style.smallPX ? style.smallPX : 50),
      // minimumPixelSize: 100,
      id: this.sobject.id + '-' + this.sobject.uuid
    })
    model.sobjectForm = this
    return model
  }
  animation() {
    if (this._primitive) {
      this._primitive.readyPromise.then(() => {
        if (this.animations) {
          this._primitive.activeAnimations.addAll({
            speedup: 1,
            loop: Cesium.ModelAnimationLoop.REPEAT
          })
        } else {
          this._primitive.activeAnimations.removeAll()
        }
        let reg = ".*IfcBuilding-.*";
        if (Object.keys(this.nodeRelation).length < 1) {
          let r = this._primitive.gltf.nodes
          r.forEach((n, i) => {
            if (n.name.match(reg)) {
              n.children.forEach((q, w) => {
                this.nodeRelation[q] = {}
                this.ifcNode(q, this.nodeRelation[q], r)
              })
            }
          });
          // console.log(this.nodeRelation)
        }
      })
    }

  }
  ifcNode(key, obj, arr) {
    if (arr[key].children) {
      arr[key].children.forEach((q, w) => {
        this.ifcNode(q, obj, arr)
      })
    } else {
      obj[arr[key].name] = arr[key]
    }
  }
  /**
  显示选择样式
   */
  showSelectStyle() {
    if (this._primitive) {
      this.color = this._primitive.color
      // console.log('模型高亮颜色', this._primitive.colorBlendMode, this._primitive.color)
      this._primitive.color = Cesium.Color.RED
      this.pitch = true

    }
  }
  /**
  清除选中样式
   */
  clearSelectStyle() {
    if (this._primitive) {
      this._primitive.color = this.color
      this.pitch = false

    }
  }
  updateModelMatrix(modelMatrix) {
    if (this._primitive) {
      this._primitive.modelMatrix = modelMatrix
    }
  }
}
export default SObjectFormModel