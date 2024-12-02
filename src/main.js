//src/main.js
import './assets/styles.css';
import Vue from 'vue';
import App from './App.vue';
import VueApollo from 'vue-apollo';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
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

store.dispatch('initializeStore'); // Initialize store on app startup

const httpLink = new HttpLink({
  uri: 'https://test-backend-development.onrender.com/graphql',
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.use(VueApollo);

new Vue({
  render: (h) => h(App),
  router,
  store,
  apolloProvider,
}).$mount('#app');
