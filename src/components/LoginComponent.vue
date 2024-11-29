<template>
    <div>
        <h2>Login</h2>
        <input v-model="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button @click="loginUser">Login</button>

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
            email: '',
            password: '',
            errors: [],
        };
    },
    methods: {
        async loginUser() {
            const LOGIN_USER_MUTATION = gql`
          mutation LoginUser($input: LoginUserInput!) {
            loginUser(input: $input) {
              user {
                id
                email
              }
              errors
            }
          }
        `;

            try {
                const response = await this.$apollo.mutate({
                    mutation: LOGIN_USER_MUTATION,
                    variables: {
                        input: {
                            email: this.email,
                            password: this.password,
                        },
                    },
                });

                const { loginUser } = response.data;

                if (loginUser.errors.length > 0) {
                    this.errors = loginUser.errors;
                } else {
                    // handle successful login, perhaps store user in a global state
                    this.errors = [];
                }
            } catch (error) {
                console.error('Error logging in:', error);
                this.errors = ['An unexpected error occurred'];
            }
        },
    },
};
</script>