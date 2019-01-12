import mercatorProj from './manage/mercatorProj'

import Point from './Geometry/Point'
import Line from './Geometry/Line'
import Polygon from './Geometry/Polygon'
import MultiPolygon from './Geometry/MultiPolygon'
import Model from './Geometry/Model'

class PublicLayer {
  constructor() {
    this.id = 'public';
    this.type = 'custom';
    this.renderingMode = '3d';

    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();

    this.map = ''
    this.renderer = ''

    this.sceneP = new THREE.Scene();
    this.rendererP = ''

    this.lonlat = []

    this.group = '' //最外层的组
    this.groupP = '' //最外层的组

    this.allSObjectGroup = {}

    this.allSObjectList = {}
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
    this.cGeometry.multiPolygon = new MultiPolygon()
    this.cGeometry.model = new Model()

    this.animationGroup = new THREE.AnimationObjectGroup();
    this.mixer = null
    this.clock = new THREE.Clock();


  }
  add(sobject, num) {
    if (sobject.id == 94552829965 || sobject.id == 94552829975) {
      return
    }
    if (!this.allSObjectGroup[sobject.id]) {
      this.allSObjectGroup[sobject.id] = new THREE.Group()
      this.allSObjectGroup[sobject.id].name = sobject.id
      this.allSObjectGroup[sobject.id].sobject = sobject
      this.group.add(this.allSObjectGroup[sobject.id])
    }
    let nodes = sobject.nodes
    for (let i in nodes) {
      let node = nodes[i]
      if (!(node.nodes.length > 0 || node.nodes.outer)) {
        console.log(sobject, node)
        return
      }

      // if(node.type=='line'){
      this.allSObjectGroup[sobject.id].add(this.cGeometry[node.type].create(this.lonlat, sobject, node))
      // this.allSObjectList[sobject.id]=sobject

      // this.group.add(this.cGeometry[node.type].create(this.lonlat, sobject, node))
      this.groupP.add(this.cGeometry[node.type].create(this.lonlat, sobject, node, num))
      this.allSObjectListP[num] = sobject
      // }


      if (sobject.name == "电梯测") {
        // console.log(this.allSObjectGroup[sobject.id])

        // this.animationGroup.add(this.allSObjectGroup[sobject.id]);
        // this.createAnimation()
      }


    }
    if (!sobject.show) {
      console.log('false');
      // this.allSObjectGroup[sobject.id].visible = false
    }
  }
  createAnimation() {
    // create some keyframe tracks
    let xAxis = new THREE.Vector3(1, 0, 0);
    let qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
    let qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI);
    let quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', [0, 1, 2], [qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w]);

    let colorKF = new THREE.ColorKeyframeTrack('.material.color', [0, 1, 2], [1, 0, 0, 0, 1, 0, 0, 0, 1], THREE.InterpolateDiscrete);
    let opacityKF = new THREE.NumberKeyframeTrack('.material.opacity', [0, 1, 2], [1, 0, 1]);

    // create clip
    console.log(111111111)

    let clip = new THREE.AnimationClip('default', 3, [quaternionKF, colorKF, opacityKF]);

    // apply the animation group to the mixer as the root object

    this.mixer = new THREE.AnimationMixer(this.animationGroup);
    console.log(2222222222)

    let clipAction = this.mixer.clipAction(clip);
    console.log(clipAction, 333333333332222222222)

    clipAction.play();

  }
  remove() {
    this.allSObjectGroup = {}
    this.scene.remove(this.group);

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
    // this.rendererP.setSize(window.innerWidth, window.innerHeight);
    // this.rendererP.setSize(window.innerWidth,window.innerHeight);

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

    let delta = this.clock.getDelta();

    if (this.mixer) {

      this.mixer.update(delta);

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
    this.rendererP.setSize(this.renderer.domElement.width, this.renderer.domElement.height);
    this.pickingTexture.setSize(this.renderer.domElement.width, this.renderer.domElement.height);
    // this.map.triggerRepaint();
  }
  pick(mouse) {
    if (mouse) {
      let client = {
        x: mouse.point.x,
        y: mouse.point.y,
      }
      let pixelBuffer = new Uint8Array(4);

      this.rendererP.readRenderTargetPixels(this.pickingTexture, client.x, this.pickingTexture.height - client.y, 1, 1, pixelBuffer);

      let id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
      if (this.allSObjectListP[id]) {
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