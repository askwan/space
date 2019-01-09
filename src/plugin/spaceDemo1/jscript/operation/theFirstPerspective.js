import map from "../cesiumMap/map";

import Vue from 'vue'
var vue = new Vue

class TheFirstPerspective {
  constructor() {
    this.handler = map.viewer.scene.canvas
    this.or = false


    this.direction = {
      left: false,
      right: false,
      up: false,
      down: false,
    }
    this.switchover = false
    this.positionWC = ''
    this.time = ''
    this.speed = 0.1
  }

  move() {
    let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if (havePointerLock) {
      vue.$notify({
        title: '成功',
        message: '当前移动速度为快速，~键切换速度',
        type: 'success'
      });



      this.handler.requestPointerLock = this.handler.requestPointerLock ||
        this.handler.mozRequestPointerLock ||
        this.handler.webkitRequestPointerLock;
      this.handler.requestPointerLock();

      map.viewer.scene.camera.frustum.fov = Cesium.Math.PI_OVER_TWO;
      map.viewer.scene.camera.frustum.near = 0.000001;

      this.time = setInterval(() => {
        for (let d in this.direction) {
          if (this.direction[d]) {
            times()
          }
        }
      }, 10)

      // 监听变动事件

      document.addEventListener('pointerlockchange', lockchange, false);
      document.addEventListener('mozpointerlockchange', lockchange, false);
      document.addEventListener('webkitpointerlockchange', lockchange, false);
      document.addEventListener('pointerlockerror', lockerror, false);
      document.addEventListener('mozpointerlockerror', lockerror, false);
      document.addEventListener('webkitpointerlockerror', lockerror, false);

      let _this = this;

      function lockchange(e) {
        if (!_this.or) {
          _this.or = true;
          map.viewer.scene.screenSpaceCameraController.enableInputs = false;

          _this.handler.addEventListener('mousemove', mousemove, false);
          document.addEventListener('keydown', keyDown, false)
          document.addEventListener('keyup', keyUp, false)
          map.viewer.scene.render()

        } else {
          lockerror()
        }
      }

      function lockerror(e) {
        _this.or = false;
        map.viewer.scene.camera.frustum.fov = Cesium.Math.PI_OVER_THREE;
        map.viewer.scene.camera.frustum.near = 1;
        map.viewer.scene.screenSpaceCameraController.enableInputs = true;

        document.exitPointerLock = document.exitPointerLock ||
          document.mozExitPointerLock ||
          document.webkitExitPointerLock;
        document.exitPointerLock();

        _this.handler.removeEventListener('mousemove', mousemove);
        document.removeEventListener('keydown', keyDown)
        document.removeEventListener('keyup', keyUp)

        document.removeEventListener('pointerlockchange', lockchange);
        document.removeEventListener('mozpointerlockchange', lockchange);
        document.removeEventListener('webkitpointerlockchange', lockchange);
        document.removeEventListener('pointerlockerror', lockerror);
        document.removeEventListener('mozpointerlockerror', lockerror);
        document.removeEventListener('webkitpointerlockerror', lockerror);
        clearInterval(_this.time)
        map.viewer.scene.render()

      }

      function keyDown(e) {
        if (e.keyCode == 65) { //左
          _this.direction.left = true
        } else if (e.keyCode == 83) { //下
          _this.direction.down = true
        } else if (e.keyCode == 68) { //右
          _this.direction.right = true
        } else if (e.keyCode == 87) { //上
          _this.direction.up = true
        } else if (e.keyCode == 192) {
          _this.switchover = !_this.switchover
          if (_this.switchover) {
            vue.$message('慢速移动');
          } else {
            vue.$message('快速移动');

          }
        }
      }

      function keyUp(e) {
        if (e.keyCode == 65) { //左
          _this.direction.left = false
        } else if (e.keyCode == 83) { //下
          _this.direction.down = false
        } else if (e.keyCode == 68) { //右
          _this.direction.right = false
        } else if (e.keyCode == 87) { //上
          _this.direction.up = false
        }
      }

      function mousemove(e) {
        let movementX = e.movementX ||
          e.mozMovementX ||
          e.webkitMovementX ||
          0
        let movementY = e.movementY ||
          e.mozMovementY ||
          e.webkitMovementY ||
          0;

        _this.positionWC = map.viewer.scene.camera.positionWC;
        let pitch = map.viewer.scene.camera.pitch;
        if (movementY > 0) { //下转
          if (pitch > -1.44) {
            map.viewer.camera.lookDown(Cesium.Math.toRadians(movementY) / 16)
          }
        }
        if (movementY < 0) { //上转
          if (pitch < 1.44) {
            map.viewer.camera.lookUp(-Cesium.Math.toRadians(movementY) / 16)
          }
        }
        map.viewer.camera.rotate(_this.positionWC, Cesium.Math.toRadians(movementX) / 16)

      }

      function times() {
        let cameraHeight = map.viewer.scene.camera.positionCartographic.height;
        cameraHeight = cameraHeight < 1 ? 1 : cameraHeight;

        if (_this.switchover) {
          _this.speed = 0.2
        } else {
          let math = Cesium.Math.logBase(cameraHeight, 2);
          _this.speed = math < 0.2 ? 0.2 : math;
        }
        let recall = ''
        if (_this.direction.left) {
          map.viewer.camera.moveLeft(_this.speed)
          recall = 'moveRight'
        }
        if (_this.direction.right) {
          map.viewer.camera.moveRight(_this.speed)
          recall = 'moveLeft'

        }
        if (_this.direction.down) {
          map.viewer.camera.moveBackward(_this.speed)
          recall = 'moveForward'

        }
        if (_this.direction.up) {
          map.viewer.camera.moveForward(_this.speed)
          recall = 'moveBackward'

        }
        _this.positionWC = map.viewer.scene.camera.positionWC;
        // console.log(cameraHeight, _this.speed, Cesium.Math.logBase(cameraHeight, 2))

        // let directionWC = Cesium.Cartesian3.normalize(map.viewer.scene.camera.directionWC, new Cesium.Cartesian3());

        // let plane = Cesium.Plane.fromPointNormal(_this.positionWC, directionWC);
        // for (let i in AxisAlignedBoundingBox) {
        //   let box = AxisAlignedBoundingBox[i];
        //   if (_this.positionWC.x - box.minimum.x >= 0 && _this.positionWC.x - box.maximum.x <= 0 && _this.positionWC.y - box.minimum.y >= 0 && _this.positionWC.y - box.maximum.y <= 0 && _this.positionWC.z - box.minimum.z >= 0 && _this.positionWC.z - box.maximum.z <= 0) {
        //     // console.log(11, i, box, _this.positionWC)
        //     if (recall == 'moveLeft') {
        //       map.viewer.camera.moveLeft(_this.speed)
        //     }
        //     if (recall == 'moveRight') {
        //       map.viewer.camera.moveRight(_this.speed)
        //     }
        //     if (recall == 'moveBackward') {
        //       map.viewer.camera.moveBackward(_this.speed)
        //     }
        //     if (recall == 'moveForward') {
        //       map.viewer.camera.moveForward(_this.speed)
        //     }
        //     return
        //   }
        // }
        // OrientedBoundingBox
      }

    } else {
      vue.$notify.error({
        title: '错误',
        message: '这是一条错误的提示消息'
      });
    }

  }

}
export default TheFirstPerspective
