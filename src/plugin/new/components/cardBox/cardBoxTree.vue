<template>
    <cards :title="title" :num="num">
      <tree :loading="loading"></tree>
    </cards>
</template>
<script>
export default {
  data() {
    return {
      title: "对象树",
      num: 3
    };
  },
  props: ["loading"],
  components: {
    cards: () => import("../cards.vue"),
    tree: () => import("../upWindow/tree.vue")
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