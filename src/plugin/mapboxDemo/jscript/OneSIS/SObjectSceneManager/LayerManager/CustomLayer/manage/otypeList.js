class OtypeList {
  constructor() {
    this.otypeList = ''
  }
  setlist(list) {
    this.otypeList = list
  }
  getOtype(id){
    return this.otypeList[id]
  }
}
let otypeList = new OtypeList()
export default otypeList
