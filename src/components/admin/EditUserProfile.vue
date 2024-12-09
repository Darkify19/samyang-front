<template>
    <div class="edit-user-profile">
        <h2>Edit User Profile</h2>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" v-model="user.firstName" id="firstName" :class="{ success: success }" required />
            </div>

            <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" v-model="user.lastName" id="lastName" :class="{ success: success }" required />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" v-model="user.email" id="email" :class="{ success: success }" required />
            </div>

            <div class="form-group">
                <label for="mobileNumber">Mobile Number</label>
                <input type="text" v-model="user.mobileNumber" id="mobileNumber" :class="{ success: success }"
                    required />
            </div>

            <div class="form-group">
                <label for="birthdate">Birthdate</label>
                <input type="date" v-model="user.birthdate" id="birthdate" :class="{ success: success }" required />
            </div>

            <div class="form-group">
                <label for="gender">Gender</label>
                <select v-model="user.gender" id="gender" :class="{ success: success }" required>
                    <option value="" disabled>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Other</option>
                </select>
            </div>

            <div class="form-group">
                <label for="sexualOrientation">Sexual Orientation</label>
                <select v-model="user.sexualOrientation" id="sexualOrientation" :class="{ success: success }" required>
                    <option value="" disabled>Select Sexual Orientation</option>
                    <option>Straight</option>
                    <option>Gay</option>
                    <option>Bisexual</option>
                    <option>Lesbian</option>
                    <option>Asexual</option>
                    <option>Other</option>
                </select>
            </div>

            <div class="form-group">
                <label for="genderInterest">Gender Interest</label>
                <select v-model="user.genderInterest" id="genderInterest" :class="{ success: success }" required>
                    <option value="" disabled>Select Gender Interest</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Everyone</option>
                </select>
            </div>

            <div class="form-group">
                <label for="location">Location</label>
                <input type="text" v-model="user.location" id="location" :class="{ success: success }" required />
            </div>

            <div class="form-group">
                <label for="bio">Bio</label>
                <textarea v-model="user.bio" id="bio" :class="{ success: success }" required></textarea>
            </div>

            <button type="submit" class="submit-btn">Save Changes</button>
        </form>
        <button @click="goBack" class="back-btn">Back</button>
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
            loading: true,
            success: false, // To control green flash effect
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

                    // Trigger green flash effect
                    this.success = true;
                    setTimeout(() => {
                        this.success = false;
                    }, 300);
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
    padding: 30px;
    background-color: #f4f7fc;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 20px auto;
}

h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 20px;
}

form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 15px;
}

label {
    font-weight: bold;
    color: #555;
    margin-bottom: 5px;
    font-size: 1rem;
}

input,
textarea,
select {
    padding: 10px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    background-color: #fff;
}

input.success,
textarea.success,
select.success {
    animation: flash-green 1s;
}

button {
    padding: 12px 20px;
    background-color: #007bff;
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
    background-color: #0056b3;
}

button:active {
    transform: translateY(2px);
}

button.back-btn {
    margin-top: 10px;
    background-color: #6c757d;
}

button.back-btn:hover {
    background-color: #5a6268;
}

@keyframes flash-green {
    0% {
        background-color: #d4edda;
    }

    100% {
        background-color: transparent;
    }
}
</style>
