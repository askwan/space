const randomId = (num=8)=>{
  let letters = 'qwertyuiopasdfghjklzxcvbnm';
  let arr = letters.split('');
  let str = '';
  for(let i=0; i<num;i++){
    let randomNum = Math.floor(Math.random()*arr.length);
    str+=arr[randomNum];
  };
  return str;
}

const Static = {
  uis:[{id:1,name:'dack_layout'}],
  views:[{id:2,name:'testPlugin'},{id:7,name:'mapbox_plugin'},{id:8,name:'middle'},{id:9,name:'new'}],
  lists:[{id:3,name:'objectList'},{id:'4',name:'history'},{id:'5',name:'classViewList'},{id:'6',name:'detail'}]
}


export default {
  async saveApp(app){
    let res = await this.getApps();
    let apps = res.list;
    return new Promise((resolve,reject)=>{
      if(!apps.find(el=>el.name==app.name)){
        app.id = randomId();
        apps.unshift(app);
        this.saveJson(apps);
        resolve({
          status:200,
          message:'success',
          data:app
        })
      }else{
        reject({
          status:401,
          message:'名称重复'
        })
      }
    })
  },
  async savePlguin(app){
    let res = await this.getApps();
    let apps = res.list;
    return new Promise((resolve,reject)=>{
      let aim = apps.find(el=>el.id==app.id);
      if(!aim) {
        reject({
          status:402,
          message:'app不存在'
        })
      }else{
        Object.assign(aim,app);
        this.saveJson(apps);
        resolve({
          status:200,
          message:'success'
        })
      }
    })
  },
  async deleteApp(id){
    let res = await this.getApps();
    let apps = res.list;
    return new Promise((resolve,reject)=>{
      let index = apps.findIndex(el=>el.id==id);
      if(index==-1){
        reject({
          status:201,
          message:'未找到插件'
        })
      }else{
        apps.splice(index,1);
        this.saveJson(apps);
        resolve({
          status:200,
          message:'success'
        })
      }
    })
  },
  async updateApp(app){
    let res = await this.getApps();
    let apps = res.list;
    return new Promise((resolve,reject)=>{
      let index = apps.findIndex(el=>el.id==app.id);
      if(index==-1){
        reject({
          status:401,
          message:'不存在'
        })
      }else{
        apps.splice(index,1,app);
        this.saveJson(apps);
        resolve({
          status:200,
          message:'success'
        })
      }
    })
  },
  async getAppById(id){
    let res = await this.getApps();
    let apps = res.list;
    let result = apps.filter(el=>el.id===id);
    return new Promise((resolve,reject)=>{
      resolve({
        status:200,
        message:'success',
        list:result
      })
    })
  },
  clearData(){
    localStorage.removeItem('apps');
  },
  getUis(){
    return new Promise((resolve,reject)=>{
      resolve({
        status:200,
        list:Static.uis
      })
    })
  },
  getPlugins(){
    return new Promise((resolve,reject)=>{
      resolve({
        status:200,
        list:Static.lists
      })
    })
  },
  getViews(){
    return new Promise((resolve,reject)=>{
      resolve({
        status:200,
        list:Static.views
      })
    })
  },
  getApps(){
    let str = localStorage.getItem('apps');
    let apps;
    if(!str){
      apps = [];
    }else{
      apps = JSON.parse(str);
    };
    return new Promise((resolve,reject)=>{
      resolve({
        status:200,
        list:apps
      })
    })
  },
  saveJson(data){
    localStorage.setItem('apps',JSON.stringify(data));
  }
}