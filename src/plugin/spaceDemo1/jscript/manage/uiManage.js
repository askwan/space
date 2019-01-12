// import left from "../js/left.js";
// import right from "../js/right.js";
// import middle from "../js/middle.js";
import object from "../../components/upWindow/objTree.vue";
import tree from "../../components/upWindow/classViewList.vue";
import history from "../../components/upWindow/history.vue";
import detail from "../../components/upWindow/details.vue";
import modelTranslation from "../../components/upWindow/operation.vue";


/**
 * 新建一个可拖拽的类
 */
class DragUiData {
  constructor(name, title, ui, top, left, width, height, show, icon) {
    this.name = name
    this.title = title
    this.icon = icon ? icon : 'el-icon-star-on'
    this.ui = ui
    this.show = show
    this.width = width || 300
    this.height = height || 500
    this.left = left || 0;
    this.top = top || 0
    this.zIndex = 100
    this.titleNum = 0

    this.oldData = {
      width: 300,
      height: 500,
    };
    // if(this.name!=='middle'){
    //   uiFunction.updated({name:this.name,left:this.left})
    // }
  }
}
/**
 * 类的集合
 */
let uiManage = {
  manageUi: {
    objectUi: new DragUiData(
      "objectUi",
      "对象树",
      object,
      0,
      0,
      300,
      500,
      false,
      "icon-object-ungroup"),
    treeUi: new DragUiData(
      "treeUi",
      "类视图",
      tree,
      0,
      0,
      300,
      500,
      false,
      "icon-shu"),
    historyUi: new DragUiData(
      "historyUi",
      "历史",
      history,
      0,
      0,
      300,
      500,
      false,
      "icon-yuyuelishi"),
    detailUi: new DragUiData(
      "detailUi",
      "详情",
      detail,
      0,
      0,
      300,
      500,
      false,
      "icon-shuxing"),
    modelTranslationUi: new DragUiData(
      "modelTranslationUi",
      "操作",
      modelTranslation,
      0,
      0,
      300,
      500,
      false,
      "icon-yuanchengkongzhi"),
  },
  toolBars: [],
  getManage() {
    return uiManage.manageUi
  },

}

/**
 * 工具的集合
 */
const upWindowTool = []
/**
 * 公共的
 */
let commonality = {
  leftData: [],
  rightData: [],
  otherData: [],
  leftDataIndex: {}, //左边最高层级数据
  rightDataIndex: {}, //右边最高层级数据
  bodyHeight: 0,
  bodyWidth: 0,
  fuzzy: 20,
  pitchObj: null
}
/**
 * 所有的方法
 */
