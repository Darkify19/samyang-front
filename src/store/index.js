import Vue from 'vue';
import Vuex from 'vuex';
import { gql } from '@apollo/client/core';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    isAuthenticated: false,
    user: null,
    filteredUsers: [],
    skippedUsers: [],
    likedUsers: [],
    users: [],
    likedUserId: null,
    matches: [],  // Store match data
  },

  mutations: {
    setUser(state, userData) {
      state.isAuthenticated = true;
      state.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    },
    setFilteredUsers(state, users) {
      state.filteredUsers = users;
    },
    setUsers(state, users) {
      state.users = users;
    },
    addSkippedUser(state, user) {
      state.skippedUsers.push(user);
    },
    addLikedUser(state, user) {
      state.likedUsers.push(user);
    },
    setLikedUserId(state, likedUserId) {
      state.likedUserId = likedUserId;
    },
    setMatches(state, matches) {
      state.matches = matches;  // Set matches in the state
    },
    clearMatches(state) {
      state.matches = [];  // Clear the match data
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
    setFilteredUsers({ commit }, users) {
      commit('setFilteredUsers', users);
    },
    setUsers({ commit }, users) {
      commit('setUsers', users);
    },
    skipUser({ commit }, user) {
      commit('addSkippedUser', user);
    },
    likeUser({ commit }, user) {
      commit('addLikedUser', user);
    },
    moveUserToBack({ commit }, userIndex) {
      commit('moveUserToBack', userIndex);
    },
    setLikedUserId({ commit }, likedUserId) {
      commit('setLikedUserId', likedUserId);
    },
    // Action to fetch and set matches based on the current user
    async fetchMatches({ commit, state }) {
      try {
        if (!state.user || !state.user.id) {
          throw new Error('User is not authenticated.');
        }

        const { data } = await this.$apollo.query({
          query: gql`
            query GetMatches($userId: ID!) {
              matches(userId: $userId) {
                userId
                likedUserId
              }
            }
          `,
          variables: { userId: state.user.id },
        });

        // Process and filter matches to ensure mutual matching
        const mutualMatches = data.matches.filter((match) =>
          data.matches.some(
            (otherMatch) =>
              match.userId === otherMatch.likedUserId &&
              match.likedUserId === otherMatch.userId
          )
        );

        commit('setMatches', mutualMatches);
        console.log('Fetched matches:', mutualMatches);  // Debug log
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    },
    // Action to clear matches from store
    clearMatches({ commit }) {
      commit('clearMatches');
    },
  },

  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getUserId: (state) => (state.user ? state.user.id : null),
    getFilteredUsers: (state) => state.filteredUsers,
    getUsers: (state) => state.users,
    getSkippedUsers: (state) => state.skippedUsers,
    getLikedUsers: (state) => state.likedUsers,
    getLikedUserId: (state) => state.likedUserId,
    getMatches: (state) => state.matches,  // Return the matches state
  },
});
