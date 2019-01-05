<template>
  <cards :title="title" :num="num">
    <c-operation :loading="loading"></c-operation>
  </cards>
</template>
<script>
export default {
  data() {
    return {
      title: "操作面板",
      num: 3
      // state:"开启",
    };
  },
  props: {
    loading: {
      type: [Boolean]
    }
  },
  components: {
    cards: () => import("../cards.vue"),
    COperation: () => import("../upWindow/operation.vue")
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>