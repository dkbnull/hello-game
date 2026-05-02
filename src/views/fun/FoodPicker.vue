<template>
  <GamePage hero>
    <div class="food-picker-wrapper">
      <!-- 选择面板 -->
      <div v-if="phase === 'select'" class="select-screen">
        <div class="hero-section">
          <div class="hero-emoji-float">
            <span class="float-emoji" style="--delay: 0s; --x: -30px; --y: -10px;">🍜</span>
            <span class="float-emoji" style="--delay: 0.5s; --x: 30px; --y: -15px;">🍕</span>
            <span class="float-emoji" style="--delay: 1s; --x: -20px; --y: 10px;">🍣</span>
            <span class="float-emoji" style="--delay: 1.5s; --x: 25px; --y: 5px;">🥘</span>
            <span class="float-emoji" style="--delay: 2s; --x: 0px; --y: -25px;">🍱</span>
          </div>
          <div class="hero-main-emoji">🍽️</div>
          <h2 class="hero-title">今天吃什么？</h2>
          <p class="hero-subtitle">选择你的偏好，让命运来决定！</p>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label class="form-label">餐次</label>
            <div class="meal-grid">
              <button
                  v-for="m in MEAL_TYPES"
                  :key="m.key"
                  class="meal-btn"
                  :class="{ active: mealType === m.key }"
                  @click="mealType = m.key"
              >
                <span class="meal-icon">{{ m.icon }}</span>
                <span class="meal-label">{{ m.label }}</span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">口味偏好 <span class="form-hint">（可多选，不选则随机）</span></label>
            <div class="taste-grid">
              <button
                  v-for="t in TASTE_OPTIONS"
                  :key="t.key"
                  class="taste-btn"
                  :class="{ active: selectedTastes.includes(t.key) }"
                  @click="toggleTaste(t.key)"
              >
                <span class="taste-icon">{{ t.icon }}</span>
                <span class="taste-label">{{ t.label }}</span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">忌口 <span class="form-hint">（可多选，不选则无限制）</span></label>
            <div class="dietary-grid">
              <button
                  v-for="d in DIETARY_OPTIONS"
                  :key="d.key"
                  class="dietary-btn"
                  :class="{ active: selectedDietary.includes(d.key) }"
                  @click="toggleDietary(d.key)"
              >
                <span class="dietary-icon">{{ d.icon }}</span>
                <span class="dietary-label">{{ d.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <button
            class="btn btn-start btn-lg"
            :disabled="!mealType || availableCount === 0"
            @click="startSpin"
        >
          <span class="btn-start-icon">🎲</span>
          开始抽取
          <span v-if="mealType" class="btn-start-count">（{{ availableCount }}个可选）</span>
        </button>

        <button class="fp-action-btn fp-action-btn--outline fp-manage-btn" @click="showManage = true">
          <span class="fp-action-btn-icon">📝</span> 管理食物
        </button>
      </div>

      <!-- 抽取动画 -->
      <div v-if="phase === 'spinning'" class="spinning-screen">
        <h2 class="hero-title spin-hero-title">今天吃什么？</h2>
        <div class="slot-machine">
          <div class="slot-frame">
            <div class="slot-glow"></div>
            <div class="slot-viewport">
              <div class="slot-strip" :style="stripStyle">
                <div
                    v-for="(item, idx) in spinItems"
                    :key="idx"
                    class="slot-item"
                    :class="{ 'slot-item-final': idx === finalIndex }"
                >
                  <span class="slot-emoji">{{ item.emoji }}</span>
                  <span class="slot-name">{{ item.name }}</span>
                </div>
              </div>
            </div>
            <div class="slot-indicator"></div>
          </div>
        </div>

        <div class="spin-text">
          <span class="spin-dots">
            <span style="--i:0">命</span>
            <span style="--i:1">运</span>
            <span style="--i:2">转</span>
            <span style="--i:3">动</span>
            <span style="--i:4">中</span>
          </span>
        </div>

        <div class="particle-container">
          <div
              v-for="p in particles"
              :key="p.id"
              class="particle"
              :style="{
              left: p.x + '%',
              top: p.y + '%',
              '--dx': p.dx + 'px',
              '--dy': p.dy + 'px',
              '--rot': p.rot + 'deg',
              '--size': p.size + 'px',
              animationDelay: p.delay + 'ms',
              fontSize: p.size + 'px',
            }"
          >{{ p.emoji }}
          </div>
        </div>
      </div>

      <!-- 结果展示 -->
      <div v-if="phase === 'result' && resultFood" class="result-screen">
        <div class="result-card" :class="{ 'result-card-enter': resultVisible }">
          <div class="result-bg-emoji">{{ resultFood.emoji }}</div>
          <div class="result-emoji-main">{{ resultFood.emoji }}</div>
          <h2 class="result-name">{{ resultFood.name }}</h2>
          <div class="result-tags">
            <span v-for="tag in resultFood.tags" :key="tag" class="result-tag">{{ tag }}</span>
          </div>
          <div class="result-tastes">
            <span v-for="t in resultFood.tastes" :key="t" class="result-taste">
              {{ getTasteEmoji(t) }} {{ getTasteLabel(t) }}
            </span>
          </div>
          <div class="result-meal-info">
            {{ getMealLabel() }} · 推荐美食
          </div>
          <div class="result-actions">
            <button class="fp-action-btn fp-action-btn--outline" @click="resetAll">
              <span class="fp-action-btn-icon">↺</span> 重新选择
            </button>
            <button class="fp-action-btn fp-action-btn--gradient" @click="reroll">
              <span class="fp-action-btn-icon">🎲</span> 再抽一次
            </button>
          </div>
        </div>

        <div class="confetti-container">
          <div
              v-for="c in confetti"
              :key="c.id"
              class="confetti-piece"
              :style="{
              left: c.x + '%',
              '--dx': c.dx + 'px',
              '--dy': c.dy + 'px',
              '--rot': c.rot + 'deg',
              backgroundColor: c.color,
              width: c.w + 'px',
              height: c.h + 'px',
              animationDelay: c.delay + 'ms',
            }"
          ></div>
        </div>
      </div>

      <!-- 自定义食物管理弹窗 -->
      <Teleport to="body">
        <div v-if="showManage" class="modal-overlay" @click.self="showManage = false">
          <div class="modal-content">
            <div class="modal-header">
              <h3>管理自定义食物</h3>
              <button class="modal-close" @click="showManage = false">✕</button>
            </div>

            <div class="modal-body">
              <div class="add-form">
                <input
                    v-model="newFood.name"
                    class="form-input"
                    type="text"
                    placeholder="食物名称"
                    maxlength="20"
                />
                <div class="add-form-row">
                  <div class="add-form-group">
                    <label class="add-form-label">餐次</label>
                    <div class="add-meal-btns">
                      <button
                          v-for="m in MEAL_TYPES"
                          :key="m.key"
                          class="mini-btn"
                          :class="{ active: newFood.meal.includes(m.key) }"
                          @click="toggleNewFoodMeal(m.key)"
                      >{{ m.icon }} {{ m.label }}
                      </button>
                    </div>
                  </div>
                  <div class="add-form-group">
                    <label class="add-form-label">口味</label>
                    <div class="add-taste-btns">
                      <button
                          v-for="t in TASTE_OPTIONS"
                          :key="t.key"
                          class="mini-btn"
                          :class="{ active: newFood.tastes.includes(t.key) }"
                          @click="toggleNewFoodTaste(t.key)"
                      >{{ t.icon }}
                      </button>
                    </div>
                  </div>
                  <div class="add-form-group">
                    <label class="add-form-label">标签（逗号分隔）</label>
                    <input
                        v-model="newFoodTagsStr"
                        class="form-input"
                        type="text"
                        placeholder="如：面食,川菜"
                    />
                  </div>
                  <div class="add-form-group">
                    <label class="add-form-label">Emoji</label>
                    <div class="emoji-picker">
                      <button
                          v-for="e in FOOD_EMOJIS"
                          :key="e"
                          class="emoji-btn"
                          :class="{ active: newFood.emoji === e }"
                          @click="newFood.emoji = e"
                      >{{ e }}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                    class="btn btn-primary btn-sm"
                    :disabled="!newFood.name.trim() || newFood.meal.length === 0"
                    @click="addFood"
                >添加食物
                </button>
              </div>

              <div class="custom-list">
                <h4 class="custom-list-title">已添加的自定义食物</h4>
                <div v-if="customFoods.length === 0" class="empty-hint">暂无自定义食物，快来添加吧！</div>
                <div v-for="food in customFoods" :key="food.id" class="custom-item">
                  <span class="custom-item-emoji">{{ food.emoji }}</span>
                  <span class="custom-item-name">{{ food.name }}</span>
                  <span class="custom-item-meal">{{ food.meal.map(m => getMealKeyLabel(m)).join('/') }}</span>
                  <button class="custom-item-del" @click="removeFood(food.id)">✕</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </GamePage>
