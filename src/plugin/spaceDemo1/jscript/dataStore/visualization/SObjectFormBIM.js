import IfcGeom from './IfcGeom'

import {
  formQuery
} from '../../../psde/objectService'
let childrenCollections = []

let ifcFormCollections = {}

function getSobjectIfcMeshForm(sobject) {
  for (let i = 0; i < sobject.forms.length; i++) {
    let form = sobject.forms[i]
    if (form.type == 62) {
      return form
    }
  }
  return null
}

class BimNode {
  constructor(sobject, location, style) {
    this.children = []
    this.sobject = sobject

    this.location = location; // new Cesium.Cartesian3.fromDegrees(113.631081, 34.737166, 0); // 经纬度坐标
    this.excursion = new Cesium.Cartesian3(0, 0, 0); // 处理偏移
    this.zoomIn = 0.01; // 缩放量
    if (style.scale && style.scale != '') {
      this.zoomIn = Number(style.scale)
    }

    // console.log(style, 'bim样式')
    this.isajax = false
    this.pitch = false

    this.createGeom(this.sobject)
  }
  addChildrenNode(node) {
    this.children.push(node)
    if (node._primitive) {
      childrenCollections.push(node)
    }
  }
  getChildrenNode() {
    return childrenCollections
  }
  getSObjectId() {
    return this.sobject.id
  }
  setIfcFormData(ifcForm, geom) {
    ifcForm.indices = geom.indices
    ifcForm.materialIndices = geom.materialIndices
    ifcForm.materials = geom.materials
    ifcForm.matrix = geom.matrix
    ifcForm.normals = geom.normals
    ifcForm.vertices = geom.vertices
  }
  createGeom(sobject) {
    let ifcForm = getSobjectIfcMeshForm(sobject)
    if (ifcForm == null) {
      return
    }
    if (ifcForm.vertices == null) {
      // 判断是否已经加载过该形态
      if (ifcFormCollections[ifcForm.id]) {
        this.setIfcFormData(ifcForm, ifcFormCollections[ifcForm.id])
        this.createGeom(sobject)
      } else if (!this.isajax) {
        // ajax异步请求加载数据
        this.isajax = true
        formQuery(ifcForm.formref).then(res => {
          if (res.length > 0) {
            let data = res[0]
            let geom = JSON.parse(atob(data.geom))
            this.setIfcFormData(ifcForm, geom)
            this.createGeom(sobject)
            if (ifcForm.vertices != null) {
              ifcFormCollections[ifcForm.id] = ifcForm
            }
          }
        })
      }
      return
    }
    let geometry = new IfcGeom(sobject, ifcForm)
    // 模型矩阵
    var modelMatrix = Cesium.Matrix4.multiplyByUniformScale(Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
      this.location), this.excursion, new Cesium.Matrix4()), this.zoomIn, new Cesium.Matrix4())
    // 四面体的实例
    var geometryInstance = new Cesium.GeometryInstance({
      geometry: geometry,
      modelMatrix: modelMatrix,
      attributes: {
        // color: new Cesium.ColorGeometryInstanceAttribute(1, 0, 0, 1),
        show: new Cesium.ShowGeometryInstanceAttribute(true)
      },
      id: sobject.id + '-' + sobject.uuid
    })
    this._primitive = new Cesium.Primitive({
      geometryInstances: geometryInstance,
      appearance: new Cesium.PerInstanceColorAppearance({
        faceForward: true, // 当true片段着色器根据需要翻转曲面法线时，确保法线面向观看者以避免黑点。当几何图形的两边都应该像阴影一样时，这很有用WallGeometry。
        translucent: sobject.otype.name == 'IfcWindow' ? true : false, // 何时true，几何图形预计会显示为半透明，因此Appearance#renderState启用了Alpha混合。
        closed: false, // 何时true，几何图形预计将关闭，因此Appearance#renderState启用背面剔除。
      }),
      vertexCacheOptimize: true, // 当true几何顶点针对顶点着色器前后高速缓存进行优化时。
      interleave: true, // 当true几何顶点属性交错时，这可以稍微提高渲染性能，但会增加加载时间。
      compressVertices: true, // 当true几何顶点被压缩时，这将节省内存。
      asynchronous: false, // 确定是否将异步创建该基元，或者阻止直到准备就绪。
      debugShowBoundingVolume: false, // 仅用于调试。确定是否显示此基元的命令的边界球体。
      shadows: Cesium.ShadowMode.ENABLED
    })
    this._primitive.sobjectForm = this
  }
  /**
  显示选择样式
  */
  showSelectStyle() {
    this._primitive.appearance = new Cesium.MaterialAppearance({
      material: new Cesium.Material({
        fabric: {
          type: 'Color',
          uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 1)
          }
        }
      }),
      faceForward: true,
      translucent: this.sobject.otype.name == 'IfcWindow' ? true : false,
      closed: false
    })
    this.pitch = true

  }
  /**
  清除选中样式
   */
  clearSelectStyle() {
    this._primitive.appearance = new Cesium.PerInstanceColorAppearance({
      faceForward: true,
      translucent: this.sobject.otype.name == 'IfcWindow' ? true : false,
      closed: false
    })
    this.pitch = false

  }
  update(frameState) {
    if (this._primitive && this.sobject.getIsShow() && this.sobject.otype.isShow) {
      this._primitive.update(frameState)
    }
    // 更新子对象
    for (let i = 0; i < this.children.length; i++) {
      let childrenNode = this.children[i]
      childrenNode.update(frameState)
    }
  }
}

class BimTree {
  constructor(sobject, form,sobjectList) {
    this.rootSbject = sobject
    this.form = form
    this.sobjectList=sobjectList
    let position = sobject.getSobjectPosition()
    this.style = {
      'scale': '1',
      'x': '',
      'y': '',
      'z': ''
    }
    if (form.style && form.style != '') {
      this.style = JSON.parse(form.style)[0]
    }

    this.rootNode = new BimNode(sobject, new Cesium.Cartesian3.fromDegrees(position[0], position[1], 0), this.style)

    this.buildChildNode(this.rootNode)
  }
  buildChildNode(parentNode) {
    let id = parentNode.getSObjectId()

    let childrens = this.getSOobjectByPid(id)

    if (childrens.length > 0) {
      for (let i in childrens) {
        let children = childrens[i]
        let childNode = new BimNode(children, parentNode.location, this.style)
        parentNode.addChildrenNode(childNode)
        this.buildChildNode(childNode)
      }
    }
  }
  /**
  根据父id获取子节点
   */
  getSOobjectByPid(pid) {
    console.log(pid)
    let resultList = []
    for (let i = 0; i < this.sobjectList.length; i++) {
      let sobject = this.sobjectList[i]
      for (let p = 0; p < sobject.parents.length; p++) {
        let parent = sobject.parents[p]
        if (parent.id == pid) {
          resultList.push(sobject)
        }
      }
    }
    return resultList
  }
  update(frameState) {
    if (this.rootNode) {
      this.rootNode.update(frameState)
    }
  }
}

/**
bim模型
 */
export default class SObjectFormBIM {
  constructor(form, sobject,sobjectList) {
    this.sobject = sobject
    this.form = form
    this.bimTree = new BimTree(sobject, form,sobjectList)

  }
  update(frameState) {

    this.bimTree.update(frameState)
  }
  buildBimTree() {}
}
