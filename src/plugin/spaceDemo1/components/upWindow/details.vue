<template>
    <div class="detailUi">
            <div class="detail-root">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item title=" 属性信息" name="1">
                        <c-attribute></c-attribute>
                    </el-collapse-item>
                    <el-collapse-item title=" 形态面板" name="2">
                        <c-form></c-form>
                    </el-collapse-item>
                    <el-collapse-item title=" 行为面板" name="3">
                        <c-behavior></c-behavior>
                    </el-collapse-item>
                    <el-collapse-item title=" 关系面板" name="4">
                        <c-relation></c-relation>
                    </el-collapse-item>
                </el-collapse>
            </div>
    </div>
</template>
<script>
import GlobalData from "../../jscript/GlobalData";
import CAttribute from "./part/attribute";
import CForm from "./part/form";
import CBehavior from "./part/behavior";
import CRelation from "./part/relation";

// import { psdeApi } from "../psde/config";
// import "../assets/public.scss"
export default {
  data() {
    return {
        activeNames: ['1','2','3','4'],
        GlobalData,
    };
  },
  props: {},
  components: {
    CAttribute,
    CForm,
    CBehavior,
    CRelation,

   
  },
  computed: {},
  created() {
      
  },
  mounted() {
  },
  watch:{

  },
  methods: {
    handleChange(val) {
      //console.log(val);
    },
  }
};
</script>
<style lang="scss" scoped>
// .el-collapse-item__content{
//     padding-bottom: 0px;
// }
.detail{
}
.detail-root {
  width:280px;
//   padding:0 10px;
  bottom: 0;
  right: 0;
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>