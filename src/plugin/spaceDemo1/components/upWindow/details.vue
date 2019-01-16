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
        <el-collapse-item title=" 组成关系" name="5">
          <c-constitute></c-constitute>
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
import CConstitute from "./part/constitute";

// import { psdeApi } from "../psde/config";
// import "../assets/public.scss"
export default {
  data() {
    return {
      activeNames: ["1", "2", "3", "4", "5"],
      GlobalData
    };
  },
  props: {},
  components: {
    CAttribute,
    CForm,
    CBehavior,
    CRelation,
    CConstitute
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleChange(val) {
      //console.log(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.detail-root {
  width: 280px;
  //   padding:0 10px;
  bottom: 0;
  right: 0;
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>