<template>
  <div class="app" :class="{ 'is-game': isGamePage }">
    <Header/>
    <main class="main">
      <router-view/>
    </main>
    <Footer v-if="!isGamePage"/>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const isGamePage = computed(() => route.name !== 'Home')
</script>

<style scoped>
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.app.is-game .main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.main {
  flex: 1;
  padding: 1.5rem 0;
}
</style>
