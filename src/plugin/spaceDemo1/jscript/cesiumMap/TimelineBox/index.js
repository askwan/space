import Timeline from './Timeline';
var TimeLineBox = {
  init: function (viewer, id) {
    this.viewer = viewer;
    this.speedValue = 1;
    this.zoomVal = 0;
    this.maxZoom = 100;
    this.createdUi(id);
    this.viewer.timeLine = new Timeline(document.getElementById("time-line-container"), this.viewer.cesiumWidget.clock);

    this.viewer.timeLine.addEventListener('settime', (e) => { //设置timeLine与clock同步
      this.viewer.cesiumWidget.clock.currentTime = e.timeJulian;
      this.viewer.cesiumWidget.clock.shouldAnimate = false;
    }, false);

    this.viewer.timeLine._timeBarEle.addEventListener(
      "mousewheel",
      () => {
        this.timeLineChangeFn();
      },
      false
    ); //绑定滚轮事件
    this.syncStatus();
  },
  enable: function () { //时间轴显示
    this.timeLineDom.style.display = "block";
    this.timeLineChangeFn();
    setTimeout(() => {
      this.viewer.timeLine.resize();
    }, 10)
  },
  disabled: function () { //时间轴销毁
    this.timeLineDom.style.display = "none";
  },
  resize: function () { //窗口大小改变绘制
    this.viewer.timeLine.resize();
  },
  createdUi: function (id) { //创建UI
    this.timeLineDom = document.getElementById(id);
    this.createTimeToolBoxUi();
  },
  syncStatus() { //同步状态
    this.viewer.clock.onTick.addEventListener(e => {
      //一直刷新
      // this.currentTime = Date.parse(Cesium.JulianDate.toDate(this.viewer.clock.currentTime)); //获取当前时间
      // // console.log(this.currentTime)
      // this.playSpeed = this.viewer.clock.multiplier; //设置播放速度
      // this.play = this.viewer.cesiumWidget.clock.shouldAnimate; //设置播放状态
      // this.updateClock();
      // this.updateTimeLine();
      // if( this.viewer.cesiumWidget.clock.shouldAnimate ){
      this.updateClockFn();
      this.updatePlayFn();
      this.updateSpeedFn();
      this.updateZoomFn();
      // }
    });
  },
  createTimeToolBoxUi: function () {
    this.timeLineDom.innerHTML =
      `<div class="time-tool-box">
        <div class="time-tool cle">
            <div class="time-tool-fl cle">
                <div class="play-back cle">
                    <a href="javascript:;" class="previous">
                        <i class="iconfont icon-houtui"></i>
                    </a>
                    <a href="javascript:;" class="play">
                        <i class="iconfont icon-bofang i-play"></i>
                        <i class="iconfont icon-weibiaoti519 i-stop"></i>
                    </a>
                    <a href="javascript:;" class="next">
                        <i class="iconfont icon-qianjin"></i>
                    </a>
                </div>
                <div class="time-speed cle">
                    <div class="time-speed-tit">
                        播放速度
                    </div>
                    <a href="javascript:;" class="rewind">
                        <i class="iconfont icon-ai18"></i>
                    </a>
                    <div class="speed-txt">
                        <input type="text">
                    </div>
                    <a href="javascript:;" class="forward">
                        <i class="iconfont icon-ai18-copy"></i>
                    </a>
                </div>
            </div>
            <div class="time-tool-fr cle">
                <a href="javascript:;" class="shrink">
                    <i class="iconfont icon-jianhao"></i>
                </a>
                <div href="javascript:;" class="line-max-box">
                    <div href="javascript:;" class="line-box">
                        <a href="javascript:;" class="line-event-bg"></a>
                        <a href="javascript:;" class="line"></a>
                        <a href="javascript:;" class="piece"></a>
                    </div>
                </div>
                <a href="javascript:;" class="enlarge">
                    <i class="iconfont icon-jiahao"></i>
                </a>
            </div>
        </div>
        <div class="time-down-box">
            <div class="current-time">
                <div class="current-hours">
                    06:00:00
                </div>
                <div class="current-year">
                    2018-03-01
                </div>
            </div>
            <div id="time-line-container"></div>
        </div>
    </div>
    `;
    this.playFn();
    this.clockFn();
    this.speedFn();
    this.zoomFn();
  },
  zoomFn: function () {
    this.shrinkDom = document.getElementsByClassName("shrink")[0];
    this.shrinkDom.addEventListener("click", () => { //缩小
      //缩小
      if (this.zoomVal > 1) {
        this.zoomVal--;
        this.lineChangeFn();
      }
    })
    this.enlargeDom = document.getElementsByClassName("enlarge")[0];
    this.enlargeDom.addEventListener("click", () => { //缩小
      //缩小
      if (this.zoomVal < 100) {
        this.zoomVal++;
        this.lineChangeFn();
      }
    })

    this.pieceDom = document.getElementsByClassName("piece")[0];
    this.lineMaxBoxDom = document.getElementsByClassName("line-max-box")[0];
    this.lineMaxBoxDom.addEventListener("click", (e) => { //缩小
      this.zoomVal = e.layerX / this.lineMaxBoxDom.clientWidth * 100;
      this.lineChangeFn();
    })
  },
  timeLineChangeFn: function () {
    //滚轮在时间轴上滚动时
    var currentStart = Date.parse(
      Cesium.JulianDate.toDate(this.viewer.timeLine._startJulian)
    );
    var currentEnd = Date.parse(
      Cesium.JulianDate.toDate(this.viewer.timeLine._endJulian)
    );
    var currentDeviation = currentEnd - currentStart;
    var currentMiddelTime = (currentStart + currentEnd) / 2; //当前可视区域的中心时间

    var startTime = Date.parse(
      Cesium.JulianDate.toDate(this.viewer.clock.startTime)
    );
    var stopTime = Date.parse(
      Cesium.JulianDate.toDate(this.viewer.clock.stopTime)
    );
    var deviationTime = stopTime - startTime;
    var displayTime = deviationTime / 100; //显示区域内的时间戳
    // this.zoomVal = 100 - currentDeviation / deviationTime * 100; //求百分比
    this.zoomVal = (1 - currentDeviation / deviationTime) * this.maxZoom; //求百分比
  },
  lineChangeFn: function () {
    var currentStart = Date.parse(
      Cesium.JulianDate.toDate(this.viewer.timeLine._startJulian)
    );
    var currentEnd = Date.parse(
      Cesium.JulianDate.toDate(this.viewer.timeLine._endJulian)
    );
    var currentDeviation = currentEnd - currentStart;
    var currentMiddelTime = (currentStart + currentEnd) / 2; //当前可视区域的中心时间
    var startTime = Date.parse(
      Cesium.JulianDate.toDate(this.viewer.clock.startTime)
    );
    var stopTime = Date.parse(
      Cesium.JulianDate.toDate(this.viewer.clock.stopTime)
    );
    var deviationTime = stopTime - startTime;
    // var displayTime = (100 - this.zoomVal) * (deviationTime / 100); //显示区域内的时间戳
    var displayTime = deviationTime / this.zoomVal; //显示区域内的时间戳
    if (displayTime == 0) {
      //开始时间跟结束时间不能相等。所以至少要等于1
      displayTime = deviationTime / 100;
    }
    this.viewer.timeLine.zoomTo(
      Cesium.JulianDate.fromDate(
        new Date(currentMiddelTime - displayTime / 2)
      ),
      Cesium.JulianDate.fromDate(
        new Date(currentMiddelTime + displayTime / 2)
      )
    );
  },
  updateZoomFn: function () {
    this.pieceDom.style.left = this.lineMaxBoxDom.clientWidth * this.zoomVal * 0.01 + "px";
  },
  speedFn: function () {
    this.rewindDom = document.getElementsByClassName("rewind")[0];
    this.rewindDom.addEventListener("click", () => { //快进
      this.speedTxtDom.value = parseFloat(this.speedTxtDom.value) - this.speedValue;
    })
    this.speedTxtDom = document.getElementsByClassName("speed-txt")[0].childNodes[1];
    this.speedTxtDom.value = this.viewer.clock.multiplier;
    this.forwardDom = document.getElementsByClassName("forward")[0];
    this.forwardDom.addEventListener("click", () => { //快进
      this.speedTxtDom.value = parseFloat(this.speedTxtDom.value) + this.speedValue;
    })
    this.updateSpeedFn();
  },
  speedVeriFn: function (e) {
    //速度验证
    this.playSpeed = parseFloat(this.speedTxtDom.value);
    if (isNaN(this.playSpeed)) {
      this.playSpeed = 1;
    }
    if (this.playSpeed > 604800) {
      this.playSpeed = 604800;
    }
    if (this.playSpeed < -604800) {
      this.playSpeed = -604800;
    }
    this.viewer.clock.multiplier = this.playSpeed;
    this.speedTxtDom.value = this.playSpeed;
  },
  updateSpeedFn: function () {
    this.speedVeriFn();
  },
  playFn: function () {
    this.previousDom = document.getElementsByClassName("previous")[0];
    this.previousDom.addEventListener("click", () => { //快退
      this.speedTxtDom.value = -Math.abs(
        this.speedTxtDom.value
      );
    })
    this.playDom = document.getElementsByClassName("play")[0];
    this.playDom.addEventListener("click", () => { //播放
      this.viewer.cesiumWidget.clock.shouldAnimate = !this.viewer.cesiumWidget
        .clock.shouldAnimate;
    })
    this.nextDom = document.getElementsByClassName("next")[0];
    this.nextDom.addEventListener("click", () => { //快进
      this.speedTxtDom.value = Math.abs(
        this.speedTxtDom.value
      );
    })
    this.updatePlayFn();
  },
  updatePlayFn: function () {
    if (this.viewer.clock.multiplier < 0) {
      this.previousDom.classList.add("active")
    } else {
      this.previousDom.classList.remove("active")
    }
    if (this.viewer.cesiumWidget.clock.shouldAnimate) {
      this.playDom.classList.add("start-play")
    } else {
      this.playDom.classList.remove("start-play")
    }
    if (this.viewer.clock.multiplier > 0) {
      this.nextDom.classList.add("active")
    } else {
      this.nextDom.classList.remove("active")
    }
  },
  clockFn: function () {
    this.currentHoursDom = document.getElementsByClassName("current-hours")[0];
    this.currentYearDom = document.getElementsByClassName("current-year")[0];
    this.updateClockFn();
  },
  updateClockFn: function () {
    let newHoursHTML = this.timeConversion(Date.parse(Cesium.JulianDate.toDate(this.viewer.clock.currentTime)))[1];
    let newYearHTML = this.timeConversion(Date.parse(Cesium.JulianDate.toDate(this.viewer.clock.currentTime)))[0];
    if (this.currentHoursDom.innerHTML != newHoursHTML) {
      this.currentHoursDom.innerHTML = newHoursHTML;
    }
    if (this.currentYearDom.innerHTML != newYearHTML) {
      this.currentYearDom.innerHTML = newYearHTML;
    }
  },
  timeConversion: function (timestamps) {
    var time = new Date(timestamps);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hour = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    hour < 10 ? (hour = "0" + hour) : "";
    minute < 10 ? (minute = "0" + minute) : "";
    second < 10 ? (second = "0" + second) : "";
    month < 10 ? (month = "0" + month) : "";
    date < 10 ? (date = "0" + date) : "";
    return [`${year}-${month}-${date}`, `${hour}:${minute}:${second}`]
  }
}
export default TimeLineBox;