import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import {Row,Col,Message} from 'element-ui';
import elementUi from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import axios from './util/http'

/* Vue.use(Row);
Vue.use(Col);
Vue.use(Message); */
Vue.use(elementUi);

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
