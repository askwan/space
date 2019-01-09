import SObjectTile from '../manageData/SObjectTile'
import GlobalData from '../../GlobalData'
// import { CesiumEventBus, CesiumEvent } from '../cesiumEvent/Event'
// 引擎数据管理

class MapDataStore {
  constructor() {
    // 当前引擎加载的对象数据
    this.lumpAll = {} // 总块  里面对象包数组  是sobjectID
  }

  createSobjectTile(list) {
    console.log(list,'new sobject')
    this.lumpAll.one = new SObjectTile(list)
  }

  update(frameState) {
    // 对场景内的切片进行调度
    if (GlobalData.historyOpen) {
      return
    }
    for (let i in this.lumpAll) {
      this.lumpAll[i].update(frameState)
    }
  }

  /**
  根据对象id查询对象
   */
  querySObjectById(sid) {
    for (let i in this.lumpAll) {
      let sobjectList = this.lumpAll[i].sobjectList
      if (sobjectList[sid]) {
        return sobjectList[sid]
      }
    }
    return
  }

  modelAnimations(otItem, index, id, val) { // 控制模型动画的执行
    let sobj = this.primitiveAll[id]
    console.log(sobj)
    if (otItem.mdef.type == 1) {
      sobj.sobject.forms.forEach((n, i) => {
        if (n.type == 50) {
          sobj.primitive[i].animations = val
          sobj.primitive[i].animation()
        }
      })
    }
  }
  allRelationShow(value, sobjId) {}

}
let mapDataStore = new MapDataStore()
export default mapDataStore