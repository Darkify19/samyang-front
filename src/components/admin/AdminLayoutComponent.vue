<template>
    <div class="admin-layout">
        <header>
            <h1>Admin Dashboard</h1>
            <nav>

            </nav>
        </header>
        <main>
            <router-view /> <!-- Render the admin pages here -->
        </main>
    </div>
</template>

<script>
export default {
    name: 'AdminLayoutComponent',
};
</script>

<style scoped>
.admin-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f4f4f4;
}

header {
    background-color: #821d30;
    color: white;
    padding: 15px 20px;
    border-radius: 8px 8px 0 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}

header h1 {
    margin: 0;
    font-size: 1.8rem;
}

nav ul {
    list-style-type: none;
    padding: 0;
    margin: 10px 0 0 0;
}

nav ul li {
    display: inline-block;
    margin-right: 20px;
}

nav ul li:last-child {
    margin-right: 0;
}

nav ul li a {
    text-decoration: none;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    transition: color 0.3s ease;
}

nav ul li a:hover {
    color: #f38592;
}

main {
    flex: 1;
    padding: 20px;
    background-color: white;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    header h1 {
        font-size: 1.5rem;
    }

    nav ul li {
        display: block;
        margin-bottom: 15px;
    }

    nav ul li:last-child {
        margin-bottom: 0;
    }
}
</style>
