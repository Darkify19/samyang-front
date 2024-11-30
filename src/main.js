import './assets/styles.css';
import Vue from 'vue';
import App from './App.vue';
import VueApollo from 'vue-apollo';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import router from './router';
import { store } from './store';  // Make sure this is imported

Vue.config.productionTip = false;

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql', // Your GraphQL endpoint
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
  store,  // Ensure the store is passed here
  apolloProvider,
}).$mount('#app');
