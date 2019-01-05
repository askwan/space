<template>
    <div>
      
        <cards :title="title" :num="num">
            <div id="main-top" style="width: 316px;height:240px;backgroundColor: #fff"></div>

        </cards>
        <cards :title="title" :num="num">
           <div id="main-center" style="width:316px;height:240px;backgroundColor: #fff"></div>
        </cards>
        <!-- <cards :title="title" :num="num">
            <div id="main" style="width: 200px;height:200px;"></div>
        </cards> -->



    </div>
</template>
<script>
import chart from '../../jscript/echartData/data.js'
export default {
  data() {
    return {
      title: "图表",
      num: 3
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
            console.log(123123,echarts)
            chart.discount_chart("main-top",echarts)
            chart.dot_plot("main-center",echarts)
          }
        );
    //  chart.discount_chart("main")
  },
  methods: {

  }
};
</script>
<style lang='scss' scoped>
#main-top-tip{
  position: absolute;
  top: 20px;
  right: 30px;
}
</style>