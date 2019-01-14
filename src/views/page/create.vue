<template>
    <div class="create">
    <div class="leader cle">
        <b><b v-if="urlParams">编辑</b><b v-else>创建</b>App</b>
        <a href="" class="back">我的 App</a>
    </div>
    <!-- form -->
    <div class="create-tabs">
        <el-form :label-position="labelPosition" :rules="rules" label-width="100px" :model="formLabelAlign" ref="ruleForm">
            <el-form-item label="图标 :" class="icon">
                <el-upload class="article-avatar-up" name="file" :action="imageUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="formLabelAlign.icon" :src="ImageUrl" class="article-avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon article-avatar-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <!-- <el-form-item label="描述">
                <el-input v-model="formLabelAlign.des"></el-input>
            </el-form-item> -->
            <el-form-item label="选择ui">
                <el-select v-model="formLabelAlign.ui" placeholder="请选择" class="selected">
                    <el-option v-for="item in uis" :key="item.id" :label="item.name||item.id" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择场景">
                <el-select v-model="formLabelAlign.view" placeholder="请选择" class="selected">
                    <el-option v-for="item in views" :key="item.id" :label="item.name||item.id" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择时空域">
                <el-select v-model="formLabelAlign.domian" placeholder="请选择" class="selected" clearable>
                    <el-option v-for="item in sDomian" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所有权">
            <el-switch
            class="ownerShip"
            v-model="formLabelAlign.ownerShip"
            active-text="公有"
            inactive-text="私有">
            </el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <i class="el-form-item__label icon1">*</i>
        <i class="el-form-item__label icon2">*</i>
        <i class="el-form-item__label icon3">*</i>
    </div>
    </div>
