<template>
    <header>
        <div class="logo-container">
            <img :src="$myLogo1" alt="Logo" class="logo" />
        </div>
        <nav>
            <ul>
                <li><router-link to="/">Home</router-link></li>
                <li v-if="$store.getters.isAuthenticated"><router-link to="/profile">Profile</router-link></li>
                <li v-if="$store.getters.isAuthenticated"><router-link to="/swipe">Swipe</router-link></li>
                <li v-if="$store.getters.isAuthenticated"><router-link to="/matches">Matches</router-link></li>
                <li v-if="!$store.getters.isAuthenticated"><router-link to="/login">Login</router-link></li>
                <li v-if="!$store.getters.isAuthenticated"><router-link to="/register">Register</router-link></li>
                <li v-if="$store.getters.isAuthenticated" @click="logout">
                    <router-link to="#">Logout</router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>


<script>
export default {
    name: 'HeaderComponent',
    methods: {
        logout() {
            // Dispatch the logout action and redirect to the home page
            this.$store.dispatch('logout');
            this.$router.push({ path: '/' });
        },
    },
};
</script>

<style scoped>
/* Navbar styling */
header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #821d30;
    z-index: 10;
    box-shadow: 0px 1px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    box-sizing: border-box;
}

.logo-container {
    flex-shrink: 0;
    /* Prevents logo from shrinking */
}

.logo {
    width: 150px;
    margin-left: 40px;
    position: static;
    /* Adjust size as needed */
    height: auto;
}

nav ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    text-align: right;
}

nav ul li {
    display: inline;
    margin-right: 20px;
}

nav ul li a {
    color: white;
    text-decoration: none;
    font-size: 16px;
}

nav ul li a:hover {
    color: #D1114D;
}
</style>
