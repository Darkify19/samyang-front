<template>
    <header>
        <div class="logo-container">
            <img :src="$myLogo1" alt="Logo" class="logo" />
        </div>
        <nav>
            <ul :class="{ 'mobile-menu': isMobile && isMenuOpen }">
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
            <button v-if="isMobile" @click="toggleMenu" class="hamburger">
                <i class="fas" :class="isMenuOpen ? 'fa-times' : 'fa-bars'"></i>
            </button>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'HeaderComponent',
    data() {
        return {
            isMobile: false,
            isMenuOpen: false,
        };
    },
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkMobile);
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
            this.$router.push({ path: '/' });
        },
        checkMobile() {
            this.isMobile = window.innerWidth <= 768;
            if (!this.isMobile) {
                this.isMenuOpen = false; // Close menu on desktop
            }
        },
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
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
}

.logo {
    width: 200px;
    margin-left: 40px;
    height: auto;
}

nav ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    text-align: right;
    display: flex;
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

/* Hamburger button for mobile */
.hamburger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
}

.hamburger i {
    color: white;
    font-size: 24px;
}

/* Mobile specific styles */
@media (max-width: 768px) {
    nav ul {
        display: none;
        flex-direction: column;
        width: 100%;
        text-align: center;
        background-color: #821d30;
        position: absolute;
        top: 60px;
        left: 0;
        padding: 10px 0;
    }

    nav ul.mobile-menu {
        display: flex;
    }

    nav ul li {
        display: block;
        margin-right: 0;
        padding: 10px;
    }

    .hamburger {
        display: block;
    }
}
</style>
