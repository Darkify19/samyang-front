import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    isAuthenticated: false,  // User authentication status
    user: null,  // Stores user data
  },
  mutations: {
    setUser(state, userData) {
      state.isAuthenticated = true;
      state.user = userData;

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;

      // Remove from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    },
  },
  actions: {
    setUser({ commit }, userData) {
      commit('setUser', userData);
    },
    logout({ commit }) {
      commit('logout');
    },
    initializeStore({ commit }) {
      const user = JSON.parse(localStorage.getItem('user'));
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

      if (user && isAuthenticated) {
        commit('setUser', user);
      }
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getUserId: (state) => (state.user ? state.user.id : null),
  },
});
