import mercatorProj from './manage/mercatorProj'

import Point from './Geometry/Point'
import Line from './Geometry/Line'
import Polygon from './Geometry/Polygon'
import Model from './Geometry/Model'

class PublicLayer {
  constructor() {
    this.id = 'public';
    this.type = 'custom';
    this.renderingMode = '3d';

    this.camera = new THREE.Camera();

    this.scene = new THREE.Scene();
    this.sceneP = new THREE.Scene();

    this.map = ''
    this.renderer = ''

    this.lonlat = []

    this.group = '' //最外层的组
    this.groupP = '' //最外层的组

    this.allSObjectGroup = {}
    this.allSObjectGroupP = {}

    this.allSObjectListP = {}

    this.cGeometry = {} //所有的几何类型
    this.show = true


    this.lamplight()
    this.init()
  }

  setShow(value) {
    this.show = value
    this.group.visible = value
  }
  setLonLat(lonlat) {
    this.lonlat = lonlat
  }

  lamplight() {
    let l = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(l)
    let ls = new THREE.AmbientLight(0xffffff)
    this.sceneP.add(ls)

    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-50000, -50000, 50000);
    this.scene.add(light);

    var lights = new THREE.DirectionalLight(0xffffff);
    lights.position.set(50000, 50000, 50000);
    this.scene.add(lights);
  }
  init() {
    this.cGeometry.point = new Point()
    this.cGeometry.line = new Line()
    this.cGeometry.polygon = new Polygon()
    this.cGeometry.model = new Model()
  }
  add(sobject, num) {

    if (!this.allSObjectGroup[sobject.id]) {
      this.allSObjectGroup[sobject.id] = new THREE.Group()
      this.allSObjectGroup[sobject.id].name = sobject.id
      this.allSObjectGroup[sobject.id].sobject = sobject
      this.group.add(this.allSObjectGroup[sobject.id])

      // this.allSObjectGroupP[sobject.id] = new THREE.Group()
      // this.allSObjectGroupP[sobject.id].name = sobject.id
      // this.allSObjectGroupP[sobject.id].sobject = sobject
      // this.groupP.add(this.allSObjectGroupP[sobject.id])
    } else {

    }
    let nodes = sobject.nodes
    for (let i in nodes) {
      let node = nodes[i]
      // if (node.type == 'polygon') {
      this.allSObjectGroup[sobject.id].add(this.cGeometry[node.type].create(this.lonlat, sobject, node))

      this.groupP.add(this.cGeometry[node.type].create(this.lonlat, sobject, node, num))
      this.allSObjectListP[num] = sobject
      // }


    }
    if (!sobject.show) {
      console.log('false');
      this.allSObjectGroup[sobject.id].visible = false
    }
  }
  remove() {
    this.allSObjectGroup = {}
    this.scene.remove(this.group);

    this.allSObjectGroupP = {}
    this.sceneP.remove(this.groupP);

    this.resetView()
  }
  resetView() {
    this.group = ''
    this.group = new THREE.Group() //总的组
    this.group.name = 'allGroup' //总的组
    this.scene.add(this.group);

    this.groupP = ''
    this.groupP = new THREE.Group() //总的组
    this.groupP.name = 'allGroup' //总的组
    this.sceneP.add(this.groupP);
  }
  onAdd(map, gl) {
    this.map = map;
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl
    });
    this.renderer.autoClear = false;

    this.rendererP = new THREE.WebGLRenderer({
      antialias: true
    });
    this.rendererP.setPixelRatio(window.devicePixelRatio);
    this.rendererP.setSize(this.renderer.domElement.width, this.renderer.domElement.height);

    this.pickingTexture = new THREE.WebGLRenderTarget(this.renderer.domElement.width, this.renderer.domElement.height);
    this.pickingTexture.texture.minFilter = THREE.LinearFilter;
    this.resetView()

  }

  transition(gl, matrix, mapCenter, translate, group) {
    if (group) {
      let lonlat = mercatorProj.lonLat2Mercator(this.lonlat[0], this.lonlat[1])
      let mapPosition = mercatorProj.lonLat2Mercator(mapCenter.lng, mapCenter.lat)

      group.position.x = (lonlat.x - mapPosition.x) / 2
      group.position.y = (lonlat.y - mapPosition.y) / 2
      group.position.z = 0
      //缩小
      group.scale.x = 0.5
      group.scale.y = 0.5
      group.scale.z = 0.5
    }
  }
  render(gl, matrix) {

    let mapCenter = this.map.getCenter()
    //经纬度转坐标
    let translate = mercatorProj.fromLL(mapCenter.lng, mapCenter.lat)

    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4().makeTranslation(translate.x, translate.y, 0)
      .scale(new THREE.Vector3(mercatorProj.scale, -mercatorProj.scale, mercatorProj.scale));

    //改变的
    this.transition(gl, matrix, mapCenter, translate, this.group)
    this.transition(gl, matrix, mapCenter, translate, this.groupP)

    this.camera.projectionMatrix.elements = matrix;
    this.camera.projectionMatrix = m.multiply(l);

    this.renderer.state.reset();

    this.rendererP.render(this.sceneP, this.camera, this.pickingTexture);

    this.renderer.render(this.scene, this.camera);
  }
  pick(mouse) {

    if (mouse) {
      let client={
        // x:mouse.originalEvent.clientX,
        // y:mouse.originalEvent.clientY,

        x:mouse.point.x,
        y:mouse.point.y,
      }
      let pixelBuffer = new Uint8Array(4);

      this.rendererP.readRenderTargetPixels(this.pickingTexture, client.x, this.pickingTexture.height - client.y, 1, 1, pixelBuffer);

      let id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
      // console.log('-=====================================================')
      if (this.allSObjectListP[id]) {
        console.log(id,this.allSObjectListP[id].name)

        this.update()
        return this.allSObjectListP[id].id
      }
      return null
    }
  }
  update() {
    this.map.triggerRepaint();
  }
}
export default PublicLayer