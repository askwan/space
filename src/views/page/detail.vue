<template>
    <div class="detail fill">
      <div class="leader cle">
        <b>{{config.name}}</b>
        <a href="" class="back">我的 App</a>
        <div class="tab-but">
            <el-button size="mini" type="primary" round plain @click="centerDialogVisible = true">插件</el-button>
            <el-button size="mini" type="primary" round plain @click="savePlguin">保存</el-button>
        </div>
    </div>
    <!-- content -->
    <div class="app-box">
      <app-frame :config="config"></app-frame>
    </div>
    <el-dialog
      title="选择插件"
      :visible.sync="centerDialogVisible"
      width="60%"
      center>
      
      <ul class="plugin-list cle">
        <li @click="select(e)" v-for="(e,i) in plugins" :key="i"> <el-button plain :type="isSelect(e)">{{e.name}}</el-button></li>
        <!-- <el-checkbox-group>
          <el-checkbox v-for="(e,i) in plugins" :checked="isSelect(e)" :key="i" :label="e.name" @change="select(e)" border></el-checkbox>
        </el-checkbox-group> -->
      </ul>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPlugin()">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
// import plugin from './js/plugin-list.js'
// import collection from '@/data.js'
let _id;
import server from '@/server.js'
import {serverApp} from '@/server/index.js'
import userMgr from "@/server/userUtil.js";
export default {
  data() {
    return {
      title:"",
      centerDialogVisible: false,
      plugins:[],
      nowCliack:"",
      config:{},
    };
  },
  props: {},
  components: {
    "app-frame":()=>import('./frame.vue')
  },
  computed: {},
  watch:{},
  created() {},
  mounted() {
    let userObj = userMgr.getUser()
    let uid = userObj.id
    let parmes = {descOrAsc:true,
                  isloadversion:true,
                  keywords:"",
                  orderType:"ID",
                  pageNum:1,
                  pageSize:6,
                  type:"2",//插件
                  }
    // this.title = this.$route.query.new;
      //插件列表
      serverApp.getPlugins(parmes).then(res=>{
        res.data.list.forEach(e=>{
          if(e.classify.id == 8){
            this.plugins.push(e)
          }
        })
        // this.plugins = res.data.list;
        // this.plugins = res.list;
      });

    
    let id = this.$route.query.new;
    _id = this.$route.query.new;
    let session = sessionStorage.getItem(id);
    if(session){
      console.log("本地")
      this.config = JSON.parse(session);
      console.log(this.config)
    }else{
      // serverApp.getAppById(id).then(res=>{
      //   this.config = res.list[0];
      // });
      console.log("请求");
      console.log(this.config);
      serverApp.getApps({uid:uid}).then(res=>{
        // console.log(res)
        if(res.status==200){
          let arr = res.data
          arr.forEach(e => {
            if(e.id == id){
              e.plugins = e.plugins || [];
              // console.log(e,451212)
              this.config = e
            }
          });
        }
        // this.plugins = res.list;
      
      });
    }
  },
  destroyed(){
    console.log("xiaohui",this.$route.query.new)
    // window.removeEventListener("resize",this.change)
    sessionStorage.removeItem(_id);
  },
  methods: {
    checked(){
      let id = this.$route.query.new;
      let session = sessionStorage.getItem(id);
      if(session){
        this.$confirm('编辑未保存, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path:'/home',
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }else{
        this.$router.push({
            path:'/home',
          });
      }
    },
    addPlugin(){
      sessionStorage.setItem(this.config.id,JSON.stringify(this.config));
      this.centerDialogVisible = false;      
      location.reload();
    },
    select(item){
            let index = this.config.plugins.findIndex(el=>el.name==item.name);
            // console.log(item.name,this.config.plugins,index)
            if(index==-1){
              this.config.plugins.push(item);
            }else{
              this.config.plugins.splice(index,1);
              // console.log(this.config.plugins)
            };
          
      // console.log(this.config)
    },
    isSelect(item){
      if(this.config.plugins){
        // console.log(item)
        // return Boolean(this.config.plugins.find(el=>el.name==item.name))
        return this.config.plugins.find(el=>el.name==item.name)?'primary':'';
      }
    },
    savePlguin(){
      console.log(this.config)
      serverApp.saveApp(this.config).then(res=>{
        // console.log(res);
        if(res.status==200){
          // this.$message('保存成功');
          this.$notify({
            type:'success',
            title:'成功',
            message:res.message
          })
          sessionStorage.removeItem(_id);
        }
      })
    }
  }
};
</script>
<style lang='scss' scoped>
.cle:after {
    content: " ";
    display: block;
    width: 100%;
    clear: both;
  }
.detail{
  background-color: #f8f8f8;
  .leader{
    // margin-top: 1.55rem;
    padding: 1.023rem;
    &>b{
      float: left;
      font-size: 1.7689rem;
      color: #4c4c4c;
      font-weight: 600;
    }
    .tab-but{
      float:right;
    }
    border-bottom: 1px solid #ccc;
    .back{
      float: left;
      margin: 10px 20px;
      font-size: 12px;
      color: #4c4c4c;
      &:hover{
        text-decoration: underline;
      }
    }
  }
  .plugin-list{
    width:100%;
    li{
      float: left;
      margin: 10px;
      box-sizing: border-box;
    }
  }
     .tab-title {
        font-size: 1rem;
        line-height: 1.55rem;
        margin-right: 2px;
        padding:14px;
        box-sizing: border-box;
        //  border-bottom: 2px solid rgba(255, 255, 255, 0);
        &>a{
          color: #4c4c4c;
        }
        // &:hover{
        //   border-bottom: 2px solid #0079c1;
        // }
    }
  .app-box{
    height: calc(100% - 4rem);
    position: relative;
    width: 100%;
  }
}
</style>