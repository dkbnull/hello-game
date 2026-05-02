<template>
  <router-link :to="to" class="game-card" v-track="{ category: 'game_card', action: 'click', label: title }">
    <div class="card-preview" :style="{ background: iconBg }">
      <img :src="icon" :alt="title" class="preview-svg"/>
    </div>
    <div class="card-info">
      <h3 class="card-name">{{ title }}</h3>
      <p class="card-desc">{{ description }}</p>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  to: {type: String, required: true},
  icon: {type: String, required: true},
  iconBg: {type: String, default: 'linear-gradient(135deg, #6c5ce7, #a29bfe)'},
  title: {type: String, required: true},
  description: {type: String, default: ''},
  category: {type: String, default: 'classic'},
})
</script>

<style scoped>
.game-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
  background: var(--bg-card);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.card-preview {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-svg {
  width: 100px;
  height: 100px;
  transition: transform 0.3s ease;
}

.game-card:hover .preview-svg {
  transform: scale(1.1);
}

.card-info {
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.card-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
