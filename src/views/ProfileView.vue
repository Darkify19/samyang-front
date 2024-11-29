<template>
    <div>
        <HeaderComponent />
        <ProfileComponent />
        <FooterComponent />
    </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import ProfileComponent from '../components/ProfileComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
    components: {
        HeaderComponent,
        ProfileComponent,
        FooterComponent,
    },
};
</script>