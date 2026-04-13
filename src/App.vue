<template>
  <div class="app">
    <Header/>
    <main class="main">
      <router-view/>
    </main>
    <Footer/>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: 1.5rem 0;
}
</style>
