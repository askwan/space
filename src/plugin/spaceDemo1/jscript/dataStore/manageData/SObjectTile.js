import globalData from '../../GlobalData'

import SObjectFormGeometry from '../visualization/SObjectFormGeometry.js'
import SObjectFormModel from '../visualization/SObjectFormModel.js'
// import SObjectFormBIM from '../visualization/SObjectFormBIM.js'
import SObjectFormServer from '../visualization/SObjectFormServer.js'

import SObjectRelationPrimitive from '../visualization/SObjectRelationPrimitive'
import SObjectTrajectory from '../visualization/SObjectTrajectory.js'


import {
  EventAll,
  MapEvent
} from '../../event/Event.js'
import map from '../../cesiumMap/map'

/**
时空对象切片存储单元
 */
class SObjectTile {
  constructor(list,version) {
    this.list = list
    this.version = version

    // 存储对象数据
    this.sobjectList = {}
    // 存储显示对象
    this.primitiveList = {}
    // 关系线
    this.relationPolylinesList = {}
    // 轨迹
    this.trajectoryList = {}

    // 创建时间，用于做时间调度
    this.date = new Date()

    this.bebavior = '' // 行为

    // 切片是否载入
    this.isload = 'unload'

    this.manageData(this.list)

    this.parentTile = null

    this.dynamicData = null

    this.nextTime = nextTime
  }

  manageData(list) { // 处理数据
    let trajectoryId = []
    for (let i = 0; i < list.length; i++) {
      let sobject = list[i]
      if (sobject.forms && sobject.forms.length > 0) {
        this.sobjectList[sobject.id] = sobject
        // if (sobject.actions) {
        //   let length = sobject.actions.length
        //   for (let i = 0; i < length; i++) {
        //     let act = sobject.actions[i]
        //     if (act.sTime != act.eTime) {
        //       trajectoryId.push(sobject.id)
        //     }
        //   }
        // }

        this.createPrimitiveList(sobject)
      }
    }
  }
  // getTrajectory(trajectoryId) {
  //   let ob = {
  //     oids: trajectoryId,
  //     tableName: 'taxibeijing',
  //     // tableName: this.sobject.otype.tags,
  //     startTime: this.DateChange(this.version.vid * 1000),
  //     endTime: this.DateChange(this.nextTime),
  //     // endTime:this.JulianDateChange(map.clock.clock.stopTime),
  //     geoWkt: this.tile.arr[0] + ',' + this.tile.arr[1] + ',' + this.tile.arr[2] + ',' + this.tile.arr[3]
  //     // version: this.sobject.version.vid,
  //   }
  //   // console.log(ob)
  //   trajectoryQuery(ob).then(res => {
  //     if (res.objectDynamicDatasList && res.objectDynamicDatasList[0].objectDynamicDataList && res.objectDynamicDatasList[0].objectDynamicDataList[0]) {
  //       this.dynamicData = res.objectDynamicDatasList[0].objectDynamicDataList

  //       this.dynamicData.forEach((n, i) => {
  //         console.log(this.primitiveList[n.oid])
  //         if (!this.primitiveList[n.oid]) {
  //           return
  //         }
  //         this.primitiveList[n.oid].trajectory = new SObjectTrajectory(n.dynamicData, this.sobjectList[n.oid])
  //       })
  //     }
  //     // this.create()
  //   }, (err) => {
  //     console.log('轨迹请求错误', err)
  //   })
  // }
  /**
  创建显示对象集合
   */
  createPrimitiveList(sobject) {
    if (this.primitiveList[sobject.id]) {
      console.log('同一切片有相同的sobject', sobject)
      return
    }

    this.primitiveList[sobject.id] = {
      primitive: [],
      sobject: null,
      trajectory: null,
      relation: null
    }
    let primitive = this.createPrimitive(sobject)
    let trajectory = null
    let relation = null
    if (sobject.network.nodes.length > 0) {
      relation = new SObjectRelationPrimitive(sobject)
    }
    // if (globalData.historyOpen) {
    //   trajectory = new SObjectTrajectory(sobject,this.parameter.geoWkt)
    // }
    this.primitiveList[sobject.id] = {
      primitive: primitive,
      sobject: sobject,
      trajectory: trajectory,
      relation: relation
    }

  }
  // 根据sobject创建渲染对象
  createPrimitive(sobject) {
    if (sobject.forms) {
      let arr = []
      for (let i = 0; i < sobject.forms.length; i++) {
        let primitive = ''
        let form = sobject.forms[i]
        try {
          form.geom = JSON.parse(form.geom)
        } catch (error) {}
        if (form.type <= 23) {
          // 几何
          if (form.style && form.style != null) {
            let style = map.formStyleToStyle(form.style)
            if (style && style.style == 5) {
              // 服务类型的样式
              // primitive = new SObjectFormServer(form, sobject, style)
            } else if (style && style.style == 3) {
              primitive = new SObjectFormGeometry(form, sobject)
            }
          } else {
            if (form.type <= 23) {
              primitive = new SObjectFormGeometry(form, sobject)
            }
          }
        } else if (form.type == 50) {
          // 模型
          primitive = new SObjectFormModel(form, sobject)
        } else if (form.type == 40) {
          // bim数据

        } else {
          // console.log(form)
        }
        arr.push(primitive)
      }
      return arr
    }
  }

