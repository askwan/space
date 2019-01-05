import axios from 'axios';
import Vue from 'vue';
import {
  ucOnegis,
} from "../userUtil.js";
let vm = new Vue();

let axiosMain = axios.create({
  headers: {
    'Authorization': sessionStorage.getItem('token') || ''
  },
});
//  请求封装
function fetch(method, url, params) {
  return new Promise((resolve, reject) => {
    let time = Date.parse(new Date());
    if (url.includes('?')) {
      url = `${url}&time=${time}`;
    } else {
      url = `${url}?time=${time}`;
    }

    let axiosMain = axios.create({
      headers: {
        'Authorization': sessionStorage.getItem('token') || ''
      },
    });
    let loading;
    if (method == 'post') {
      loading = vm.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.4)'
      });
      // console.log('post');
      // this.$message
    }
    axiosMain[method](url, params)
      .then(response => {
        if (method == 'post') {
          loading.close();
        }
        if (response.status == 200) {
          if (response.data.status == 450) {
            console.log(450);
            // vm.onegis.clearUser();
            // alert('请登录')
            location.href = ucOnegis + window.location.href;
          } else {
            resolve(response.data);
          }
        } else {
          window.OneGis.$message.error(response.data.message)
        }
      })
      .catch((error) => {
        reject(error);
        if (method == 'post') {
          loading.close();
        }
        window.OneGis.$message.error('获取数据失败')
      })
  })
}

//异步上传文件
function uploadFile(url, form, newThis) {
  return new Promise((resolve, reject) => {
    axiosMain.post(url, form, {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 1800000,
        onUploadProgress: function (progressEvent) {
          // 对原生进度事件的处理
          var loaded = progressEvent.loaded; //已经上传大小情况 
          var tot = progressEvent.total; //附件总大小 
          var per = Math.floor(100 * loaded / tot); //已经上传的百分比    
          console.log(per)
          newThis.progress = per;
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
export {
  fetch,
  uploadFile
};
