<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="registerUser">
      <input v-model="firstName" placeholder="First Name" required />
      <input v-model="lastName" placeholder="Last Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="mobileNumber" placeholder="Mobile Number" />
      <input v-model="birthdate" type="date" placeholder="Birthdate" />
      <input v-model="gender" placeholder="Gender" />
      <input v-model="sexualOrientation" placeholder="Sexual Orientation" />
      <input v-model="genderInterest" placeholder="Gender Interest" />
      <input v-model="location" placeholder="Location" />
      <textarea v-model="bio" placeholder="Bio"></textarea>
      <button type="submit">Register</button>
    </form>

    <!-- Display the registered user -->
    <div v-if="user">
      <h3>User Created:</h3>
      <p>Name: {{ user.firstName }} {{ user.lastName }}</p>
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobileNumber: '',
      birthdate: '',
      gender: '',
      sexualOrientation: '',
      genderInterest: '',
      location: '',
      bio: '',
      user: null, // store user data after registration
      errors: [], // store errors if there are any
    };
  },
  methods: {
    async registerUser() {
      const REGISTER_USER_MUTATION = gql`
        mutation RegisterUser(
          $firstName: String!,
          $lastName: String!,
          $email: String!,
          $password: String!,
          $mobileNumber: String,
          $birthdate: String,
          $gender: String,
          $sexualOrientation: String,
          $genderInterest: String,
          $location: String,
          $bio: String
        ) {
          registerUser(
            input: {
              firstName: $firstName,
              lastName: $lastName,
              email: $email,
              password: $password,
              mobileNumber: $mobileNumber,
              birthdate: $birthdate,
              gender: $gender,
              sexualOrientation: $sexualOrientation,
              genderInterest: $genderInterest,
              location: $location,
              bio: $bio
            }
          ) {
            user {
              id
              firstName
              lastName
              email
              mobileNumber
              birthdate
              gender
              sexualOrientation
              genderInterest
              location
              bio
            }
            errors
          }
        }
      `;

      try {
        const response = await this.$apollo.mutate({
          mutation: REGISTER_USER_MUTATION,
          variables: {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            mobileNumber: this.mobileNumber,
            birthdate: this.birthdate,
            gender: this.gender,
            sexualOrientation: this.sexualOrientation,
            genderInterest: this.genderInterest,
            location: this.location,
            bio: this.bio,
          },
        });

        const { registerUser } = response.data;

        if (registerUser.errors.length > 0) {
          this.errors = registerUser.errors;
          this.user = null;
        } else {
          this.user = registerUser.user;
          this.errors = [];
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
