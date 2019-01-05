<template>
  <div class='mapbox-scene fill'>
    <div class="tool-tab pd-left-mini flex-align">
      <el-button size="mini" v-for="plugin in currentPlugins" :key="plugin.name" :icon="plugin.icon"></el-button>
      <el-button icon="el-icon-plus" size="mini" @click="addPlugin"></el-button>
      <el-button size="mini" :loading="isAjax" @click="savePage">打包</el-button>
    </div>
    <el-dialog title="添加插件" :visible.sync="showPlugins">
      <el-select v-model="selected">
        <el-option v-for="plugin in pluginList" :key="plugin.name" :label="plugin.name" :value="plugin.name"></el-option>
      </el-select>

      <div slot="footer">
        <el-button @click="showPlugins=false">取消</el-button>
        <el-button type="primary" @click="savePlugin">确定</el-button>
      </div>
    </el-dialog>
    <div class="plugin-box">
      <component v-for="plugin in currentPlugins" :key="plugin.name" :is="plugin.comp"></component>
    </div>

    <!-- 实例化mapbox -->
    <div id="map-box" class="fill map-box"></div>
  </div>
</template>
<script>
  import {pluginServe,pageServe} from '@/server'
  export default {
    data(){
      return {
        pluginList:[],
        showPlugins:false,
        selected:'',
        currentPlugins:[],
        isAjax:false
      }
    },
    props:{},
    components:{},
    computed:{},
    watch:{
      showPlugins(bool){
        if(!bool) this.selected = '';
      }
    },
    mounted(){
      this.getPlugin();
    },
    methods:{
      addPlugin(){
        this.showPlugins = true;
      },
      getPlugin(){
        let path = this.$route.fullPath;
        let typeId =2;
        pluginServe.getPlugins({typeId}).then(res=>{
          console.log(res.data);
          this.pluginList = res.data;
        })
      },
      savePlugin(){
        let plugin = this.pluginList.find(el=>el.name==this.selected);
        let index = this.currentPlugins.findIndex(el=>el.name==plugin.name);
        if(index==-1){
          plugin.comp = ()=>import('@/../plugin/'+plugin.name);
          // this.$set('plugin','comp',()=>import('@/../plugin/'+plugin.name));
          this.currentPlugins.push(plugin);
        }else{
          console.log('已添加')
        }
        this.showPlugins = false;
        console.log(this.currentPlugins);
      },
      savePage(){

        this.$prompt('请输入项目名称','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
        }).then(({value})=>{
          this.isAjax = true;
          pageServe.createScene({
            plugins:this.currentPlugins,
            type:2,
            pageId:value
          }).then(res=>{
            this.isAjax = false
            console.log(res)
          },err=>{
            this.isAjax = false;
          })
        })

        
      }
    }
  }
</script>
<style lang='scss' scoped>
  .mapbox-scene{
    .tool-tab{
      height: 40px;
      width: 100%;
      background-color: rgba(0,0,0,.1);
      overflow-x: auto;
      position: absolute;
      z-index: 100;
    }
    .map-box{
      background-color: #eee;
    }
    .plugin-box{
      position: absolute;
      z-index: 100;
    }
  }
</style>