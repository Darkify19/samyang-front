<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="registerUser" class="register-form">
      <!-- Form fields -->
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
        <input v-model="mobileNumber" placeholder="Mobile Number" />
      </div>
      <div class="form-group">
        <h3>Birthdate:</h3>
        <input v-model="birthdate" type="date" required />
      </div>
      <div class="form-group">
        <select v-model="gender" required>
          <option disabled value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Non-binary</option>
          <option>Other</option>
        </select>
        <input v-if="gender === 'Other'" v-model="customGender" placeholder="Custom Gender" />
      </div>
      <div class="form-group">
        <select v-model="sexualOrientation" required>
          <option disabled value="">Select Sexual Orientation</option>
          <option>Heterosexual</option>
          <option>Homosexual</option>
          <option>Bisexual</option>
          <option>Asexual</option>
          <option>Other</option>
        </select>
        <input v-if="sexualOrientation === 'Other'" v-model="customSexualOrientation"
          placeholder="Custom Sexual Orientation" />
      </div>
      <div class="form-group">
        <select v-model="genderInterest" required>
          <option disabled value="">Select Gender Interest</option>
          <option>Male</option>
          <option>Female</option>
          <option>Non-binary</option>
          <option>Any</option>
          <option>Other</option>
        </select>
        <input v-if="genderInterest === 'Other'" v-model="customGenderInterest" placeholder="Custom Gender Interest" />
      </div>
      <div class="form-group">
        <input v-model="location" placeholder="Location (e.g., City, Region, Country)" required />
      </div>
      <div class="form-group">
        <textarea v-model="bio" placeholder="Bio"></textarea>
      </div>
      <button type="submit" class="register-btn">Register</button>
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
            gender: this.gender === 'Other' ? this.customGender : this.gender,
            sexualOrientation: this.sexualOrientation === 'Other' ? this.customSexualOrientation : this.sexualOrientation,
            genderInterest: this.genderInterest === 'Other' ? this.customGenderInterest : this.genderInterest,
            location: this.location,
            bio: this.bio,
          },
        });

        const { registerUser } = response.data;

        if (registerUser.errors.length > 0) {
          EventBus.$emit('message', {
            type: 'error',
            text: registerUser.errors.join(', '),
          });
        } else {
          EventBus.$emit('message', {
            type: 'success',
            text: 'User registered successfully! Proceed to Login',
          });
        }
      } catch (error) {
        console.error('Error creating user:', error);
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
.register-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 25px;
  background-color: #F7D6D0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {

  font-size: 1.8rem;
}

h3 {
  text-align: left;
  color: #821d30;
  margin-bottom: 8px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

input,
textarea,
select {
  padding: 10px;
  border: 2px solid #f38592;
  border-radius: 5px;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #d6517c;
}

textarea {
  min-height: 60px;
  resize: vertical;
}

.register-btn {
  padding: 12px;
  background-color: #821d30;
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register-btn:hover {
  background-color: #d6517c;
}
</style>