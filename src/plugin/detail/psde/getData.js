import { psdeApi } from "./config";

// var getToken =
//           "eyJ1aWQiOjE5MDQ3LCJ0eXAiOiJKV1QiLCJjbGllbnRJZCI6IjliODI1ZTZkMTJmOTQzMTFiYjY4YTkwYzYwZjI1N2ZmIiwiYWxnIjoiSFMyNTYifQ.eyJuYmYiOjE1NDMyMTcxODMsImlzcyI6Imh0dHA6Ly93d3cuYmx1ZXRoaW5rLmNuIiwidHlwIjoiSldUIiwiZXhwIjoxNTQzMjI3OTgzLCJhbGciOiJIUzI1NiIsImlhdCI6MTU0MzIxNzE4M30.A-AuX-0eRsk77BZ6mlstIIiOO0pOb-efH8hiwE0eUrE";
var getToken = sessionStorage.getItem('token')
let getData = {
    //初始化请求对象
    ajaxData(obj) {
        return new Promise((resolve, reject) => {
          psdeApi
            .get(`/object/query?token=${getToken}`, {
              params: obj
            })
            .then(res => {
              if (res.data.status === 200) {
              //   console.log(res.data.data.list, 123);
                res.data.data.list = res.data.data.list.map(el => {
                  if (!el.name) {
                    el.name = "default";
                  }
                  return el;
                });
                // console.log(res.data.data.list)
                resolve(res.data.data.list)
                // // context.commit(MutationsList.objectList,res.data.data.list);
                // resolve(res.data.data);
              } else {
                reject();
              }
            });
        });
      },

      //请求对应的形态类型  id对照名称
      getDict(){
        return new Promise((resolve, reject) => {
            psdeApi
              .get(`/dict/getDict/form?token=${getToken}`)
              .then(res => {
                if (res.data.status === 200) {
                //   console.log(res.data.data);
                  resolve(res.data.data)
                } else {
                  reject();
                }
              });
          });
      },

      //请求形态样式
      getFormStyle(obj){
        return new Promise((resolve, reject) => {
            psdeApi
              .get(`/oformstyle/query?token=${getToken}`,{
                  params:obj
              })
              .then(res => {
                if (res.data.status === 200) {
                //   console.log(res.data.data);
                  resolve(res.data.data)
                } else {
                  reject();
                }
              });
          });
      }
}

export default getData