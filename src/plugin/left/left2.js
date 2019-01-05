export default {
  data: function () {
    return {
    }
  },
  template: '<div @click="abc">left2</div>',
  methods:{
    abc(){
      console.log(this);
    }
  }
}