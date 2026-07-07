<template>
  <GamePage hero>
    <template #actions>
      <template v-if="started">
        <h2 class="math-hero-title quiz-hero-title">加减乐园</h2>
        <span class="stat-badge equal-width-action"><span class="stat-icon">⭐</span> {{ score }}</span>
        <span class="stat-badge equal-width-action combo-badge" v-if="combo > 1">
          <span class="stat-icon">🔥</span> ×{{ combo }}</span>
        <span class="stat-badge equal-width-action"><span class="stat-icon">📝</span>
          {{ currentIndex + 1 }} / {{ selectedRounds }}
        </span>
        <span class="stat-badge equal-width-action"><span class="stat-icon">⏱</span> {{ formattedTime }}</span>
        <button class="btn-action equal-width-action" @click="backToStart">重新开始</button>
      </template>
    </template>
    <div class="edu-game-wrapper">
      <div v-if="!started" class="edu-start-screen">
        <div class="math-hero">
          <img :src="mathIcon" alt="加减乐园" class="edu-start-svg"/>
          <div class="math-hero-ring"></div>
        </div>
        <h2 class="math-hero-title">加减乐园</h2>
        <p class="math-hero-desc">趣味加减法，提升数学能力</p>
        <div class="edu-config-section">
          <div class="edu-config-row">
            <label class="edu-config-label">题目数量</label>
            <div class="edu-options-group">
              <button
                  v-for="r in ROUND_OPTIONS"
                  :key="r"
                  class="edu-select-btn"
                  :class="{ active: selectedRounds === r }"
                  @click="selectedRounds = r"
              >{{ r }}题
              </button>
            </div>
          </div>
          <div class="edu-config-row">
            <label class="edu-config-label">难度选择</label>
            <div class="edu-options-group">
              <button
                  v-for="d in DIFFICULTIES"
                  :key="d.value"
                  class="edu-select-btn"
                  :class="{ active: selectedDiff === d.value }"
                  @click="selectedDiff = d.value"
              >{{ d.label }}
              </button>
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-lg math-start-btn" @click="startGame">开始练习</button>
      </div>
      <div v-else-if="finished" class="edu-result-screen">
        <div class="edu-result-emoji">🌟</div>
        <h2 class="math-result-title">练习完成！</h2>
        <p>正确率：{{ correctCount }} / {{ selectedRounds }}</p>
        <p>用时：{{ formattedTime }}</p>
        <p class="edu-result-score">总分：{{ score }}</p>
        <button class="btn btn-primary btn-lg math-start-btn" @click="backToStart">再来一轮</button>
      </div>
      <div v-else class="edu-quiz-area">
        <div class="edu-question-card math-question-card">
          <div class="edu-question-text">
            {{ currentQuestion.num1 }}
            <span class="operator">{{ currentQuestion.operator }}</span>
            {{ currentQuestion.num2 }}
            <span class="equals">=</span>
            <span class="answer-slot">?</span>
          </div>
        </div>
        <div class="edu-options-grid math-options-grid">
          <button
              v-for="(opt, i) in currentOptions"
              :key="opt"
              class="edu-option-btn math-option-btn"
              :class="optionClass(i)"
              @click="selectOption(i)"
              :disabled="answered"
          >{{ opt }}
          </button>
        </div>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
import {randInt, shuffle} from '@/utils/helpers.js'
import {useTimer} from '@/composables/useTimer.js'
import mathIcon from '@/assets/icons/math.svg'

const ROUND_OPTIONS = [5, 10, 15, 20, 30]
const ANSWER_DELAY = 600
const MAX_COMBO_MULTIPLIER = 5
const SCORE_PER_CORRECT = 10
const ADD_PROBABILITY = 0.4
const WRONG_OPTION_RATIO = 0.4

const DIFFICULTIES = [
  {value: 'easy', label: '简单 (1-10)'},
  {value: 'medium', label: '中等 (1-20)'},
  {value: 'hard', label: '困难 (1-50)'},
]

const MAX_NUM = {easy: 10, medium: 20, hard: 50}

const started = ref(false)
const finished = ref(false)
const score = ref(0)
const correctCount = ref(0)
const combo = ref(0)
const currentIndex = ref(0)
const selectedDiff = ref('easy')
const selectedRounds = ref(10)
const questions = ref([])
const currentOptions = ref([])
const answered = ref(false)
const selectedIdx = ref(-1)

const {formattedTime, startTimer, stopTimer} = useTimer()

const currentQuestion = computed(() => questions.value[currentIndex.value] || {
  num1: 0, num2: 0, operator: '+', answer: 0,
})

function generateQuestion() {
  const max = MAX_NUM[selectedDiff.value]
  const isAdd = Math.random() > ADD_PROBABILITY
  let num1, num2, answer, operator

  if (isAdd) {
    num1 = randInt(1, max)
    num2 = randInt(1, max)
    answer = num1 + num2
    operator = '+'
  } else {
    num1 = randInt(1, max)
    num2 = randInt(1, num1)
    answer = num1 - num2
    operator = '-'
  }

  return {num1, num2, operator, answer}
}

