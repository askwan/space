/**
样式控制
 */
let StyleCtrl = {
  styleList: {},
  setStyleList(styles) {
    for (let i = 0; i < styles.length; i++) {
      this.styleList[styles[i].id] = styles[i]
    }
  },
  getStyle(styleId) {
    if (this.styleList[styleId]) {
      return this.styleList[styleId]
    }
    return null
  },
  getMapCesiumStyle(styleId,sobject) {
    let result = {
      width: 5,
      height: 0,
      color: new Cesium.Color(0.0, 1.0, 0.0, 0.2),
      opacity: 1,
      type: ''
    }
    let jsonStyle = this.getStyle(styleId)
    if (jsonStyle && jsonStyle.style == 3) {
      let style 
      try{
        style = JSON.parse(jsonStyle.data)
      }catch(arr){
        return result
      }
      result.type = style.type
      if (style.paint) {
        let paint = style.paint
        let name = style.type
        let height = name + '-height'
        let color = name + '-color'
        let opacity = name + '-opacity'
        let width = name + '-width'
        if (paint[height]) {
          result.height = paint[height]
        }
        if (paint[width]) {
          result.width = paint[width]
        }
        if (paint[opacity]) {
          result.opacity = paint[opacity]
        }
        if (paint[color]) {
          let RGBAcolor
          if(paint[color] instanceof Object){
            sobject.attributes.forEach((n,i) => {
              if(n.name==paint[color].property){
                paint[color].stops.forEach((q,w)=>{
                  if(q[0]==n.value){
                    RGBAcolor =Cesium.Color.fromCssColorString(q[1]); 
                    result.color = Cesium.Color.fromAlpha(RGBAcolor, result.opacity);
                  }
                })
              }
            });

          }else if(paint[color] instanceof String){
        RGBAcolor = Cesium.Color.fromCssColorString(paint[color]); 
        result.color = Cesium.Color.fromAlpha(RGBAcolor, result.opacity);
          }


           // new Cesium.Color(RGBAcolor[0] / 255, RGBAcolor[1] / 255, RGBAcolor[2] / 255, styleOpacity)
        }
      }
    }
    return result
  },
  getOtypeStyle(sobject, form) {
    if (sobject.otype && sobject.otype.formStyles) {
      let styles = sobject.otype.formStyles.styles
      if (styles && styles.length > 0) {
        for (let i = 0; i < styles.length; i++) {
          if (styles[i].type == form.type) {
            return this.getMapCesiumStyle(styles[i].id,sobject)
          }
        }
      }
    }
    return null
  },
  getGeomFormStyle(sobject, form) {
  
    let cesiumStyle = this.getMapCesiumStyle(0,sobject)
    if (form.style && form.style.length > 0 && JSON.parse(form.style).length > 0) {
      let styleArr = JSON.parse(form.style)
      cesiumStyle = StyleCtrl.getMapCesiumStyle(styleArr[0],sobject)
    } else {
      // 查询otype是否有样式
      let style = StyleCtrl.getOtypeStyle(sobject, form)
      cesiumStyle = (style != null ? style : cesiumStyle)
    }
    return cesiumStyle
  }
}
export default StyleCtrl
