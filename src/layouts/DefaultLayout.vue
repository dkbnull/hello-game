<template>
  <div class="layout-default">
    <Header/>
    <main class="main">
      <router-view/>
    </main>
    <Footer/>
  </div>
</template>

<script setup>
</script>

<style scoped>
.layout-default {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: 1.5rem 0;
  padding-top: var(--header-height);
}
</style>
