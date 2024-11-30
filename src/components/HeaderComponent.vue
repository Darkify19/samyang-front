<template>
    <header>
        <nav>
            <ul>
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/profile">Profile</router-link></li>
                <li><router-link to="/login">Login</router-link></li>
                <li><router-link to="/register">Register</router-link></li>

            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'HeaderComponent',
};
</script>

<style scoped>
/* Make the navbar fixed at the top */
header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #821d30;
    z-index: 10;
    box-shadow: 0px 1px;
}

nav ul {
    list-style-type: none;
    margin: 0;
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
