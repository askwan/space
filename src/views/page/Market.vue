<template>
  <div class='plugin-market pd-large'>
    <div class="mg-bottom-large">
      <el-input placeholder="请输入搜索内容" v-model="searchVal">
        <el-select v-model="select" slot='prepend' placeholder="请选择">
          <el-option label="a" value="a"></el-option>
          <el-option label="b" value="b"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <ul class="plugin-list">
      <li class="shadow plugin-li mg-bottom-big pd-small flex-between" v-for="plugin in plugins" :key="plugin.id">
        <div class="icon-box shrink mg-left-small">
          <img class="img-auto" :src="plugin.icon" alt="">
        </div>
        <div class="plugin-info pd-left-big mg-right-small">
          <h3 class="font-18 mg-bottom-small pointer-default">{{plugin.name}}</h3>
          <p class="mg-bottom-small text-ellipsis-3 font-gray">{{plugin.title}}</p>
          <div>
            <el-tag class="mg-right-small" disable-transitions size="mini" v-for="tag in plugin.keywords" :key="tag">{{tag}}</el-tag>
          </div>
        </div>
        <div class="plugin-downlon flex-center radius-2 shrink mg-right-small">
          <i v-if="localPlugins.find(el=>el.id==plugin.name)" class="el-icon-delete font-36 font-gray pointer-danger" @click="deletePlugin(plugin)"></i>
          <i v-else class="el-icon-download font-36 font-gray pointer-default" @click="downloadPlugin(plugin)"></i>
        </div>
      </li>
    </ul>
    <div class="page-foot flex-center">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {serverApp} from '@/server'
  import {pluginServer} from "@/localServer"
  export default {
    data(){
      return {
        searchVal:"",
        select:'',
        pageNumber:1,
        pages:1,
        plugins:[],
        total:0,
        localPlugins:[]
      }
    },
    props:{},
    components:{},
    computed:{},
    mounted(){
      this.getLocal();
      this.getList();
    },
    filters:{
      toArray(str){
        if(str.length>0){
          return JSON.parse(str);
        }else{
          []
        }
      }
    },
    methods:{
      downloadPlugin(plugin){
        console.log(plugin.versionList[0]);
        let zip = plugin.versionList[0].versionFileList[0];
        let fileUrl = zip.fileUrl;
        let fileName = zip.fileName;
        console.log(fileUrl,fileName);
        pluginServer.download({fileUrl:fileUrl,name:fileName}).then(res=>{
          console.log(res,"res");
          this.localPlugins.push({id:res.name});
        })
      },
      deletePlugin(plugin){
        console.log(plugin);
        let obj = {
          name:plugin.name
        };
        pluginServer.deletePlugin(obj).then(res=>{
          console.log(res,'success');
          this.localPlugins = this.localPlugins.filter(el=>el.id!=obj.name);
        })
        .catch(err=>{
          console.log(err,'err')
        })
      },
      getList(){
        // console.log(serverApp.imageUrl)
        serverApp.getPlugins({type:2,pageNum:this.pageNumber,pageSize:10,orderType:"ID",descOrAsc:true,isloadversion:true,isloadversionfile:true}).then(res=>{
          this.plugins = res.data.list.map(el=>{
            el.keywords = JSON.parse(el.keywords);
            el.icon = serverApp.imageUrl+'/picture'+el.icon;
            return el
          }).filter(el=>el.versionList.length>0);
          this.pages = res.data.pages;
          this.pageNumber = res.data.pageNumber;
          this.total = res.data.total;
          console.log(this.plugins)
        })
      },
      getLocal(){
        let p1 = pluginServer.query({type:1});
        let p2 = pluginServer.query({type:2});
        let p3 = pluginServer.query({type:3});
        Promise.all([p1,p2,p3]).then(lists=>{
          console.log(lists);
          lists.forEach(els=>{
            this.localPlugins = this.localPlugins.concat(els.list);
          })
        })
      },
      changePage(pageNum){
        this.pageNumber = pageNum;
        this.getList();
      }
    }
  }
</script>
<style lang='scss' scoped>
  .plugin-market{
    width: 1200px;
    margin: auto;
    // height: 100%;
    background-color: #f8f8f8;
    // overflow-y: auto;
    .plugin-list{
      .plugin-li{
        height: 150px;
        background-color: #fff;
        .icon-box{
          width: 100px;
          height: 100px;
        }
        .plugin-info{
          flex-grow: 2;
          min-height: 100px;
        }
        .plugin-downlon{
          width: 100px;
          height: 100px;
          border: 1px solid #aaa;
        }
      }
    }
    
  }
</style>