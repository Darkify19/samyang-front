import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    isAuthenticated: false, // User authentication status
    user: null, // Stores user data
  },
  mutations: {
    // Set user data when login is successful
    setUser(state, userData) {
      state.isAuthenticated = true;
      state.user = userData;
    },
    // Clear user data when logout happens
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  actions: {
    // Action to set the user after successful login
    // Directly commits the mutation
    setUser({ commit }, userData) {
      commit('setUser', userData);
    },
    // Action to log the user out
    logout({ commit }) {
      commit('logout');
    },
  },
  getters: {
    // Getters to access user data and auth status
    isAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
  },
});
