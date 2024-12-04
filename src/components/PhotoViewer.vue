<template>
    <div class="photo-viewer" v-if="isOpen">
        <div class="overlay" @click="closeViewer"></div>
        <div class="viewer-content">
            <button class="nav-button left" @click="prevPhoto">❮</button>
            <img :src="photos[currentPhotoIndex].url" :alt="'Photo ' + (currentPhotoIndex + 1)" class="photo" />
            <button class="nav-button right" @click="nextPhoto">❯</button>
            <button class="close-button" @click="closeViewer">✖</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        photos: {
            type: Array,
            required: true,
        },
        startIndex: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            currentPhotoIndex: this.startIndex,
            isOpen: true,
        };
    },
    methods: {
        closeViewer() {
            this.isOpen = false;
            this.$emit('close');
        },
        prevPhoto() {
            this.currentPhotoIndex =
                (this.currentPhotoIndex - 1 + this.photos.length) % this.photos.length;
        },
        nextPhoto() {
            this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.photos.length;
        },
    },
};
</script>

<style scoped>
.photo-viewer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
}

.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
}

.viewer-content {
    position: relative;
    text-align: center;
}

.photo {
    max-width: 90%;
    max-height: 90%;
    border-radius: 10px;
}

.nav-button {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    z-index: 1100;
}

.nav-button.left {
    left: 10px;
}

.nav-button.right {
    right: 10px;
}

.close-button {
    position: fixed;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    z-index: 1100;
}
</style>
