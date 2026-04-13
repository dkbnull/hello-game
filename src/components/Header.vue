<template>
  <header class="app-header">
    <div class="header-inner container">
      <router-link to="/" class="logo-link">
        <img src="/favicon.svg" alt="Logo" class="logo-icon"/>
        <span class="logo-text">Hello Game</span>
      </router-link>
      <nav class="header-nav">
        <router-link to="/" class="nav-link">首页</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
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
</style>
