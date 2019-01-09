// import psde from '../../../psde'
// import store from '@/store'
// import {
//   MutationsList
// } from '@/store/EventList'
// import map from '@/script/map.js'
// import TimeLineBox from '@/Cesium/Widgets/TimeLineBox'

// import globalData from '@/script/datastore/globalData/GlobalData'

// import {
//   versionListQuery
// } from '../../../psde/objectService'
// import Version from '../manageData/Version'
// import {
//   CesiumEventBus,
//   CesiumEvent
// } from '../cesiumEvent/Event'

/**
历史数据集
 */
class HistoryDataStroe {
  constructor() {
    this.versionAll = {}
    //所有版本
    this.versionList = []

    this.nowVersionList = []



    // 当前视口显示的切片
    this.tiles = []
    //上一个版本时间
    this.beforeTime = 0

    // this.nowVersion = null
    this.monitor()

  }
  monitor() {
    CesiumEventBus.on(CesiumEvent.MoveEnd, data => {
      if (globalData.historyOpen) {
        return
      }
      this.tiles = data.arr
    })
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
  createFirstVersion(time) {
    if (this.versionList.length > 0) {
      let n = this.versionList[0]
      let nextTime = this.versionList[1] ? this.versionList[1].vid * 1000 : time.stopTime
      if (!this.versionAll[n.vid]) {
        this.versionAll[n.vid] = new Version(n, this.tiles, nextTime)
        this.nowVersionList.push(n.vid)
        console.log('加载第一个版本', n.vid, this.DateChange(n.vid * 1000))
      }
    }
  }
  createNewVersion(n, nextTime) {
    //当前版本是否有
    if (!this.versionAll[n.vid]) {
      this.versionAll[n.vid] = new Version(n, this.tiles, nextTime)
      console.log(n.vid, '走一个当前----------------------------------')
    }
    return this.versionAll[n.vid]
  }
  createNextVersion(nextVersion, time) {
    //下一版本
    if (nextVersion.now && !this.versionAll[nextVersion.now.vid]) {
      console.log('---------------------------------------------')
      console.log('加载下一个版本', nextVersion.now.vid)
      let nextTimes = nextVersion.next ? nextVersion.next.vid * 1000 : time.stopTime
      this.versionAll[nextVersion.now.vid] = new Version(nextVersion.now, this.tiles, nextTimes)
    }
  }
  nextVersion(nowVersion, multiplier) {
    for (let i = 0; i < this.versionList.length; i++) {
      let n = this.versionList[i]
      if (n.vid > nowVersion.vid + multiplier) {
        let obj = {
          now: n,
          next: this.versionList[i + 1] ? this.versionList[i + 1] : null
        }
        return obj
      }
    }

    return null
  }
  getNowVersion() {
    let now = null
    let version = null
    this.nowVersionList.forEach((n, i, arr) => {
      if (time.nowTime >= n.vid * 1000) {
        let num = time.nowTime - n.vid * 1000
        if (!now) {
          now = num
        } else {
          if (now - num > 0) {
            now = num
          }
          now = now

        }
        return n
      }
    })
  }
  //筛选版本
  // filtrateList() {
  //   let version = null
  //   let nextVersion = null
  //   let multiplier = map.clock.clock._multiplier

  //   //处理时间
  //   let time = this.getTimes()
  //   this.createFirstVersion(time)
  //   this.versionList.forEach((n, i, arr) => {
  //     // let nextTime = arr[i+1] ? arr[i+1].vid * 1000 : time.stopTime

  //     if (time.nowTime >= n.vid * 1000) {
  //       this.setNowVersion(n.vid)
  //       version = this.createNewVersion(n.vid)
  //       nextVersion = this.nextVersion(n, multiplier)
  //       console.log(nextVersion.now.vid, nextVersion.next.vid)

  //       // if (nextVersion) {
  //       //   this.createNextVersion(nextVersion, time)
  //       // }
  //       return
  //     }
  //   })

  //   this.nowVersionList.forEach((n, i, arr) => {
  //     if (time.nowTime >= n.vid * 1000) {
  //       return n
  //     }
  //   })
  //   return version


  //   let arr = []
  //   let atime = 0
  //   list.forEach((n, i) => {
  //     if (i == 0) {
  //       atime = n.vid
  //       arr.push(n)
  //     } else {
  //       // if (n.vtime - atime >= multiplier * 5 * 1000) {
  //       if (n.vid - atime >= multiplier * 5) {
  //         atime = n.vid

  //         arr.push(n)
  //       }
  //     }
  //   })
  //   return arr

  // }
  // update(frameState) {
  //   if (!globalData.historyOpen) {
  //     return
  //   }

  //   // //当前时间轴快进倍数
  //   // let version = this.filtrateList()
  //   // if (version) {
  //   //   version.update(frameState)

  //   // }
  //   // return
  //   //加载第一个版本
  //   this.createFirstVersion()
  //   versionList.forEach((n, i, arr) => {
  //     let next = arr[i + 1]
  //     let nexts = arr[i + 2]
  //     let nextTime = next ? next.vid * 1000 : time.stopTime
  //     //在时间轴内 开始播放
  //     if (time.nowTime >= n.vid * 1000 && time.nowTime < nextTime) {
  //       this.createNewVersion(n, nextTime)
  //       this.setNowVersion(n.vid)
  //       this.createNextVersion(next, time, nexts)
  //       this.versionAll[n.vid].update(frameState)
  //     }
  //   })
  // }

  update(frameState) {
    if (!globalData.historyOpen) {
      return
    }
    // 对场景内的切片进行调度
    // this.dispatchTile(frameState)
    //时间轴当前时间
    let nowTime = new Date(Cesium.JulianDate.toDate(map.clock.clock.currentTime)).getTime()
    //时间轴起始时间
    let startTime = new Date(Cesium.JulianDate.toDate(map.clock.clock.startTime)).getTime()
    //时间轴结束时间
    let stopTime = new Date(Cesium.JulianDate.toDate(map.clock.clock.stopTime)).getTime()
    //当前时间轴快进倍数
    // let multiplier = map.clock.clock._multiplier
    let multiplier = 60
    map.clock.clock._multiplier = multiplier
    if (this.versionList.length > 0) {
      let n = this.versionList[0]
      let nextTime = this.versionList[1] ? this.versionList[1].vid * 1000 : stopTime

      if (!this.versionAll[n.vid]) {
        this.versionAll[n.vid] = new Version(n, this.tiles, nextTime)
        console.log('加载第一个版本', this.DateChange(n.vid))
      }
    }
    let versionList = this.filtrateList(this.versionList, multiplier)
    //console.log(versionList)
    versionList.forEach((n, i, arr) => {
      // this.versionList.forEach((n, i, arr) => {
      let next = arr[i + 1]
      let nexts = arr[i + 2]
      let nextTime = next ? next.vid * 1000 : stopTime
      //在时间轴内 开始播放
      if (nowTime >= n.vid * 1000 && nowTime < nextTime) {
        //当前版本是否有
        if (!this.versionAll[n.vid]) {
          this.versionAll[n.vid] = new Version(n, this.tiles, nextTime)
          console.log('走一个当前')
        }
        this.setNowVersion(n.vid)
        // console.log(n.vid)
        this.versionAll[n.vid].update(frameState)
        // this.nowVersion = null
        // this.nowVersion = this.versionAll[n.vid]
        //下一版本
        if (next && !this.versionAll[next.vid]) {
          console.log('---------------------------------------------')
          console.log('加载下一个版本')
          let nextTimes = nexts ? nexts.vid * 1000 : stopTime

          this.versionAll[next.vid] = new Version(next, this.tiles, nextTimes)
        }

      } else {

      }

    })

  }
  getUpdateVersion(versionList) {
    return null;
  }

  setNowVersion(val) {
    globalData.versionId = val
  }
  //筛选版本
  filtrateList(list, multiplier) {
    // let versionList=this.bubbleSort(list)
    let arr = []
    let atime = 0
    list.forEach((n, i) => {
      if (i == 0) {
        atime = n.vid
        arr.push(n)
      } else {
        if (n.vid - atime >= multiplier * 1) {
          atime = n.vid

          arr.push(n)
        }
      }
    })
    return arr

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
  loadHistory(start, end, n) { //版本 开
    console.log('版本开', 666666666)

    globalData.historyOpen = true

    map.clock.clock.startTime = Cesium.JulianDate.fromDate(new Date(start)).clone();
    map.clock.clock.currentTime = Cesium.JulianDate.fromDate(new Date(start)).clone();
    map.clock.clock.stopTime = Cesium.JulianDate.fromDate(new Date(end)).clone();
    map.viewer.scene.render();

    TimeLineBox.init(map.viewer, 'time-line') // 加载时间轴
    store.commit(MutationsList.openTab, {
      name: 'timeLineUi'
    });
    TimeLineBox.enable();
    // TimeLineBox.disabled();

    let ob = {
      beginTime: this.JulianDateChange(map.clock.clock.startTime),
      endTime: this.JulianDateChange(map.clock.clock.stopTime),
      pageNum: 1,
      pageSize: 1000
    }

    versionListQuery(ob).then(res => {

      this.versionList = this.bubbleSort(res.list)
      console.log(this.versionList)
    })
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
