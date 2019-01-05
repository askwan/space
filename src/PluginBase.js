//插件信息
export default class Plugin {
  constructor(option) {
    //插件的显示与隐藏
    this.show = true;
    //插件名称
    this.name = '';
    this.title = '';
    //工具栏图标
    this.icon = '';
    //是否显示工具栏图标
    this.toolbar = false;
    //工具栏图标下拉选项
    this.options = [];
    //插件ui集合
    this.uis = [];
    //插件方法
    this.methods = {
      
    };
    Object.assign(this, option);
    //存储插件内部变量
    this.store = {};
    this.uis = this.uis.map(ui=>new Ui(ui));
    this.setMethods(this.methods);
  }
  /**
   * 设置插件ui
   * @param {object} ui 
   */
  setUi(ui) {
    let index = this.uis.findIndex(el => el.name == ui.name);
    if (index == -1) {
      this.uis.push(new Ui(ui));
    } else {
      throw new Error(`已经有${ui.name}这个插件了`)
    }
  }
  /**
   * 插件初始化完成回调事件
   */
  inited() {
    
  }
  /**
   * 设置插件方法
   * @param {object} obj 
   */
  setMethods(obj) {
    for (let name in obj) {
      let fn = obj[name]
      if (typeof fn === 'function') {
        this[name] = bind(fn,this);
      }
    }
  }
}


class Ui {
  constructor(options) {
    this.position = 'left';
    this.show = true;
    Object.assign(this, options);
  }
}

function bind(fn, ctx) {
  return function (a) {
    var l = arguments.length
    return l ?
      l > 1 ?
      fn.apply(ctx, arguments) :
      fn.call(ctx, a) :
      fn.call(ctx)
  }
}