</template>

<script setup>
import {DIETARY_OPTIONS, filterFoods, getRandomFood, MEAL_TYPES, TASTE_OPTIONS,} from '@/data/foodPicker.js'
import {useFoodPicker} from '@/composables/useFoodPicker.js'

const FOOD_EMOJIS = [
  '🍚', '🍜', '🍝', '🍛', '🍲', '🥘', '🥟', '🥠', '🥩', '🍗',
  '🍖', '🥓', '🍔', '🍕', '🌭', '🥪', '🥙', '🥗', '🥞', '🌯',
  '🥣', '🥡', '🍱', '🍣', '🦀', '🍤', '🍳', '🥛', '🥜', '🥥',
  '🥚', '🍅', '🌶️', '🐟', '🐠', '🥦', '🍆', '🍢', '🦆',
]

const {allFoods, customFoods, addCustomFood, removeCustomFood} = useFoodPicker()

const phase = ref('select')
const mealType = ref('')
const selectedTastes = ref([])
const selectedDietary = ref([])
const resultFood = ref(null)
const resultVisible = ref(false)
const showManage = ref(false)

const newFood = reactive({
  name: '',
  meal: [],
  tastes: [],
  tags: [],
  emoji: '🍚',
})
const newFoodTagsStr = ref('')

const spinItems = ref([])
const finalIndex = ref(0)
const stripOffset = ref(0)
const isSpinning = ref(false)

