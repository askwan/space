import axios from 'axios'
import sObjectManege from './SObjectManege'
import GlobalData from './GlobalData'

import MapboxGL from './OneSIS/OneSISGL/MapboxGL.js'

import {
  EventBus,
  MapEvent
} from '../jscript/event/Event.js'

const psdeBaseUrl = 'http://bt1.geosts.ac.cn/api';
const psdeHost = psdeBaseUrl + '/dae/datastore';
const psdeUrl = psdeHost + '/rest/v0.1.0/datastore/';

class Map {
  constructor() {
    this.styleList = ''
    this.dataList = ''
    this.sobject = ''
    this.map = ''

    this.clickGroup = ''
    this.clickSObjColor = ''
  }
  init(fn) {
    requirejs(
      [
        "/js/threejs/three.js"
      ],
      (THREE) => {
        window.THREE = THREE;
        requirejs(
          [
            "/js/threejs/GLTFLoader.js", "/js/threejs/BufferGeometryUtils.js"
          ],
          () => {
            let obj = {
              center: [120.433512, 31.324123],
              id: "map"
            };
            console.log('----------------------------------------------------')
            this.map = new MapboxGL(obj)
            this.getColor(fn)
          }
        );
      }
    );
  }
  getFormDict() {
    let url = psdeUrl + `/dict/getDict/form?token=${sessionStorage.getItem('token')}`

    axios.get(url, {
        params: {
          // orderType: "ID",
          // descOrAsc: true,
        }
      })
      .then((response) => {
        GlobalData.formDict = response.data
        console.log(GlobalData.formDict, 333)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getColor(fn) {
    let url = psdeUrl + '/oformstyle/query'
    axios.get(url, {
        params: {
          orderType: "ID",
          descOrAsc: true,
        }
      })
      .then((response) => {
        this.getFormDict()
        console.log(response.data.data);
        this.styleList = response.data.data.list
        GlobalData.styleList = this.styleList
        this.getData(fn)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getData(fn) {
    let url = psdeUrl + '/object/query'
    let obj = {
      // parents: 2169714253824,
      // geoWkt: _obj,
      geoWkt: "BBOX(120.432163 120.433513 31.322459 31.324095)",
      loadChildren: true,
      loadForm: true,
      geoEdit: true,
      loadNetwork: true,
      loadObjType: true,
      sdomains: 4439556972544,
      uids: ''
    };
    axios.get(url, {
        params: obj
      })
      .then((response) => {
        console.log(response.data);
        // console.log(JSON.stringify(response.data.data.list))
        if (response.data.status == 200) {
          this.dataList = response.data.data.list
          GlobalData.dataList = this.dataList
          this.sobject = sObjectManege.transform(this.dataList);
          GlobalData.treeList = [this.sobject]
          fn()
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  createMap() {
    this.start()
    this.LeftClick()
    this.RightClick()
    this.sliderChange()
    this.inMapClick()

  }
  start() {
    let obj = {
      styleList: this.styleList
    };
    this.map.setColorAndOtype(obj)
    this.map.start(this.sobject);
  }
  //在地图上点击
  inMapClick() {
    this.map.map.on('click', (e) => {
      console.log('========================================')
      console.log('click', e)
      console.log(e.originalEvent)
      for (let i in this.map.allLayer) {
        let layer = this.map.allLayer[i]
        let id = layer.pick(e)
        if (id) {
          let group = layer.allSObjectGroup[id]
          if (group) {
            GlobalData.selectPick = group.sobject.data;
            if (this.clickGroup) {
              let oldMesh = this.clickGroup.children[0].children[0]
              oldMesh.material.color = this.clickSObjColor
            }
            this.clickGroup = group
            let mesh = group.children[0].children[0]
            this.clickSObjColor = mesh.material.color.clone()
            mesh.material.color = new THREE.Color(1, 0, 0);
          }
        }

      }

    })
  }
  //对象树上左键
  LeftClick() {
    EventBus.on(MapEvent.LeftClick, () => {
      let id = GlobalData.selectPick.id
      console.log(GlobalData.selectPick)
      for (let i in this.map.allLayer) {
        let layer = this.map.allLayer[i]
        if (layer.allSObjectGroup[id]) {
          let group = layer.allSObjectGroup[id]
          if (this.clickGroup) {
            let oldMesh = this.clickGroup.children[0].children[0]
            oldMesh.material.color = this.clickSObjColor
          }
          this.clickGroup = group
          let mesh = group.children[0].children[0]
          this.clickSObjColor = mesh.material.color.clone()
          mesh.material.color = new THREE.Color(1, 0, 0);
          layer.update()
        }
      }
    })
  }
  //对象树上右键
  RightClick() {
    EventBus.on(MapEvent.RightClick, data => {
      // console.log('fly', data)
      let bbox = [
        [data.geoBox.maxx, data.geoBox.maxy],
        [data.geoBox.minx, data.geoBox.miny]
      ];
      this.map.map.fitBounds(bbox, {
        // padding: {top: 10, bottom:10, left: 300, right: 300},
        // linear:true
      });

    })
  }
  //操作面板 滑块移动
  sliderChange() {
    EventBus.on(MapEvent.sliderChange, data => {
      for (let i in this.map.allLayer) {
        let layer = this.map.allLayer[i]
        for (let q in layer.allSObjectGroup) {
          let group = layer.allSObjectGroup[q]
          let floor = group.sobject.floor ? group.sobject.floor : 0
          group.position.x = (data.valueX - 50) * floor
          group.position.y = (data.valueY - 50) * floor
          group.position.z = (data.valueZ - 50) * floor
        }
        layer.update()
      }

    })
  }

}
let map = new Map()
export default map