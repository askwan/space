<template>
  <div class="detail upWindows">
    <div class="detail-root">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title=" 属性信息" name="1">
          <c-attribute :attributes="attributes" :id="objId"></c-attribute>
        </el-collapse-item>
        <el-collapse-item title=" 形态面板" name="2">
          <c-form :forms="forms"></c-form>
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
import CAttribute from "../part/attribute";
import CForm from "../part/form";
import CBehavior from "../part/behavior";
import CRelation from "../part/relation";

import { psdeApi } from "../psde/config";
import "../assets/public.scss";
import { vm } from "../bus";
export default {
  data() {
    return {
      activeNames: ["1"],
      attributes: [],
      forms: [],
      objId: 0
    };
  },
  props: {},
  components: {
    CAttribute,
    CForm,
    CBehavior,
    CRelation
  },
  computed: {},
  created() {},
  mounted() {
    this.listenEvent();
  },
  watch: {},
  methods: {
    handleChange(val) {
      //console.log(val);
    },
    listenEvent() {
      vm.$on("detail.getSobject", obj => {
        this.attributes = obj.attributes;
        this.forms = obj.forms;
        this.objId = obj.id;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
// .el-collapse-item__content{
//     padding-bottom: 0px;
// }
.detail {
}
.detail-root {
  width: 300px;
  padding: 0 10px;
  position: absolute;
  top: 34px;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>