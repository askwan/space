<template>
    <div>
        <cards  :title="title" :num="num" :state="state">
            <cardSlot :content="list"></cardSlot>
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

        list:"list"
    };
  },
  props: {},
  components: {
      cards:()=>import('../cards.vue'),
      cardSlot:()=>import('../cardSlot.vue')},
  computed: {},
  watch:{},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>