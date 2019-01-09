import map from '../../cesiumMap/map'
import globalData from '../../GlobalData'
import ToolEvent from '../toolEvent'

/* 
    拾取模型
*/
class PickModel extends ToolEvent {
  constructor() {
    super()
    this.pickPrimitive = null
    this.pickColor = null
  }
  getName() {
    return 'PickModel'
  }
  mouseLeftClick(eve) {
    let ep = map.viewer.scene.pick(eve.position)
   // console.log(ep)
    if (Cesium.defined(ep)) {
      let primitive = ep.primitive
      if (primitive.sobjectForm && primitive.sobjectForm.showSelectStyle) {
        // 选中的是模型
        if (this.pickPrimitive) {
          this.pickPrimitive.materials[0].setValue('baseColorFactor', this.pickColor);
        }
        if (primitive.sobjectForm.nodeRelation && Object.keys(primitive.sobjectForm.nodeRelation).length > 0 && !globalData.pickModelNode) {
          globalData.pickModelId=primitive.sobjectForm.sobject.id;
          globalData.currentSelectObjectId = ''
          globalData.currentSelectObject = ''
          this.currentSobject()
          let mesh = ep.primitive.getMesh(ep.mesh.name)
          if (mesh) {
            let ModelMaterial = mesh.materials[0]
            this.pickPrimitive = mesh
            this.pickColor = ModelMaterial.getValue('baseColorFactor').clone()
            ModelMaterial.setValue('baseColorFactor', new Cesium.Cartesian4(1.0, 0.0, 0.0, 1.0));
          }
         
        } else {
          this.pickPrimitive = null
          this.pickColor = null
          this.currentSobject(primitive.sobjectForm)
          map.viewer.scene.render()
        }

      } else {}
      // 选中对象后直接返回
      return
    } else {
      globalData.pickModelId=''
      globalData.currentSelectObjectId = ''
      globalData.currentSelectObject = ''
      this.currentSobject()
    }
  }
  // 选中后的对象 
  currentSobject(sobj) {
    if (!sobj || !sobj.sobject || !sobj.sobject.id) {
      store.commit(MutationsList.getClick, {})
      return
    }
    let par = {
      ids: sobj.sobject.id,
      loadAttr: true, // 是否加载属性信息
      loadForm: true, // 是否加载形态数据
      loadNetwork: true, // 是否加载关系
      loadModel: true, // 是否加载模型
      loadObjType: true,
      loadAction: true // 是否载入操作集合
    };
    objectQuery.query(par).then(res => {
      if (res.list && res.list[0]) {
        store.commit(MutationsList.getClick, res.list[0]);
        globalData.currentSelectObjectId = sobj.sobject.id;
        globalData.currentSelectObject = res.list[0];
        globalData.pickModelId=''
      }
    });
    store.commit(MutationsList.getClick, sobj.sobject)
  }

}
export default PickModel
