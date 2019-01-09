/**
服务形态
 */
export default class SObjectFormServer {
  constructor(form, sobject, style) {
    this.sobject = sobject
    this.form = form
    this.style = style

    this.data = JSON.parse(style.data)

    if (this.data.type == 'ObliquePhotography') {
      // 倾斜摄影
      this._primitive = new Cesium.Cesium3DTileset({
        // url : "/static/qxsy",
        url: this.data.serverUrl
        // modelMatrix:modelMatrix
      })
    }
  }
  update(frameState) {
    if (this._primitive) {
      this._primitive.update(frameState)
    }
  }
}
