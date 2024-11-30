<template>
    <div class="profile-container">
        <h2>User Profile</h2>

        <div class="user-info" v-if="user">
            <img :src="user.profilePicture" alt="Profile Picture" class="profile-picture" />
            <div class="user-details">
                <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>Location:</strong> {{ user.location }}</p>
                <p><strong>Bio:</strong> {{ user.bio }}</p>
            </div>
        </div>

        <button @click="editProfile">Edit Profile</button>

        <div class="inbox">
            <h3>Inbox</h3>
            <ul>
                <li v-for="contact in contacts" :key="contact.id">
                    <div class="contact-item">
                        <img :src="contact.profilePicture" alt="Contact Photo" class="contact-photo" />
                        <div class="contact-details">
                            <p><strong>{{ contact.firstName }} {{ contact.lastName }}</strong></p>
                            <p>{{ contact.lastMessageExcerpt }}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { gql } from '@apollo/client/core'; // Correct import for gql

export default {
    data() {
        return {
            contacts: [
                { id: 1, firstName: 'John', lastName: 'Doe', profilePicture: 'path_to_contact_image', lastMessageExcerpt: 'Hello there!' },
                { id: 2, firstName: 'Jane', lastName: 'Smith', profilePicture: 'path_to_contact_image', lastMessageExcerpt: 'How are you?' },
            ],
        };
    },
    computed: {
        // Get the user from Vuex store
        user() {
            return this.$store && this.$store.getters ? this.$store.getters.getUser : null;
        },
    },
    mounted() {
        if (!this.user) {
            this.fetchUserProfile();
        }
    },
    methods: {
        async fetchUserProfile() {
            // Make sure the user has an ID (get the ID from a Vuex getter or route params)
            const userId = this.$store.getters.getUserId;  // Assuming you have the user's ID in Vuex

            const GET_USER_PROFILE = gql`
                query GetUserProfile($id: ID!) {
                    user(id: $id) {
                        id
                        firstName
                        lastName
                        email
                        location
                        bio
                        profilePicture
                    }
                }
            `;

            try {
                const response = await this.$apollo.query({
                    query: GET_USER_PROFILE,
                    variables: { id: userId }, // Pass the user ID as a variable
                });

                const user = response.data.user;
                this.$store.dispatch('setUser', user); // Store user data in Vuex
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        },
        editProfile() {
            console.log('Edit profile clicked');
        },
    },
};
</script>


<style scoped>
.profile-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.profile-picture {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
}

.user-details p {
    margin: 5px 0;
}

.inbox {
    margin-top: 40px;
}

.inbox h3 {
    margin-bottom: 20px;
}

.contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.contact-photo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
}

.contact-details p {
    margin: 0;
}
</style>
