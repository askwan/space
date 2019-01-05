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

  transform(list) {
    let root = list.find(el => el.id == 7183427739648);
    if (!root) return {};
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
    this.getChildren(root);
    this.sobjectList[root.id] = root;
    return root;
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