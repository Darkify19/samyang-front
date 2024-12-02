<template>
  <div class="home-container" :style="{ backgroundImage: `url(${background})` }">
    <div class="overlay">
      <header class="home-header">
        <img :src="logo" alt="App Logo" class="app-logo" />
        <h1>Welcome to Pairfect</h1>
      </header>
      <div class="description-card">
        <p>
          Where love finds you by discovering meaningful connections, exploring new possibilities, and meeting someone
          who feels like your perfect match.
        </p>
        <p>
          At Pairfect, we believe every love story is unique. Let’s make your story pairfectly unique—because every
          great connection starts with a simple hello.
        </p>
        <h2>Ready to meet your Pairfect match?</h2>
        <button @click="getStarted">Let's Get Started</button>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<script>
import FooterComponent from '@/views/FooterComponent.vue';

export default {
  components: {
    FooterComponent,
  },
  data() {
    return {
      background: this.$myBackground,
      logo: this.$myLogo,
    };
  },
  methods: {
    getStarted() {
      this.$router.push('/register'); // Redirect to register page
    },
  },
};
</script>


<style scoped>
/* Background and container styles */
.home-container {
  width: 100%;
  height: 80vh;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Logo and header */
.home-header {
  text-align: center;
  margin-bottom: 30px;
}

.app-logo {
  width: 120px;
  height: auto;
  margin-bottom: 20px;
}

.home-header h1 {
  color: #d1114d;
  font-size: 3.5rem;
  margin: 0;
}

/* Description card */
.description-card {
  background-color: #fef4f4;
  padding: 30px 20px;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 500px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

.description-card p {
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.description-card h2 {
  color: #821d30;
  font-size: 1.8rem;
  margin-top: 20px;
}

/* Button */
.description-card button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #d1114d;
  color: white;
  font-size: 1.1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.description-card button:hover {
  background-color: #d6517c;
  transform: translateY(-2px);
}
</style>