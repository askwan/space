import Evented from '@/script/utils/evented'

export const EventBus = new Evented();


export const MapEvent = {

  RightClick: 'RightClick', //树上右键
  LeftClick: 'LeftClick', //左键选中
  sliderChange: 'sliderChange', //操作滑块
  echartPic:"echartPic",  //echarts图表

}