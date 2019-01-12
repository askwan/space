import axios from "axios";
import map from '../../cesiumMap/map'

import GlobalData from '../../GlobalData'
import SObjectTile from '../manageData/SObjectTile'

import Sobject from '../Sobject'


// const psdeHost = "http://bt1.geosts.ac.cn/api/dae/datastore";
// const psdeUrl = psdeHost + "/rest/v0.1.0/datastore/";

const psdeUrl = "http://192.168.1.133:8001/rest/v0.1.0/datastore";
/**
历史数据集
 */
class HistoryDataStroe {
  constructor() {
    this.SObjectAll = {}
    this.sobjectData = []


    this.start = false
    //所有版本
    this.versionList = []

  }
  loadHistory(start, end, n) { //版本 开
    console.log('版本开', 666666666)
    this.start = false
    GlobalData.historyOpen = true
    GlobalData.queryReady = false;
    GlobalData.timelineShow = false

    map.clock.clock.startTime = Cesium.JulianDate.fromDate(new Date(start)).clone();
    map.clock.clock.currentTime = Cesium.JulianDate.fromDate(new Date(start)).clone();
    map.clock.clock.stopTime = Cesium.JulianDate.fromDate(new Date(end)).clone();
    map.viewer.scene.render();
    GlobalData.timelineShow = true
    // TimeLineBox.init(map.viewer, 'time-line') // 加载时间轴
    // TimeLineBox.enable();
    // TimeLineBox.disabled();
    let ob = {
      beginTime: this.JulianDateChange(map.clock.clock.startTime),
      endTime: this.JulianDateChange(map.clock.clock.stopTime),
      sdomains: GlobalData.sdomains,
      pageNum: 1,
      pageSize: 1000000
    }
    let url = psdeUrl + '/version/list/query'
    axios
      .get(url, {
        params: ob
      })
      .then(response => {
        console.log(response.data.data);
        this.versionList = this.bubbleSort(response.data.data.list)
        let idList = ''
        for (let i = 0; i < this.versionList.length; i++) {
          let v = this.versionList[i]
          if (i == 0) {
            idList += v
          } else {
            idList += ',' + v
          }
        }
        this.getData(idList)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getData(version) {
    let url = psdeUrl + "/object/query";

    let obj = {
      loadAttr: true, // 是否加载属性信息
      loadForm: true, // 是否加载形态数据
      loadNetwork: true, // 是否加载关系
      loadModel: true, // 是否加载模型
      loadObjType: true,
      // loadAction: true, // 是否载入操作集合
      loadChildren: true,
      loadVersion: true,

      versions: version,
      sdomains: GlobalData.sdomains,
      uids: ""
    };
    axios
      .get(url, {
        params: obj
      })
      .then(response => {
        console.log(response.data.data);
        if (response.data.status == 200) {
          this.sobjectData = []

          for (let i = 0; i < response.data.data.list.length; i++) {
            let sobj = response.data.data.list[i];
            this.sobjectData.push(new Sobject(sobj));
          }
          this.SObjectAll = new SObjectTile(this.sobjectData)
          this.start = true
          GlobalData.queryReady = true;
       
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //冒泡
  vidSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        if (arr[j].version.vid > arr[j + 1].version.vid) { //相邻元素两两对比
          let temp = arr[j + 1]; //元素交换
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
    return arr;
  }
  getTimes() {
    //时间轴当前时间
    let nowTime = new Date(Cesium.JulianDate.toDate(map.clock.clock.currentTime)).getTime()
    //时间轴起始时间
    let startTime = new Date(Cesium.JulianDate.toDate(map.clock.clock.startTime)).getTime()
    //时间轴结束时间
    let stopTime = new Date(Cesium.JulianDate.toDate(map.clock.clock.stopTime)).getTime()

    let time = {
      nowTime: nowTime,
      startTime: startTime,
      stopTime: stopTime
    }
    return time
  }


  update(frameState) {
    if (GlobalData.historyOpen && this.start && this.sobjectData && this.SObjectAll != {}) {
      this.SObjectAll.update(frameState)
    }

  }
 
  //冒泡
  bubbleSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        if (arr[j].vid > arr[j + 1].vid) { //相邻元素两两对比
          let temp = arr[j + 1]; //元素交换
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
    return arr;
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

let historyDataStroe = new HistoryDataStroe()

export default historyDataStroe