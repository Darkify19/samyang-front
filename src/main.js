//src/main.js
import './assets/styles.css';
import Vue from 'vue';
import App from './App.vue';
import VueApollo from 'vue-apollo'; // Using vue-apollo@3
import apolloClient from './apollo'; // Import Apollo client configuration
import router from './router';
import { store } from './store';

import defaultPlaceholder from '@/assets/default_placeholder.png';
import myBackground from '@/assets/myapp_bg.jpg';
import myLogo from '@/assets/myapp_logo.png';
import myLogo1 from '@/assets/my_logo.png';

Vue.prototype.$myLogo1 = myLogo1;
Vue.prototype.$defaultPlaceholder = defaultPlaceholder;
Vue.prototype.$myBackground = myBackground;
Vue.prototype.$myLogo = myLogo;

Vue.config.productionTip = false;

// Initialize the store on app startup
store.dispatch('initializeStore');

// Register Apollo with Vue
Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

new Vue({
  render: (h) => h(App),
  router,
  store,
  apolloProvider,
}).$mount('#app');
