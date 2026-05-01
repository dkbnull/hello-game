<template>
  <div class="layout-game">
    <Header/>
    <main class="main">
      <router-view/>
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.layout-game {
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
