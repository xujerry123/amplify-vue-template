<!-- src/components/UserHome.vue -->
<template>
  <div class="userhome-container">
    <h2>Welcome</h2>
    <p v-if="userAttributes.given_name && userAttributes.family_name">
      Hello, {{ userAttributes.given_name }} {{ userAttributes.family_name }}!
    </p>
    <p v-else-if="errorMessage">Error: {{ errorMessage }}</p>
    <p v-else>Loading user information...</p>
    <button @click="handleSignOut">Sign Out</button>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth";

interface UserAttributes {
  given_name?: string;
  family_name?: string;
}

export default defineComponent({
  name: "UserHome",
  data(): {
    userAttributes: UserAttributes;
    message: string;
    errorMessage: string;
  } {
    return {
      userAttributes: {},
      message: "",
      errorMessage: "",
    };
  },
  async created() {
    try {
      const user = await getCurrentUser();
      console.log("Current user:", user); // Debug: Log user
      const attributes = await fetchUserAttributes();
      console.log("User attributes:", attributes); // Debug: Log attributes
      this.userAttributes = {
        given_name: attributes.given_name,
        family_name: attributes.family_name,
      };
      if (!attributes.given_name || !attributes.family_name) {
        this.errorMessage = "User attributes are incomplete. Please ensure given_name and family_name are set.";
      }
    } catch (error: any) {
      this.errorMessage = `Error fetching user data: ${error.message}`;
      console.error("Error:", error);
      this.$router.push("/login"); // Redirect to login if not authenticated
    }
  },
  methods: {
    async handleSignOut() {
      try {
        await signOut();
        this.message = "Signed out successfully";
        this.$router.push("/login");
      } catch (error: any) {
        this.message = `Sign-out error: ${error.message}`;
        console.error("Sign-out error:", error);
      }
    },
  },
});
</script>

<style scoped>
.userhome-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #c82333;
}
.message {
  margin-top: 10px;
  color: #333;
}
</style>