import SObjectTile from './SObjectTile'
import globalData from '@/script/datastore/globalData/GlobalData'
import {
  CesiumEventBus,
  CesiumEvent
} from '../cesiumEvent/Event'

// import historyDataStroe from '../control/HistoryDataStroe'

class Version {
  constructor(version, tiles, nextTime) {
    this.version = version;
    this.tiles = tiles
    //总的切片中sobject
    this.sobjectTiles = {};

    this.nextTime = nextTime
    // this.versionRectangle = Cesium.Rectangle.fromDegrees(this.version.bbox.minx, this.version.bbox.miny, this.version.bbox.maxx, this.version.bbox.maxy)

    this.manageTile(this.tiles)
    this.monitor()
  }
  monitor() {
    CesiumEventBus.on(CesiumEvent.MoveEnd, data => {
      this.tiles = data.arr
      this.manageTile(this.tiles)
    })
  }
  manageTile(tiles) {
    if (globalData.historyOpen) {
      tiles.forEach(n => {
        // this.beforeLoadTile(n)
        this.loadtile(n)
      })
    }
  }
  update(frameState) {
    if (!globalData.historyOpen) {
      return
    }
    this.tiles.forEach(n => {
      if (this.sobjectTiles[n.xyl]) {
        this.sobjectTiles[n.xyl].update(frameState)
      }
    });
  }
  // beforeLoadTile(Tile) {
  //   let tileRectangle = Cesium.Rectangle.fromDegrees(Tile.arr[0], Tile.arr[2], Tile.arr[1], Tile.arr[3])
  //   let intersect = Cesium.Rectangle.intersection(this.versionRectangle, tileRectangle)
  //   if (intersect) {
  //     this.loadtile(Tile)
  //     console.log('改变的')
  //   } else {
  //     if (historyDataStroe.nowVersion) {
  //       if (historyDataStroe.nowVersion.sobjectTiles[Tile.xyl]) {
  //         if (!this.sobjectTiles[Tile.xyl]) {
  //           this.sobjectTiles[Tile.xyl] = null
  //           this.sobjectTiles[Tile.xyl] = historyDataStroe.nowVersion.sobjectTiles[Tile.xyl]
  //           console.log('无请求')
  //         } else {
  //           this.sobjectTiles[Tile.xyl].date = new Date()
  //         }

  //       } else {
  //         this.loadtile(Tile)
  //         console.log('无切片')

  //       }
  //     } else {
  //       this.loadtile(Tile)
  //       console.log('无上个版本')

  //     }
  //   }
  // }
  loadtile(Tile) {
    //请求切片全部数据
    let obj = {
      xyl: Tile.xyl,
      par: {
        loadAttr: true, //是否加载属性信息
        loadForm: true, //是否加载形态数据
        loadNetwork: true, //是否加载关系
        loadModel: true, //是否加载模型
        loadAction: true, //是否载入操作集合
        loadVersion: true, //是否加载版本
        loadObjType: true, //是否加载类模板
        // loadDynamicData: true,//轨迹数据

        geoWkt: Tile.bbox,
        grain: Tile.level,
        version: this.version.vid,
        geoClip: true
      }
    }
    if (this.sobjectTiles && this.sobjectTiles[obj.xyl]) {
      // console.log('该层级有了', obj.xyl)
      // 更新切片渲染时间
      if (!this.sobjectTiles[obj.xyl].isload) {
        this.sobjectTiles[obj.xyl] = new SObjectTile(obj, this.sobjectTiles, Tile, this.version, this.nextTime)
      } else {
        this.sobjectTiles[obj.xyl].date = new Date()
      }
    } else {
      this.sobjectTiles[obj.xyl] = new SObjectTile(obj, this.sobjectTiles, Tile, this.version, this.nextTime)
    }



  }
  timestampChange(t) {
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
export default Version
