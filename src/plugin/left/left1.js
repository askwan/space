import pluginManager from '@/pluginManager'
export default {
  data: function () {
    return {
    }
  },
  template: '<div class="font-white font-30" @click="abc">8888888888956</div>',
  methods:{
    abc(){
      console.log(this);
    }
  },
  mounted() {
    console.log(pluginManager)
    // console.log('插件的mounted')
    // console.log('mounted')
  },
}