function generateOptions(answer) {
  const opts = new Set([answer])
  while (opts.size < 4) {
    const offset = randInt(1, Math.max(3, Math.floor(answer * WRONG_OPTION_RATIO)))
    const wrong = answer + (Math.random() > 0.5 ? offset : -offset)
    if (wrong >= 0 && wrong !== answer) {
      opts.add(wrong)
    }
  }
  return shuffle([...opts])
}

function generateQuestions() {
  questions.value = Array.from({length: selectedRounds.value}, () => generateQuestion())
  generateCurrentOptions()
}

function generateCurrentOptions() {
  const q = questions.value[currentIndex.value]
  if (!q) return
  currentOptions.value = generateOptions(q.answer)
  answered.value = false
  selectedIdx.value = -1
}

function selectOption(idx) {
  if (answered.value) return
  answered.value = true
  selectedIdx.value = idx
  const isCorrect = currentOptions.value[idx] === currentQuestion.value.answer
  if (isCorrect) {
    combo.value++
    const bonus = Math.min(combo.value, MAX_COMBO_MULTIPLIER)
    score.value += SCORE_PER_CORRECT * bonus
    correctCount.value++
  } else {
    combo.value = 0
  }
  setTimeout(() => {
    if (currentIndex.value < selectedRounds.value - 1) {
      currentIndex.value++
      generateCurrentOptions()
    } else {
      finished.value = true
      stopTimer()
    }
  }, ANSWER_DELAY)
}

function optionClass(idx) {
  if (!answered.value) return {}
  const isCorrect = currentOptions.value[idx] === currentQuestion.value.answer
  const isSelected = idx === selectedIdx.value
  return {correct: isCorrect, wrong: isSelected && !isCorrect}
}

function backToStart() {
  started.value = false
  finished.value = false
  stopTimer()
}

function startGame() {
  started.value = true
  finished.value = false
  score.value = 0
  correctCount.value = 0
  combo.value = 0
  currentIndex.value = 0
  generateQuestions()
  startTimer()
}
</script>

<style scoped>
.combo-badge {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe) !important;
  animation: comboPulse 0.6s ease infinite alternate;
}

@keyframes comboPulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.08);
  }
}

.math-hero {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.math-hero-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid rgba(108, 92, 231, 0.2);
  animation: ringPulse 2.5s ease-in-out infinite;
}

.math-hero-title {
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe, #fd79a8);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
  margin-bottom: 6px;
}

.math-hero-desc {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 20px;
}

.quiz-hero-title {
  text-align: center;
  margin-bottom: 4px;
  width: 100%;
}

.math-start-btn {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe) !important;
  box-shadow: 0 4px 20px rgba(108, 92, 231, 0.35) !important;
  position: relative;
  overflow: hidden;
}

.math-start-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%);
  animation: btnShine 3s ease-in-out infinite;
}

.math-start-btn:hover {
  box-shadow: 0 6px 28px rgba(108, 92, 231, 0.45) !important;
  transform: translateY(-2px) !important;
}

.math-question-card {
  background: linear-gradient(135deg, #f5f2ff, #ede8ff) !important;
  border: 2px solid rgba(108, 92, 231, 0.2) !important;
}

.operator {
  color: #6c5ce7;
  font-weight: 800;
  text-shadow: 0 0 8px rgba(108, 92, 231, 0.3);
}

.equals {
  color: var(--text-light);
}

.answer-slot {
  color: #a29bfe;
  animation: mathBlink 1s infinite;
  font-weight: 800;
}

@keyframes mathBlink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.math-options-grid {
  gap: 12px !important;
}

.math-option-btn {
  background: linear-gradient(145deg, #f5f2ff, #ede8ff) !important;
  border: 2px solid rgba(108, 92, 231, 0.15) !important;
  font-size: 22px !important;
  font-weight: 800 !important;
  border-radius: 14px !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.math-option-btn:hover:not(:disabled) {
  border-color: rgba(108, 92, 231, 0.5) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 6px 20px rgba(108, 92, 231, 0.2) !important;
}

.math-option-btn:active:not(:disabled) {
  transform: translateY(-1px) !important;
}

.math-option-btn.correct {
  background: linear-gradient(135deg, #00b894, #00cec9) !important;
  color: #fff !important;
  border-color: #00b894 !important;
  box-shadow: 0 4px 20px rgba(0, 184, 148, 0.4) !important;
  animation: mathCorrectPop 0.4s ease !important;
}

@keyframes mathCorrectPop {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.12);
  }
  100% {
    transform: scale(1);
  }
}

.math-option-btn.wrong {
  background: linear-gradient(135deg, #ff4444, #e74c3c) !important;
  color: #fff !important;
  border-color: #ff4444 !important;
  box-shadow: 0 4px 16px rgba(255, 68, 68, 0.3) !important;
  animation: mathWrongShake 0.4s ease !important;
}

@keyframes mathWrongShake {
  0%, 100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}

.math-result-title {
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe, #fd79a8);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}
</style>