const particles = ref([])
const confetti = ref([])

const availableFoods = computed(() => {
  if (!mealType.value) return []
  return filterFoods(allFoods.value, mealType.value, selectedTastes.value, selectedDietary.value)
})

const availableCount = computed(() => availableFoods.value.length)

const stripStyle = computed(() => {
  return {
    transform: `translateY(-${stripOffset.value}px)`,
    transition: isSpinning.value ? 'none' : 'transform 1.2s cubic-bezier(0.15, 0.85, 0.25, 1)',
  }
})

function toggleTaste(key) {
  const idx = selectedTastes.value.indexOf(key)
  if (idx === -1) selectedTastes.value.push(key)
  else selectedTastes.value.splice(idx, 1)
}

function toggleDietary(key) {
  const idx = selectedDietary.value.indexOf(key)
  if (idx === -1) selectedDietary.value.push(key)
  else selectedDietary.value.splice(idx, 1)
}

function toggleNewFoodMeal(key) {
  const idx = newFood.meal.indexOf(key)
  if (idx === -1) newFood.meal.push(key)
  else newFood.meal.splice(idx, 1)
}

function toggleNewFoodTaste(key) {
  const idx = newFood.tastes.indexOf(key)
  if (idx === -1) newFood.tastes.push(key)
  else newFood.tastes.splice(idx, 1)
}

function addFood() {
  if (!newFood.name.trim() || newFood.meal.length === 0) return
  const tags = newFoodTagsStr.value
      .split(/[,，]/)
      .map(t => t.trim())
      .filter(Boolean)
  addCustomFood({
    name: newFood.name.trim(),
    meal: [...newFood.meal],
    tastes: newFood.tastes.length > 0 ? [...newFood.tastes] : ['salty'],
    tags: tags.length > 0 ? tags : ['自定义'],
    emoji: newFood.emoji,
  })
  newFood.name = ''
  newFood.meal = []
  newFood.tastes = []
  newFood.tags = []
  newFood.emoji = '🍚'
  newFoodTagsStr.value = ''
}

function removeFood(id) {
  removeCustomFood(id)
}

function getTasteEmoji(key) {
  const t = TASTE_OPTIONS.find(o => o.key === key)
  return t ? t.icon : ''
}

function getTasteLabel(key) {
  const t = TASTE_OPTIONS.find(o => o.key === key)
  return t ? t.label : key
}

function getMealKeyLabel(key) {
  const m = MEAL_TYPES.find(o => o.key === key)
  return m ? m.label : key
}

function getMealLabel() {
  const m = MEAL_TYPES.find(o => o.key === mealType.value)
  return m ? m.label : ''
}

function generateParticles() {
  const emojis = ['✨', '🌟', '💫', '⭐', '🔥', '💥', '🎉', '🎊']
  const items = []
  for (let i = 0; i < 20; i++) {
    items.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      dx: (Math.random() - 0.5) * 200,
      dy: (Math.random() - 0.5) * 200,
      rot: Math.random() * 720 - 360,
      size: 12 + Math.random() * 20,
      delay: Math.random() * 500,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    })
  }
  particles.value = items
}

