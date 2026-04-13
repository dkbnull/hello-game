<template>
  <div class="game-page">
    <div class="game-top-bar container">
      <router-link to="/" class="back-link">
        <span class="back-arrow">←</span> 返回首页
      </router-link>
    </div>
    <div class="game-center-area container">
      <h1 class="game-title">{{ title }}</h1>
      <div class="game-actions">
        <slot name="actions"></slot>
      </div>
      <div class="game-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {type: String, required: true},
})
</script>

<style scoped>
.game-page {
  min-height: calc(100vh - var(--header-height) - var(--footer-height) - 48px);
}

.game-top-bar {
  margin-bottom: 16px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  font-size: 14px;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--primary);
}

.back-arrow {
  font-size: 16px;
}

.game-center-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  text-align: center;
}

.game-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  font-size: 16px;
}

.game-body {
  display: flex;
  justify-content: center;
}
</style>
