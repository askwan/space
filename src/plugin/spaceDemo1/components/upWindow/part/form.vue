<template>
    <div class="form-tab updetail" id="bgc">
        <el-collapse accordion>
            <el-collapse-item v-for="(form,i) in formList" :key="i">
              <template slot="title">
                {{transForm(form.type)}}
              </template>
              <!-- <el-form label-width="60px" class="form-e">
                <el-form-item label="名称">
                  <el-input v-model="formLabelAlign"></el-input>
                </el-form-item>
              </el-form> -->
              <ul class="form-list">
                <li class="form-li cle" v-show="form.type!=50">
                  <div class="form-name">样式内容:</div>
                  <div class="form-value">
                    <!-- <div class="form-style" v-for="(n,p) in styleForm(form.style)" :key="p">{{p}} : {{n?n:0}}</div> -->
                    <div class="form-style">{{form.style | styleForm()}}</div>
                  </div>
                </li>
                <li class="form-li cle" v-show="form.type==50">
                  <div class="form-name" >模型内容:</div>
                  <div class="form-value">{{form.formref}}</div>
                </li>
                <li class="form-li cle">
                  <div class="form-name">维度:</div>
                  <div class="form-value">{{form.dim}}</div>
                </li>
                <!-- <li class="form-li">
                  <div class="form-name">位置:</div>
                  <div class="form-value">{{form.geom.type}}</div>
                </li> -->
                <li class="form-li cle">
                  <div class="form-name">最小可见:</div>
                  <div class="form-value">{{form.minGrain}}</div>
                </li>
                <li class="form-li cle">
                  <div class="form-name">最大可见:</div>
                  <div class="form-value">{{form.maxGrain}}</div>
                </li>
                <li class="form-li cle" v-show="form.type==50">
                  <div class="form-name">矩阵:</div>
                  <div class="form-value">{{form.style}}</div>
                </li>
                <!--<li class="form-li">
                  <div class="form-name">显示:</div>
                  <div class="form-value">
                    <el-switch
                      style="display: block"
                      v-model="form.checked"
                      active-color="#13ce66" 
                      inactive-color="#ff4949"
                      >
                    </el-switch>
                  </div>
                </li>-->
              </ul>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import GlobalData from "../../../jscript/GlobalData.js";
export default {
  data() {
    return {
        list:[],
        array:[],
        style:[],
        // activeNames: ['1'],
        getNum:GlobalData,
    };
  },
  props: {},
  components: {},
  filters:{
    styleForm(val){
      let emptyArr = []
      let arr = JSON.parse(val) || []
      // console.log(obj,7897890)
      // console.log(GlobalData.styleList,222222)
      let styleArr = GlobalData.styleList || []
      styleArr.forEach(e=>{
        arr.forEach(f=>{
        if(e.id == f){
          // console.log(e)
          emptyArr.push(JSON.parse(e.data).paint)
        }
        })
      })
      // console.log(emptyArr,789789)
      return emptyArr
    }
  },
  computed: {
    formList() {
      let arr = this.list
      if (!arr) return [];
      arr = arr.map(el => {
        // el.checked=true;
        this.$set(el, "checked", true);
        return el;
      });
      // console.log(arr)
      return arr;
    },
    dict() {
        
    }
  },
  watch:{
    "getNum.currentSelectObject"(){
      this.getData()
    },
    "getNum.formDict"(){
      this.array = this.getNum.formDict
    }
  },
  created() {},
  mounted() {
      this.getData()
  },
  methods: {
    getData() {
      this.array = this.getNum.formDict
      this.list = this.getNum.currentSelectObject.forms
      // console.log(this.list)
    },

    transForm(type){
        let obj = this.array.find(el => el.value == type)
        if (obj) {
            return obj.name;
        } else {
            return "Null";
        }
    },

    // styleForm(val) {
    //   if (val) {
    //     let obj = {
    //         orderType: 'ID',
    //         descOrAsc: true
    //     }
    //     try {
    //       let arr = JSON.parse(val);
    //       let re;
    //       arr.forEach((q, p) => {
    //         if (q instanceof Object) {
    //           re = q;
    //         } else if (q instanceof Array) {
    //         } else {
    //           this.style.forEach((n, i) => {
    //             if (n.id == q) {
    //               re = JSON.parse(n.data).paint;
    //             }
    //           });
    //         }
    //       });
    //       return re;
    //     } catch (err) {}
    //   }
    // }
  }
};
</script>
<style lang="scss" scoped>

.cle:after {
    content: " ";
    display: block;
    width: 100%;
    height: 0px;
    overflow: hidden;
    clear: both;
  }

.form-list{
  padding: 0 10px;
}
.form-li {
  color: #fff;
    // height: 35px;
  border-bottom: 1px solid #666;
  padding: 0 5px 0 20px;
  line-height: 36px;
}
.form-name,.form-value{
  float: left;
}
.form-name{
  width:64px;
  text-align: right;
  margin-right: 10px;
}

</style>