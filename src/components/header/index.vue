<template>
  <div class='nav-box fill flex-between pd-left-small pd-right-small'>
    <div class="nav-left nav-box">
      space
    </div>
    <div class="nav-right flex" >
      <!-- <div class="login pd-left-big pd-right-big font-14 font-black flex-center pointer" click="login" v-if="!isUser">
        <a :href="ucOnegi" style="cursor: pointer;"> <img class="userphoto" src="../../../static/icon/default-user-avatar.png" /> <span>请登录</span> </a>
      </div> -->
      <common-bar height="50" :title="userInfo.nickName ? userInfo.nickName : userInfo.userName" :src='userInfo.userAvatar ? userInfo.userAvatar : false' :lists="lists" @select="operate" v-if="isUser"></common-bar>
      <common-bar height='50' title="网站导航" :lists="urls" @select="hrefTo"></common-bar>
    </div>
  </div>
</template>
<script>
  import userMgr from "@/server/userUtil.js";
  import {ucOnegis} from "@/server/newUrl.js"
  export default {
    data(){
      return {
        lists:[{name:'管理',id:1},{name:'退出',id:2}],
        urls:[{name:'BlueThink',url:'http://bluethink.cn/#/'},{name:'OneGis',url:'http://www.onegis.org'}],
        userInfo: {},
        isUser: false,
        // userMgr:util,
        ucOnegi: "", //当前地址
      }
    },
    props:{},
    components:{
      'common-bar':()=>import('@/components/common/submenu.vue')
    },
    computed:{
    },
    watch:{
    },
    mounted(){

      this.ucOnegi = ucOnegis + window.location.href;

      let token = sessionStorage.getItem('token')
      if (token) { // 有token
        if (userMgr.isUser()) {
          //拿到的用户信息
          this.userInfo = userMgr.getUser();
          this.isUser = true;
        }
      }else {
        window.location.href = ucOnegis + window.location.href
      }
      
    },
    methods:{
      login(){
        console.log('login')
      },
      hrefTo(item){
        window.open(item.url);
      },
      operate(item){
        if(item.id===1){
          this.$router.push('/manager')
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  .userphoto {
    width: 26px;
    height: 26px;
    border-radius: 50%;
  }
</style>