<template>
    <cards :title="title" class="treeCard height-100">
      <tree :loading="loading"></tree>
    </cards>
</template>
<script>
export default {
  data() {
    return {
      title: "对象树",
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