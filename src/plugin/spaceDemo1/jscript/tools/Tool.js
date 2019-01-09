import {
  EventAll,
  MapEvent
} from '../event/Event.js'

import MeasurementManage from './tool/MeasurementManage'
import PickCoordinate from './tool/PickCoordinate'
import PickModel from './tool/PickModel'
class Tool {
  constructor() {

    this.tools = {} //工具集合

    this.init()
    this.nowToolName = 'PickModel' //当前工具状态 默认普通获取

  }
  init() {
    //拾取地图内模型
    let pickModel = new PickModel()
    this.tools[pickModel.getName()] = pickModel
    //点击获取坐标
    let pickCoordinate = new PickCoordinate()
    this.tools[pickCoordinate.getName()] = pickCoordinate
    //量算
    let measurementManage = new MeasurementManage()
    this.tools[measurementManage.getName()] = measurementManage

    this.monitor()
  }
  monitor() {
    EventAll.on(MapEvent.PickObject, data => {
      this.mouseEventLeft(data.eve)
    })
    EventAll.on(MapEvent.MouseRight, data => {
      this.mouseEventRight(data.eve)
    })
    EventAll.on(MapEvent.MouseMove, data => {
      this.mouseEventMove(data.eve)
    })
  }
  mouseEventLeft(eve) {
    for (let toolName in this.tools) {
      let tool = this.tools[toolName]
      if (toolName == this.nowToolName) {
        tool.mouseLeftClick(eve)
      }
    }
  }
  mouseEventRight(eve) {
    for (let toolName in this.tools) {
      let tool = this.tools[toolName]
      if (toolName == this.nowToolName) {
        tool.mouseRightClick(eve)
      }
    }

  }
  mouseEventMove(eve) {
    for (let toolName in this.tools) {
      let tool = this.tools[toolName]
      if (toolName == this.nowToolName) {
        tool.mouseMoveClick(eve)
      }
    }
  }
  setCurrent(val) {
    this.nowToolName = val
  }
 

}

export default Tool
