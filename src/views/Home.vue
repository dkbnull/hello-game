<template>
  <div class="home">
    <section class="hero container">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hello">Hello</span> Game
        </h1>
        <p class="hero-subtitle">寓教于乐，快乐成长 🎮📚</p>
        <p class="hero-desc">经典益智游戏 + 趣味早教学习，让小朋友在游戏中快乐学习</p>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
              v-model="searchQuery"
              class="search-input"
              type="text"
              placeholder="搜索游戏（支持拼音）"
          />
          <span v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</span>
        </div>
      </div>
    </section>

    <section v-if="searchQuery" class="game-section container">
      <h2 class="section-title">
        <span class="section-icon">🔍</span> 搜索结果
      </h2>
      <div v-if="filteredGames.length === 0" class="no-result">
        未找到匹配的游戏
      </div>
      <div v-else class="game-grid">
        <GameCard
            v-for="game in filteredGames"
            :key="game.to"
            v-bind="game"
        />
      </div>
    </section>

    <section v-else v-for="section in GAME_SECTIONS" :key="section.key" class="game-section container">
      <h2 class="section-title">
        <img :src="section.icon" :alt="section.title" class="section-svg"/>
        {{ section.title }}
      </h2>
      <div class="game-grid">
        <GameCard
            v-for="game in getGamesByCategory(section.key)"
            :key="game.to"
            v-bind="game"
        />
      </div>
    </section>

    <transition name="back-top-fade">
      <button
          v-if="showBackToTop"
          @click="backToTop"
          class="back-to-top"
          aria-label="回到顶部"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </transition>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import GameCard from '@/components/GameCard.vue'
import {GAME_SECTIONS, GAMES} from '@/data/games.js'

const searchQuery = ref('')
const showBackToTop = ref(false)

const filteredGames = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  return GAMES.filter(g => {
    const titleMatch = g.title.toLowerCase().includes(q)
    const pinyinMatch = g.pinyin.toLowerCase().includes(q)
    const descMatch = g.description.toLowerCase().includes(q)
    const tagMatch = g.tag.toLowerCase().includes(q)
    return titleMatch || pinyinMatch || descMatch || tagMatch
  })
})

function getGamesByCategory(category) {
  return GAMES.filter(g => g.category === category)
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const backToTop = () => {
  window.scrollTo({top: 0, behavior: 'smooth'})
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
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
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: 24px;
  padding: 8px 16px;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: var(--primary);
}

.search-icon {
  font-size: 16px;
  margin-right: 8px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans), serif;
}

.search-input::placeholder {
  color: var(--text-light);
}

.search-clear {
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  padding: 2px 4px;
  border-radius: 50%;
  transition: all 0.2s;
}

.search-clear:hover {
  color: var(--text-primary);
  background: var(--bg-game);
}

.no-result {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  font-size: 15px;
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

.section-svg {
  width: 28px;
  height: 28px;
  vertical-align: middle;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.35);
  transition: all 0.3s ease;
  z-index: 1000;
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(108, 92, 231, 0.45);
}

.back-to-top:active {
  transform: translateY(-1px) scale(0.97);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 17px;
  }

  .hero-desc {
    margin-bottom: 16px;
  }

  .game-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 42px;
    height: 42px;
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
    margin-bottom: 12px;
  }

  .search-box {
    padding: 6px 12px;
  }

  .search-input {
    font-size: 14px;
  }

  .game-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
