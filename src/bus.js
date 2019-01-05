import Vue from 'vue';

const bus = new Vue();

window._bus = bus;
export {
  bus
}