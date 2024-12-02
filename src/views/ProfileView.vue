<template>
    <div>
        <HeaderComponent />
        <ProfileComponent />
        <FooterComponent />
    </div>
</template>

<script>
import HeaderComponent from './HeaderComponent.vue';
import ProfileComponent from '../components/ProfileComponent.vue';
import FooterComponent from './FooterComponent.vue';

export default {
    components: {
        HeaderComponent,
        ProfileComponent,
        FooterComponent,
    },
};
</script>