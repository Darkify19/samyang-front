<template>
    <div class="swipe-container">
        <div v-if="filteredUsers.length === 0" class="no-users-message">
            <p>No more users to display. Please check back later!</p>
        </div>
        <div class="user-card" v-for="(user, index) in filteredUsers" :key="user.id" :style="{
            backgroundImage: `url(${user.photos && user.photos.length ? user.photos[0].url : defaultPlaceholder})`,
            boxShadow: index === currentCardIndex ? cardBoxShadow : '0 6px 0px rgba(0, 0, 0, 0.4)'
        }" ref="userCards" @mousedown="startSwipe(index, $event)" @touchstart="startSwipe(index, $event)">
            <div class="user-details">
                <h3>{{ user.firstName }} {{ user.lastName }}</h3>
                <p>{{ user.location }}</p>
                <p>{{ user.bio }}</p>

                <p class="user-gender" :class="{ 'gender-match': isGenderMatch(user.gender) }">
                    Gender: {{ user.gender }}
                </p>
            </div>

        </div>
        <!-- Floating Icons for Heart and X -->
        <div class="swipe-actions">
            <i class="fa fa-times-circle action-x"></i>
            <i class="fa fa-gratipay action-heart"></i>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import swipeLogic from './custom.js';
import { gql } from '@apollo/client/core';
import { EventBus } from '@/eventBus'; // Import EventBus

export default {
    name: 'SwipeComponent',
    data() {
        return {
            startX: 0, // Starting position for swipe
            currentCardIndex: null, // Track the index of the current card
            cardBoxShadow: '0 6px 15px rgba(0, 255, 0, 0.5)', // Default shadow for "right" swipe
            defaultPlaceholder: this.$defaultPlaceholder, // Default placehsolder image path
        };
    },
    computed: {
        ...mapGetters({
            currentUser: 'getUser', // Access current user from Vuex
            users: 'getFilteredUsers', // Get filtered users from Vuex
            matches: 'getMatches', // Assuming you have a getter to fetch matches
            likedUsers: 'getLikedUsers', // Assuming you have a getter for liked users
        }),

        filteredUsers() {
            // Exclude users who are already liked or matched
            return this.users.filter(user => {
                return user && user.id !== this.currentUser.id &&
                    !this.matches.some(match => match.likedUserId === user.id) &&
                    !this.likedUsers.some(likedUser => likedUser.id === user.id); // Exclude already liked users
            });
        }
    },
    watch: {
        currentUser(newUser) {
            if (newUser && newUser.genderInterest) {
                this.fetchUsersByGenderInterest(newUser.genderInterest);
            } else {
                console.warn("Gender interest is undefined or missing in currentUser.");
            }
        },
    },
    methods: {
        ...swipeLogic.methods,
        ...mapActions({
            setFilteredUsers: 'setFilteredUsers', // Use Vuex action to update filtered users
        }),

        async fetchUsersByGenderInterest(genderInterest) {
            if (!genderInterest) {
                console.error("Gender interest is missing, aborting the fetch.");
                EventBus.$emit('message', { type: 'error', text: "Gender interest is missing." }); // Emit error
                return; // Abort if no valid genderInterest
            }

            const GET_USERS_BY_GENDER_INTEREST = gql`
        query GetUsersByGenderInterest($genderInterest: String!) {
          usersByGenderInterest(genderInterest: $genderInterest) {
            id
            firstName
            lastName
            location
            bio
            gender
            photos {
              url
            }
          }
        }
      `;

            try {
                const { data } = await this.$apollo.query({
                    query: GET_USERS_BY_GENDER_INTEREST,
                    variables: { genderInterest },
                });

                const filteredUsers = data.usersByGenderInterest.filter(user => user.id !== this.currentUser.id);

                this.setFilteredUsers(filteredUsers);

                if (filteredUsers.length === 0) {
                    console.warn("No matching users found for the current user's gender interest.");
                    EventBus.$emit('message', { type: 'warning', text: "No matching users found." }); // Emit warning
                }
            } catch (error) {
                console.error("Error fetching users: ", error);
                EventBus.$emit('message', { type: 'error', text: "Failed to fetch users." }); // Emit error
            }
        },

        isGenderMatch(gender) {
            return this.currentUser && gender === this.currentUser.genderInterest;
        },


    },
    mounted() {
        // Ensure currentUser is populated and genderInterest exists
        if (this.currentUser && this.currentUser.genderInterest) {
            this.fetchUsersByGenderInterest(this.currentUser.genderInterest);
        } else {
            console.warn("Gender interest is undefined in mounted hook.");
        }
    },
};
</script>

<style scoped>
.swipe-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    overflow: hidden;
    position: relative;
    padding: 10px;
}

.user-card {
    position: absolute;
    width: 320px;
    height: 480px;
    background-size: cover;
    background-position: center;
    border-radius: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    z-index: 10;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 15px;
    background-color: #eed5d1;
    user-select: none;
}

.user-card.swipe-out {
    transform: translateX(1000px) rotate(30deg);
    opacity: 0;
    transition: transform 1.0s ease, opacity 0.3s ease;
}

.user-details {
    background: #721c24;
    padding: 5px;
    border-radius: 10px;
    width: 100%;
    color: white;
    font-size: 16px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    transform: translateY(10px);
    transition: all 0.3s ease;
}

.user-details h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #eed5d1;
}

.user-details p {
    margin: 5px 0;
}

.user-card:hover .user-details {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(0px);
}

.swipe-actions {
    position: absolute;
    top: 95%;
    width: 25%;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
    z-index: 15;
}

.action-x,
.action-heart {
    font-size: 5rem;
    color: black;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
}

.action-x:hover,
.action-heart:hover {
    transform: scale(1.1);
}
</style>