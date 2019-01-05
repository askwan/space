// Custom layer implemented as ES6 class
class NullIslandLayer {
  constructor () {
    this.id = 'null-island'
    this.type = 'custom'

    this.renderingMode = '3d'

    this.translate = [0.279471, 0.364935, 0.0000025]
    this.scale = 0.000003
    this.camera = new THREE.Camera()
    this.scene = new THREE.Scene()

    var geometry = new THREE.BoxGeometry(1, 1, 1)
    var material = new THREE.MeshPhongMaterial({ color: 0xeeeeff })
    this.cube = new THREE.Mesh(geometry, material)
    this.scene.add(this.cube)

    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(0, -70, 10000).normalize()
    this.scene.add(directionalLight)

  /*  var loader = new THREE.GLTFLoader()
    loader.load('model/liaoninghao.glb', gltf => {

      gltf.scene.position.x = 2
      gltf.scene.position.z = -1
      gltf.scene.position.y = 2

      gltf.scene.rotation.x += Math.PI / 2


      gltf.scene.scale.set(0.01, 0.01, 0.01)

      this.scene.add(gltf.scene)
    }, undefined, function (e) {
      console.error(e)
    })*/
  }

  onAdd (map, gl) {
    this.map = map
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl
    })
    this.renderer.autoClear = false
  }

  render (gl, matrix) {
    const m = new THREE.Matrix4().fromArray(matrix)

    const l = new THREE.Matrix4().makeTranslation(this.translate[0], this.translate[1], this.translate[2])
      .scale(new THREE.Vector3(this.scale, -this.scale, this.scale))

    this.camera.projectionMatrix.elements = matrix
    this.camera.projectionMatrix = m.multiply(l)
    this.renderer.state.reset()
    this.renderer.render(this.scene, this.camera)
  // this.map.triggerRepaint()
  }
}

export default NullIslandLayer
