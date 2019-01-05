const plugins = {};
export default {
  setPlugin(plugin){
    plugins[plugin.name] = plugin;
  },
  getPlugin(name){
    return plugins[name];
  },
  plugins(){
    return plugins;
  }
}