<template>
  <div class="layout-game" :class="{ 'is-fullscreen': isFullscreen }">
    <main class="main">
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import {useFullscreen} from '@/composables/useFullscreen.js'

const {isFullscreen} = useFullscreen()
</script>

<style scoped>
.layout-game {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.layout-game.is-fullscreen {
  overflow: hidden;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}
</style>
