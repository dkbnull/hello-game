<template>
  <GamePage hero>
    <div class="fortune-wrapper">
      <div v-if="!result" class="input-screen">
        <div class="fortune-hero">
          <img :src="fortuneIcon" alt="算命" class="start-svg"/>
          <div class="fortune-hero-ring"></div>
        </div>
        <h2 class="fortune-hero-title">算命运势</h2>
        <p class="fortune-hero-desc">输入信息，测算你的命运与运势</p>

        <div class="form-section">
          <div class="form-group">
            <label class="form-label">你的名字</label>
            <input
                v-model="name"
                class="form-input fortune-input"
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
            class="btn btn-primary btn-lg fortune-start-btn"
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
                  class="score-circle-anim"
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
          <button class="btn btn-primary btn-lg fortune-start-btn" @click="saveResult">保存为图片</button>
          <button class="btn btn-secondary btn-lg" @click="reset">再测一次</button>
        </div>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
import {FORTUNE_TYPES, generateFortune, ZODIAC_SIGNS} from '@/data/fortune.js'
import {saveAsImage} from '@/utils/saveImage.js'
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

.fortune-hero {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.fortune-hero-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid rgba(253, 203, 110, 0.25);
  animation: ringPulse 2.5s ease-in-out infinite;
}

.start-svg {
  width: 100px;
  height: 100px;
  margin-bottom: 0;
}

.fortune-hero-title {
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(135deg, #fdcb6e, #e17055, #fd79a8);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
  margin-bottom: 6px;
}

.fortune-hero-desc {
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-size: 14px;
}

.form-section {
  width: 100%;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
  text-align: left;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.fortune-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  background: linear-gradient(145deg, var(--bg-card), var(--bg-game));
  color: var(--text-primary);
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.fortune-input:focus {
  border-color: #fdcb6e;
  box-shadow: 0 4px 16px rgba(253, 203, 110, 0.2);
}

.fortune-input::placeholder {
  color: var(--text-light);
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.zodiac-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 4px;
  border-radius: 10px;
  background: linear-gradient(145deg, var(--bg-card), var(--bg-game));
  color: var(--text-secondary);
  border: 2px solid var(--border);
  transition: all 0.25s;
  cursor: pointer;
}

.zodiac-btn:hover {
  border-color: rgba(253, 203, 110, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(253, 203, 110, 0.15);
}

.zodiac-btn.active {
  border-color: #fdcb6e;
  background: linear-gradient(145deg, #fff9e6, #fff3cc);
  color: #e17055;
  box-shadow: 0 4px 16px rgba(253, 203, 110, 0.3);
  transform: translateY(-2px);
}

.zodiac-icon {
  font-size: 22px;
}

.zodiac-name {
  font-size: 11px;
  font-weight: 600;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 12px;
  background: linear-gradient(145deg, var(--bg-card), var(--bg-game));
  color: var(--text-secondary);
  border: 2px solid var(--border);
  transition: all 0.25s;
  cursor: pointer;
}

.type-btn:hover {
  border-color: rgba(253, 203, 110, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(253, 203, 110, 0.15);
}

.type-btn.active {
  border-color: #fdcb6e;
  background: linear-gradient(145deg, #fff9e6, #fff3cc);
  color: #e17055;
  box-shadow: 0 4px 16px rgba(253, 203, 110, 0.3);
  transform: translateY(-2px);
}

.type-icon {
  font-size: 22px;
}

.type-label {
  font-size: 14px;
  font-weight: 700;
}

.fortune-start-btn {
  background: linear-gradient(135deg, #fdcb6e, #e17055) !important;
  box-shadow: 0 4px 20px rgba(253, 203, 110, 0.35) !important;
  position: relative;
  overflow: hidden;
}

.fortune-start-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%);
  animation: btnShine 3s ease-in-out infinite;
}

.fortune-start-btn:hover:not(:disabled) {
  box-shadow: 0 6px 28px rgba(253, 203, 110, 0.5) !important;
  transform: translateY(-2px) !important;
}

.fortune-start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-screen {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fortuneResultIn 0.5s ease;
}

@keyframes fortuneResultIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-card {
  background: linear-gradient(145deg, #fffdf5, #fff8e8);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 8px 32px rgba(253, 203, 110, 0.15), 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  text-align: center;
  margin-bottom: 16px;
  border: 1px solid rgba(253, 203, 110, 0.2);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-type-badge {
  display: inline-block;
  padding: 5px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, #fdcb6e, #e17055);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(253, 203, 110, 0.3);
}

.result-date {
  font-size: 13px;
  color: var(--text-secondary);
}

.result-user {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.result-zodiac {
  font-size: 32px;
  animation: fortuneZodiacBounce 0.6s ease 0.3s both;
}

@keyframes fortuneZodiacBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
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

.score-circle-anim {
  animation: fortuneScoreDraw 1s ease-out 0.3s both;
}

@keyframes fortuneScoreDraw {
  from {
    stroke-dasharray: 0 314;
  }
}

.result-fortune {
  background: linear-gradient(135deg, rgba(253, 203, 110, 0.08), rgba(225, 112, 85, 0.05));
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
  text-align: left;
  border: 1px solid rgba(253, 203, 110, 0.1);
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
  gap: 10px;
}

.lucky-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: linear-gradient(145deg, rgba(253, 203, 110, 0.06), rgba(225, 112, 85, 0.03));
  border-radius: 12px;
  border: 1px solid rgba(253, 203, 110, 0.1);
  transition: transform 0.2s;
}

.lucky-item:hover {
  transform: translateY(-2px);
}

.lucky-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.lucky-value {
  font-size: 15px;
  font-weight: 700;
  color: #e17055;
}

.result-footer {
  font-size: 12px;
  color: var(--text-light);
  padding-top: 12px;
  border-top: 1px solid rgba(253, 203, 110, 0.15);
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

  .fortune-hero-title {
    font-size: 22px;
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
