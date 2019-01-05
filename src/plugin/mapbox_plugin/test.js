import Vue from "vue";

let vueUI1 = new Vue();

let vueUI = new Vue();


let plugin = {

  getUIs() {
    return [{
        ui: vueUI1,
        position: "left"
      },
      {
        ui: vueUI,
        position: "right"
      }
    ]
  },
  getMenuUI(){

  },
  initEvent() {

  },
  init(pluginManga) {

    pluginManga.getPlugin("mapbox").on("click",function(){

    })

  },
  onCreate() {

  }
}


export default plugin;