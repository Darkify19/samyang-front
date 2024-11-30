import './assets/styles.css';
import Vue from 'vue';
import App from './App.vue';
import VueApollo from 'vue-apollo';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import router from './router'

import store from './store'

Vue.config.productionTip = false;

// Apollo Client Setup
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql', // Rails GraphQL endpoint
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

// Use VueApollo for integration
Vue.use(VueApollo);

new Vue({
  render: (h) => h(App),
  router,
  store,
  apolloProvider
}).$mount('#app');
