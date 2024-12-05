<template>
    <div class="profile-container container">
        <h2>User Profile</h2>
        <div class="user-info" v-if="user">
            <!-- Profile Picture Display -->
            <img :src="userPhotos.length ? userPhotos[0].url : $defaultPlaceholder" class="profile-picture" />
            <p v-if="!userPhotos.length">You have not yet uploaded any photos. Please upload.</p>
            <p v-if="userPhotos.length <= 5"> Click the photos for a preview. </p>

            <!-- Cloudinary Upload Button -->
            <button @click="openCloudinaryWidget" class="upload-button" :disabled="userPhotos.length >= 5">
                Upload Photo
            </button>
            <p v-if="userPhotos.length >= 5">You can only upload up to 5 photos.</p>

            <!-- Current Photos Gallery -->
            <div class="current-photos" v-if="userPhotos.length">
                <h3>Current Photos</h3>
                <div class="photo-gallery">
                    <div v-for="(photo, index) in userPhotos" :key="photo.id" class="photo-item">
                        <img :src="photo.url" :alt="'Photo ' + (index + 1)" class="thumbnail"
                            @click="openPhotoViewer(index)" />
                        <button class="delete-photo-btn" @click="deletePhoto(photo.id)"
                            :disabled="photo.position === 1">
                            X
                        </button>
                    </div>
                </div>
            </div>

            <!-- Photo Viewer Component -->
            <PhotoViewer v-if="showPhotoViewer" :photos="userPhotos" :startIndex="currentPhotoIndex"
                @close="showPhotoViewer = false" />

            <!-- User Info Update Form -->
            <form @submit.prevent="updateProfile" class="form-group two-columns">
                <div v-for="(value, key) in userDetails" :key="key" class="form-item">
                    <label :for="key">{{ formatLabel(key) }}:</label>

                    <!-- Conditional Rendering of Input Fields -->
                    <input v-if="key !== 'bio' && !['gender', 'sexualOrientation', 'genderInterest'].includes(key)"
                        :id="key" v-model="userDetails[key]" :type="getInputType(key)"
                        :placeholder="'Enter your ' + formatLabel(key)" />
                    <textarea v-if="key === 'bio'" :id="key" v-model="userDetails[key]"
                        placeholder="Tell us about yourself"></textarea>

                    <!-- Select Fields for Gender/Sexual Orientation -->
                    <select v-else-if="['gender', 'sexualOrientation', 'genderInterest'].includes(key)"
                        v-model="userDetails[key]" :id="key" required>
                        <option value="" disabled selected>
                            Select {{ formatLabel(key) }}
                        </option>
                        <option v-for="option in getOptionsForSelect(key)" :key="option" :value="option">
                            {{ option }}
                        </option>
                    </select>
                </div>
                <button type="submit">
                    <i class="fa fa-save"></i> Save Changes
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import { gql } from '@apollo/client/core';
import { EventBus } from '@/eventBus';
import { openCloudinaryWidget } from '@/utils/cloudinaryUploader';
import PhotoViewer from '@/components/PhotoViewer.vue';

