const right=Vue.component('right',{
  data: function () {
    return {
    }
  },
  template: '<div @click="abc">right</div>',
  methods:{
    abc(){
      console.log(this);
    }
  }
})


export default right