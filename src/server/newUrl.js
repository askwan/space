import {
    ucHttp,
    serverUrl,
    ucServer
  } from '@/config.js';
import { fetch } from './axios';
export const ucUrl = `${ucHttp}/#/userCenter`; //线上新地址
export const ucOnegis = `${ucHttp}/#/login?service=`; //本地新登录

const user ={
    getUserInfo(){  // 获取用户基本信息
        return fetch('get',`${serverUrl}/user/interestedUsers`)
    },
}
export const userCenter = {
    logout() { //退出
      let token = sessionStorage.getItem('token');
      sessionStorage.removeItem('token');
      if (!token) {
        return new Promise((resove, reject) => {
          resove({
            status: 200
          })
        })
      }
      return fetch('get', `${ucServer}/account/logout?token=${token}`);
    },
    getUnreadCount() {
      return fetch('get', `${ucServer}/notice/getUnreadCount`);
    },
    getUserRoleInfo() {
        return fetch('get', `${serverUrl}/user/getUserRoleInfo`);
    },
  }

export default user;
