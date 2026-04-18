<template>
  <div class="tool-container nmti-container">
    <div v-if="phase === 'intro'" class="intro-section">
      <div class="intro-card">
        <div class="intro-icon">🐮</div>
        <h3>NMTI来了!</h3>
        <p class="intro-desc">
          NMTI——牛马人格测试，通过31道灵魂拷问，测出你内心深处的牛马人格。
          你是汗血宝马还是摸鱼咸鱼？是老黄牛还是精算狐狸？
        </p>
        <div class="intro-axes">
          <div class="axis-item">
            <span class="axis-icon">🐂</span>
            <span class="axis-name">打工态度轴</span>
            <span class="axis-detail">N 牛马打工 vs S 撒手不管</span>
          </div>
          <div class="axis-item">
            <span class="axis-icon">🐟</span>
            <span class="axis-name">摸鱼劳模轴</span>
            <span class="axis-detail">M 摸鱼大师 vs L 劳模标兵</span>
          </div>
          <div class="axis-item">
            <span class="axis-icon">🎭</span>
            <span class="axis-name">社交模式轴</span>
            <span class="axis-detail">R 社牛显眼 vs T 社恐隐身</span>
          </div>
          <div class="axis-item">
            <span class="axis-icon">🔥</span>
            <span class="axis-name">卷躺态度轴</span>
            <span class="axis-detail">I 内卷狂魔 vs O 佛系躺平</span>
          </div>
        </div>
        <div class="intro-tips">
          <p>⚠️ 本测试仅供娱乐，测出什么牛马都是命，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。</p>
        </div>
        <button @click="startTest" class="action-btn primary start-btn">
          开始测试
        </button>
      </div>
    </div>

    <div v-if="phase === 'testing'" class="testing-section">
      <div class="progress-bar-wrapper">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <span class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</span>
      </div>

      <transition name="slide" mode="out-in">
        <div class="question-card" :key="currentIndex">
          <div class="question-number">第 {{ currentIndex + 1 }} 题</div>
          <div class="question-text">{{ currentQuestion.text }}</div>
          <div class="options-list">
            <button
                v-for="option in currentQuestion.options"
                :key="option.value"
                @click="selectOption(option.value)"
                class="option-btn"
                :class="{ 'selected': answers[currentIndex] === option.value }"
            >
              <span class="option-label">{{ option.label }}</span>
            </button>
          </div>
        </div>
      </transition>

      <div class="nav-buttons">
        <button
            @click="prevQuestion"
            class="action-btn secondary"
            :disabled="currentIndex === 0"
        >
          上一题
        </button>
        <button
            v-if="currentIndex < questions.length - 1"
            @click="nextQuestion"
            class="action-btn primary"
            :disabled="!answers[currentIndex]"
        >
          下一题
        </button>
        <button
            v-else
            @click="submitTest"
            class="action-btn primary submit-btn"
            :disabled="!answers[currentIndex]"
        >
          查看结果
        </button>
      </div>
    </div>

    <div v-if="phase === 'loading'" class="loading-section">
      <div class="loading-card">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在分析您的牛马人格...</p>
        <p class="loading-sub">AI正在深度解读您的打工灵魂</p>
      </div>
    </div>

    <div v-if="phase === 'result'" class="result-screen">
      <div ref="resultCardRef" class="result-card">
        <div class="result-header">
          <span class="result-badge">NMTI</span>
        </div>
        <div class="result-type" :style="{ color: result.personality.color }">
          <span class="result-emoji">{{ result.personality.emoji }}</span>
          <h2 class="result-name">{{ result.personality.name }}</h2>
        </div>
        <div class="result-traits">
          <span v-for="trait in result.personality.traits" :key="trait" class="trait-tag"
                :style="{ background: result.personality.color + '15', color: result.personality.color }">{{
              trait
            }}</span>
        </div>
        <p class="result-desc">{{ result.personality.description }}</p>
        <div class="result-scores">
          <div v-for="(scoreData, typeKey) in personalityScores" :key="typeKey" class="score-bar-item">
            <div class="score-label">
              <span class="score-type-name">
                {{ scoreData.emoji }} {{ scoreData.name }}
              </span>
              <span class="score-value">{{ scoreData.score }}分</span>
            </div>
            <div class="score-bar-bg">
              <div class="score-bar-fill"
                   :style="{ width: (scoreData.score / totalQuestions * 100) + '%', background: scoreData.color }"></div>
            </div>
          </div>
        </div>
        <div class="result-footer">Hello Game · NMTI 牛马人格测试</div>
      </div>
      <div class="result-actions">
        <button @click="saveResult" class="action-btn primary">
          保存为图片
        </button>
        <button @click="restartTest" class="action-btn secondary">
          再测一次
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {calculateResult, personalityTypes, questions, specialPersonalityTypes} from '@/data/nmti.js'
import {saveAsImage} from '@/utils/saveImage.js'

const phase = ref('intro')
const currentIndex = ref(0)
const answers = ref({})
const result = ref(null)
const resultCardRef = ref(null)

const totalQuestions = questions.length

const currentQuestion = computed(() => questions[currentIndex.value])
const progressPercent = computed(() => ((currentIndex.value + 1) / questions.length) * 100)

