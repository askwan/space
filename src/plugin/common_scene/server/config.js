

// const psdeBaseUrl = 'http://192.168.1.133:8001';
// const psdeHost = psdeBaseUrl;

const psdeBaseUrl = 'http://bt1.geosts.ac.cn/api';
const psdeHost = psdeBaseUrl + '/dae/datastore';

const psdeUrl = psdeHost + '/rest/v0.1.0/datastore/';

const modelUrl = "http://bt1.geosts.ac.cn/api/bim";
//const modelUrl = "http://bt1.geosts.ac.cn/api/dae";//模型上传下载显示基础地址
const ucBaseUrl = "http://116.62.28.103";//UC基础地址
const UcServerUrl = "http://bt1.geosts.ac.cn/api/uc/api/v2";//UC获取数据地址

const token = localStorage.getItem('token') || ''

export {
  psdeBaseUrl,
  psdeHost,
  psdeUrl,
  ucBaseUrl,
  UcServerUrl,
  token
}