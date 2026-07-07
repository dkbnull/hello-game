<template>
  <GamePage hero>
    <div class="nmti-container">
      <div v-if="phase === 'intro'" class="intro-section">
        <div class="intro-card">
          <div class="nmti-hero">
            <div class="intro-icon">🐮</div>
            <div class="nmti-hero-ring"></div>
          </div>
          <h3 class="nmti-hero-title">NMTI来了!</h3>
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
          <button @click="startTest" class="action-btn primary start-btn nmti-start-btn">
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
              class="action-btn secondary nmti-nav-btn"
              :disabled="currentIndex === 0"
          >
            上一题
          </button>
          <button
              v-if="currentIndex < questions.length - 1"
              @click="nextQuestion"
              class="action-btn primary nmti-nav-btn"
              :disabled="!answers[currentIndex]"
          >
            下一题
          </button>
          <button
              v-else
              @click="submitTest"
              class="action-btn primary submit-btn nmti-submit-btn"
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
          <button @click="saveResult" class="action-btn primary nmti-start-btn">
            保存为图片
          </button>
          <button @click="restartTest" class="action-btn secondary nmti-nav-btn">
            再测一次
          </button>
        </div>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
import {calculateResult, personalityTypes, questions, specialPersonalityTypes} from '@/data/nmti.js'
import {saveAsImage} from '@/utils/saveImage.js'

const phase = ref('intro')
const currentIndex = ref(0)
const answers = ref({})
const result = ref(null)
const resultCardRef = ref(null)
// 随机分数在生成时一次性确定，避免 computed 中使用 Math.random 产生副作用
const randomScores = ref({})

const totalQuestions = questions.length

const currentQuestion = computed(() => questions[currentIndex.value])
const progressPercent = computed(() => ((currentIndex.value + 1) / questions.length) * 100)

// 纯函数：基于已生成的 randomScores 派生展示数据，无副作用
const personalityScores = computed(() => {
  const allTypes = {...personalityTypes, ...specialPersonalityTypes}
  const scores = {}

  const typeKeys = ['NLRI', 'NMRI', 'NLRT', 'NMRT', 'NMOI']

  typeKeys.forEach(key => {
    const pt = allTypes[key]
    if (pt) {
      scores[key] = {...pt, score: randomScores.value[key] ?? 0}
    }
  })

  if (result.value && result.value.personality) {
    const resultKey = Object.keys(allTypes).find(k => allTypes[k].name === result.value.personality.name)
    if (resultKey) {
      scores[resultKey] = {
        ...allTypes[resultKey],
        score: randomScores.value[resultKey] ?? 0
      }
    }
  }

  return scores
})

// 一次性生成所有随机分数，保证 computed 派生时数据稳定
function generateRandomScores() {
  const scores = {}
  const typeKeys = ['NLRI', 'NMRI', 'NLRT', 'NMRT', 'NMOI']
  typeKeys.forEach((key, index) => {
    scores[key] = Math.floor(Math.random() * 16) + (index === 0 ? 12 : 0)
  })

  // 实际结果类型的分数更高
  if (result.value && result.value.personality) {
    const allTypes = {...personalityTypes, ...specialPersonalityTypes}
    const resultKey = Object.keys(allTypes).find(k => allTypes[k].name === result.value.personality.name)
    if (resultKey) {
      scores[resultKey] = Math.floor(Math.random() * 8) + 16
    }
  }
  return scores
}

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
    // result 确定后一次性生成随机分数，computed 派生时数据稳定
    randomScores.value = generateRandomScores()
    phase.value = 'result'
  }, 2000)
}

const restartTest = () => {
  phase.value = 'intro'
  currentIndex.value = 0
  answers.value = {}
  result.value = null
  randomScores.value = {}
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
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.25s ease;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.action-btn.primary:hover:not(:disabled) {
  box-shadow: 0 6px 24px rgba(99, 102, 241, 0.45);
  transform: translateY(-2px);
}

.action-btn.primary:active:not(:disabled) {
  transform: translateY(0);
}

.action-btn.secondary {
  background: linear-gradient(145deg, var(--bg-card), var(--bg-game));
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.action-btn.secondary:hover:not(:disabled) {
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

.nmti-container {
  max-width: 700px;
  margin: 0 auto;
}

.intro-section {
  display: flex;
  justify-content: center;
}

.intro-card {
  background: linear-gradient(145deg, var(--bg-card), var(--bg-game));
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1), var(--shadow);
  padding: 2.5rem;
  text-align: center;
  max-width: 560px;
  width: 100%;
  border: 1px solid rgba(99, 102, 241, 0.08);
}

.nmti-hero {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.nmti-hero-ring {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 2px solid rgba(99, 102, 241, 0.2);
  animation: ringPulse 2.5s ease-in-out infinite;
}

.intro-icon {
  font-size: 4rem;
  margin-bottom: 0;
  animation: nmtiIconScale 3s ease-in-out infinite;
}

@keyframes nmtiIconScale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.12);
  }
}

