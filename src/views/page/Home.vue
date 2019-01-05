<template>
    <div class="home">
      <!-- title -->
      <div class="leader cle">
        <b>App</b>
        <div class="tab-but">
              <el-button type="primary" @click="jump()" plain>创建App</el-button>
        </div>
      </div>
      <!-- content -->
      <div class="content">
        <!-- 列表 -->
        <el-row>
          <!-- <el-col :span="2">
            <div class="grid-content bg-purple tab-title">
             我的 App
            </div>
          </el-col> -->
          <el-col :span="24" id="bar"> 
            <div>
              <article class="cell-container">
                <ul>
                  <li class="item-card" v-for="app in lists" :key="app.id">
                    <div class="cle">
                      <!-- img -->
                      <div class="ember-view float-left"><img :src="app.icon" v-if="app.icon"><img v-else src="./assets/images/img.png"></div>
                      <div class="app-info float-left">
                        <h5 :title="app.name">{{app.name | cutName()}}</h5>
                        <!-- <h6>描述</h6> -->
                      </div>
                    </div>
                    <div class="center-card">
                      <div class="app-tags">
                        <div>
                          <!-- <el-tooltip effect="dark" :content="'ui'" placement="right" v-if="app.layout"> -->
                          <span v-if="app.layout" style="margin-right:10px">
                            <span class="h-tags h-tags-green" :title="'ui：'+app.layout">{{app.layout}}</span>
                          </span>
                          <!-- </el-tooltip> -->
                          <!-- <el-tooltip effect="dark" :content="'场景'" placement="right" v-if="app.mapView"> -->
                          <span v-if="app.mapView">
                            <span class="h-tags h-tags-yellow" :title="'场景：'+app.mapView">{{app.mapView}}</span>
                          </span>
                          <!-- </el-tooltip> -->
                          <div v-if="app.sdomain">
                            <span class="h-tags h-tags-red" v-if="app.sdomain.id" :title="'时空域：'+app.sdomain.name">{{app.sdomain.name}}</span>
                          </div>
                        </div>
                      </div>
                      <h6 class="cle margin-auto">
                        <span class="text-right" title="创建日期">{{app.createTime|editTime}}</span>
                        <!-- <span class="text-right quarter">•</span>
                        <span class="text-right">{{app.uid}}</span> -->
                      </h6>
                    </div>

                      <div class="mask">
                          <i class="el-icon-edit" title="编辑插件" @click="edit(app)"></i><i class="el-icon-delete" title="删除" @click="delet(app)"></i>
                          <i class="el-icon-view" title="预览" @click="view(app)"></i><i class="el-icon-edit-outline" title="编辑app" @click="editApp(app)"></i>
                      </div>
                  </li>

                </ul>
              </article>
            </div></el-col>
        </el-row>
        
      </div>
    </div>