export default {
    components: {
        PhotoViewer,
    },
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
            userPhotos: [],
            showPhotoViewer: false,
            currentPhotoIndex: 0,
            defaultPlaceholder: this.defaultPlaceholder,
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
                    this.userDetails = Object.keys(this.userDetails).reduce((details, key) => {
                        details[key] = newValue[key] || '';
                        return details;
                    }, {});
                    // Load user photos from fetched user data
                    this.userPhotos = newValue.photos || [];
                }
            },
        },
    },
    mounted() {
        this.fetchUserPhotos();
    },
    methods: {
        async deletePhoto(photoId) {
            const DELETE_PHOTO_MUTATION = gql`
                mutation DeletePhoto($input: DeletePhotoInput!) {
                    deletePhoto(input: $input) {
                        success
                        errors
                    }
                }
            `;

            try {
                const { data } = await this.$apollo.mutate({
                    mutation: DELETE_PHOTO_MUTATION,
                    variables: { input: { userId: this.user.id, photoId } },
                });

                const { deletePhoto } = data;
                if (!deletePhoto.success) {
                    throw new Error(deletePhoto.errors.join(", "));
                }

                this.userPhotos = this.userPhotos.filter(photo => photo.id !== photoId);
                EventBus.$emit('message', { type: 'success', text: 'Photo deleted successfully!' });
            } catch (error) {
                console.error('Error deleting photo:', error);
                EventBus.$emit('message', { type: 'error', text: 'Failed to delete photo.' });
            }
        },
        replacePrimaryPhoto() {
            openCloudinaryWidget((info) => {
                this.uploadPhotoToBackend(info.secure_url, true);
            });
        },
        async uploadPhotoToBackend(url, isPrimary = false) {
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

            try {
                const { data } = await this.$apollo.mutate({
                    mutation: UPLOAD_PHOTO_MUTATION,
                    variables: { input: { userId: this.user.id, url, isPrimary } },
                });

                const { uploadPhoto } = data;
                if (uploadPhoto.errors.length) {
                    EventBus.$emit('message', { type: 'error', text: uploadPhoto.errors.join(', ') });
                } else {
                    if (isPrimary) {
                        this.userPhotos = [uploadPhoto.photo, ...this.userPhotos.slice(1)];
                    } else {
                        this.userPhotos = [...this.userPhotos, uploadPhoto.photo];
                    }
                }
            } catch (error) {
                console.error('Error uploading photo:', error);
                EventBus.$emit('message', { type: 'error', text: 'Failed to upload photo.' });
            }
        },
        openPhotoViewer(index) {
            this.currentPhotoIndex = index;
            this.showPhotoViewer = true;
        },
        async fetchUserPhotos() {
            const GET_USER_PHOTOS_QUERY = gql`
                query GetUserPhotos($id: ID!) {
                    user(id: $id) {
                        photos {
                            id
                            url
                        }
                    }
                }
            `;

            try {
                const { data } = await this.$apollo.query({
                    query: GET_USER_PHOTOS_QUERY,
                    variables: { id: this.$store.getters.getUserId },
                });

                if (data && data.user) {
                    this.userPhotos = data.user.photos || [];
                }
            } catch (error) {
                console.error('Error fetching photos:', error);
                EventBus.$emit('message', { type: 'error', text: 'Failed to load photos.' });
            }
        },
        formatLabel(key) {
            return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        },
        getInputType(key) {
            const dateFields = ['birthdate'];
            const emailFields = ['email'];
            if (dateFields.includes(key)) return 'date';
            if (emailFields.includes(key)) return 'email';
            return ['gender', 'sexualOrientation', 'genderInterest'].includes(key) ? 'select' : 'text';
        },
        getOptionsForSelect(key) {
            const options = {
                gender: ['Male', 'Female', 'Non-binary', 'Other'],
                sexualOrientation: ['Straight', 'Gay', 'Bisexual', 'Lesbian', 'Asexual', 'Other'],
                genderInterest: ['Male', 'Female', 'Non-binary', 'Everyone'],
            };
            return options[key] || [];
        },
        openCloudinaryWidget() {
            openCloudinaryWidget((info) => {
                if (this.userPhotos.length >= 5) return; // Limit to 5 photos
                this.uploadPhotoToBackend(info.secure_url);
            });
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
                            photos {
                                id
                                url
                            }
                        }
                        errors
                    }
                }
            `;

            const input = { id: this.$store.getters.getUserId, ...this.userDetails };

            try {
                const { data } = await this.$apollo.mutate({
                    mutation: UPDATE_USER_MUTATION,
                    variables: { input },
                });

                const { updateUser } = data;
                if (updateUser.errors.length) {
                    EventBus.$emit('message', { type: 'error', text: updateUser.errors.join(', ') });
                } else {
                    this.$store.dispatch('setUser', updateUser.user);
                    this.userPhotos = updateUser.user.photos || [];
                    EventBus.$emit('message', { type: 'success', text: 'Profile updated successfully!' });
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                EventBus.$emit('message', { type: 'error', text: 'Unexpected error occurred.' });
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

.current-photos {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.photo-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.photo-item {
    position: relative;
    display: inline-block;
}

.thumbnail {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    padding: 3px;
}

.delete-photo-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: transparent;
    color: red;
    font-weight: bold;
    font-size: 16px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease;
}

.delete-photo-btn:hover {
    background-color: #d6517c;
}

.delete-photo-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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