import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueContextMenu from 'vue-contextmenu'


import jsPlumb from 'jsplumb'




import '@/assets/iconfont/iconfont.css'




Vue.use(ElementUI);
Vue.use(VueContextMenu)

// Vue.prototype.url = 'http://yun.witsoftware.cn:5000';
Vue.prototype.url1 = 'http://192.168.0.196:8020';
Vue.prototype.baseUrl = 'http://yun.witsoftware.cn:9901';


Vue.config.productionTip = false
Vue.prototype.$axios = axios;

Vue.prototype.$jsPlumb = jsPlumb.jsPlumb



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
