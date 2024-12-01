<template>
    <div class="profile-container container">
        <h2>User Profile</h2>
        <div class="user-info" v-if="user">
            <img :src="user.photos && user.photos.length ? user.photos[0].url : $defaultPlaceholder"
                alt="Profile Picture" class="profile-picture" />

            <p v-if="!user.photos || !user.photos.length">You have not yet uploaded any photos. Please upload.</p>

            <div class="photo-upload">
                <!-- File Input for Upload -->
                <input type="file" @change="handleFileChange" :disabled="user.photos && user.photos.length >= 5" />
                <p v-if="user.photos && user.photos.length >= 5">You can only upload 5 photos.</p>
            </div>

            <!-- Display Current Photos -->
            <div class="current-photos">
                <h3>Current Photos</h3>
                <div v-if="user.photos && user.photos.length">
                    <img v-for="(photo, index) in user.photos" :key="photo.id" :src="photo.url"
                        :alt="'Photo ' + (index + 1)" class="thumbnail" />
                </div>
            </div>

            <div class="user-details">
                <form @submit.prevent="updateProfile" class="form-group two-columns">
                    <div>
                        <label for="firstName">First Name:</label>
                        <input id="firstName" v-model="userDetails.firstName" type="text"
                            placeholder="Enter your first name" />
                    </div>
                    <div>
                        <label for="lastName">Last Name:</label>
                        <input id="lastName" v-model="userDetails.lastName" type="text"
                            placeholder="Enter your last name" />
                    </div>
                    <div>
                        <label for="email">Email:</label>
                        <input id="email" v-model="userDetails.email" type="email" placeholder="Enter your email" />
                    </div>
                    <div>
                        <label for="mobileNumber">Mobile Number:</label>
                        <input id="mobileNumber" v-model="userDetails.mobileNumber" type="text"
                            placeholder="Enter your mobile number" />
                    </div>
                    <div>
                        <label for="birthdate">Birthdate:</label>
                        <input id="birthdate" v-model="userDetails.birthdate" type="date" />
                    </div>
                    <div>
                        <label for="gender">Gender:</label>
                        <select v-model="userDetails.gender" required>
                            <option value="" disabled selected>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Non-binary</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label for="sexualOrientation">Sexual Orientation:</label>
                        <select v-model="userDetails.sexualOrientation" required>
                            <option value="" disabled selected>Select Sexual Orientation</option>
                            <option>Heterosexual</option>
                            <option>Homosexual</option>
                            <option>Bisexual</option>
                            <option>Asexual</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label for="genderInterest">Gender Interest:</label>
                        <select v-model="userDetails.genderInterest" required>
                            <option value="" disabled selected>Select Gender Interest</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Non-binary</option>
                            <option>Any</option>
                        </select>
                    </div>
                    <div>
                        <label for="location">Location:</label>
                        <input id="location" v-model="userDetails.location" type="text"
                            placeholder="Enter your location" />
                    </div>
                    <div>
                        <label for="bio">Bio:</label>
                        <textarea id="bio" v-model="userDetails.bio" placeholder="Tell us about yourself"></textarea>
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { gql } from '@apollo/client/core';
import { EventBus } from '@/eventBus';

export default {
    data() {
        return {
            userDetails: {
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
            selectedFile: null,
        };
    },
    computed: {
        user() {
            return this.$store.getters.getUser;
        },
    },
    watch: {
        user: {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.userDetails = { ...newValue };
                }
            },
        },
    },
    methods: {
        async handleFileChange(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Check if file size and type are correct (optional)
            if (file.size > 5 * 1024 * 1024) {
                EventBus.$emit('message', { type: 'error', text: 'File size exceeds 5MB.' });
                return;
            }

            // Initiate upload
            try {
                const response = await this.uploadPhoto(file);  // Make sure `file` is correctly passed

                if (response.errors.length) {
                    EventBus.$emit('message', { type: 'error', text: response.errors.join(', ') });
                } else {
                    this.user.photos.push(response.photo); // Add new photo to the user's photos
                    EventBus.$emit('message', { type: 'success', text: 'Photo uploaded successfully!' });
                }
            } catch (error) {
                console.error('Error uploading photo:', error);
                EventBus.$emit('message', { type: 'error', text: 'An error occurred while uploading the photo.' });
            }
        },

        async uploadPhoto(file) {
            const UPLOAD_PHOTO_MUTATION = gql`
                mutation UploadPhoto($input: UploadPhotoInput!) {
                    uploadPhoto(input: $input) {
                        photo {
                            id
                            url
                        }
                        errors
                    }
                }
            `;

            const userId = this.$store.getters.getUserId; // Get the user ID from the store

            // Send file and user_id as 'input' in the mutation
            const { data } = await this.$apollo.mutate({
                mutation: UPLOAD_PHOTO_MUTATION,
                variables: {
                    input: {
                        file: file, // File passed as Upload
                        user_id: userId, // User ID
                    },
                },
            });

            return data.uploadPhoto;
        },

        async updateProfile() {
            const UPDATE_USER_MUTATION = gql`
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
            `;

            const input = {
                id: this.$store.getters.getUserId,
                firstName: this.userDetails.firstName,
                lastName: this.userDetails.lastName,
                email: this.userDetails.email,
                mobileNumber: this.userDetails.mobileNumber,
                birthdate: this.userDetails.birthdate,
                gender: this.userDetails.gender,
                sexualOrientation: this.userDetails.sexualOrientation,
                genderInterest: this.userDetails.genderInterest,
                location: this.userDetails.location,
                bio: this.userDetails.bio,
            };

            try {
                const response = await this.$apollo.mutate({
                    mutation: UPDATE_USER_MUTATION,
                    variables: { input }, // Pass input as an object
                });

                const { updateUser } = response.data;

                if (updateUser.errors.length > 0) {
                    EventBus.$emit('message', { type: 'error', text: updateUser.errors.join(', ') });
                } else {
                    this.$store.dispatch('setUser', updateUser.user);
                    EventBus.$emit('message', { type: 'success', text: 'Profile updated successfully!' });
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                EventBus.$emit('message', { type: 'error', text: 'An unexpected error occurred.' });
            }
        },
    },
};
</script>



<style scoped>
.profile-container {
    padding: 30px;
    max-width: 800px;
    margin: 20px auto;
    background-color: #f7d6d0;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: left;
    gap: 20px;
}

.profile-picture {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid #821d30;
}

.form-group.two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.form-group label {
    font-weight: bold;
    color: #821d30;
    text-align: left;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
}
</style>
