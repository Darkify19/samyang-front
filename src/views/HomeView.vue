<template>
  <div>
    <HeaderComponent />
    <h1>Welcome to the Dating App</h1>
    <p>Please register or login to continue</p>
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  components: {
    HeaderComponent,
    FooterComponent,
  },
};
</script>
