
let extent = 20037508.34
let scale = 1 / extent

function fromLL(lon, lat) {
  let position = lonLat2Mercator(lon, lat)
  return { x: (position.x + extent) / (2 * extent), y: 1 - ((position.y + extent) / (2 * extent)) }
}

function lonLat2Mercator(lon, lat) {
  let x = lon * extent / 180
  let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180)
  y = y * extent / 180
  return { x: x, y: y }
}

class OneSisCustomLayer {
  constructor() {
    this.id = 'onesis-layer'
    this.type = 'custom'

    this.renderingMode = '3d'
  }

  onAdd(map, gl) {
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

    var dracoLoader = new THREE.DRACOLoader()
    var loader = new THREE.GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    loader.load('model/liaoninghao.glb', gltf => {

      
      gltf.scene.rotation.x += Math.PI / 2
      this.gltf = gltf
      this.scene.add(gltf.scene)
    }, undefined, function (e) {
      console.error(e)
    })

    loader.load('model/555.glb', gltf => {

      console.log(gltf,"aaaa")
      //gltf.scene.rotation.x += Math.PI / 2
      this.buildgltf = gltf
      this.scene.add(gltf.scene)
    }, undefined, function (e) {
      console.error(e)
    })

    var geometry = new THREE.BoxGeometry(100, 100, 100)
    var material = new THREE.MeshPhongMaterial({ color: 0xeeeeff })
    this.cube = new THREE.Mesh(geometry, material)
    // this.scene.add(this.cube)

    this.lng = 113.6761245

  }

  render(gl, matrix) {
    let mapCenter = this.map.getCenter()

    var translate = fromLL(mapCenter.lng, mapCenter.lat)

    var m = new THREE.Matrix4().fromArray(matrix)
    var l = new THREE.Matrix4().makeTranslation(translate.x, translate.y, 0)
      .scale(new THREE.Vector3(scale, -scale, scale))

    if (this.gltf) {
      let position = lonLat2Mercator(this.lng - mapCenter.lng, 34.74838943 - mapCenter.lat)

      this.gltf.scene.position.x = position.x / 2
      this.gltf.scene.position.z = 0
      this.gltf.scene.position.y = position.y / 2


      this.lng -= 0.00001

      // this.cube.position.set(position.x / 2, position.y / 2, 0)
    }
    if (this.buildgltf) {
      let position1 = lonLat2Mercator(113.6761245 - mapCenter.lng, 34.74838943 - mapCenter.lat)

      this.buildgltf.scene.position.x = position1.x / 2
      this.buildgltf.scene.position.z = 0
      this.buildgltf.scene.position.y = position1.y / 2
    }

    this.camera.projectionMatrix = m.multiply(l)
    this.renderer.state.reset()
    this.renderer.render(this.scene, this.camera)

    //this.map.triggerRepaint()
  }
}

export default OneSisCustomLayer
