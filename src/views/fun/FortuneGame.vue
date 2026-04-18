<template>
  <GamePage title="算命运势">
    <template #actions>
      <button v-if="result" class="btn-secondary-action equal-width-action" @click="reset">重新测算</button>
    </template>
    <div class="fortune-wrapper">
      <div v-if="!result" class="input-screen">
        <img :src="fortuneIcon" alt="算命" class="start-svg"/>
        <h2>算命运势</h2>
        <p>输入信息，测算你的命运与运势</p>

        <div class="form-section">
          <div class="form-group">
            <label class="form-label">你的名字</label>
            <input
                v-model="name"
                class="form-input"
                type="text"
                placeholder="请输入姓名"
                maxlength="20"
            />
          </div>
          <div class="form-group">
            <label class="form-label">你的生肖</label>
            <div class="zodiac-grid">
              <button
                  v-for="z in ZODIAC_SIGNS"
                  :key="z.name"
                  class="zodiac-btn"
                  :class="{ active: zodiac === z.name }"
                  @click="zodiac = z.name"
              >
                <span class="zodiac-icon">{{ z.icon }}</span>
                <span class="zodiac-name">{{ z.name }}</span>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">测算类型</label>
            <div class="type-grid">
              <button
                  v-for="t in FORTUNE_TYPES"
                  :key="t.key"
                  class="type-btn"
                  :class="{ active: fortuneType === t.key }"
                  @click="fortuneType = t.key"
              >
                <span class="type-icon">{{ t.icon }}</span>
                <span class="type-label">{{ t.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <button
            class="btn btn-primary btn-lg"
            :disabled="!name.trim() || !zodiac"
            @click="doFortune"
        >开始测算
        </button>
      </div>

      <div v-else class="result-screen">
        <div ref="resultCardRef" class="result-card">
          <div class="result-header">
            <span class="result-type-badge">{{ currentTypeLabel }}</span>
            <span class="result-date">{{ result.date }}</span>
          </div>

          <div class="result-user">
            <span class="result-zodiac">{{ currentZodiacIcon }}</span>
            <span class="result-name">{{ result.name }}</span>
          </div>

          <div class="result-level" :style="{ color: result.level.color }">
            <span class="level-emoji">{{ result.level.emoji }}</span>
            <span class="level-text">{{ result.level.label }}</span>
            <span class="level-score">{{ result.score }}分</span>
          </div>

          <div class="result-score-ring">
            <svg viewBox="0 0 120 120" class="score-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#eee" stroke-width="8"/>
              <circle
                  cx="60" cy="60" r="50" fill="none"
                  :stroke="result.level.color"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="`${result.score * 3.14} 314`"
                  transform="rotate(-90 60 60)"
              />
              <text x="60" y="60" text-anchor="middle" dominant-baseline="central"
                    :fill="result.level.color" font-size="28" font-weight="800">{{ result.score }}
              </text>
            </svg>
          </div>

          <div class="result-fortune">
            <p>{{ result.fortuneText }}</p>
          </div>

          <div class="result-lucky">
            <h4 class="lucky-title">今日幸运</h4>
            <div class="lucky-grid">
              <div class="lucky-item">
                <span class="lucky-label">幸运色</span>
                <span class="lucky-value">{{ result.lucky.color }}</span>
              </div>
              <div class="lucky-item">
                <span class="lucky-label">幸运物</span>
                <span class="lucky-value">{{ result.lucky.thing }}</span>
              </div>
              <div class="lucky-item">
                <span class="lucky-label">幸运方位</span>
                <span class="lucky-value">{{ result.lucky.direction }}</span>
              </div>
              <div class="lucky-item">
                <span class="lucky-label">幸运数字</span>
                <span class="lucky-value">{{ result.lucky.number }}</span>
              </div>
            </div>
          </div>

          <div class="result-footer">Hello Game · 算命运势 · 仅供娱乐</div>
        </div>

        <div class="result-actions">
          <button class="btn btn-primary btn-lg" @click="saveResult">保存为图片</button>
          <button class="btn btn-secondary btn-lg" @click="reset">再测一次</button>
        </div>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
import {computed, ref} from 'vue'
import GamePage from '@/components/GamePage.vue'
import {FORTUNE_TYPES, generateFortune, ZODIAC_SIGNS} from '@/data/fortune'
import {saveAsImage} from '@/utils/saveImage'
import fortuneIcon from '@/assets/icons/fortune.svg'

const name = ref('')
const zodiac = ref('')
const fortuneType = ref('daily')
const result = ref(null)
const resultCardRef = ref(null)

const currentTypeLabel = computed(() => {
  const t = FORTUNE_TYPES.find(f => f.key === fortuneType.value)
  return t ? t.label : ''
})

const currentZodiacIcon = computed(() => {
  const z = ZODIAC_SIGNS.find(s => s.name === zodiac.value)
  return z ? z.icon : ''
})

function doFortune() {
  if (!name.value.trim() || !zodiac.value) return
  result.value = generateFortune(name.value.trim(), zodiac.value, fortuneType.value)
}

function reset() {
  result.value = null
}

async function saveResult() {
  if (resultCardRef.value) {
    await saveAsImage(resultCardRef.value, `运势-${name.value}-${result.value.date}.png`)
  }
}
</script>

<style scoped>
.equal-width-action {
  min-width: 80px;
  justify-content: center;
  text-align: center;
}

.fortune-wrapper {
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

.input-screen {
  text-align: center;
  padding: 24px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.start-svg {
  width: 100px;
  height: 100px;
  margin-bottom: 12px;
}

.input-screen h2 {
  font-size: 22px;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.input-screen p {
  color: var(--text-secondary);
  margin-bottom: 16px;
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
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  font-size: 15px;
  outline: none;
  background: var(--bg-card);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: var(--primary);
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}

.zodiac-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 2px solid var(--border);
  transition: all 0.2s;
}

.zodiac-btn:hover {
  border-color: var(--primary-light);
}

.zodiac-btn.active {
  border-color: var(--primary);
  background: rgba(108, 92, 231, 0.05);
  color: var(--primary);
}

.zodiac-icon {
  font-size: 20px;
}

.zodiac-name {
  font-size: 12px;
  font-weight: 500;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--radius);
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 2px solid var(--border);
  transition: all 0.2s;
}

.type-btn:hover {
  border-color: var(--primary-light);
}

.type-btn.active {
  border-color: var(--primary);
  background: rgba(108, 92, 231, 0.05);
  color: var(--primary);
}

.type-icon {
  font-size: 20px;
}

.type-label {
  font-size: 14px;
  font-weight: 600;
}

.input-screen .btn-lg:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-screen {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  box-shadow: var(--shadow);
  width: 100%;
  text-align: center;
  margin-bottom: 16px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-type-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  background: linear-gradient(135deg, #fdcb6e, #e17055);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.result-date {
  font-size: 13px;
  color: var(--text-secondary);
}

.result-user {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.result-zodiac {
  font-size: 28px;
}

.result-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.result-level {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.level-emoji {
  font-size: 28px;
}

.level-text {
  font-size: 24px;
  font-weight: 800;
}

.level-score {
  font-size: 16px;
  font-weight: 600;
  opacity: 0.7;
}

.result-score-ring {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.score-svg {
  width: 120px;
  height: 120px;
}

.result-fortune {
  background: var(--bg-game);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 16px;
  text-align: left;
}

.result-fortune p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-primary);
}

.result-lucky {
  margin-bottom: 16px;
}

.lucky-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.lucky-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.lucky-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: var(--bg-game);
  border-radius: var(--radius-sm);
}

.lucky-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.lucky-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.result-footer {
  font-size: 12px;
  color: var(--text-light);
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.result-actions {
  display: flex;
  gap: 10px;
  width: 100%;
}

.result-actions .btn {
  flex: 1;
}

@media (max-width: 768px) {
  .zodiac-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .input-screen {
    padding: 16px 8px;
  }

  .start-svg {
    width: 72px;
    height: 72px;
  }

  .input-screen h2 {
    font-size: 18px;
  }

  .zodiac-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .zodiac-btn {
    padding: 6px 2px;
  }

  .zodiac-icon {
    font-size: 18px;
  }

  .result-card {
    padding: 20px 16px;
  }

  .result-name {
    font-size: 18px;
  }

  .level-text {
    font-size: 20px;
  }
}
</style>
