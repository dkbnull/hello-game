<template>
  <div class="layout-toolbar" :class="{ 'is-fullscreen': isFullscreen }">
    <div class="game-toolbar">
      <router-link to="/" class="toolbar-btn toolbar-back" title="返回首页">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>首页</span>
      </router-link>
      <button class="toolbar-btn toolbar-fullscreen" @click="toggleFullscreen"
              :title="isFullscreen ? '退出全屏' : '全屏'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
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
    </div>
    <main class="main">
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import {useFullscreen} from '@/composables/useFullscreen.js'

const {isFullscreen, toggleFullscreen} = useFullscreen()
</script>

<style scoped>
.layout-toolbar {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.layout-toolbar.is-fullscreen {
  overflow: hidden;
}

.game-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  z-index: 100;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.toolbar-btn:hover {
  color: var(--primary);
  background: rgba(108, 92, 231, 0.08);
}

.toolbar-btn svg {
  width: 18px;
  height: 18px;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}
</style>
