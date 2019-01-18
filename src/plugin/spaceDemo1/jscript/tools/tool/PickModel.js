import map from '../../cesiumMap/map'
import GlobalData from '../../GlobalData'
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
    console.log(ep)
    if (Cesium.defined(ep)) {
      let primitive = ep.primitive
      if (primitive.sobjectForm && primitive.sobjectForm.showSelectStyle) {
        // 选中的是模型
        if (this.pickPrimitive) {
          this.pickPrimitive.materials[0].setValue('baseColorFactor', this.pickColor);
        }
        if (primitive.sobjectForm.nodeRelation && Object.keys(primitive.sobjectForm.nodeRelation).length > 0 && !GlobalData.pickModelNode) {
          GlobalData.pickModelId = primitive.sobjectForm.sobject.id;
          GlobalData.currentSelectObjectId = ep.node._name.split('-')[1];
          GlobalData.currentSelectObject = '';

          GlobalData.sobjectDatalist.forEach((n,i)=>{
            if(n.id==GlobalData.currentSelectObjectId){
              GlobalData.currentSelectObject = n;
            }
          })
          this.currentSobject()
          let mesh = ep.primitive.getMesh(ep.mesh.name)
          if (mesh) {
            let ModelMaterial = mesh.materials[0]
            this.pickPrimitive = mesh
            this.pickColor = ModelMaterial.getValue('baseColorFactor').clone()
            ModelMaterial.setValue('baseColorFactor', new Cesium.Cartesian4(1.0, 0.0, 0.0, 1.0));
          }
          map.viewer.scene.render()
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
      GlobalData.pickModelId = ''
      GlobalData.currentSelectObjectId = ''
      GlobalData.currentSelectObject = ''
      this.currentSobject()
      map.viewer.scene.render()

    }

  }
  // 选中后的对象 
  currentSobject(sobj) {
    if (!sobj || !sobj.sobject || !sobj.sobject.id) {
      return
    }
    GlobalData.currentSelectObjectId = sobj.sobject.id;
    GlobalData.currentSelectObject = sobj.sobject;
    GlobalData.pickModelId = ''
  }

}
export default PickModel