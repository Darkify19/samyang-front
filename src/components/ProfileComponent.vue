<template>
    <div>
        <h2>User Profile</h2>
        <p>Name: {{ user.firstName }} {{ user.lastName }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Location: {{ user.location }}</p>
        <p>Bio: {{ user.bio }}</p>

        <button @click="editProfile">Edit Profile</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                firstName: 'Carl',
                lastName: 'Janzell',
                email: 'carl.oropesa11@gmail.com',
                location: 'Philippines, Laguna, Calamba, 4027',
                bio: 'Ang pogi ko shet',
            },
        };
    },
    methods: {
        editProfile() {
            // navigate to edit profile page or display an edit form
            console.log('Edit profile clicked');
        },
    },
};
</script>