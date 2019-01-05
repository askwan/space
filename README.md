# space2.0

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
npm start
```

### Compiles and minifies for production
```
npm run build
```




##### 1   默认引入的模块
```
mapbox-gl
element-ui
vue-router
axios
vue
```
##### 1.1 使用
```
import mapbox-gl from 'mapbox-gl'
```
##### 2   引入静态脚本
```
使用相对路径'./',遵循es6模块规范,
例：
import PluginBase from ‘./js/plugin.js’
```
##### 3   CDN引入
```
默认使用requirejs导入
例：
requirejs(['https://cdn.bootcss.com/three.js/r83/three.js'],function(threejs){
    ...
});
```
