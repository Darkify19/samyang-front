import Vue from 'vue';
import Vuex from 'vuex';
import { gql } from '@apollo/client/core';
import apolloClient from '../apollo'; // Import the configured Apollo Client

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
    matches: [],
    userPhotos: [], // Added for user photos
  },

  mutations: {
    setUser(state, userData) {
      state.isAuthenticated = true;
      state.user = {
        ...userData,
        photos: userData.photos || [],
      };
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('isAuthenticated', 'true');
    },
    setUserPhotos(state, photos) {
      state.userPhotos = photos;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.userPhotos = [];
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
      state.matches = matches;
    },
    clearMatches(state) {
      state.matches = [];
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
    setLikedUserId({ commit }, likedUserId) {
      commit('setLikedUserId', likedUserId);
    },
    async fetchUserPhotos({ commit, state }) {
      if (!state.user?.id) return;

      const FETCH_USER_PHOTOS = gql`
        query FetchUserPhotos($userId: ID!) {
          user(id: $userId) {
            photos {
              id
              url
            }
          }
        }
      `;


      try {
        const { data } = await apolloClient.query({
          query: FETCH_USER_PHOTOS,
          variables: { userId: state.user.id },
        });
        commit('setUserPhotos', data.user.photos);
      } catch (error) {
        console.error('Error fetching user photos:', error);
      }
    },
    async fetchMatches({ commit, state }) {
      if (!state.user?.id) return;

      const FETCH_MATCHES = gql`
        query GetMatches($userId: ID!) {
          matches(userId: $userId) {
            userId
            likedUserId
          }
        }
      `;

      try {
        const { data } = await this.$apollo.query({
          query: FETCH_MATCHES,
          variables: { userId: state.user.id },
        });

        const mutualMatches = data.matches.filter((match) =>
          data.matches.some(
            (otherMatch) =>
              match.userId === otherMatch.likedUserId &&
              match.likedUserId === otherMatch.userId
          )
        );

        commit('setMatches', mutualMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    },
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
    getMatches: (state) => state.matches,
    getUserPhotos: (state) => state.userPhotos, // Getter for photos
  },
});
