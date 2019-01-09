<template>
  <div id='list' style="{height:listHight}"  class="pointer" @mouseleave="closeList">
    <div :class="{'list-title':true,'active':isShow,'flex':true}" :style="{'width':listWidth,'height':listHight}" @mouseenter="hoverList" @click="clickList">
      <slot>
        <img @click="space.linkUserCenter()" class="userphoto img-style" :src="src" v-if="src && title!='网站导航'" @error="errorImg"/>
        <img @click="space.linkUserCenter()" class="userphoto img-style" src="../../../static/icon/default-user-avatar.png"  v-if="!src && title!='网站导航'"/>
        <span class="user-name" >{{title}}</span></slot>
      <div class="icon" :class="{'rotate':isShow,'orgin':!isShow}" v-if="title"><i class="el-icon-arrow-down"></i></div>
    </div>
      <ul class="list-content hidden" >
        <transition name="slider">
          <div v-show="isShow" class="shawoe">
            <li v-for="(list,i) in lists" class="pointer" :class="{actived:i===actived}" :key="list.name" @click="selectList(list,i)" :style="{'width':childrenWidth}">{{list.name}}</li>
          </div>
        </transition>
      </ul>
  </div>
</template>

<script>
  import {space} from "@/server/util";
  import {userCenter} from "@/server/newUrl.js";
  import {ucOnegis} from "@/server/newUrl.js";
  export default {
    data () {
      return {
        isShow:false,
        actived:null,
        ucOnegi:"",
        space
      }
    },
    props:{
      lists:{
        type:Array,
        default:()=>{return []}
      },
      title:{
        type:[String,Boolean,Number]
      },
      width:{
        type:[Number,String],
        default:120
      },
      height:{
        type:[Number,String],
        default:40
      },
      methods:{
        type:String,
        default:"hover"
      },
      src:{
        type:String,
      }
    },
    computed:{
      listWidth(){
        let width;
        if(this.width*1){
          width = this.width*1+"px";
        }else{
          width = this.width;
        };
        return width
      },
      childrenWidth(){
        let width;
        if(this.width*1){
          width = (this.width-2)*1+"px";
        }else{
          let num = this.width.split("px")[0]*1;
          width = (this.width-2)+"px";
          // width = this.width;
        };
        return width
      },
      listHight(){
        return this.height+'px'
      }
    },
    mounted(){
    },
    watch:{
      isShow(){
        // console.log(222)
      }
    },
    methods:{
      errorImg() {
        this.src = "../../../../static/img/error-user.png";
      },
      showList(){
        if(this.methods=="click"){
          this.isShow = true;
        }else if(this.methods=="hover"){
          this.isShow = true;
        }
      },
      hoverList(){
        if(this.methods =="hover") this.showList = true;
        this.isShow =this.methods=="hover"
      },
      clickList(){
        this.isShow = this.methods=="click";
      },
      closeList(){
        this.isShow = false;
      },
      selectList(list,i){
        if(list.id && list.id == 2){
          //登出
          const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(255, 255, 255, 0.4)"
        });
        userCenter.logout().then(res => {
          if (res.status == 200) {
            window.location.href = ucOnegis + window.location.href;
            // this.$router.go(this.ucOnegi);
            // this.$router.push(this.ucOnegi)
            space.clearUser();

          } else {
            space.clearUser();
            // loading.close();
            location.reload();
          }
        });
        }
        this.$emit("select",list);
        // this.actived = i;
        this.isShow = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  #list{
    position: relative;
  }
  .list-content li{
    height: 40px;
    text-align: center;
    line-height: 35px;
    font-size: 14px;
    z-index: 1;
  }
  .list-title{
    // line-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color:#333;
    height: 40px;
    max-width: 130px;
  }
  .list-content{
    position: absolute;
    z-index: 1000;
    /* top:-2px; */
    width: 100%;
    left:0;
  }
  .list-content li:hover{
    background-color: #eee;
  }
  .active{
    background-color: #f1f1f1;
    
  }
  .rotate{
    transition: transform 0.3s;
    transform:rotate(180deg);
  }
  .orgin{
    transition: transform 0.3s;
    transform:rotate(0deg);
  }
  .slider-enter-active, .slider-leave-active {
    transition: all .3s;
    
  }
  .slider-enter, .slider-leave-to{
    transform: translateY(-100%);
    opacity: 0;
  }
  .hidden{
    overflow: hidden;
  }
  .shawoe{
    border: 1px solid #f1f1f1;
    background-color: #fff;
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .icon{
    // background-color: blue;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon i{
    font-size: 18px;
  }
  .pointer{
    cursor: pointer;
  }
  .actived{
    background-color: #176de6 !important;
    color:#fff !important;
  }
  .flex{
    display: flex;
    align-items: center;
  }
  .userphoto {
            width: 26px;
            height: 26px;
            border-radius: 50%;
          }
  .user-name{
    max-width: 90px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>