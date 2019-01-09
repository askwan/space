<template>
    <div>
      <div v-if="content == 'home'">
        <div v-for="o in 4" :key="o" class="text item">
          {{'列表内容 ' + o }}
        </div>
      </div>
       <div v-if="content == 'center'">
        <div v-for="o in 4" :key="o" class="text item">
          {{'列表内容222222 ' + o }}
        </div>
      </div>
      <div v-if="content == 'bottom'">
        <div v-for="o in 7" :key="o" class="text item">
          {{'橘子香蕉 ' + o }}
        </div>
      </div>

    </div>
</template>
<script>
export default {
  data() {
    return {

    };
  },
  props: {
    content:{
        type:[String,Boolean,Number]
      },
  },
  components: {},
  computed: {},
  watch:{},
  created() {},
  mounted() {
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>