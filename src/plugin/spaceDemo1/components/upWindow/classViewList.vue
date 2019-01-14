<template>
  <div>
    <!--类试图列表 -->
    <div class="treeUi view-list">
      <el-tree
        :data="diagramList"
        show-checkbox
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        :default-checked-keys="defaultCheckList"
        @check-change="checkchange"
      ></el-tree>
    </div>
  </div>
</template>
<script>
import GlobalData from "../../jscript/GlobalData";
export default {
  data() {
    return {
      defaultProps: {
        label: "name",
        children: "otypes",
        isLeaf: true
      },
      diagramList: [],
      GlobalData,
      defaultCheckList: []
    };
  },
  props: {},
  watch: {
    // "GlobalData.otypeList"(){
    //   console.log(3333333333)
    // this.diagramList = this.GlobalData.otypeList
    // }
  },
  components: {},
  computed: {
    // diagramList(){
    //   return this.GlobalData.otypeList
    // }
  },
  created() {},
  mounted() {
    this.diagramList = GlobalData.otypeList;
    this.defaultCheckList = this.diagramList.map(el => el.id);
  },
  methods: {
    checkchange(a, b, c) {
      //传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
      // console.log(a);
      // console.log(b);
      // console.log(c);
      let have = -1;
      if (b) {
      } else {
      }
      GlobalData.disappearList.forEach((n, i) => {
        if (n == a.id) {
          have = i;
        }
      });
      if (have >= 0) {
        if (b) {
          GlobalData.disappearList.splice(have, 1);
        } else {
        }
      } else {
        if (b) {
        } else {
          GlobalData.disappearList.push(a.id);
        }
      }

    }
  }
};
</script>
<style scoped>
</style>