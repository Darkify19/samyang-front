<template>
    <div class="user-profile">
        <h2>User Profile</h2>
        <div v-if="user">
            <div class="user-info">
                <img :src="user.photos[0]?.url || $defaultPlaceholder" alt="User photo" class="user-photo" />
                <div class="user-details">
                    <h3>{{ user.firstName }} {{ user.lastName }}</h3>
                    <p><strong>Location:</strong> {{ user.location }}</p>
                    <p><strong>Bio:</strong> {{ user.bio }}</p>
                </div>
            </div>
            <div class="user-matches">
                <h3>Matches</h3>
                <template v-if="hasMatches">
                    <ul>
                        <li v-for="(match, index) in uniqueMatches" :key="match.likedUser.id || index"
                            class="match-item">
                            <img :src="match.likedUser.photos[0]?.url || $defaultPlaceholder" alt="Match photo"
                                class="match-photo" />
                            <div class="match-details">
                                <p>{{ match.likedUser.firstName }} {{ match.likedUser.lastName }}</p>
                            </div>
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
    margin: 30px auto;
    max-width: 1200px;
    background-color: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
}

h2 {
    text-align: center;
    color: #d1114d;
    font-size: 2.5rem;
    margin-bottom: 30px;
    font-weight: bold;
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    padding: 10px 0;
    border-bottom: 2px solid #f0f0f0;
}

.user-photo {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 20px;
    border: 4px solid #d1114d;
}

.user-details {
    flex-grow: 1;
}

h3 {
    margin: 5px 0;
    color: #821d30;
    font-size: 1.8rem;
}

p {
    color: #555;
    font-size: 1rem;
    line-height: 1.5;
}

.user-matches {
    margin-top: 40px;
}

.user-matches h3 {
    font-size: 1.6rem;
    color: #d1114d;
    margin-bottom: 20px;
}

.match-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}

.match-photo {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 15px;
}

.match-details p {
    color: #555;
    font-size: 1.1rem;
    font-weight: bold;
}

button {
    margin-top: 30px;
    padding: 14px 28px;
    background-color: #d1114d;
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    width: 100%;
    max-width: 200px;
    margin: 30px auto;
}

button:hover {
    background-color: #d6517c;
    transform: translateY(-2px);
}

button:active {
    transform: translateY(2px);
}

/* Responsive styles */
@media (max-width: 768px) {
    .user-info {
        flex-direction: column;
        text-align: center;
    }

    .user-photo {
        margin-bottom: 15px;
    }

    .match-item {
        flex-direction: column;
        align-items: center;
    }

    .match-photo {
        margin-bottom: 10px;
    }

    button {
        width: 100%;
        max-width: 250px;
    }
}
</style>
