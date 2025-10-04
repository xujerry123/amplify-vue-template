<!-- src/components/Home.vue -->
<template>
  <div class="home-container">
    <h2>Welcome to My App</h2>
    <p>This is a simple welcome page for our application. Explore our features and join us!</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
});
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 80px auto 20px; /* Offset for fixed navbar */
  padding: 20px;
}
</style>