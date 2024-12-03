<template>
    <div class="edit-user-profile">
        <h2>Edit User Profile</h2>
        <form @submit.prevent="submitForm">
            <label for="firstName">First Name</label>
            <input type="text" v-model="user.firstName" id="firstName" required />

            <label for="lastName">Last Name</label>
            <input type="text" v-model="user.lastName" id="lastName" required />

            <label for="email">Email</label>
            <input type="email" v-model="user.email" id="email" required />

            <label for="mobileNumber">Mobile Number</label>
            <input type="text" v-model="user.mobileNumber" id="mobileNumber" required />

            <label for="birthdate">Birthdate</label>
            <input type="date" v-model="user.birthdate" id="birthdate" required />

            <label for="gender">Gender</label>
            <select v-model="user.gender" id="gender" required>
                <option value="" disabled>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Other</option>
            </select>

            <label for="sexualOrientation">Sexual Orientation</label>
            <select v-model="user.sexualOrientation" id="sexualOrientation" required>
                <option value="" disabled>Select Sexual Orientation</option>
                <option>Straight</option>
                <option>Gay</option>
                <option>Bisexual</option>
                <option>Lesbian</option>
                <option>Asexual</option>
                <option>Other</option>
            </select>

            <label for="genderInterest">Gender Interest</label>
            <select v-model="user.genderInterest" id="genderInterest" required>
                <option value="" disabled>Select Gender Interest</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Everyone</option>
            </select>

            <label for="location">Location</label>
            <input type="text" v-model="user.location" id="location" required />

            <label for="bio">Bio</label>
            <textarea v-model="user.bio" id="bio" required></textarea>

            <button type="submit">Save Changes</button>
        </form>
        <button @click="goBack">Back</button>
    </div>
</template>

<script>
import { gql } from '@apollo/client/core';
import { EventBus } from '@/eventBus';

export default {
    data() {
        return {
            user: {
                firstName: '',
                lastName: '',
                email: '',
                mobileNumber: '',
                birthdate: '',
                gender: '',
                sexualOrientation: '',
                genderInterest: '',
                location: '',
                bio: '',
            },
            loading: true, // To manage loading state
        };
    },
    methods: {
        // Fetch user data by ID
        async fetchUser() {
            try {
                const userId = this.$route.params.id;
                const { data } = await this.$apollo.query({
                    query: gql`
                        query GetUser($id: ID!) {
                            user(id: $id) {
                                id
                                firstName
                                lastName
                                email
                                mobileNumber
                                birthdate
                                gender
                                sexualOrientation
                                genderInterest
                                location
                                bio
                            }
                        }
                    `,
                    variables: { id: userId },
                });

                if (data && data.user) {
                    this.user = { ...data.user };
                } else {
                    EventBus.$emit('message', { type: 'error', text: 'User not found!' });
                    this.$router.push({ name: 'adminUserList' }); // Redirect to admin user list
                }
            } catch (error) {
                console.error(error);
                EventBus.$emit('message', { type: 'error', text: 'Failed to fetch user data.' });
            } finally {
                this.loading = false;
            }
        },
        async submitForm() {
            try {
                const targetUserId = this.$route.params.id;

                const { data } = await this.$apollo.mutate({
                    mutation: gql`
                        mutation UpdateUser($input: UpdateUserInput!) {
                            updateUser(input: $input) {
                                user {
                                    id
                                    firstName
                                    lastName
                                    email
                                    mobileNumber
                                    birthdate
                                    gender
                                    sexualOrientation
                                    genderInterest
                                    location
                                    bio
                                }
                                errors
                            }
                        }
                    `,
                    variables: {
                        input: {
                            id: targetUserId,
                            firstName: this.user.firstName,
                            lastName: this.user.lastName,
                            email: this.user.email,
                            mobileNumber: this.user.mobileNumber,
                            birthdate: this.user.birthdate,
                            gender: this.user.gender,
                            sexualOrientation: this.user.sexualOrientation,
                            genderInterest: this.user.genderInterest,
                            location: this.user.location,
                            bio: this.user.bio,
                        },
                    },
                });

                if (data.updateUser.errors.length > 0) {
                    EventBus.$emit('message', { type: 'error', text: data.updateUser.errors.join(', ') });
                } else {
                    EventBus.$emit('message', { type: 'success', text: 'Profile updated successfully!' });
                    this.$router.push({ name: 'userProfile', params: { id: data.updateUser.user.id } });
                }
            } catch (error) {
                console.error(error);
                EventBus.$emit('message', { type: 'error', text: 'An unexpected error occurred.' });
            }
        },
        goBack() {
            this.$router.push({ name: 'userProfile', params: { id: this.$route.params.id } });
        },
    },
    async created() {
        await this.fetchUser(); // Fetch user data when the component is created
    },
};
</script>



<style scoped>
.edit-user-profile {
    padding: 20px;
    background-color: #f8f9fa;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 8px;
}

input,
textarea,
select {
    margin-bottom: 12px;
    padding: 8px;
    width: 100%;
}
</style>
