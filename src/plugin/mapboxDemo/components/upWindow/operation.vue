<template>
  <div class="upWindow upWindow-right" v-if="loading">
    <div>X轴：
      <el-slider v-model="valueX" show-input @change="changeNum"></el-slider>
    </div>
    <div>Y轴：
      <el-slider v-model="valueY" show-input @change="changeNum"></el-slider>
    </div>
    <div>Z轴：
      <el-slider v-model="valueZ" show-input @change="changeNum"></el-slider>
    </div>
    <div class="reset-btn" @click="reset">重置</div>
  </div>
  <div v-else class="loading">
    <i class="el-icon-loading"></i>
  </div>
</template>
<script>
import { EventBus, MapEvent } from "../../jscript/event/Event.js";

export default {
  data() {
    return {
      valueX: 50,
      valueY: 50,
      valueZ: 50
    };
  },
  props: {
    loading: {
      type: [Boolean]
    }
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    changeNum() {
      let obj = {
        valueX: this.valueX,
        valueY: this.valueY,
        valueZ: this.valueZ
      };
      EventBus.fire(MapEvent.sliderChange, obj);
    },
    reset() {
      this.valueX = 50;
      this.valueY = 50;
      this.valueZ = 50;
      this.changeNum()
    }
  }
};
</script>
<style lang='scss' scoped>
.reset-btn {
  border: 1px solid #fff;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  background-color: transparent;
  transition: all linear 0.1s;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    font-size: 16px;
    background-color: #409eff;
    border: 1px solid #409eff;
  }
}
</style>