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
        @check="checkchange"
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
      GlobalData
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
    defaultCheckList() {
      return this.diagramList.map(el => el.id);
    }
    // diagramList(){
    //   return this.GlobalData.otypeList
    // }
  },
  created() {},
  mounted() {
    this.diagramList = GlobalData.disappearList;
  },
  methods: {
    checkchange(a, b, c) {
      //传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
      console.log(a);
      console.log(b);
      GlobalData.disappearList = b.checkedKeys;
  
      // let otypes = [];
      // GlobalData.otypeList.forEach((n, i) => {
      //   n.otypes.forEach((e, r) => {
      //     let show = false;
      //     b.checkedKeys.forEach((q, w) => {
      //       if (e.id == q) {
      //         show = true;
      //       }
      //     });
      //     if (!show) {
      //       otypes.push(n.id);
      //     }
      //   });
      // });

      // GlobalData.disappearList = otypes;
      // console.log(otypes);

      // let otypes = [];
      // if (a.otypes) {
      //   otypes = a.otypes.map(el => el.id);
      // } else {
      //   otypes.push(a.id);
      // }
      // otypes.push(a.id);
      // otypes.forEach((q, p) => {
      //   let or = false;
      //   let num = 0;
      //   GlobalData.disappearList.forEach((n, i, arr) => {
      //     if (n == q) {
      //       or = true;
      //       num = i;
      //     }
      //   });
      //   if (or) {
      //     GlobalData.disappearList.splice(num, 1);
      //   } else {
      //     GlobalData.disappearList.push(q);
      //   }
      // });
      // console.log(GlobalData.otypeList);
      // console.log(GlobalData.disappearList);
    }
  }
};
</script>
<style scoped>
</style>