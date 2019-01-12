<template>
    <div class="leftA height-100">
        <cards :title="title" class="height-100">
            <!-- <cardSlot :content="home"></cardSlot> -->
            <history></history>
        </cards>
        
    </div>
</template>
<script>
export default {
  data() {
    return {
        title:"历史面板",
        state:"开启",

        home:"home",
        center:"center",
        bottom:"bottom"
    };
  },
  props: {},
  components: {
      cards:()=>import('../cards.vue'),
      //   cardSlot:()=>import('../cardSlot.vue')
      history:()=>import('../upWindow/versionHistory.vue'),
  },
  computed: {},
  watch:{},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>