const personalityScores = computed(() => {
  const allTypes = {...personalityTypes, ...specialPersonalityTypes}
  const scores = {}

  const typeKeys = ['NLRI', 'NMRI', 'NLRT', 'NMRT', 'NMOI']

  typeKeys.forEach((key, index) => {
    const pt = allTypes[key]
    if (pt) {
      scores[key] = {
        ...pt,
        score: Math.floor(Math.random() * 16) + (index === 0 ? 12 : 0)
      }
    }
  })

  if (result.value && result.value.personality) {
    const resultKey = Object.keys(allTypes).find(k => allTypes[k].name === result.value.personality.name)
    if (resultKey) {
      scores[resultKey] = {
        ...allTypes[resultKey],
        score: Math.floor(Math.random() * 8) + 16
      }
    }
  }

  return scores
})

const startTest = () => {
  phase.value = 'testing'
  currentIndex.value = 0
  answers.value = {}
}

const selectOption = (value) => {
  answers.value[currentIndex.value] = value
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextQuestion = () => {
  if (currentIndex.value < questions.length - 1 && answers.value[currentIndex.value]) {
    currentIndex.value++
  }
}

const submitTest = () => {
  phase.value = 'loading'
  setTimeout(() => {
    result.value = calculateResult(answers.value)
    phase.value = 'result'
  }, 2000)
}

const restartTest = () => {
  phase.value = 'intro'
  currentIndex.value = 0
  answers.value = {}
  result.value = null
}

const saveResult = async () => {
  if (resultCardRef.value) {
    await saveAsImage(resultCardRef.value, `NMTI-${result.value.personality.name}.png`)
  }
}
</script>

<style scoped>
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.primary {
  background: #42b883;
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  background: #38a169;
}

.action-btn.secondary {
  background: #f1f2f6;
  color: #333;
}

.action-btn.secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.nmti-container {
  max-width: 700px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: bold;
}

.intro-section {
  display: flex;
  justify-content: center;
}

.intro-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  text-align: center;
  max-width: 560px;
  width: 100%;
}

.intro-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.intro-card h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.intro-desc {
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.intro-axes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.axis-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.axis-icon {
  font-size: 1.25rem;
}

.axis-name {
  font-weight: 600;
  color: #333;
  min-width: 80px;
}

.axis-detail {
  color: #666;
  font-size: 0.85rem;
}

.intro-tips {
  background: #fff8e1;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.intro-tips p {
  color: #856404;
  font-size: 0.85rem;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.tip-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 1px;
}

.start-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 8px;
}

.testing-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
}

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #42b883, #38a169);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  color: #666;
  font-size: 0.875rem;
  white-space: nowrap;
  min-width: 60px;
  text-align: right;
}

.question-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  width: 520px;
  margin: 0 auto;
}

.question-number {
  color: #42b883;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.question-text {
  font-size: 1.05rem;
  color: #333;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.option-btn {
  width: 100%;
  max-width: 520px;
  padding: 1rem 1.25rem;
  background: #f8f9fa;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  color: #333;
  line-height: 1.5;
  margin: 0 auto;
}

.option-btn:hover {
  border-color: #42b883;
  background: #f0fdf4;
}

.option-btn.selected {
  border-color: #42b883;
  background: #ecfdf5;
  color: #166534;
  font-weight: 500;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.nav-buttons .action-btn {
  flex: 1;
  padding: 0.75rem;
  font-size: 0.95rem;
}

.submit-btn {
  background: #42b883 !important;
}

.submit-btn:hover:not(:disabled) {
  background: #38a169 !important;
}

.loading-section {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.loading-card {
  text-align: center;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e2e8f0;
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.loading-sub {
  color: #999;
  font-size: 0.875rem;
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
  border-radius: 12px;
  padding: 28px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 520px;
  text-align: center;
  margin-bottom: 16px;
}

.result-header {
  margin-bottom: 16px;
}

.result-badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
}

.result-type {
  margin-bottom: 16px;
}

.result-emoji {
  font-size: 56px;
  display: block;
  margin-bottom: 8px;
}

.result-name {
  font-size: 28px;
  font-weight: 800;
  margin: 0;
}

.result-traits {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.trait-tag {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
}

.result-desc {
  font-size: 14px;
  line-height: 1.7;
  color: #666;
  margin-bottom: 20px;
  text-align: left;
}

.result-scores {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.score-bar-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.score-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  align-items: center;
}

.score-type-name {
  display: flex;
  align-items: center;
  gap: 6px;
}

.score-value {
  font-weight: 700;
  font-size: 1.25rem;
  color: #333;
}

.score-bar-bg {
  height: 8px;
  border-radius: 4px;
  background: #f3f4f6;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.result-footer {
  font-size: 12px;
  color: #a0aec0;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.result-actions {
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 520px;
}

.result-actions .action-btn {
  flex: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@media (max-width: 768px) {
  .nmti-container {
    padding: 0 0.75rem;
  }

  .intro-card {
    padding: 1.5rem;
  }

  .testing-section {
    max-width: 100%;
  }

  .question-card {
    padding: 1.25rem;
    min-height: 240px;
  }

  .option-btn {
    max-width: 100%;
  }

  .result-card {
    padding: 20px 16px;
  }

  .result-emoji {
    font-size: 44px;
  }

  .result-name {
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .nmti-container {
    padding: 0 0.5rem;
  }

  .intro-card {
    padding: 1.25rem;
  }

  .intro-icon {
    font-size: 3rem;
  }

  .question-card {
    padding: 1rem;
    width: 320px;
    min-height: 220px;
  }

  .question-text {
    font-size: 0.95rem;
  }

  .option-btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .result-emoji {
    font-size: 36px;
  }

  .result-name {
    font-size: 20px;
  }

  .axis-name {
    min-width: 60px;
    font-size: 0.85rem;
  }

  .axis-detail {
    font-size: 0.75rem;
  }
}
</style>
