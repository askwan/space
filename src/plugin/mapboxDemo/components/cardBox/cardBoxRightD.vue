<template>
    <div class="cardBoxRightC">
      
        <cards :title="title">
            <div id="main-top" style="width: 316px;height:240px;backgroundColor:#fff" title="点击查看大图" @click="passValue('discount_chart')"></div>
        </cards>
        <cards :title="title">
          <!-- 123123 -->
           <div id="main-center" style="width:316px;height:240px;backgroundColor: #fff" title="点击查看大图" @click="passValue('dot_plot')"></div>
        </cards>

    </div>
</template>
<script>
import chart from '../../jscript/echartData/data.js'
import { EventBus, MapEvent } from "../../jscript/event/Event.js";
export default {
  data() {
    return {
      title: "图表",
      
    };
  },
  props: {},
  components: {
    cards: () => import("../cards.vue"),
    COperation: () => import("../upWindow/operation.vue")
  },
  computed: {},
  watch:{},
  created() {},
  mounted() {

      requirejs(
          [
            "/js/echarts.js"
          ],
          (echarts) => {
            chart.discount_chart("main-top",echarts)
            chart.dot_plot("main-center",echarts)
          }
        );
  },
  methods: {
    passValue(fun){
      let objPass = {
        pic:fun,
        data:chart
      }
      EventBus.fire(MapEvent.echartPic,objPass)
    }
  }
};
</script>
<style lang='scss' scoped>

</style>