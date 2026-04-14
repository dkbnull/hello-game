<template>
  <div class="home">
    <section class="hero container">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hello">Hello</span> Game
        </h1>
        <p class="hero-subtitle">寓教于乐，快乐成长 🎮📚</p>
        <p class="hero-desc">经典益智游戏 + 趣味早教学习，让小朋友在游戏中快乐学习</p>
      </div>
    </section>

    <section v-for="section in GAME_SECTIONS" :key="section.key" class="game-section container">
      <h2 class="section-title">
        <span class="section-icon">{{ section.icon }}</span> {{ section.title }}
      </h2>
      <div class="game-grid">
        <GameCard
            v-for="game in getGamesByCategory(section.key)"
            :key="game.to"
            v-bind="game"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import GameCard from '../components/GameCard.vue'
import {GAME_SECTIONS, GAMES} from '../data/games'

function getGamesByCategory(category) {
  return GAMES.filter(g => g.category === category)
}
</script>

<style scoped>
.home {
  padding-bottom: 40px;
}

.hero {
  text-align: center;
  padding: 48px 20px 40px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.hello {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-weight: 500;
}

.hero-desc {
  font-size: 15px;
  color: var(--text-secondary);
}

.game-section {
  margin-bottom: 36px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 22px;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 17px;
  }

  .game-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 32px 16px 24px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 15px;
  }

  .hero-desc {
    font-size: 13px;
  }

  .game-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