  getPrimitive(ids) {
    // 获取模型的primite
    let id = ids.split('-')[0]
    let pri = this.primitiveList[id].primitive
    for (let i = 0; i < pri.length; i++) {
      let primitive = pri[i]
      if (primitive instanceof SObjectFormModel) {
        return primitive
      }
    }
    return null
  }
  
  /**
  对象更新方法
   */
  update(frameState) {
    
      for (let i in this.primitiveList) {
        let primitive = this.primitiveList[i]
        // 计算轨迹坐标与跟随
        if (globalData.historyOpen && primitive.trajectory) {
          // primitive.trajectory.countCoordinate(map.nowtime, primitive.primitive)
          // 控制轨迹线个轨迹点的显示
          // primitive.trajectory.update(frameState)

          // 控制跟随
          if (map.follow.open) {
            map.follow.movePlace(primitive)
          }
        }

        primitive.primitive.forEach(n => {
          if (n && n.update && n._primitive) {
            let id = n.id
            // 清除选中
            if (n.pitch && id != globalData.currentSelectObjectId) {
              n.clearSelectStyle()
            }
            // 选中
            if (!n.pitch && id == globalData.currentSelectObjectId) {
              n.showSelectStyle()
            }
            // 类视图列表树控制显示隐藏
            let otypeId = n.sobject.otype.id
            let show = true
            globalData.showTreeArr.forEach(q => {
              if (otypeId == q) {
                show = false
              }
            })
            if (show) {
              n.update(frameState)
            }
          }
        })
        // 关系线
        if (primitive.relation) {
          if (globalData.relationShow) {
            primitive.relation.update(frameState)
          }
        }
      }
  }
  // 计算轨迹坐标与跟随
  trajectoryMove(primitive) {}
  createModelBehavior(sobject) { // 处理行为
    if (sobject.otype && sobject.otype.id) {
      // let otype = store.getters.getOtypeById(sobject.otype.id)
      // if (otype) {
      //   otype = JSON.stringify(otype)
      //   otype = JSON.parse(otype)
      // }
      // Object.assign(sobject.otype, otype)
      // 处理行为
      let arr = []
      if (sobject.models && sobject.models.models.length > 0 && sobject.models.models instanceof Array) {
        arr = arr.concat(parseStr(sobject.models.models))
      }
      if (sobject.otype.models && sobject.otype.models.models.length > 0 && sobject.otype.models.models instanceof Array) {
        arr = arr.concat(parseStr(sobject.otype.models.models))
      }
      sobject.models.models = arr
      console.log(arr)
      // 如果有otype  加载行为
      if (otype) {
        this.createSobjectBehavior(sobject, otype)
      }
    }
    // this.createPrimitiveList(sobject)

  }
  createSobjectBehavior(sobject, otype) { // 行为
    let arr = []

    if (sobject.otype && sobject.otype.id) {
      if (sobject.models && sobject.models.models.length > 0 && sobject.models.models instanceof Array) {
        arr = arr.concat(parseStr(sobject.models.models))
      }
      if (sobject.otype.models && sobject.otype.models.models.length > 0 && sobject.otype.models.models instanceof Array) {
        arr = arr.concat(parseStr(sobject.otype.models.models))
      }
      sobject.models.models = arr

      let model = sobject.models.models
      cesiumCollection.behaviorLists[sobject.id + '-' + sobject.uuid] = []
      for (let p in model) {
        let mobj = model[p]
        if (mobj && mobj.mobj && mobj.mobj.script != '') {
          let code = eval(mobj.mobj.script)
          if (code) {
            try {
              // 将sobject传入行为
              let behavior = new code(sobject, this)
              behavior.type = mobj.mdef.type
              behavior.openShow = false
              cesiumCollection.behaviorLists[sobject.id + '-' + sobject.uuid].push(behavior)
            } catch (err) {}
          } else {
            let behavior = {}
            cesiumCollection.behaviorLists[sobject.id + '-' + sobject.uuid].push(behavior)
          }
        } else {
          let behavior = {}
          cesiumCollection.behaviorLists[sobject.id + '-' + sobject.uuid].push(behavior)
        }
      }
    }
  }
  /**
  卸载渲染对象
   */
  unloadPrimitive() {}
  /**
  释放切片所有数据
   */
  dispose() {

    // 存储切片对象数据
    this.sobjectList = null
    // 存储切片显示对象
    this.primitiveList = null
  }
  JulianDateChange(t) {
    let time = new Date(Cesium.JulianDate.toDate(t))
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    let h = time.getHours()
    let f = time.getMinutes()
    let s = time.getSeconds()
    let hs = time.getMilliseconds()
    return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
  }
  DateChange(t) {
    let time = new Date(t)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    let h = time.getHours()
    let f = time.getMinutes()
    let s = time.getSeconds()
    let hs = time.getMilliseconds()
    return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
  }
}
const parseStr = (arr) => {
  arr.forEach(el => {
    if (el && el.mdef && el.mdef.inTypes) {
      if (
        typeof el.mdef.inTypes === 'string' &&
        el.mdef.inTypes.length > 0
      ) {
        try {
          el.mdef.inTypes = JSON.parse(el.mdef.inTypes)
        } catch (error) {
          console.log(el.mdef.inTypes, 'error')
        }
      }
      if (
        typeof el.mdef.outTypes === 'string' &&
        el.mdef.outTypes.length > 0
      ) {
        try {
          el.mdef.outTypes = JSON.parse(el.mdef.outTypes)
        } catch (error) {
          console.log(el.mdef.outTypes, 'out')
        }
      }
    }
  })
  return arr
}
export default SObjectTile