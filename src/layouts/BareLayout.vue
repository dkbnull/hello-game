<template>
  <div class="layout-bare">
    <main class="main">
      <router-view/>
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.layout-bare {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}
</style>
