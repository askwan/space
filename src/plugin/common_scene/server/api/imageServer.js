import Base from './Base'

import {psdeUrl,psdeBaseUrl,token,UcServerUrl} from '../config'

class ImageServer extends Base {
  constructor(){
    super();
  }
  getImageUrl(src){
    return psdeUrl + "image/show?token=" + token + "&imageUrl=" + src
  }
  getUserImage(src){
    return UcServerUrl+src;
  }
}

export default new ImageServer();