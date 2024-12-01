<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="loginUser" class="login-form">
            <div class="form-group">
                <input v-model="email" type="email" placeholder="Email" required />
            </div>
            <div class="form-group">
                <input v-model="password" type="password" placeholder="Password" required />
            </div>
            <button type="submit" class="login-btn">Login</button>
        </form>
    </div>
</template>

<script>
import { gql } from '@apollo/client/core';
import { EventBus } from '@/eventBus'; // Ensure EventBus is correctly imported

export default {
    data() {
        return {
            email: '',
            password: '',
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
      firstName
      lastName
      mobileNumber
      birthdate
      gender
      sexualOrientation
      genderInterest
      location
      bio
      photos
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
                    // Emit error messages using EventBus
                    EventBus.$emit('message', {
                        type: 'error',
                        text: loginUser.errors.join(', '),  // Join multiple errors
                    });
                } else {
                    // Emit success message using EventBus
                    EventBus.$emit('message', {
                        type: 'success',
                        text: 'Login successful! Ready to find your match? Let’s get started! 💖',  // Success message
                    });

                    // Store user data in Vuex
                    this.$store.dispatch('setUser', loginUser.user);

                    // Redirect to profile page
                    this.$router.push({ name: 'profile' });

                    // Optionally reset form fields
                    this.email = '';
                    this.password = '';
                }
            } catch (error) {
                console.error('Error logging in:', error);
                // Emit unexpected error message using EventBus
                EventBus.$emit('message', {
                    type: 'error',
                    text: 'An unexpected error occurred.',
                });
            }
        },
    },
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    background-color: #F7D6D0;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h2 {
    margin-bottom: 20px;
    font-size: 1.8rem;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.login-btn {
    padding: 10px 15px;
    background-color: #821d30;
    color: #ffffff;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.login-btn:hover {
    background-color: #a61717;
}

ul {
    margin: 0;
    padding-left: 20px;
    list-style: disc;
}

li {
    margin: 5px 0;
}
</style>