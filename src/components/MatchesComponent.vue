<template>
    <div class="matches-container">
        <h2>Your Matches</h2>
        <div v-if="matches.length > 0" class="matches-list">
            <div v-for="match in matches" :key="`${match.user.id}-${match.likedUser.id}`" class="match-card">
                <div class="match-info">
                    <h3>{{ match.likedUser.firstName }} {{ match.likedUser.lastName }}</h3>
                    <p>Email: {{ match.likedUser.email }}</p>
                    <p>Location: {{ match.likedUser.location }}</p>
                    <p>Bio: {{ match.likedUser.bio }}</p>
                </div>
                <button @click="chatWithMatch(match.likedUser.id)" class="chat-button">Start Chat</button>
            </div>
        </div>
        <div v-else class="no-matches">
            <p>No matches yet. Keep swiping!</p>
        </div>
    </div>
</template>


#### Vue Script:
```javascript
<script>
import gql from 'graphql-tag';

export default {
    name: 'MatchesComponent',
    data() {
        return {
            matches: [],
            currentUserId: null,
        };
    },
    methods: {
        async fetchCurrentUserId() {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData?.id) {
                    this.currentUserId = userData.id;
                } else {
                    throw new Error('User ID not found in localStorage');
                }
            } catch (error) {
                console.error('Error fetching current user ID:', error);
            }
        },
        async fetchMatches() {
            try {
                if (!this.currentUserId) {
                    throw new Error('Current user ID is not set');
                }

                const { data } = await this.$apollo.query({
                    query: gql`
    query GetMatches($userId: ID!) {
      matches(userId: $userId) {
        id
        userId
        likedUserId
        user {
          id
          firstName
          lastName
          email
          location
          bio
        }
        likedUser {
          id
          firstName
          lastName
          email
          location
          bio
        }
      }
    }
  `,
                    variables: { userId: this.currentUserId },
                });

                // Deduplicate matches logic
                const uniqueMatches = [];
                const matchSet = new Set();

                data.matches.forEach((match) => {
                    const matchKey = `${match.user.id}-${match.likedUser.id}`;
                    const reverseMatchKey = `${match.likedUser.id}-${match.user.id}`;

                    if (!matchSet.has(matchKey) && !matchSet.has(reverseMatchKey)) {
                        uniqueMatches.push(match);
                        matchSet.add(matchKey);
                    }
                });

                this.matches = uniqueMatches;
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        },
        chatWithMatch(matchId) {
            console.log(`Start chat with match ID: ${matchId}`);
        },
    },
    async mounted() {
        try {
            await this.fetchCurrentUserId();
            await this.fetchMatches();
        } catch (error) {
            console.error('Error during component initialization:', error);
        }
    },
};
</script>




<style scoped>
.matches-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.matches-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.match-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 15px;
    display: flex;
    flex-direction: column;
}

.match-info {
    margin-bottom: 10px;
}

.match-info h3 {
    font-size: 18px;
    margin-bottom: 5px;
}

.match-info p {
    font-size: 14px;
    color: #555;
}

.chat-button {
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    margin-top: 10px;
    transition: background-color 0.3s;
}

.chat-button:hover {
    background-color: #0056b3;
}

.no-matches {
    text-align: center;
    font-size: 16px;
    color: #777;
}
</style>
