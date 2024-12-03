<template>
    <div class="user-list">
        <h2>User Manager</h2>
        <table>
            <thead>
                <tr>
                    <th>Primary Photo</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>
                        <img :src="user.photos[0]?.url || $myLogo" alt="User photo" class="user-photo" />
                    </td>
                    <td>{{ user.firstName }}</td>
                    <td>{{ user.lastName }}</td>
                    <td>
                        <button @click="viewUser(user.id)">View</button>
                        <button @click="editUser(user.id)">Edit</button>
                        <button @click="deleteUser(user.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { gql } from '@apollo/client/core';

export default {
    data() {
        return {
            users: [], // Store for users
        };
    },
    methods: {
        // View user profile
        viewUser(id) {
            this.$router.push({ name: 'userProfile', params: { id } });
        },
        // Edit user profile
        editUser(id) {
            this.$router.push({ name: 'editUser', params: { id } });
        },
        // Delete user
        async deleteUser(id) {
            // Send GraphQL mutation to delete user
            const response = await this.$apollo.mutate({
                mutation: gql`
            mutation DeleteUser($id: ID!) {
              deleteUser(id: $id)
            }
          `,
                variables: { id },
            });
            if (response.data.deleteUser) {
                this.users = this.users.filter(user => user.id !== id);
            }
        },
        // Fetch users from the GraphQL API
        async fetchUsers() {
            const { data } = await this.$apollo.query({
                query: gql`
            query GetUsers {
              users {
                id
                firstName
                lastName
                photos {
                  url
                }
              }
            }
          `,
            });
            this.users = data.users;
        },
    },
    mounted() {
        this.fetchUsers();
    },
};
</script>

<style scoped>
.user-list {
    margin: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px 12px;
    text-align: left;
}

th {
    background-color: #f4f4f4;
}

.user-photo {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
}

button {
    margin-right: 8px;
}
</style>
