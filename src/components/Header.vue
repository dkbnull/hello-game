<template>
  <header class="app-header">
    <div class="header-inner container">
      <router-link to="/" class="logo-link" @click="goHome">
        <img src="/favicon.svg" alt="Logo" class="logo-icon"/>
        <span class="logo-text">Hello Game</span>
      </router-link>
      <nav :class="['header-nav', { 'nav-open': menuOpen }]">
        <router-link to="/" class="nav-link" :class="{ 'router-link-exact-active': route.path === '/' }"
                     @click="goHome">首页
        </router-link>
        <button
            v-for="section in GAME_SECTIONS"
            :key="section.key"
            class="nav-link nav-section"
            @click="scrollToSection(section.key)"
        >
          {{ section.title }}
        </button>
        <router-link to="/about" class="nav-link">关于</router-link>
        <button class="fullscreen-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏'">
          <svg class="fullscreen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <template v-if="!isFullscreen">
              <path d="M4 8V4h4M4 4l4 4M16 4h4v4M20 4l-4 4M4 16v4h4M4 20l4-4M16 20h4v-4M20 20l-4-4"/>
            </template>
            <template v-else>
              <path
                  d="M8 8L4 4M8 8H4M8 8V4M16 8L20 4M16 8h4M16 8V4M8 16L4 20M8 16H4M8 16v4M16 16L20 20M16 16h4M16 16v4"/>
            </template>
          </svg>
        </button>
      </nav>
      <button
          class="menu-toggle"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
          @click="menuOpen = !menuOpen"
      >
        <span :class="['hamburger', { active: menuOpen }]">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
  </header>
</template>

<script setup>
import {useFullscreen} from '@/composables/useFullscreen.js'
import {GAME_SECTIONS} from '@/data/games.js'

const {isFullscreen, toggleFullscreen} = useFullscreen()

const route = useRoute()
const router = useRouter()

const menuOpen = ref(false)

const goHome = async () => {
  menuOpen.value = false
  if (route.path !== '/') {
    await router.push('/')
  }
  await nextTick()
  window.scrollTo({top: 0, behavior: 'smooth'})
}

const scrollToSection = async (key) => {
  menuOpen.value = false
  if (route.path !== '/') {
    await router.push('/')
    await nextTick()
  }
  await nextTick()
  const el = document.getElementById(`section-${key}`)
  if (el) {
    el.scrollIntoView({behavior: 'smooth', block: 'start'})
  }
}

watch(route, () => {
  menuOpen.value = false
})
</script>

<style scoped>
.app-header {
  height: var(--header-height);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
}

.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  width: 36px;
  height: 36px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-nav {
  display: flex;
  gap: 4px;
  align-items: center;
}

.nav-link,
.nav-section {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.router-link-exact-active,
.nav-section:hover {
  color: var(--primary);
  background: rgba(108, 92, 231, 0.08);
}

.nav-section {
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  line-height: inherit;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.fullscreen-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--text-secondary);
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
}

.fullscreen-btn:hover {
  color: var(--primary);
  background: rgba(108, 92, 231, 0.08);
}

.fullscreen-icon {
  width: 20px;
  height: 20px;
}

.menu-toggle {
  display: none;
  padding: var(--spacing-sm);
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 22px;
}

.hamburger span {
  display: block;
  height: 2px;
  background-color: var(--text-primary);
  border-radius: 1px;
  transition: all 0.2s;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .header-nav {
    display: none;
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--bg-card);
    border-bottom: 1px solid var(--border);
    padding: var(--spacing-md);
    gap: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .nav-open {
    display: flex;
  }

  .nav-link,
  .nav-section {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
  }
}
</style>