.nmti-hero-title {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #ec4899, #8b5cf6);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
  margin-bottom: 1rem;
}

.intro-desc {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.intro-axes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1.5rem;
  text-align: left;
}

.axis-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 12px 16px;
  background: linear-gradient(145deg, var(--bg-game), var(--bg-card));
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.06);
  transition: all 0.25s;
}

.axis-item:hover {
  transform: translateX(4px);
  border-color: rgba(99, 102, 241, 0.15);
}

.axis-icon {
  font-size: 1.25rem;
}

.axis-name {
  font-weight: 700;
  color: var(--text-primary);
  min-width: 80px;
}

.axis-detail {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.intro-tips {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(236, 72, 153, 0.03));
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(99, 102, 241, 0.06);
}

.intro-tips p {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.nmti-start-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
}

.nmti-start-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.12) 50%, transparent 70%);
  animation: btnShine 3s ease-in-out infinite;
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
  height: 10px;
  background: linear-gradient(145deg, var(--bg-game), var(--border));
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #ec4899, #8b5cf6);
  background-size: 200% 100%;
  border-radius: 5px;
  transition: width 0.4s ease;
  animation: nmtiProgressGlow 2s ease infinite;
}

@keyframes nmtiProgressGlow {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.progress-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
  min-width: 60px;
  text-align: right;
  font-weight: 600;
}

.question-card {
  background: linear-gradient(145deg, var(--bg-card), var(--bg-game));
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.08), var(--shadow);
  padding: 2rem;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  width: 520px;
  margin: 0 auto;
  border: 1px solid rgba(99, 102, 241, 0.06);
}

.question-number {
  color: #6366f1;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  letter-spacing: 0.5px;
}

.question-text {
  font-size: 1.05rem;
  color: var(--text-primary);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.option-btn {
  width: 100%;
  max-width: 520px;
  padding: 1rem 1.25rem;
  background: linear-gradient(145deg, var(--bg-game), var(--bg-card));
  border: 2px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0 auto;
}

.option-btn:hover {
  border-color: rgba(99, 102, 241, 0.4);
  background: linear-gradient(145deg, rgba(99, 102, 241, 0.04), var(--bg-card));
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.option-btn.selected {
  border-color: #6366f1;
  background: linear-gradient(145deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.04));
  color: #4f46e5;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15);
  transform: translateX(4px);
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.nmti-nav-btn {
  flex: 1;
  padding: 0.75rem;
  font-size: 0.95rem;
}

.nmti-submit-btn {
  background: linear-gradient(135deg, #6366f1, #ec4899) !important;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35) !important;
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
  width: 64px;
  height: 64px;
  border: 4px solid rgba(99, 102, 241, 0.1);
  border-top-color: #6366f1;
  border-right-color: #ec4899;
  border-radius: 50%;
  animation: nmtiSpin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes nmtiSpin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.loading-sub {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.result-screen {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: nmtiResultIn 0.5s ease;
}

@keyframes nmtiResultIn {
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
  background: linear-gradient(145deg, var(--bg-card), #faf8ff);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1), var(--shadow);
  width: 100%;
  max-width: 520px;
  text-align: center;
  margin-bottom: 16px;
  border: 1px solid rgba(99, 102, 241, 0.08);
}

.result-header {
  margin-bottom: 16px;
}

.result-badge {
  display: inline-block;
  padding: 5px 18px;
  border-radius: 20px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
}

.result-type {
  margin-bottom: 16px;
}

.result-emoji {
  font-size: 56px;
  display: block;
  margin-bottom: 8px;
  animation: emojiBounce 0.6s ease 0.3s both;
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
  padding: 5px 14px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  transition: transform 0.2s;
}

.trait-tag:hover {
  transform: translateY(-2px);
}

.result-desc {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 20px;
  text-align: left;
}

.result-scores {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.score-bar-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.score-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
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
  color: var(--text-primary);
}

.score-bar-bg {
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(145deg, var(--bg-game), var(--border));
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.8s ease;
  position: relative;
}

.score-bar-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: nmtiBarShine 2s ease infinite;
}

@keyframes nmtiBarShine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.result-footer {
  font-size: 12px;
  color: var(--text-muted);
  padding-top: 12px;
  border-top: 1px solid rgba(99, 102, 241, 0.08);
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

  .nmti-hero-title {
    font-size: 22px;
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
