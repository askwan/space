<template>
  <div class="cards">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
        <el-button style="float: right; padding: 3px 0" type="text">{{num}}</el-button>
      </div>
      <!-- <div>
                <div class="state cle"><span class="float-left">状态</span><span class="float-right">{{state}}</span></div>
      </div>-->
      <div class="content">
        <slot></slot>
      </div>
    </el-card>
  </div>
</template>
<script>
import "../assets/public.scss";
export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: [String]
    },
    num: {
      type: [Number]
    },
    state: {
      type: [String]
    }
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.cards {
  height: 100%;  
  .box-card {
    height: 100%;  
    // background-color: rgba(47, 53, 60, 0.8);
    background-color: transparent;
    color: #eee;
    .content {
      height: 100%;  
      width: 100%;
      color: #eee;
    }
  }
}
.float-left {
  float: left;
}
.float-right {
  float: right;
}

.state {
  width: 100%;
  padding: 4px;
  font-size: 10px;
  background-color: rgba(77, 79, 82, 0.8);
}
</style>