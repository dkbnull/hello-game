<template>
  <header class="app-header">
    <div class="header-inner container">
      <router-link to="/" class="logo-link">
        <img src="/favicon.svg" alt="Logo" class="logo-icon"/>
        <span class="logo-text">Hello Game</span>
      </router-link>
      <nav class="header-nav">
        <router-link to="/" class="nav-link">首页</router-link>
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
    </div>
  </header>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'

const isFullscreen = ref(false)

function toggleFullscreen() {
  const doc = document.documentElement
  if (!isFullscreen.value) {
    if (doc.requestFullscreen) {
      doc.requestFullscreen().catch(() => {
      })
    } else if (doc.webkitRequestFullscreen) {
      doc.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {
      })
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!(document.fullscreenElement || document.webkitFullscreenElement)
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('webkitfullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
})
</script>

<style scoped>
.app-header {
  height: var(--header-height);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
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
  gap: 8px;
  align-items: center;
}

.nav-link {
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  color: var(--primary);
  background: rgba(108, 92, 231, 0.08);
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
}

.fullscreen-btn:hover {
  color: var(--primary);
  background: rgba(108, 92, 231, 0.08);
}

.fullscreen-icon {
  width: 20px;
  height: 20px;
}
</style>
