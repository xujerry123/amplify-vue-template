<!-- src/components/Archives.vue -->
<template>
  <div class="archives-container">
    <h2>Archives</h2>
    <p>Testing message 1: Welcome to the archives section.</p>
    <p>Testing message 2: This is a placeholder for archived content.</p>
    <p>Testing message 3: More features coming soon!</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Archives",
});
</script>

<style scoped>
.archives-container {
  max-width: 800px;
  margin: 80px auto 20px; /* Offset for fixed navbar */
  padding: 20px;
}
</style>