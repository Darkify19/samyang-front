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
  `, variables: { userId: this.currentUserId },
                });
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
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #EED5D1;
    border-radius: 10px;
}

h2 {
    text-align: center;
    color: #D1114D;
    font-size: 24px;
    margin-bottom: 20px;
}

.matches-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
}

.match-card {
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
}

.match-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.profile-container {
    width: 100%;
    max-width: 120px;
    margin-bottom: 15px;
}

.profile-pic {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #D6517C;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.match-info h3 {
    font-size: 20px;
    color: #D1114D;
    margin-bottom: 10px;
}

.match-info p {
    font-size: 14px;
    color: #555;
    margin: 5px 0;
}

.chat-button {
    background-color: #D6517C;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.2s;
    margin-top: 15px;
}

.chat-button:hover {
    background-color: #F38592;
    transform: scale(1.05);
}

.no-matches {
    text-align: center;
    font-size: 18px;
    color: #777;
    font-weight: bold;
}
</style>
