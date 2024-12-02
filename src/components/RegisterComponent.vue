<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="registerUser" class="register-form">
      <!-- Left Column -->
      <div class="form-column">
        <h3>User Information:</h3>

        <div class="form-group">
          <input v-model="firstName" placeholder="First Name" required />
        </div>
        <div class="form-group">
          <input v-model="lastName" placeholder="Last Name" required />
        </div>
        <div class="form-group">
          <input v-model="email" type="email" placeholder="Email" required />
        </div>
        <div class="form-group">
          <input v-model="password" type="password" placeholder="Password" required />
        </div>
        <div class="form-group">
          <input v-model="passwordConfirmation" type="password" placeholder="Confirm Password" required />
        </div>
        <div class="form-group">
          <input v-model="mobileNumber" placeholder="Mobile Number" />
        </div>
        <button type="submit" class="register-btn">Register</button>
      </div>

      <!-- Right Column -->
      <div class="form-column">
        <div class="form-group">
          <h3>Birthdate:</h3>
          <input v-model="birthdate" type="date" required />
        </div>
        <div class="form-group">
          <h3>Gender:</h3>
          <select v-model="gender" required>
            <option value="" disabled selected>Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-group">
          <h3>Sexual Orientation:</h3>
          <select v-model="sexualOrientation" required>
            <option value="" disabled selected>Select Sexual Orientation</option>
            <option>Heterosexual</option>
            <option>Homosexual</option>
            <option>Bisexual</option>
            <option>Asexual</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-group">
          <h3>Gender Preference:</h3>
          <select v-model="genderInterest" required>
            <option value="" disabled selected>Select Gender Interest</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Any</option>
          </select>
        </div>
        <div class="form-group">
          <input v-model="location" placeholder="Location (e.g., City, Region, Country)" required />
        </div>
        <div class="form-group">
          <textarea v-model="bio" placeholder="Bio"></textarea>
        </div>
      </div>

      <input type="hidden" :value="authenticityToken" name="authenticity_token" />
    </form>
  </div>
</template>


<script>
import { gql } from '@apollo/client/core';
import { EventBus } from '@/eventBus';

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      mobileNumber: '',
      birthdate: '',
      gender: '',
      sexualOrientation: '',
      genderInterest: '',
      location: '',
      bio: '',
      customGender: '',
      customSexualOrientation: '',
      customGenderInterest: '',
      authenticityToken: document.querySelector('meta[name="csrf-token"]').getAttribute('content'), // Authenticity token
    };
  },
  methods: {
    async registerUser() {
      // Check for missing fields
      if (!this.firstName || !this.lastName || !this.email || !this.password || !this.passwordConfirmation) {
        EventBus.$emit('message', { type: 'error', text: 'Please fill in all required fields.' });
        return;
      }

      // Ensure passwords match
      if (this.password !== this.passwordConfirmation) {
        EventBus.$emit('message', { type: 'error', text: 'Passwords do not match.' });
        return;
      }


      const REGISTER_USER_MUTATION = gql`
        mutation RegisterUser(
          $firstName: String! 
          $lastName: String! 
          $email: String! 
          $password: String! 
          $passwordConfirmation: String! 
          $mobileNumber: String 
          $birthdate: String 
          $gender: String 
          $sexualOrientation: String 
          $genderInterest: String 
          $location: String 
          $bio: String
        ) {
          registerUser(
            input: {
              firstName: $firstName,
              lastName: $lastName,
              email: $email,
              password: $password,
              passwordConfirmation: $passwordConfirmation,
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
            passwordConfirmation: this.passwordConfirmation,
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
          EventBus.$emit('message', { type: 'error', text: registerUser.errors.join(', ') });
        } else {
          EventBus.$emit('message', { type: 'success', text: 'User registered successfully! Proceed to Login.' });
        }
      } catch (error) {
        console.error('Error creating user:', error);
        EventBus.$emit('message', { type: 'error', text: 'An unexpected error occurred.' });
      }
    },
  },
};
</script>



<style scoped>
.register-container {
  max-width: 900px;
  margin: 7px auto;
  padding: 20px;
  background-color: #F7D6D0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
}

h3 {
  text-align: left;
  color: #821d30;
  margin-bottom: 0;
  margin-top: 0;
}

.register-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  grid-auto-rows: minmax(100px, auto);
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.register-btn {
  padding: 12px;
  background-color: #821d30;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register-btn:hover {
  background-color: #d6517c;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .register-form {
    grid-template-columns: 1fr;
    /* Stack columns on smaller screens */
  }
}
</style>