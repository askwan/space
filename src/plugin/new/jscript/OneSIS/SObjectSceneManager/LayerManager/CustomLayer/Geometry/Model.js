import publicFun from './publicFun'

class Model extends publicFun{
  constructor() {
    super()
    
  }
  create(lonlat, sobject,node) {
    let floorObj = new THREE.Object3D();
    let form=sobject.forms[0]
    let style = form.style[0]
    let loader = new THREE.GLTFLoader();
    loader.load('http://bt1.geosts.ac.cn/api/dae/model-service/model/rest/v0.1.0/datastore/slave/model/file/download/' + form.formref.refid, gltf => {
      gltf.scene.rotation.x += Math.PI / 2
      if (style) {
        gltf.scene.scale.x = style.scale ? style.scale : 1
        gltf.scene.scale.y = style.scale ? style.scale : 1
        gltf.scene.scale.z = style.scale ? style.scale : 1
        gltf.scene.rotation.x += (style.x / 180) * Math.PI
        gltf.scene.rotation.y += (style.y / 180) * Math.PI
        gltf.scene.rotation.z += (style.z / 180) * Math.PI
        gltf.scene.position.z = style.h ? style.h : 0
      }
      floorObj.add(gltf.scene);
    }, undefined, (e) => {
      console.error('模型错误', e);
    });

    return floorObj

  }
}
export default Model