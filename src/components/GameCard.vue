<template>
  <router-link :to="to" class="game-card">
    <div class="card-icon" :style="{ background: iconBg }">
      <span class="icon-emoji">{{ icon }}</span>
    </div>
    <div class="card-info">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-desc">{{ description }}</p>
    </div>
    <span class="card-tag" :class="category">{{ tag }}</span>
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
  tag: {type: String, default: ''},
})
</script>

<style scoped>
.game-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  text-decoration: none;
  color: inherit;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-light);
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-emoji {
  font-size: 28px;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.card-tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.card-tag.classic {
  background: rgba(108, 92, 231, 0.1);
  color: var(--primary);
}

.card-tag.edu {
  background: rgba(0, 206, 201, 0.1);
  color: var(--secondary);
}
</style>
