import map from "../../cesiumMap/map";

import HeightFinding from './measurement/HeightFinding'
import Ranging from './measurement/Ranging'
import ToolEvent from '../toolEvent'

/* 
    量算
*/
class MeasurementManage extends ToolEvent {
  constructor() {
    super()
    this.measurementTool = {} //总类型

    this.selectState = '' //量算选择状态

    this.init()
  }
  init() {
    //测高
    let heightFinding = new HeightFinding()
    this.measurementTool[heightFinding.getName()] = heightFinding
    //测距
    let ranging = new Ranging()
    this.measurementTool[ranging.getName()] = ranging
  }
  getName() {
    return 'MeasurementManage'
  }
  setSelectState(val) {
    if (this.selectState != val) {
      if(this.measurementTool[this.selectState]){
        this.measurementTool[this.selectState].mouseRightClick()
      }
    }
    this.selectState = val
  }
  mouseLeftClick( eve) {
    for (let i in this.measurementTool) {
      let type = this.measurementTool[i]
      if (this.selectState == i) {
        type.mouseLeftClick( eve)
      }
    }
  }
  mouseRightClick( eve) {
    for (let i in this.measurementTool) {
      let type = this.measurementTool[i]
      if (this.selectState == i ) {
        type.mouseRightClick( eve)
      }
    }
  }
  mouseMoveClick(eve) {
    for (let i in this.measurementTool) {
      let type = this.measurementTool[i]
      if (this.selectState == i ) {
        type.mouseMoveClick(eve)
      }
    }
  }

  clear() { //清除
    console.log('clear')
    for (let i in this.measurementTool) {
      let type = this.measurementTool[i]
      type.clear()
    }
    map.measurementLabel.removeAll()
    map.measurementPolyline.removeAll()
    map.viewer.scene.render()

  }
}
export default MeasurementManage
