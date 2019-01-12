<template>
  <div class="relation-content updetail" v-if="relationList && relationList.length>0">
		<!-- <div class="relation-head">
			<div class="right-objtype-save">
				<el-switch :value="showRelation" active-color="#13ce66" inactive-color="#ff4949" @change="relationShowFn"></el-switch>
			</div>
		</div> -->
		<div class="object-detail">
			<el-collapse v-model="activeNames" @change="handleChange(activeNames)" accordion>
				<el-collapse-item :name="index+1" v-for="(otItem,index) in filterAction(relationList)" :key="index+1">
					<template slot="title">
						<div class="right-from-to" v-if="objectDetail.id">
							<span :title="objectDetail.name">{{objectDetail.name}}</span>
							<div>
								<div class="right-relation-pull">
									<div>
										<span v-if="otItem.id && otItem.edge && otItem.edge.relation && otItem.edge.relation.id">
											{{otItem.edge.relation.name}}
										</span>
										<span v-else>default</span>
									</div>
									<span></span>
									<!-- <i class="iconfont icon-zuojiantou"></i> -->
                  <i class="el-icon-caret-right"></i>
								</div>
							</div>
							<span :title="otItem.label">{{otItem.label}}</span>
						</div>
						<div class="right-from-to" v-else>
							<span>default</span>
						</div>
			
					</template>
					<el-form v-if="otItem.id && otItem.edge && otItem.edge.relation && otItem.edge.relation.fields && otItem.edge.relation.fields.fields.length>0">
						<el-form-item v-for="(it,ix) in otItem.edge.relation.fields.fields" :key="ix" :label="getKeysName(it.name, otItem) + ' :'" :title="getKeysName(it.name, otItem)" :label-width="classNameWidth">
							<el-input v-model="it.nameValue" placeholder="无" :disabled="true"></el-input>
						</el-form-item>
			
					</el-form>
				</el-collapse-item>
			</el-collapse>
		</div>
	</div>
</template>
<script>
// import getVal from "../psde/getData.js";

import GlobalData from "../../jscript/GlobalData.js";
export default {
  data() {
    return {
      activeNames: 0, //当前点击的第几个列表
      curCollapse: null, //记录当前点击的形态
      classNameWidth: "75px",

      //关系对象
      relationList: [], //object的relation列表

      objectDetail:{},

      getNum:GlobalData,
    };
  },
  props: {},
  components: {},
  computed: {},
  watch:{
    // objectDetail(val) {
    //   this.getData();
    // },
  },
  created() {},
  mounted() {
    this.getData()
  },
  methods: {
    getKeysName(keys, otItem) {
      var name = keys;
      otItem.edge.relation.fields.fields.forEach((item, index) => {
        if (item.name == keys) {
          name = item.caption;
        }
      });
      return name;
    },
    filterAction(data) {
      return data;
    },
     getData() {
      // let ids = localStorage.getItem("ids")
      // let par = {
      //     ids: ids,
      //     loadAttr: true, // 是否加载属性信息
      //     loadForm: true, // 是否加载形态数据
      //     loadNetwork: true, // 是否加载关系
      //     loadModel: true, // 是否加载模型
      //     loadObjType:true,
      //     loadAction: true // 是否载入操作集合
      // };
      // getVal.ajaxData(par).then(res=>{
          // this.objectDetail = res[0];
          // var val = this.objectDetail;
          // if (val.network && val.network.nodes && val.network.nodes.length > 0) {
          //   this.addRelationList(val.network.nodes);
          // } else {
          //   this.relationList = [];
          // }
      //   })

       this.objectDetail = this.getNum.selectPick;
          var val = this.objectDetail;
          if (val.network && val.network.nodes && val.network.nodes.length > 0) {
            this.addRelationList(val.network.nodes);
          } else {
            this.relationList = [];
          }

    },

    //关系对象
    addRelationList(data) {
      this.relationList = [];
      data.forEach((item, index) => {
        var str = JSON.stringify(item.edge.relation);
        var strObj = JSON.parse(str);
        var obj = {
          id: item.id,
          label: item.label,
          relatedObjectId: item.relatedObjectId,
          properties: item.properties,
          edge: {
            relation: strObj
          }
        };
        this.relationList.push(obj);
        console.log(this.relationList,"push")
      });
      this.relationList.forEach((otItem, index) => {
        if (
          otItem.id &&
          otItem.edge &&
          otItem.edge.relation &&
          otItem.edge.relation.fields &&
          otItem.edge.relation.fields.fields.length > 0
        ) {
          if (JSON.stringify(otItem.properties) == "{}" || !otItem.properties) {
            otItem.properties = {};
            otItem.edge.relation.fields.fields.forEach(item => {
              var name = item.name.toString();
              otItem.properties[name] = "";
            });
          } else {
            otItem.edge.relation.fields.fields.forEach(item => {
              var name = item.name.toString();
              if (item.nameValue) {
                otItem.properties[name] = item.nameValue;
              } else {
                if (otItem.properties[name]) {
                  otItem.properties[name] = otItem.properties[name];
                  item.nameValue = otItem.properties[name];
                } else {
                  otItem.properties[name] = "";
                  item.nameValue = "";
                }
              }
            });
          }
        }
      });
    },

    handleChange(activeNames) {
      this.curCollapse = activeNames;
    },
    deleteRelation(otItem, index) {}
  }
};
</script>
<style lang="scss" scoped>

.relation-content {
  /*position: absolute;
		top: 0px;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;*/
  margin-bottom: 20px;
}

.relation-head {
  height: 30px;
  width: 100%;

  .right-objtype-save {
    float: right;
    width: 50px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    color: #4588e6;
    cursor: pointer;
  }
}

.object-detail {
  /*position: relative;
		top: 20px;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;*/
  padding-bottom: 5px;
  .right-objtype-i {
    float: right;
    margin-right: 20px;
    color: #ffffff;
  }
  .right-from-to {
    display: inline-block;
    vertical-align: top;
    > span {
      max-width: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      user-select: none;
      color: #ffffff;
    }
    > span:hover {
      color: #409eff;
    }
    div {
      display: inline-block;
      vertical-align: top;
      margin-left: 3px;
      .right-relation-pull {
        position: relative;
        float: left;
        div {
          display: inline-block;
          position: absolute;
          left: 50%;
          top: -6px;
          transform: translateX(-55%);
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            color: #ffffff;
          }
        }
        > span {
          display: inline-block;
          width: 86px;
          height: 1px;
          margin-right: 7px;
          background: #999999;
          margin-top:26px;
        }
        > i {
          font-size: 8px;
          color: #ffffff;
          position: absolute;
          top: 22px;
          right: 0px;
          width: 15px;
          height: 15px;
        }
      }
    }
  }
}
</style>