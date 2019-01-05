const middle=Vue.component('middle',{
  data: function () {
    return {
    }
  },
  template: '<div @click="abc">middle</div>',
  methods:{
    abc(){
      console.log("我是一个middle");
    }
  }
})


export default middle