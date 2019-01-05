import {
    ucUrl
  } from "./newUrl";

export const space = {};
space.user = {};

space.linkUserCenter = function (userId) {
    return window.open(`${ucUrl}`);
  }
space.removeItem = function (name) { //删除cookie
    return sessionStorage.removeItem(name);
}
space.setInfo = function (name, val) { //设置cookie
    space.user[name] = val;
  }

space.clearUser = function(){
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userId');
    this.setInfo("roles", {});
    this.removeItem("token");
}
space.removeItem = function (name) { //删除cookie
return sessionStorage.removeItem(name);
}
