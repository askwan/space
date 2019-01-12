<template>
     <div>  <!--类试图列表 -->
        <div class="tree view-list">
          <el-tree
            :data="diagramList"
            show-checkbox
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            :default-checked-keys="defaultCheckList"
            @check="checkchange">
          </el-tree>
        </div>
    </div>
</template>
<script>
import { psdeApi } from "../psde/config";
import globalData from "../script/GlobalData.js";
import "../assets/public.scss"
export default {
  data() {
    return {
      defaultProps: {
        label: "name",
        children: "otypes",
        isLeaf: true
      },
      diagramList:[],
    };
  },
  props: {},
  components: {},
  computed: {
    defaultCheckList() {
      return this.diagramList.map(el => el.id);
    }
  },
  created() {},
  mounted() {
      this.getData()
  },
  methods: {
    ajaxData(obj) {
      var getToken =
        "eyJ1aWQiOjE5MDQ3LCJ0eXAiOiJKV1QiLCJjbGllbnRJZCI6IjNjODY0ZTI5OWMzZjQzODRhZjYyZjRhNWQ3NDg1YWNjIiwiYWxnIjoiSFMyNTYifQ.eyJuYmYiOjE1NDMyNzkxNzIsImlzcyI6Imh0dHA6Ly93d3cuYmx1ZXRoaW5rLmNuIiwidHlwIjoiSldUIiwiZXhwIjoxNTQzMjg5OTcyLCJhbGciOiJIUzI1NiIsImlhdCI6MTU0MzI3OTE3Mn0.eCSvIXdRZwMg-v54x2QVDOjGyi_mkiNlpVCsEIUsco8";
      return new Promise((resolve, reject) => {
        psdeApi
          .get(`/diagram/query?token=${getToken}`, {
            params: obj
          })
          .then(res => {
            if (res.data.status === 200) {
              resolve(res.data.data.list)
            } else {
              reject();
            }
          });
      });
    },
    getData(){
        let obj = {
            loadField: true,
            loadModel: true,
            loadForm: true,
            loadParentField: true,
            loadParents: true,
            loadConnector: true
        }
        this.ajaxData(obj).then(res=>{
            this.diagramList = res
        })
    },
    checkchange(a,b,c) {
      //传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
      console.log(a);
      // console.log(b);
      console.log(globalData.showTreeArr,567)

      let otypes = [];
      if (a.otypes) {
        otypes = a.otypes.map(el => el.id);
      } else {
        otypes.push(a.id);
      }
      otypes.forEach((q,p)=>{
        let or=false
         globalData.showTreeArr.forEach((n,i,arr) => {
        if(n==q){ 
            or=true
            arr.splice(i,1)
          }
      });
      if(!or){
          globalData.showTreeArr.push(q)
      }
      })
     
    //   console.log(globalData.showTreeArr)
    }
  }
};
</script>
<style scoped>
</style>