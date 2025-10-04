<!-- src/components/SignUp.vue -->
<template>
  <div class="signup-container">
    <h2>Sign Up</h2>
    <form v-if="!showConfirmation" @submit.prevent="handleSignUp">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="formData.username"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <div class="form-group">
        <label for="phone_number">Phone Number</label>
        <input
          id="phone_number"
          v-model="formData.phone_number"
          type="tel"
          placeholder="Enter your phone number (e.g., +15555555555)"
        />
      </div>
      <div class="form-group">
        <label for="given_name">First Name</label>
        <input
          id="given_name"
          v-model="formData.given_name"
          type="text"
          placeholder="Enter your first name"
        />
      </div>
      <div class="form-group">
        <label for="family_name">Last Name</label>
        <input
          id="family_name"
          v-model="formData.family_name"
          type="text"
          placeholder="Enter your last name"
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
    <form v-else @submit.prevent="handleConfirmSignUp">
      <div class="form-group">
        <label for="confirmationCode">Confirmation Code</label>
        <input
          id="confirmationCode"
          v-model="confirmationCode"
          type="text"
          placeholder="Enter confirmation code"
        />
      </div>
      <button type="submit">Confirm</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { signUp, confirmSignUp, SignUpInput, SignUpOutput, ConfirmSignUpInput } from "aws-amplify/auth";

interface FormData {
  username: string;
  password: string;
  phone_number: string;
  given_name: string;
  family_name: string;
}

export default defineComponent({
  name: "SignUp",
  data(): {
    formData: FormData;
    confirmationCode: string;
    showConfirmation: boolean;
    message: string;
  } {
    return {
      formData: {
        username: "",
        password: "",
        phone_number: "",
        given_name: "",
        family_name: "",
      },
      confirmationCode: "",
      showConfirmation: false,
      message: "",
    };
  },
  methods: {
    async handleSignUp() {
      try {
        // Validate phone number (E.164 format)
        if (this.formData.phone_number && !/^\+\d{10,15}$/.test(this.formData.phone_number)) {
          this.message = "Phone number must be in E.164 format (e.g., +15555555555)";
          return;
        }
        // Validate password (Cognito default: min 8 characters, including uppercase, lowercase, number, special character)
        if (
          this.formData.password.length < 8 ||
          !/[A-Z]/.test(this.formData.password) ||
          !/[a-z]/.test(this.formData.password) ||
          !/[0-9]/.test(this.formData.password) ||
          !/[^A-Za-z0-9]/.test(this.formData.password)
        ) {
          this.message =
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
          return;
        }

        const signUpInput: SignUpInput = {
          username: this.formData.username,
          password: this.formData.password,
          options: {
            userAttributes: {
              email: this.formData.username,
              phone_number: this.formData.phone_number,
              given_name: this.formData.given_name,
              family_name: this.formData.family_name,
            },
          },
        };

        const { isSignUpComplete, userId, nextStep }: SignUpOutput = await signUp(signUpInput);
        this.message = `Sign-up ${isSignUpComplete ? "completed" : "initiated"}`;
        if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
          this.showConfirmation = true;
          this.message = "Please enter the confirmation code sent to your email or phone.";
        } else if (isSignUpComplete) {
          this.$router.push("/login"); // Redirect to login
        }
        console.log("User ID:", userId);
      } catch (error: any) {
        this.message = `Error: ${error.message}`;
        console.error("Sign-up error:", error);
      }
    },
    async handleConfirmSignUp() {
      try {
        const confirmInput: ConfirmSignUpInput = {
          username: this.formData.username,
          confirmationCode: this.confirmationCode,
        };
        const { isSignUpComplete, nextStep } = await confirmSignUp(confirmInput);
        this.message = `Confirmation ${isSignUpComplete ? "successful" : "pending"}`;
        if (isSignUpComplete) {
          this.showConfirmation = false;
          this.$router.push("/login"); // Redirect to login
        }
      } catch (error: any) {
        this.message = `Confirmation error: ${error.message}`;
        console.error("Confirmation error:", error);
      }
    },
  },
});
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.message {
  margin-top: 10px;
  color: #333;
}
</style>