</template>
<script>
import server from '@/server.js'
import {serverApp} from '@/server/index.js'
import userMgr from "@/server/userUtil.js";
import {readyServer} from '@/localServer'
export default {
  data() {
    return {
      show:false,
      lists:[]
    };
  },
  props: {},
  components: {},
  computed: {
   
  },
  watch:{},
  created() {},
  mounted() {
    let userObj = userMgr.getUser()
    let uid = userObj.id
    serverApp.getApps({uid:uid}).then(res=>{
      // console.log(res);
     if(res.status==200){
       let lists = [];
       console.log(res.data,"data")
        this.lists = res.data.reverse();
        this.lists.forEach(el=>{
          lists.push(el.layout);
          lists.push(el.mapView);
          el.plugins.forEach(ev=>{
            lists.push(ev.name);
          });
        })
        // console.log(lists,55555);
        readyServer.loadSource({lists:lists}).then(res=>{
          console.log(res,'loadServer');
        })
     }
    })
  },
  filters:{
    editTime(timestamp){
       var date = new Date(timestamp);
        var Y = date.getFullYear() + '年';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
        var D = date.getDate() + '日';
        // var h = date.getHours() + ':';
        // var m = date.getMinutes() + ':';
        // var s = date.getSeconds();
        return Y+M+D;
    },
     cutName(txt){  // 分割 name
        if( txt.length > 10 ){
          return txt.substr(0,10) + "...";
        }else{
          return txt;
        }
      },
  },
  methods: {
    view(app){
     window.open('#/view?app='+ app.id)
    },
    maskShow(){
      this.show = true
    },
    jump(){
      this.$router.push(
        "/create"
      )
    },
    delet(app) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(app.id)
          let id = app.id
          serverApp.deleteApp({id:id}).then(res=>{
            if(res.status==200){
              // console.log(res)
              this.lists = this.lists.filter(el=>el.id!=app.id);
              this.$notify({
                type:'success',
                title:'成功',
                message:'删除成功'
              })
            }
            
          })
        }).catch(() => {
        
        });
      },
    edit(app){
      this.$router.push({
        path:'/detail',
        query:{
          new:app.id
        }
      });
      // window.open('#/detail?new='+app.id)
    },
    editApp(app){
      this.$router.push({
        path:'/create',
        query:{
          edit:app.id
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.home{
  width: 1200px;
  margin: 0 auto;
  height: 1000px;
  background-color: #f8f8f8;
  .cle:after {
    content: " ";
    display: block;
    width: 100%;
    clear: both;
  }
  .font-size{
    font-size: 16px;
  }
  .align-left{
    text-align: left;
  }
  .align-right{
    text-align: right;
  }
  .float-left{
    float: left;
  }
  .width-80{
    width: 80px;
  }
  .margin-auto{
    margin: 9% 25%;
  } 
  .leader{
    // margin-top: 1.55rem;
    padding: 1.023rem;
    margin-bottom: 20px;
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
  }
  #bar{
    overflow-y: auto;
  }
  // content
   .tab-title {
        font-size: 1rem;
        line-height: 1.55rem;
        margin-right: 2px;
        padding:14px;
        box-sizing: border-box;
         border-bottom: 2px solid rgba(255, 255, 255, 0);
        &>a{
          color: #4c4c4c;
        }
        &:hover{
          border-bottom: 2px solid #0079c1;
        }
    }
  .cell-container{
    position: relative;
    width: 100%;
    height: 740px;
    ul{
      display: flex;
      flex-wrap:wrap;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 1000px;
      .app-info{
        margin:10px 14px;
      }
      .item-card{
        width: 232px;
        height: 235px;
        position: relative;
        margin: 10px 0px 0 17px;
        padding: 10px;
        text-align: center;
        border: 1px solid #ccc;
        background-color: #fff;
        .ember-view{
          width: 70px;
          height: 70px;
          img{
            width: 100%;
            height: 100%;
            border-radius: 6px;
          }
        }
        .center-card{
          color: #6e6e6e;
          padding: 10px;
          &>h5{
            padding: 20px 0;
            font-weight: 600;
          }
          .text-right,.text-left,.quarter{
            font-size: 12px;
            font-weight: 400;
            float: left;
          }
          .app-tags{
            // border: 1px solid #ccc;
            height: 55px;
            position: relative;
            &>div{
              cursor:pointer;
              width: 100%;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%,-50%);
            }
          }
          .quarter{
            padding: 0 8px;
          }
          .h-tags{
              font-size: 12px;
              display: inline-block;
              text-align: center;
              border-radius: 5px;
              max-width: 50%;
              font-size: 12px;
              padding: 3px 5px;
              margin-right: 4px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-height: 30px;
              line-height: 13px;
              &:last-child{
                  margin: 0;
              }
          }
          .h-tags-green{
              color: #67c23a;
              background: #f0f9eb;
              border: 1px solid #c2e7b0; 
          }
          .h-tags-yellow{
              color: #e6a23c;
              background: #fdf6ec;
              border: 1px solid #f5dab1; 
          }
          .h-tags-red{
              color: #f56c6c;
              background: #fef0f0;
              border: 1px solid #fbc4c4; 
          }
        }
        .mask{
          text-align: center;
          margin: -14px;
          i{
            padding: 10px;
            color: #6e6e6e;
            font-size:16px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
