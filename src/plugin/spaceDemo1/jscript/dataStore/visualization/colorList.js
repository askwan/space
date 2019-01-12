class ColorList {
  constructor() {
    this.colorList = null
  }
  setList(val) {
    this.colorList = val
  }
  getColor(obj) {
    let data = this.getStyleId(obj)
    let objs = {
      color: "#ffffff",
      opacity: 0.5,
      width: 5,
      type: ''

    }
    if (data) {
      try {
        let style = JSON.parse(data.data)
        let type = style.type
        objs.type=type
        if (style.paint) {
          if (style.paint[type + '-color']) {
            objs.color = style.paint[type + '-color']
          }
          if (style.paint[type + '-opacity']) {
            objs.opacity = style.paint[type + '-opacity']
          }
          if (style.paint[type + '-width']) {
            objs.width = style.paint[type + '-width']
          }
          
        }

      } catch (err) {
        console.log(data,err)
      }

    }
    if (objs.color instanceof Array) {
      for (let i = 0; i < objs.color.length; i++) {
        let n = objs.color[i]
        if (n[0] == '#') {
          objs = {
            color: n,
            opacity: 0.5
          }
        }
      }
    } else {}
    objs.color = Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(objs.color), objs.opacity)
    return objs
  }
  getStyleId(obj) {
    if (!obj) {
      return
    }
    let forms = obj.forms
    let style = null
    for (let q = 0; q < forms.length; q++) {
      let form = forms[q]
      if (form.type == 23) {
        style = form.style
      }
    }
    if (style) {
      style = JSON.parse(style)
      return this.getStyle(style[0])
    } else {
      if (!obj.otype.formStyles) {
        return
      }
      let styles = obj.otype.formStyles.styles
      if (!styles) {
        return
      }
      for (let i = 0; i < styles.length; i++) {
        let sty = styles[i]
        if (sty.style == 3) {
          return this.getStyle(sty.id)
        }
      }
    }

    return null
  }
  getStyle(id) {
    if (!id) {
      return
    }
    for (let i = 0; i < this.colorList.length; i++) {
      let style = this.colorList[i]
      if (id == style.id) {
        return style
      }
    }
    return null
  }
}
let colorList = new ColorList()
export default colorList