function generateConfetti() {
  const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6eb4', '#a66cff', '#ff9f43', '#00d2d3']
  const items = []
  for (let i = 0; i < 60; i++) {
    items.push({
      id: i,
      x: Math.random() * 100,
      dx: (Math.random() - 0.5) * 300,
      dy: Math.random() * 600 + 200,
      rot: Math.random() * 1080 - 540,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 800,
    })
  }
  confetti.value = items
}

function startSpin() {
  if (availableFoods.value.length === 0) return

  const foods = availableFoods.value
  const result = getRandomFood(foods)
  resultFood.value = result

  const totalSpinItems = 30
  const items = []
  for (let i = 0; i < totalSpinItems; i++) {
    const randomFood = foods[Math.floor(Math.random() * foods.length)]
    items.push({...randomFood})
  }
  const finalIdx = totalSpinItems - 3
  items[finalIdx] = {...result}
  spinItems.value = items
  finalIndex.value = finalIdx

  phase.value = 'spinning'
  isSpinning.value = true
  generateParticles()

  const ITEM_HEIGHT = 80
  const targetOffset = (finalIdx - 1) * ITEM_HEIGHT

  stripOffset.value = 0

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      let currentOffset = 0
      const totalDuration = 3000
      const startTime = performance.now()

      function animate(now) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / totalDuration, 1)
        const eased = 1 - Math.pow(1 - progress, 4)
        currentOffset = targetOffset * eased
        stripOffset.value = currentOffset

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          stripOffset.value = targetOffset
          isSpinning.value = false
          setTimeout(() => {
            phase.value = 'result'
            generateConfetti()
            setTimeout(() => {
              resultVisible.value = true
            }, 100)
          }, 600)
        }
      }

      requestAnimationFrame(animate)
    })
  })
}

function reroll() {
  resultVisible.value = false
  confetti.value = []
  setTimeout(() => {
    startSpin()
  }, 200)
}

function resetAll() {
  resultVisible.value = false
  resultFood.value = null
  confetti.value = []
  particles.value = []
  phase.value = 'select'
}
</script>

<style scoped>
.food-picker-wrapper {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 顶部操作按钮 */
.fp-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.25s;
  white-space: nowrap;
}

.fp-action-btn-icon {
  font-size: 14px;
}

.fp-action-btn--outline {
  background: rgba(255, 255, 255, 0.85);
  color: var(--text-primary);
  border: 1.5px solid var(--border);
  backdrop-filter: blur(8px);
}

.fp-action-btn--outline:hover {
  border-color: var(--primary-light);
  color: var(--primary);
  background: rgba(108, 92, 231, 0.06);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(108, 92, 231, 0.12);
}

