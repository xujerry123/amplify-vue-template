<!-- src/components/NavBar.vue -->
<template>
  <nav class="navbar">
    <div class="navbar-left">
      <div class="navbar-brand">My App</div>
      <span v-if="isAuthenticated" class="user-name">
        {{ userAttributes.given_name || "" }} {{ userAttributes.family_name || "" }}
      </span>
    </div>
    <ul class="navbar-links">
      <li><router-link to="/home">Home</router-link></li>
      <li><router-link to="/archives">Archives</router-link></li>
      <li v-if="!isAuthenticated">
        <router-link to="/login">Login</router-link>
      </li>
      <li v-else>
        <router-link to="/home" @click="handleSignOut">Logout</router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth";
import { Hub } from "@aws-amplify/core"; // Import Hub from @aws-amplify/core

interface UserAttributes {
  given_name?: string;
  family_name?: string;
}

export default defineComponent({
  name: "NavBar",
  data(): {
    isAuthenticated: boolean;
    userAttributes: UserAttributes;
  } {
    return {
      isAuthenticated: false,
      userAttributes: {},
    };
  },
  created() {
    // Initial auth state check
    this.checkAuthState();
    // Listen for auth events
    Hub.listen("auth", ({ payload: { event } }) => {
      console.log("Auth event:", event); // Debug
      if (event === "signIn") {
        this.checkAuthState();
      } else if (event === "signOut") {
        this.isAuthenticated = false;
        this.userAttributes = {};
      }
    });
  },
  methods: {
    async checkAuthState() {
      try {
        await getCurrentUser();
        this.isAuthenticated = true;
        const attributes = await fetchUserAttributes();
        console.log("NavBar attributes:", attributes); // Debug
        this.userAttributes = {
          given_name: attributes.given_name,
          family_name: attributes.family_name,
        };
      } catch (error) {
        this.isAuthenticated = false;
        this.userAttributes = {};
        console.log("Not authenticated:", error);
      }
    },
    async handleSignOut() {
      try {
        await signOut();
        this.isAuthenticated = false;
        this.userAttributes = {};
        this.$router.push("/home");
      } catch (error: any) {
        console.error("Sign-out error:", error);
      }
    },
  },
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #007bff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-sizing: border-box;
  z-index: 1000;
}
.navbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}
.navbar-brand {
  font-size: 1.5em;
  font-weight: bold;
  white-space: nowrap;
}
.user-name {
  font-size: 1em;
  white-space: nowrap;
}
.navbar-links {
  list-style: none;
  display: flex;
  gap: 15px;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
  max-width: 70%;
}
.navbar-links li {
  display: flex;
  align-items: center;
}
.navbar-links a {
  color: white;
  text-decoration: none;
  font-size: 1em;
}
.navbar-links a:hover {
  text-decoration: underline;
}
@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }
  .navbar-left {
    flex-direction: column;
    align-items: flex-start;
  }
  .navbar-links {
    margin-top: 10px;
    max-width: 100%;
  }
}
</style>