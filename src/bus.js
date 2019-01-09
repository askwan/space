import Vue from 'vue';

const bus = new Vue();
console.log(445)
window._bus = bus;
export {
  bus
}