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
    this.sobject = []
    this.map = ''

    this.clickGroup = ''
    this.clickSObjColor = ''

    this.oldData={
      x:50,
      y:50,
      z:50,
    }
  }
  init(fn) {
    requirejs(
      [
        "/js/threejs/three.js", "/js/poly2tri/poly2tri.js"
      ],
      (THREE, poly2tri) => {
        window.THREE = THREE;
        window.poly2tri = poly2tri;

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
            setTimeout(() => {
              this.getColor(fn)
            }, 500)
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
        GlobalData.formDict = response.data.data
        // console.log(GlobalData.formDict)
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
        // console.log(response.data.data);
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
      geoWkt: "BBOX(120.432163 120.433513 31.322459 31.324095)",
      loadAttr: true, // 是否加载属性信息
      loadForm: true, // 是否加载形态数据
      loadNetwork: true, // 是否加载关系
      loadModel: true, // 是否加载模型
      loadObjType: true,
      // loadAction: true, // 是否载入操作集合
      loadChildren: true,
      geoEdit: true,
      sdomains: GlobalData.sdomains,
      uids: ''
    };

    axios.get(url, {
        params: obj,
      })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.status == 200) {
          this.dataList = response.data.data.list
          GlobalData.dataList = this.dataList
          let idArr = [94552829965, 94552829975]
          // let idArr = [7478302392320]
          this.sobject = sObjectManege.transform(this.dataList, idArr);
          GlobalData.treeList = this.sobject

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
    if (this.sobject[0].geoBox) {
      this.map.start(this.sobject);
    }
  }
  //在地图上点击
  inMapClick() {
    this.map.map.on('click', (e) => {
      // console.log('========================================')
      // console.log('click', e)
      let selLayer
      let sobjId = null
      for (let i in this.map.allLayer) {
        let layer = this.map.allLayer[i]
        let id = layer.pick(e)
        if (id) {
          selLayer = this.map.allLayer[i]
          sobjId = id
        }
      }
      if (this.clickGroup) {
        for (let q = 0; q < this.clickGroup.children[0].children.length; q++) {
          let oldMesh = this.clickGroup.children[0].children[q]
          if (oldMesh.type == "LineSegments") {
            oldMesh.material.color.set(new THREE.Color(0xffffff));
          } else {
            oldMesh.material.color.set(this.clickSObjColor);
          }
        }
        this.update()
      }
      if (sobjId) {
        let group = selLayer.allSObjectGroup[sobjId]
        if (group) {
          // console.log(group)

          GlobalData.selectPick = group.sobject.data;
          this.clickGroup = group
          this.clickSObjColor = group.children[0].children[0].material.color.clone()
          for (let q = 0; q < group.children[0].children.length; q++) {
            let mesh = group.children[0].children[q]
            mesh.material.color.set(new THREE.Color(1, 0, 0))
          }
          this.update()
        }
      }
    })
  }
  //对象树上左键
  LeftClick() {
    EventBus.on(MapEvent.LeftClick, () => {
      let id = GlobalData.selectPick.id
      for (let i in this.map.allLayer) {
        let layer = this.map.allLayer[i]
        if (layer.allSObjectGroup[id]) {
          let group = layer.allSObjectGroup[id]
          console.log(group,77777777)
          if (this.clickGroup) {
            if (this.clickGroup.children[0] && this.clickGroup.children[0].children[0]) {
              for (let q = 0; q < this.clickGroup.children[0].children.length; q++) {
                let oldMesh = this.clickGroup.children[0].children[q]
                if (oldMesh.type == "LineSegments") {
                  oldMesh.material.color.set(new THREE.Color(0xffffff));
                } else {
                  oldMesh.material.color.set(this.clickSObjColor);
                }
              }
              this.update()
            }
          }
          this.clickGroup = group
          if (group.children[0] && group.children[0].children[0]) {
            this.clickSObjColor = group.children[0].children[0].material.color.clone()
            for (let q = 0; q < group.children[0].children.length; q++) {
              let mesh = group.children[0].children[q]
              mesh.material.color.set(new THREE.Color(1, 0, 0))
            }
          }
        }
      }
      this.update()
    })
  }
  //对象树上右键
  RightClick() {
    EventBus.on(MapEvent.RightClick, data => {
      let bbox = [
        [data.geoBox.maxx, data.geoBox.maxy],
        [data.geoBox.minx, data.geoBox.miny]
      ];
      this.map.map.fitBounds(bbox);
    })
  }
  //操作面板 滑块移动
  sliderChange() {
    EventBus.on(MapEvent.sliderChange, data => {
      for (let i in this.map.allLayer) {
        let layer = this.map.allLayer[i]
        for (let q in layer.allSObjectGroup) {
          let group = layer.allSObjectGroup[q]
          let floor = group.sobject.floor>0 ? group.sobject.floor : 0
          group.position.x += (data.valueX - this.oldData.x) * floor
          group.position.y += (data.valueY - this.oldData.y) * floor
          group.position.z += (data.valueZ - this.oldData.z) * floor
        }
        for (let q in layer.groupP.children) {
          let group = layer.groupP.children[q]
          let floor = group.sobject.floor>0 ? group.sobject.floor : 0
          group.position.x += (data.valueX - this.oldData.x) * floor
          group.position.y += (data.valueY - this.oldData.y) * floor
          group.position.z += (data.valueZ - this.oldData.z) * floor
        }
      }
      this.oldData.x=data.valueX
      this.oldData.y=data.valueY
      this.oldData.z=data.valueZ
      this.update()
    })
  }
  update() {
    for (let i in this.map.allLayer) {
      let layer = this.map.allLayer[i]
      layer.update()
    }
  }
}
let map = new Map()
export default map