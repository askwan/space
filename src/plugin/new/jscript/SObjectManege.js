import otypeList from './OneSIS/SObjectSceneManager/LayerManager/CustomLayer/manage/otypeList';
import GlobalData from './GlobalData'

class SObjectManege {
  constructor() {
    this.sobjectList = {};
    this.sobjectGroup = {};
  }
  addList(sobject) {
    if (this.sobjectList[sobject.id]) {} else {
      this.sobjectList[sobject.id] = sobject
    }
  }

  transform(list,idArr) {
    let arr=[]
    idArr.forEach((n,i)=>{
      arr.push(list.find(el => el.id == n)) ;
    })
    // arr.push(list.find(el => el.id == 94552829965)) ;
    // arr.push(list.find(el => el.id == 94552829975)) ;
    // arr.push(list.find(el => el.id == 714059423744)) ;
    
    if (arr.length<1) return [];
    let otypes = {};
    list.forEach(sobject => {
      sobject.show = true;
      this.addList(sobject);
      if (!otypes[sobject.otype.id]) otypes[sobject.otype.id] = sobject.otype;
      sobject.parents.forEach(parent => {
        if (!this.sobjectGroup[parent.id]) {
          this.sobjectGroup[parent.id] = [];
        };
        let index = this.sobjectGroup[parent.id].findIndex(el => el.id == sobject.id);
        if (index == -1) this.sobjectGroup[parent.id].push(sobject);
      })
    })
    otypeList.setlist(otypes);
    GlobalData.otypeList = otypeList
    for(let i=0;i<arr.length;i++){
      let obj=arr[i]
      this.getChildren(obj);
    this.sobjectList[obj.id] = obj;

    }
    return arr;
  }
  getChildren(sobject) {
    sobject.children = this.sobjectGroup[sobject.id] || [];
    sobject.children.forEach(child => {
      this.getChildren(child);
    })
    return sobject
  }
  toggle(sobject, bool) {
    sobject.show = bool;
    for (let key in sobject.children) {
      sobject.children[key].show = bool;
      sobject.children[key] = this.toggle(sobject.children[key], bool);
    }
    return sobject;
  }
}
let sObjectManege = new SObjectManege()
export default sObjectManege