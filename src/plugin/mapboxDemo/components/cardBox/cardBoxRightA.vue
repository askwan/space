<template>
    <div class="detailCard height-100">
        <cards  :title="title" class="height-100">
            <!-- <cardSlot :content="list"></cardSlot> -->
            <!-- <cardSlot></cardSlot> -->
            <detail></detail>
        </cards>
    </div>
</template>
<script>
import GlobalData from "../../jscript/GlobalData.js";
// console.log(GlobalData,432432)
export default {
  data() {
    return {
        title:"详情",
        // state:"开启",

        objChange:{}
    };
  },
  props: {},
  components: {
      cards:()=>import('../cards.vue'),
      detail:()=>import('../upWindow/details.vue')
  },
  computed: {},
  watch:{
        objChange(){
            // console.log("change")
        }

  },
  created() {},
  mounted() {
      this.objChange = GlobalData.selectPick
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>