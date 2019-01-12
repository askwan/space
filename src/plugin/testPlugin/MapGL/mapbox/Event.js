export default class Event {
  constructor(map){
    this.map = map;
  }
  init(){
    this.map.on('click',event=>{
      console.log(event);
    })
  }
}