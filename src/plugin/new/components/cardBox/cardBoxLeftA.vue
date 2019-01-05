<template>
    <div class="leftA">
        <cards :title="title" :num="num" :state="state">
            <cardSlot :content="home"></cardSlot>
            <!-- <cardSlot></cardSlot> -->
        </cards>
        <cards :title="title" :num="num" :state="state">
            <cardSlot :content="center"></cardSlot>
            <!-- <cardSlot></cardSlot> -->
        </cards>
        <cards :title="title" :num="num" :state="state">
            <cardSlot :content="bottom"></cardSlot>
            <!-- <cardSlot></cardSlot> -->
        </cards>
    </div>
</template>
<script>
export default {
  data() {
    return {
        title:"中心机房",
        num:3,
        state:"开启",

        home:"home",
        center:"center",
        bottom:"bottom"
    };
  },
  props: {},
  components: {
      cards:()=>import('../cards.vue'),
      cardSlot:()=>import('../cardSlot.vue')
  },
  computed: {},
  watch:{},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.leftA{
    height: 90%;
}
</style>