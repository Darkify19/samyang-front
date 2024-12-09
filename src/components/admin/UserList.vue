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
                        <img :src="user.photos[0]?.url || $defaultPlaceholder" alt="User photo" class="user-photo" />
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
            const confirmation = confirm("Are you sure you want to delete this user?");
            if (!confirmation) return;

            try {
                const response = await this.$apollo.mutate({
                    mutation: gql`
                        mutation DeleteUser($input: DeleteUserInput!) {
                            deleteUser(input: $input) {
                                success
                                errors
                            }
                        }
                    `,
                    variables: { input: { id } },
                });

                const { success, errors } = response.data.deleteUser;

                if (success) {
                    this.users = this.users.filter((user) => user.id !== id);
                    alert("User deleted successfully.");
                } else {
                    alert(`Failed to delete user: ${errors.join(", ")}`);
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("An unexpected error occurred while deleting the user.");
            }
        },
        // Fetch users from the GraphQL API
        async fetchUsers() {
            try {
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
            } catch (error) {
                console.error("Error fetching users:", error);
                alert("An error occurred while fetching users.");
            }
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