.fp-action-btn--gradient {
  background: linear-gradient(135deg, #ff6b6b, #ff9f43);
  color: #fff;
  border: none;
  box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
}

.fp-action-btn--gradient:hover {
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
  transform: translateY(-1px);
}

/* 选择面板 */
.select-screen {
  text-align: center;
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-section {
  position: relative;
  padding: 20px 0 10px;
  margin-bottom: 8px;
}

.hero-emoji-float {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.float-emoji {
  position: absolute;
  font-size: 24px;
  animation: floatEmoji 3s ease-in-out infinite;
  animation-delay: var(--delay);
  left: 50%;
  top: 50%;
  transform: translate(var(--x), var(--y));
}

@keyframes floatEmoji {
  0%, 100% {
    opacity: 0.6;
    transform: translate(var(--x), var(--y)) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(var(--x), calc(var(--y) - 15px)) scale(1.15);
  }
}

.hero-main-emoji {
  font-size: 64px;
  margin-bottom: 8px;
  animation: heroPulse 2s ease-in-out infinite;
}

@keyframes heroPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

.hero-title {
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 4px;
}

.spin-hero-title {
  margin-bottom: 16px;
  text-align: center;
}

.result-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.fp-manage-btn {
  margin-top: 10px;
}

.form-section {
  width: 100%;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 14px;
  text-align: left;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-hint {
  font-weight: 400;
  color: var(--text-muted);
  font-size: 12px;
}

.meal-grid {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.meal-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 10px;
  border-radius: var(--radius);
  background: var(--bg-card);
  border: 2px solid var(--border);
  transition: all 0.3s;
}

.meal-btn:hover {
  border-color: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.15);
}

.meal-btn.active {
  background: linear-gradient(135deg, #ff6b6b, #ff9f43);
  border-color: #ff6b6b;
  color: #fff;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.35);
  transform: translateY(-2px);
}

.meal-icon {
  font-size: 28px;
}

.meal-label {
  font-size: 14px;
  font-weight: 600;
}

.meal-btn.active .meal-label {
  color: #fff;
}

.taste-grid,
.dietary-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.taste-btn,
.dietary-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 20px;
  background: var(--bg-card);
  border: 2px solid var(--border);
  font-size: 14px;
  transition: all 0.25s;
}

.taste-btn:hover,
.dietary-btn:hover {
  border-color: var(--primary-light);
}

.taste-btn.active,
.dietary-btn.active {
  background: linear-gradient(135deg, #ff6b6b, #ff9f43);
  border-color: #ff6b6b;
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.taste-icon,
.dietary-icon {
  font-size: 16px;
}

.taste-label,
.dietary-label {
  font-weight: 500;
}

.btn-start {
  background: linear-gradient(135deg, #ff6b6b, #ffd93d);
  color: #fff;
  font-weight: 700;
  border: none;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.35);
  transition: all 0.3s;
  margin-top: auto;
  padding: 16px 40px;
  font-size: 18px;
  border-radius: 30px;
}

.btn-start:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(255, 107, 107, 0.45);
}

.btn-start:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-start-icon {
  margin-right: 4px;
  display: inline-block;
  animation: diceRoll 1s ease-in-out infinite;
}

@keyframes diceRoll {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(15deg);
  }
  75% {
    transform: rotate(-15deg);
  }
}

.btn-start-count {
  font-size: 13px;
  font-weight: 400;
  opacity: 0.85;
}

/* 抽取动画 */
.spinning-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.slot-machine {
  position: relative;
  z-index: 2;
}

.slot-frame {
  width: 280px;
  position: relative;
  background: linear-gradient(145deg, #f5f2fa, #ede9f6);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 0 30px rgba(108, 92, 231, 0.12),
  0 0 60px rgba(108, 92, 231, 0.06),
  inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(108, 92, 231, 0.2);
}

.slot-glow {
  position: absolute;
  inset: -4px;
  border-radius: 24px;
  background: linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #a66cff);
  background-size: 400% 400%;
  animation: glowRotate 3s linear infinite;
  z-index: -1;
  opacity: 0.25;
  filter: blur(8px);
}

@keyframes glowRotate {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.slot-viewport {
  height: 240px;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  position: relative;
}

.slot-strip {
  will-change: transform;
}

.slot-item {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(108, 92, 231, 0.06);
}

.slot-emoji {
  font-size: 36px;
}

.slot-name {
  font-size: 20px;
  font-weight: 700;
  color: rgba(42, 42, 72, 0.6);
  letter-spacing: 2px;
}

.slot-item-final .slot-name {
  color: #e17055;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.2);
}

.slot-item-final .slot-emoji {
  filter: drop-shadow(0 0 6px rgba(255, 107, 107, 0.3));
}

.slot-indicator {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 80px;
  transform: translateY(-50%);
  border-top: 2px solid rgba(108, 92, 231, 0.3);
  border-bottom: 2px solid rgba(108, 92, 231, 0.3);
  pointer-events: none;
  background: rgba(108, 92, 231, 0.04);
}

.spin-text {
  margin-top: 24px;
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  z-index: 2;
}

.spin-dots span {
  display: inline-block;
  animation: dotBounce 1.4s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.15s);
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

.particle-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  animation: particleFly 2s ease-out forwards;
  animation-delay: var(--delay, 0ms);
  opacity: 0;
}

@keyframes particleFly {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0.3);
  }
}

/* 结果展示 */
.result-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.result-card {
  position: relative;
  z-index: 2;
  background: linear-gradient(145deg, #fff, #fefefe);
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(108, 92, 231, 0.15),
  0 0 0 1px rgba(108, 92, 231, 0.1);
  width: 100%;
  max-width: 360px;
  opacity: 0;
  transform: scale(0.5) translateY(40px);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-card-enter {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.result-bg-emoji {
  position: absolute;
  font-size: 160px;
  opacity: 0.06;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.result-emoji-main {
  font-size: 80px;
  margin-bottom: 12px;
  animation: resultBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
}

@keyframes resultBounce {
  0% {
    transform: scale(0) rotate(-20deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.result-name {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #ff6b6b, #ffd93d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.result-tags {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.result-tag {
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(108, 92, 231, 0.1);
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
}

.result-tastes {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.result-taste {
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(255, 107, 107, 0.1);
  color: #e17055;
  font-size: 12px;
  font-weight: 500;
}

.result-meal-info {
  font-size: 13px;
  color: var(--text-muted);
}

.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  top: -10px;
  border-radius: 2px;
  animation: confettiFall 2.5s ease-out forwards;
  animation-delay: var(--delay, 0ms);
  opacity: 0;
}

@keyframes confettiFall {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(var(--dx), var(--dy)) rotate(var(--rot));
  }
}

/* 管理弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: overlayIn 0.25s ease;
}

@keyframes overlayIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: var(--bg-card);
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
  animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-header h3::before {
  content: '🍽️';
  font-size: 20px;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--bg-game);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(225, 112, 85, 0.1);
  color: var(--danger);
  transform: rotate(90deg);
}

.modal-body {
  padding: 0 24px 24px;
  overflow-y: auto;
  flex: 1;
}

.add-form {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.04), rgba(255, 107, 107, 0.04));
  border: 1.5px solid rgba(255, 152, 0, 0.12);
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 20px;
}

.add-form .form-input {
  width: 100%;
  margin-bottom: 12px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  background: var(--bg-card);
  transition: all 0.2s;
}

.add-form .form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
  outline: none;
}

.add-form .form-input::placeholder {
  color: var(--text-light);
}

.add-form-row {
  margin-bottom: 4px;
}

.add-form-group {
  margin-bottom: 14px;
}

.add-form-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.add-meal-btns,
.add-taste-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mini-btn {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  transition: all 0.25s;
  font-weight: 500;
}

.mini-btn:hover {
  border-color: var(--primary-light);
  background: rgba(108, 92, 231, 0.04);
}

.mini-btn.active {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(108, 92, 231, 0.25);
}

.emoji-picker {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.emoji-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 18px;
  background: var(--bg-card);
  border: 2px solid transparent;
  transition: all 0.2s;
}

.emoji-btn:hover {
  background: var(--bg-game);
  transform: scale(1.08);
}

.emoji-btn.active {
  border-color: var(--primary);
  background: rgba(108, 92, 231, 0.08);
  transform: scale(1.12);
  box-shadow: 0 2px 8px rgba(108, 92, 231, 0.2);
}

.add-form .btn-primary {
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #ff9f43, #ff6b6b);
  border: none;
  box-shadow: 0 3px 12px rgba(255, 107, 107, 0.25);
  margin-top: 4px;
}

.add-form .btn-primary:hover:not(:disabled) {
  box-shadow: 0 5px 18px rgba(255, 107, 107, 0.35);
  transform: translateY(-1px);
}

.add-form .btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.custom-list {
  margin-top: 4px;
}

.custom-list-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.custom-list-title::before {
  content: '📋';
}

.empty-hint {
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
  padding: 24px 16px;
  background: var(--bg-game);
  border-radius: 12px;
  border: 1.5px dashed var(--border);
}

.custom-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  margin-bottom: 6px;
  background: var(--bg-game);
  transition: all 0.2s;
}

.custom-item:hover {
  background: rgba(108, 92, 231, 0.04);
}

.custom-item-emoji {
  font-size: 22px;
  width: 32px;
  text-align: center;
}

.custom-item-name {
  flex: 1;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.custom-item-meal {
  font-size: 11px;
  color: var(--text-muted);
  padding: 2px 8px;
  background: var(--bg-card);
  border-radius: 8px;
  font-weight: 500;
}

.custom-item-del {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: transparent;
  color: var(--text-light);
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.custom-item-del:hover {
  background: rgba(225, 112, 85, 0.1);
  color: var(--danger);
}

@media (max-width: 480px) {
  .hero-main-emoji {
    font-size: 48px;
  }

  .hero-title {
    font-size: 22px;
  }

  .meal-grid {
    gap: 6px;
  }

  .meal-btn {
    padding: 10px 6px;
  }

  .meal-icon {
    font-size: 24px;
  }

  .slot-frame {
    width: 240px;
    padding: 14px;
  }

  .result-card {
    padding: 28px 20px;
  }

  .result-emoji-main {
    font-size: 60px;
  }

  .result-name {
    font-size: 26px;
  }

  .modal-content {
    border-radius: 16px;
  }

  .modal-header {
    padding: 16px 18px 12px;
  }

  .modal-body {
    padding: 0 18px 18px;
  }

  .add-form {
    padding: 14px;
  }
}
</style>
