<template>
    <div class="plugin">
        <div class="leader cle">
        <b>{{plug}}</b>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
        plug:"",
    };
  },
  props: {},
  components: {},
  computed: {},
  watch:{},
  created() {},
  mounted() {
      this.plug = this.$route.query.plug
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.cle:after {
    content: " ";
    display: block;
    width: 100%;
    clear: both;
  }
.plugin{
  width: 1200px;
  margin: auto;
  background-color: #f8f8f8;
  .leader{
    padding: 1.023rem;
    margin-bottom: 20px;
    &>b{
      float: left;
      font-size: 1.7689rem;
      color: #4c4c4c;
      font-weight: 600;
    }
    // .tab-but{
    //   float:right;
    // }
    border-bottom: 1px solid #ccc;
  }
}
</style>