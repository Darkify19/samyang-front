<template>
    <div class="user-profile">
        <h2>User Profile</h2>
        <div v-if="user">
            <div class="user-info">
                <img :src="user.photos[0]?.url || $myLogo" alt="User photo" class="user-photo" />
                <h3>{{ user.firstName }} {{ user.lastName }}</h3>
                <p><strong>Location:</strong> {{ user.location }}</p>
                <p><strong>Bio:</strong> {{ user.bio }}</p>
            </div>
            <div class="user-matches">
                <h3>Matches</h3>
                <template v-if="hasMatches">
                    <ul>
                        <li v-for="(match, index) in uniqueMatches" :key="match.likedUser.id || index">
                            {{ match.likedUser.firstName }} {{ match.likedUser.lastName }}
                            <img :src="match.likedUser.photos[0]?.url || $myLogo" alt="Match photo"
                                class="match-photo" />
                        </li>
                    </ul>
                </template>
                <p v-else>No matches found for this user.</p>
            </div>
        </div>
        <button @click="goBack">Back</button>
    </div>
</template>



<script>
import { gql } from '@apollo/client/core';

export default {
    data() {
        return {
            user: null, // Store user data
        };
    },
    computed: {
        uniqueMatches() {
            // Filter matches to remove duplicates and exclude the current user
            if (!this.user || !this.user.matches) return [];
            return this.user.matches.filter(
                (match, index, self) =>
                    match.likedUser.id !== this.user.id && // Exclude current user
                    index === self.findIndex(m => m.likedUser.id === match.likedUser.id)
            );
        },
        hasMatches() {
            return this.uniqueMatches.length > 0;
        },
    },
    methods: {
        async fetchUserProfile(id) {
            const { data } = await this.$apollo.query({
                query: gql`
                    query GetUser($id: ID!) {
                        user(id: $id) {
                            id
                            firstName
                            lastName
                            location
                            bio
                            photos {
                                url
                            }
                            matches {
                                likedUser {
                                    id
                                    firstName
                                    lastName
                                    photos {
                                        url
                                    }
                                }
                            }
                        }
                    }
                `,
                variables: { id },
            });
            this.user = data.user;
        },
        goBack() {
            this.$router.push({ name: 'userList' });
        },
    },
    mounted() {
        const userId = this.$route.params.id;
        this.fetchUserProfile(userId);
    },
};
</script>



<style scoped>
.user-profile {
    margin: 20px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.user-photo {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 20px;
    border: 3px solid #f38592;
}

h3 {
    margin: 5px 0;
    color: #821d30;
}

.user-matches h3 {
    color: #821d30;
    margin-bottom: 15px;
}

.match-photo {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 12px;
}

button {
    margin-top: 20px;
    padding: 12px 18px;
    background-color: #d1114d;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
    background-color: #d6517c;
    transform: translateY(-2px);
}

button:active {
    transform: translateY(2px);
}
</style>