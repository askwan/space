<template>
</template>
<script>
import { ucOnegis, user,userCenter } from "./newUrl.js";
import { space } from "./util.js";
import userMgr from './userUtil.js'
export default {
  data() {
    return {};
  },
  mounted() {
    let index1 = window.location.href.indexOf("service=") + 8;
    let index2 = window.location.href.indexOf("&token=");
    let service = decodeURIComponent(
      window.location.href.substring(index1, index2)
    );
    let token = decodeURIComponent(window.location.href.substring(index2 + 7));
    if (token) {
      sessionStorage.setItem("token", token);
      this.loadUser();
      
    } else {
      window.location.href = ucOnegis + service;
    }

  },
  methods: {
    loadUser() {
      userCenter.getUserRoleInfo().then(res => {
        console.log(res,"3resresres")
        if (res.status == 450) {
          space.removeItem("token");
          window.OneGis.$message.error(res.message);
          window.location.href = ucOnegis + window.location.href;
          return;
        } else if (res.status == 200) {
          //				let obj=tokenUtils.transformRoles(res.data.roles);
          if (res.data.active == 1) {
            userCenter.logout().then(res => {
              window.OneGis.$message.error("此账号已被禁用!");
              space.setInfo("roles", {});
              space.removeItem("token");
              window.location.href = ucOnegis + window.location.href;
            });
          }

          userMgr.setUserInfo({
            active: res.data.active,
            code: res.data.code,
            userAvatar: res.data.avatar,
            id: res.data.id,
            nickName: res.data.nickName,
            userName: res.data.userName
          });

        

          space.setInfo("active", res.data.active);
          space.setInfo("code", res.data.code);
          space.setInfo("userAvatar", res.data.avatar);
          space.setInfo("id", res.data.id);
          space.setInfo("nickName", res.data.nickName);
          space.setInfo("userName", res.data.userName);
          let index1 = window.location.href.indexOf("service=") + 8;
          let index2 = window.location.href.indexOf("&token=");
          let service = decodeURIComponent(
            window.location.href.substring(index1, index2)
          );

          window.location.href = service;
          
          //next();
        } else {
        }
      });
    }
  }
};
</script>