</template>
<script>
// import server from '@/server.js'
import {serverApp} from '@/server/index.js'
import userMgr from "@/server/userUtil.js";
import {readyServer,pluginServer} from '@/localServer'
export default {
  data() {
    return {
        labelPosition: 'right',
        formLabelAlign: {
          name: '',
          ui: '',
          view: '',
          domian:'',
          des: '',
          list:[],
          icon:'',
          ownerShip:false,
        },
        rules: {
        //   name: [
        //     { required: true, message: '请输入app名称', trigger: 'blur' },
        //     { min: 1, max: 20, message: '不能为空', trigger: 'blur' }
        //   ],
        //   abc:[
        //     { required: true, message: '请输入app名称', trigger: 'change' },
        //     // { min: 1, max: 20, message: '不能为空', trigger: 'blur' }
        //   ],
        // abc: [{
        //     required: true,
        //     message: '请选择ui!',
        //     trigger: 'change'
        // }],
        // pLanguage: [{
        //     // type: 'number',
        //     required: true,
        //     message: '请选择场景!',
        //     trigger: 'change'
        // }]
      
        },
        views:[],
        uis:[],
        sDomian:[],
        sDomianName:'',
        imageUpload: serverApp.imageUrl + "/file/upload/image",
        imageBaseUrl: serverApp.imageUrl + "/picture",
        ImageUrl: "",
        urlParams:this.$route.query.edit,
        userId:""
    };
  },
  props: {},
  components: {},
  computed: {},
  watch:{

  },
  created() {},
  mounted() {

      this.userId = userMgr.getUser()
    //   console.log(this.userId.id)
    //   //请求时空域
      let params = {
          uid:this.userId.id
      }
      serverApp.getDomain(params).then(res=>{
          if(res.status == 200){
              console.log(res.data,"sdomin")
              this.sDomian = res.data.list
          }
      });

      let p1 = pluginServer.query({type:1});
      let p2 = pluginServer.query({type:2});

      Promise.all([p1,p2]).then(list=>{
          console.log(list)
          this.uis = list[0].list;
          console.log(this.uis)
          this.views = list[1].list;
      })

      //判断地址栏id
      let appIds = this.$route.query.edit
      //编辑状态
      if(appIds){
          //查询 
          let uid = this.userId.id
          serverApp.getApps({uid:uid}).then(res=>{
          // console.log(res);
          if(res.status==200){
              let arr = res.data
              arr.forEach(e=>{
                  if(e.id == appIds){
                      this.formLabelAlign.name = e.name
                      this.formLabelAlign.ui = e.layout
                      this.formLabelAlign.view = e.mapView
                      this.formLabelAlign.domian = e.sdomain?e.sdomain.id:''
                      this.formLabelAlign.ownerShip = e.ownerShip == "PRIVATE" ? false : true
                      this.ImageUrl = e.icon
                      this.formLabelAlign.icon = e.icon
                  }
              })
          }
          })
      }

  },
  methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              let flag = this.formLabelAlign.name && this.formLabelAlign.ui && this.formLabelAlign.view
            if(!flag){
                return this.$message.error('请填写完整信息');
            }
            let sDomianId = this.formLabelAlign.domian
            this.sDomian.forEach(e=>{
                if(e.id == sDomianId){
                    this.sDomianName = e.name
                }
            })

            let options = {
                uid:this.userId.id,
                name:this.formLabelAlign.name,
                title:"",
                layout:this.formLabelAlign.ui,
                mapView:this.formLabelAlign.view,
                plugins:[],
                sdomain:{id:this.formLabelAlign.domian,name:this.sDomianName},
                icon:this.ImageUrl,
                ownerShip: this.formLabelAlign.ownerShip ? "PUBLIC" : "PRIVATE"
            }
            if(this.$route.query.edit){
                options.id = this.$route.query.edit
            }
            serverApp.saveApp(options).then(res=>{
                console.log(res);
                // window.open('#/detail?new='+res.data.id);

                // this.$router.push({
                //     path:'/detail',
                //     query:{
                //         new:res.data.id
                //     }
                // });    
                if(res.status == 200){
                    this.$notify({
                        title: '成功',
                        message: '成功',
                        type: 'success'
                    });
                     this.$router.push({
                        path:'/home',
                    }); 
                }else if(res.status == 400){
                    this.$notify({
                        title: '警告',
                        message: res.data || res.message,
                        type: 'warning'
                    });
                }
            });
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.formLabelAlign={
          name: '',
          ui: '',
          view: '',
          des: '',
          list:[],
          ownerShip:false
        }
      },
        //图片上传成功回调方法
    handleAvatarSuccess(res, file) {
        if(res.status == 200) {
            console.log(res.data.fileUrl);
            this.formLabelAlign.icon = res.data.fileUrl;
            this.ImageUrl = this.imageBaseUrl + this.formLabelAlign.icon;
        }
    },
    //图片上传前验证方法
    beforeAvatarUpload(file) {
        var isJPG = (file.type==="image/jpg" || file.type ==="image/jpeg" || file.type ==="image/png");
        var isLt2M = file.size / 1024 / 1024 < 2;
        if(!isJPG) {
            // this.$message.error("请上传 JPG 或 JPEG 或 PNG 格式!");
        this.$notify({
            type:'error',
            title:'错误',
            message:"请上传 JPG 或 JPEG 或 PNG 格式!"
          })
        }
        if(!isLt2M) {
            // this.$message.error("上传图片大小不能超过 2MB!");
        this.$notify({
            type:'error',
            title:'错误',
            message:"上传图片大小不能超过 2MB!"
          })
        }
        return isJPG && isLt2M;
    },
  },


};
</script>
<style lang='scss' scoped>
.cle:after {
  content: " ";
  display: block;
  width: 100%;
  height: 0px;
  overflow: hidden;
  clear: both;
}
.create{
    width: 1200px;
    margin: 0 auto;
    height: 1000px;
    background-color: #f8f8f8;
   .leader{
    // margin-top: 1.55rem;
    padding: 1.023rem;
    b{
      float: left;
      font-size: 1.7689rem;
      color: #4c4c4c;
      font-weight: 600;
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
  .create-tabs{
      width:80%;
      margin:50px auto;
      position: relative;
      .selected{
          display: block;
      }
      .ownerShip{
          padding: 23px 0 0 10px;
      }
  }
  .article-avatar-up {
      width: 100px;
      height: 100px;
      overflow: hidden;
  .article-avatar {
    width: 100px;
    height: 100px;
    // box-sizing: border-box;
  }
  .article-avatar-icon {
    width: 100px;
    height: 100px;
    line-height: 100px;
    border: 1px dashed #d9d9d9;
  }
}
.el-form-item__label{
    color: #f56c6c;
    margin-right: 4px;
    position: absolute;
 }
 .icon1{
    top: 122px;
    left: 47px;
 }
 .icon2{
    top: 185px;
    left: 34px;
 }
 .icon3{
     top: 247px;
     left: 19px;
 }
}

</style>