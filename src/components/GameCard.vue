<template>
  <router-link :to="to" class="game-card">
    <div class="card-preview" :style="{ background: iconBg }">
      <span class="preview-emoji">{{ icon }}</span>
    </div>
    <div class="card-info">
      <h3 class="card-name">{{ title }}</h3>
      <p class="card-desc">{{ description }}</p>
      <span class="card-btn" :class="category">{{ tag }}</span>
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
  tag: {type: String, default: ''},
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
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-emoji {
  font-size: 3.5rem;
}

.card-info {
  padding: var(--spacing-lg);
}

.card-name {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.card-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.card-btn {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.card-btn.classic {
  background: rgba(108, 92, 231, 0.1);
  color: var(--primary);
}

.card-btn.edu {
  background: rgba(0, 206, 201, 0.1);
  color: var(--secondary);
}

.card-btn.ninja {
  background: rgba(253, 121, 168, 0.1);
  color: var(--accent);
}
</style>