const uiFunction = {
  
  /**
   * 要查询的名字
   * @param {string} name 
   */
  getNameUi(name) {
    return uiManage.manageUi[name]
  },
  /**
   * 窗口变化时变化的宽高
   * @param {object} options 
   */
  calcBody(options) { //窗口大小变化时  重置弹窗
    commonality.bodyWidth = options.width;
    commonality.bodyHeight = options.height;
    // console.log(commonality,"comm")
    if (commonality.rightData.length > 0) {
      commonality.rightData.forEach((item, index) => {
        uiFunction.getNameUi(item).left = commonality.bodyWidth - uiFunction.getNameUi(item).width;
        uiFunction.updated({
          name: item,
          show: true
        });
      })
    }
    if (commonality.leftData.length > 0) {
      commonality.leftData.forEach(e => {
        uiFunction.updated({
          name: e,
          show: true
        });
      })
    }
    uiFunction.middleLocationChange()
  },
  /**
   * //关闭弹窗
   * name为要关闭的弹窗的名字
   * @param {string} name 
   */
  closeTab(name) {
    uiFunction.delFiltrate(name, 'leftData')
    uiFunction.delFiltrate(name, 'rightData')
    uiFunction.updated({
      name: name,
      show: false
    });
  },

  /**
   * //删除不在左和右的数组内
   * name 为要删除的弹窗名字
   * or 为左右吸附的数组
   * @param {string} name 
   * @param {string} or 
   */
  delFiltrate(name, or) {
    let list = commonality[or]
    let orIndex = or + 'Index'
    list.forEach((n, i) => {
      if (n == name) {
        list.splice(i, 1)
        if (list.length > 0) {
          commonality[orIndex] = list[list.length - 1]
        }
      }
    })
  },
  /**
   *  打开弹窗
   * @param {string} name 
   */
  openTab(name) { //打开弹窗
    uiFunction.updated({
      name: name,
      show: true
    });
  },
  /**
   * obj 为接收的弹窗的对象
   * @param {object} obj 
   */
  updated(obj) { //刷新弹窗位置
    let options;
    // if (obj.name == 'middle') {
    //   options = uiFunction.getMiddleUi()
    //   options.height = obj.height

    // } else {
      options = uiFunction.getNameUi(obj.name)
      obj = Object.assign(options, obj);
      // if (!obj.show) {
      //   return
      // }
      uiFunction.notMiddle(obj, options)
    // }
    uiFunction.getTitlePosition()
  },
  /**
   * obj 为传过来的要改变的对象
   * options 为之前的参数对象
   * @param {object} obj 
   * @param {object} options 
   */
  notMiddle(obj, options) {
    options.width = obj.width <= 200 ? 200 : obj.width;
    options.height = obj.height <= 300 ? 300 : obj.height;

    //判断有没有超出边界  上下
    if (obj.top <= 0) {
      options.top = 0;
    } else {
      options.top = obj.top
    }
    //判断有没有超出边界  高度
    if (obj.height >= commonality.bodyHeight) {
      options.height = commonality.bodyHeight;
    }
    // if(obj.height+obj.top>commonality.bodyHeight){
    //   options.height = commonality.bodyHeight-obj.top;
    // }
    // console.log(1111111111111111111111111111111111)
    // //判断有没有超出边界   左右
    // if (obj.left < 0) {
    //   options.left = 0;
    // } else if (obj.left + obj.width > commonality.bodyWidth) {
    //   options.left = commonality.bodyWidth - 300;
    //   options.width = 300;
    // console.log(obj.left + obj.width, commonality.bodyWidth,options.left)

    // }

    uiFunction.adsorb(obj, options)
  },
  /**
   * /吸附判断
   * obj 为传过来的要改变的对象
   * options 为之前的参数对象
   * @param {object} obj 
   * @param {object} options 
   */
  adsorb(obj, options) {
    if (obj.left <= commonality.fuzzy && obj.show) {
      //吸附左侧
      options.left = 0;
      options.top = 0;
      options.width = 300;
      options.height = commonality.bodyHeight;
      uiFunction.whetherOrNot(obj, options, 'leftData')
    } else if (commonality.bodyWidth - obj.left - obj.oldData.width <= commonality.fuzzy && obj.show) {
      //吸附右侧
      options.left = commonality.bodyWidth - 300
      options.top = 0
      options.width = 300;
      options.height = commonality.bodyHeight;
      uiFunction.whetherOrNot(obj, options, 'rightData')
    } else {
      //没有吸附
      options.left = obj.left;
      uiFunction.filtrate(obj, 'leftData')
      uiFunction.filtrate(obj, 'rightData')
      options.width = options.oldData.width
      options.height = options.oldData.height
    }

  },
  /**
   * //筛选不在左和右的数组内
   * obj 为传过来的要改变的对象
   * or 为左右吸附的数组
   * @param {object} obj 
   * @param {string} or 
   */
  filtrate(obj, or) {
    let list = commonality[or]
    let orIndex = or + 'Index'
    list.forEach((n, i) => {
      if (n == obj.name) {
        list.splice(i, 1)
        if (list.length > 0) {
          commonality[orIndex] = list[list.length - 1]
          uiFunction.getNameUi(commonality[orIndex]).zIndex = 200
        }
        uiFunction.getNameUi(n).zIndex = 300
      }
    })
  },
  /**
   * //判断是否在数组内
   * obj 为传过来的要改变的对象
   * options 为之前的参数对象
   * or 为左右吸附的数组
   * @param {object} obj 
   * @param {object} options 
   * @param {string} or 
   */
  whetherOrNot(obj, options, or) {
    let list = commonality[or]
    let orIndex = or + 'Index'
    let have = false
    list.forEach((n, i) => {
      uiFunction.getNameUi(n).zIndex = 100
      if (n == obj.name) {
        have = true
      }
    })
    if (!have) {
      if (obj.show) {
        list.push(obj.name)
      }
    }
    commonality[orIndex] = obj.name
    options.zIndex = 200
  },
  /**
   * 中间组件变化产生的影响
   */
  middleLocationChange() {
    // uiFunction.getMiddleUi().left = 0
    // uiFunction.getMiddleUi().width = commonality.bodyWidth
    // uiFunction.getMiddleUi().height = commonality.bodyHeight
    return
    if (commonality.leftData.length > 0) {
      uiFunction.getMiddleUi().left = 300
    } else {
      uiFunction.getMiddleUi().left = 0
    }
    if (commonality.rightData.length > 0) {
      uiFunction.getMiddleUi().width = commonality.bodyWidth - 300 - uiFunction.getMiddleUi().left
    } else {
      uiFunction.getMiddleUi().width = commonality.bodyWidth - uiFunction.getMiddleUi().left
    }
  },
  /**
   * 获取计算小title距上的高度
   */
  getTitlePosition() {
    uiFunction.middleLocationChange()
    commonality.leftData.forEach((n, i) => {
      let options = uiFunction.getNameUi(n)
      options.titleNum = 1 + i * 60
    })
    commonality.rightData.forEach((n, i) => {
      let options = uiFunction.getNameUi(n)
      options.titleNum = 1 + i * 60
    })
  },
  /**
   * 改变之前宽高
   * @param {object} obj 
   */
  setOldData(obj) {
    let options = uiFunction.getNameUi(obj.name)
    options.oldData.width = obj.oldData.width
    options.oldData.height = obj.oldData.height
  },
  /**
   * 点击选中
   * @param {string} name 
   */
  pitch(name) {
    // let options = uiFunction.getNameUi(obj.name)
    commonality.pitchObj = name
  },
  /**
   * 100在左右数组中
   * 200在左右数组最前面
   * 300拖拽到外面
   * 400点击高亮
   * 500移动中
   */
  setZIndex(name, num) {
    let obj = uiFunction.getNameUi(name)
    obj.zIndex = num
  }
}
export default {
  uiManage,
  uiFunction,
  commonality,
  upWindowTool
}