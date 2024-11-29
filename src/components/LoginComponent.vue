<template>
  <div>
    <input v-model="name" placeholder="Name" />
    <input v-model="email" placeholder="Email" />
    <button @click="registerUser">Register</button>

    <!-- Display the registered user -->
    <div v-if="user">
      <h3>User Created:</h3>
      <p>Name: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
    </div>

    <!-- Display errors -->
    <div v-if="errors.length">
      <h4>Errors:</h4>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { gql } from '@apollo/client/core';

export default {
  data() {
    return {
      name: '',
      email: '',
      user: null, // store user data after registration
      errors: [], // store errors if there are any
    };
  },
  methods: {
    async registerUser() {
      const REGISTER_USER_MUTATION = gql`
        mutation RegisterUser($input: RegisterUserInput!) {
          registerUser(input: $input) {
            user {
              id
              name
              email
            }
            errors
          }
        }
      `;

      try {
        const response = await this.$apollo.mutate({
          mutation: REGISTER_USER_MUTATION,
          variables: {
            input: {
              email: this.email,
              name: this.name,
            },
          },
        });

        const { registerUser } = response.data;

        if (registerUser.errors.length > 0) {
          this.errors = registerUser.errors; // store errors if any
          this.user = null; // clear user data if registration fails
        } else {
          this.user = registerUser.user; // store the created user data
          this.errors = []; // clear any previous errors
        }
      } catch (error) {
        console.error('Error creating user:', error);
        this.errors = ['An unexpected error occurred'];
        this.user = null;
      }
    },
  },
};
</script>
