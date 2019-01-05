import mercatorProj from './mercatorProj'
import axios from 'axios'
import color from './color'
class BuildingLayer {
  constructor () {
    this.id = 'building-layer'
    this.type = 'custom'

    this.renderingMode = '3d'
  }
  loadBuilding () {
    axios.get('深圳-437-港隆城购物中心.json').then(res => {
      this.group = new THREE.Group()
      let buildingData = res.data.data
      console.log(buildingData, 'data')
      for (let i = 0;i < buildingData.Floors.length;i++) {
        this.createFloor(buildingData.Floors[i], this.group, i)
      }
      this.scene.add(this.group)
    })
  }
  createFloor (floorData, buildingGroup, i) {
    let floorGroup = new THREE.Group()
    floorGroup.position.z = i *30
    // console.log(floorData, 'floorData')
    for (let i = 0;i < floorData.FuncAreas.length;i++) {
      this.createAreaShape(floorData.FuncAreas[i], floorGroup)
    }
    buildingGroup.add(floorGroup)
  }
  createAreaShape (areaData, floorGroup) {
    if (areaData.Outline.length == 1) {
      let nums = areaData.Outline[0][0]
      var pts = []
      for (let i = 0;i < nums.length;i += 2) {
        pts.push(new THREE.Vector2(nums[i], nums[i + 1]))
      }
      for ( var i = 0; i < pts.length; i++) pts[ i ].multiplyScalar(0.25)
      var createAreaShape = new THREE.Shape(pts)

      var extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 }

      var geometry = new THREE.ExtrudeBufferGeometry(createAreaShape, extrudeSettings)
      let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: this.bg3().hex() }))

      // var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)
      // var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color }))

      // console.log(pts,"pts")
      floorGroup.add(mesh)
    }
  }
  bg3 (saturation, value) {
    var ratio = 0.618033988749895
    var hue = Math.random()

    hue += ratio
    hue %= 1

    if (typeof saturation !== 'number') {
      saturation = 0.5
    }

    if (typeof value !== 'number') {
      value = 0.95
    }

    return color({
      h: hue * 360,
      s: saturation * 100,
      v: value * 100
    })
  }
  onAdd (map, gl) {
    this.map = map
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl
    })
    this.renderer.autoClear = false
    this.camera = new THREE.PerspectiveCamera()

    this.scene = new THREE.Scene()
    var light = new THREE.AmbientLight(0xffffff)
    this.scene.add(light)

    this.loadBuilding()
  }
  render (gl, matrix) {
    let mapCenter = this.map.getCenter()

    var translate = mercatorProj.fromLL(mapCenter.lng, mapCenter.lat)

    var m = new THREE.Matrix4().fromArray(matrix)
    var l = new THREE.Matrix4().makeTranslation(translate.x, translate.y, 0)
      .scale(new THREE.Vector3(mercatorProj.scale, -mercatorProj.scale, mercatorProj.scale))

    if (this.group) {
      let position2 = mercatorProj.lonLat2Mercator(113.6761245 - mapCenter.lng  , 34.74838943 - mapCenter.lat)

      this.group.position.x = position2.x / 2

      this.group.position.y = position2.y / 2
    }

    this.camera.projectionMatrix = m.multiply(l)
    this.renderer.state.reset()
    this.renderer.render(this.scene, this.camera)
  }
}

export default BuildingLayer
