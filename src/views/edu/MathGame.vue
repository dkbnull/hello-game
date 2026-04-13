<template>
  <GamePage title="加减乐园">
    <template #actions>
      <span class="score-display">得分：{{ score }}</span>
      <span class="combo-display" v-if="combo > 1">连击 ×{{ combo }}</span>
      <span class="progress-display">{{ currentIndex + 1 }} / {{ selectedRounds }}</span>
      <span class="timer-display">⏱ {{ formattedTime }}</span>
      <button class="btn btn-primary btn-sm" @click="startGame">重新开始</button>
    </template>
    <div class="math-wrapper">
      <div v-if="!started" class="start-screen">
        <div class="start-emoji">➕</div>
        <h2>加减乐园</h2>
        <p>趣味加减法，提升数学能力</p>
        <div class="config-section">
          <div class="config-row">
            <label class="config-label">题目数量</label>
            <div class="round-options">
              <button
                  v-for="r in ROUND_OPTIONS"
                  :key="r"
                  class="round-btn"
                  :class="{ active: selectedRounds === r }"
                  @click="selectedRounds = r"
              >{{ r }}题
              </button>
            </div>
          </div>
          <div class="config-row">
            <label class="config-label">难度选择</label>
            <div class="diff-options">
              <button
                  v-for="d in difficulties"
                  :key="d.value"
                  class="diff-btn"
                  :class="{ active: selectedDiff === d.value }"
                  @click="selectedDiff = d.value"
              >{{ d.label }}
              </button>
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-lg" @click="startGame">开始练习</button>
      </div>
      <div v-else-if="finished" class="result-screen">
        <div class="result-emoji">🌟</div>
        <h2>练习完成！</h2>
        <p>正确率：{{ correctCount }} / {{ selectedRounds }}</p>
        <p>用时：{{ formattedTime }}</p>
        <p class="result-score">总分：{{ score }}</p>
        <button class="btn btn-primary btn-lg" @click="startGame">再来一轮</button>
      </div>
      <div v-else class="quiz-area">
        <div class="question-card">
          <div class="question-text">
            {{ currentQuestion.num1 }}
            <span class="operator">{{ currentQuestion.operator }}</span>
            {{ currentQuestion.num2 }}
            <span class="equals">=</span>
            <span class="answer-slot">?</span>
          </div>
        </div>
        <div class="options-grid">
          <button
              v-for="(opt, i) in currentOptions"
              :key="i"
              class="option-btn"
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
import {computed, onUnmounted, ref} from 'vue'
import GamePage from '../../components/GamePage.vue'

const ROUND_OPTIONS = [5, 10, 15, 20, 30]

const difficulties = [
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

const timerSeconds = ref(0)
let timerInterval = null

const formattedTime = computed(() => {
  const m = Math.floor(timerSeconds.value / 60)
  const s = timerSeconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const currentQuestion = computed(() => questions.value[currentIndex.value] || {
  num1: 0, num2: 0, operator: '+', answer: 0,
})

function startTimer() {
  stopTimer()
  timerSeconds.value = 0
  timerInterval = setInterval(() => {
    timerSeconds.value++
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

onUnmounted(() => {
  stopTimer()
})

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuestion() {
  const max = MAX_NUM[selectedDiff.value]
  const isAdd = Math.random() > 0.4
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
    const offset = randInt(1, Math.max(3, Math.floor(answer * 0.4)))
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
    const bonus = Math.min(combo.value, 5)
    score.value += 10 * bonus
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
  }, 600)
}

function optionClass(idx) {
  if (!answered.value) return {}
  const isCorrect = currentOptions.value[idx] === currentQuestion.value.answer
  const isSelected = idx === selectedIdx.value
  return {correct: isCorrect, wrong: isSelected && !isCorrect}
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
.math-wrapper {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.score-display,
.progress-display,
.timer-display {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-right: 12px;
}

.combo-display {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
  margin-right: 12px;
}

.start-screen,
.result-screen {
  text-align: center;
  padding: 40px 20px;
}

.start-emoji,
.result-emoji {
  font-size: 64px;
  margin-bottom: 16px;
}

.start-screen h2,
.result-screen h2 {
  font-size: 24px;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.start-screen p,
.result-screen p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.result-score {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
}

.config-section {
  margin-bottom: 20px;
}

.config-row {
  margin-bottom: 12px;
}

.config-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.round-options,
.diff-options {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.round-btn,
.diff-btn {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 2px solid var(--border);
  transition: all 0.2s;
}

.round-btn:hover,
.diff-btn:hover {
  border-color: var(--primary-light);
}

.round-btn.active,
.diff-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.question-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 40px;
  text-align: center;
  box-shadow: var(--shadow);
  margin-bottom: 24px;
}

.question-text {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.operator {
  color: var(--primary);
}

.equals {
  color: var(--text-light);
}

.answer-slot {
  color: var(--accent);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.option-btn {
  padding: 20px;
  font-size: 28px;
  font-weight: 700;
  border-radius: var(--radius);
  background: var(--bg-card);
  color: var(--text-primary);
  border: 2px solid var(--border);
  transition: all 0.2s;
}

.option-btn:hover:not(:disabled) {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.option-btn.correct {
  background: #d4edda;
  border-color: var(--success);
  color: var(--success);
}

.option-btn.wrong {
  background: #f8d7da;
  border-color: var(--danger);
  color: var(--danger);
}
</style>
