import axios from 'axios';

const psdeHost = "http://bt1.geosts.ac.cn/api/dae/datastore";

const psdeUrl = psdeHost + "/rest/v0.1.0/datastore/";

let psdeApi = axios.create({
    baseURL:psdeUrl
})

export {
    psdeUrl,
    psdeApi
}