<template>
  <div class="game-page">
    <div class="game-center-area">
      <template v-if="hero">
        <div v-if="$slots.actions" class="game-actions">
          <slot name="actions"></slot>
        </div>
        <div v-if="$slots.actionsBottom" class="game-actions-bottom">
          <slot name="actionsBottom"></slot>
        </div>
      </template>
      <template v-else>
        <h1 class="game-title">{{ title }}</h1>
        <div v-if="$slots.actions" class="game-actions">
          <slot name="actions"></slot>
        </div>
        <div v-if="$slots.actionsBottom" class="game-actions-bottom">
          <slot name="actionsBottom"></slot>
        </div>
      </template>
      <div class="game-body">
        <slot></slot>
      </div>
      <slot name="overlay"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {type: String, default: ''},
  hero: {type: Boolean, default: false},
})
</script>

<style scoped>
.game-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.game-center-area {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  min-height: 0;
  overflow: hidden;
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
}

.game-title {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #6c5ce7, #a855f7, #ec4899);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGradientShift 4s ease infinite;
}

@keyframes titleGradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.game-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.game-actions-bottom {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.game-body {
  flex: 1;
  display: flex;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
  width: 100%;
}

@media (max-width: 768px) {
  .game-center-area {
    padding: 8px 8px;
  }

  .game-title {
    font-size: 18px;
    margin-bottom: 6px;
  }

  .game-actions {
    gap: 6px;
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {
  .game-title {
    font-size: 16px;
    margin-bottom: 4px;
  }

  .game-actions {
    gap: 4px;
    margin-bottom: 6px;
  }
}
</style>
