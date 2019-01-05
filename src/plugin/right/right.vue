<template>
  <div class='root font-white pd-small'>
    <el-form size="mini" label-width="80px">
      <el-form-item label="lng">
        <el-input v-model="center.lng"></el-input>
      </el-form-item>
      <el-form-item label="lat">
        <el-input v-model="center.lat"></el-input>
      </el-form-item>
      <el-form-item label="点击坐标">
        <el-input :readonly="true" v-model="str"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="setCenter">set-center</el-button>
      </el-form-item>
    </el-form> 
  </div>
</template>
<script>
  export default {
    data(){
      return {
        center:{
          lat:0,
          lng:0
        },
        str:''
      }
    },
    props:{},
    components:{},
    computed:{},
    mounted(){
      this.listenEvent();
    },
    methods:{
      listenEvent(){
        _bus.$on('middle.click',event=>{
          let posi = event.lngLat;
          this.str = posi.toString();
        })
      },
      setCenter(){
        let pluginManage = this._pluginManage;
        pluginManage.plugins().middle.setCenter(this.center);
      }
    }
  }
</script>
<style lang='scss' scoped>

</style>