class Clock {
  constructor() {}
  init() { // 初始化时钟
    console.log('加载时钟-时间轴')
    let time = new Date()
    // time.setDate(time.getDate() - 15)
    //  let y = time.getFullYear()
    // let m = time.getMonth()
    // let d = time.getDate()
    // let h = time.getHours()
    // let f = time.getMinutes()
    // let s = time.getSeconds()
    // let hs = time.getMilliseconds()
    // var start = Cesium.JulianDate.fromDate(new Date())
    // var stop = Cesium.JulianDate.fromDate(new Date(y + 1, m, d, h, f, s, hs))

    var today = Cesium.JulianDate.now()
    // var tomorrow = JulianDate.addDays(today, 1, new JulianDate())

    // var start = Cesium.JulianDate.addDays(today, 0, new Cesium.JulianDate()); // Cesium.JulianDate.fromDate(new Date(time.getDate() - 15))
    var start = Cesium.JulianDate.fromDate(new Date(2008, 1, 2, 0, 59, 0));
    var stop = Cesium.JulianDate.fromDate(new Date(2008, 1, 3, 20, 59, 0));
    // var stop = Cesium.JulianDate.addDays(today, +15, new Cesium.JulianDate()); // Cesium.JulianDate.fromDate(new Date(time.getDate() + 15));
    // console.log(start, stop, '初始化时间')
    this.clock = new Cesium.Clock({ // 时钟
      startTime: start.clone(),
      currentTime: start.clone(),
      stopTime: stop.clone(),
      clockRange: Cesium.ClockRange.LOOP_STOP, // 循环结束时
      clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
      multiplier: 1, // 播放速度
      shouldAnimate: false, // 是否开始动画
    })
  }
  getClock() {
    return this.clock
  }
  getClockViewModel() {
    return new Cesium.ClockViewModel(this.clock)
  }
}
let clock = new Clock()
export default clock
