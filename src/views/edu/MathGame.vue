<template>
  <GamePage title="加减乐园">
    <template #actions>
      <span class="stat-badge equal-width-action"><span class="stat-icon">⭐</span> {{ score }}</span>
      <span class="stat-badge equal-width-action" v-if="combo > 1"><span class="stat-icon">🔥</span> ×{{ combo }}</span>
      <span class="stat-badge equal-width-action"><span class="stat-icon">📝</span> {{
          currentIndex + 1
        }} / {{ selectedRounds }}</span>
      <span class="stat-badge equal-width-action"><span class="stat-icon">⏱</span> {{ formattedTime }}</span>
      <button class="btn-action equal-width-action" @click="startGame">重新开始</button>
    </template>
    <div class="edu-game-wrapper">
      <div v-if="!started" class="edu-start-screen">
        <img :src="mathIcon" alt="加减乐园" class="edu-start-svg"/>
        <h2>加减乐园</h2>
        <p>趣味加减法，提升数学能力</p>
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
                  v-for="d in difficulties"
                  :key="d.value"
                  class="edu-select-btn"
                  :class="{ active: selectedDiff === d.value }"
                  @click="selectedDiff = d.value"
              >{{ d.label }}
              </button>
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-lg" @click="startGame">开始练习</button>
      </div>
      <div v-else-if="finished" class="edu-result-screen">
        <div class="edu-result-emoji">🌟</div>
        <h2>练习完成！</h2>
        <p>正确率：{{ correctCount }} / {{ selectedRounds }}</p>
        <p>用时：{{ formattedTime }}</p>
        <p class="edu-result-score">总分：{{ score }}</p>
        <button class="btn btn-primary btn-lg" @click="startGame">再来一轮</button>
      </div>
      <div v-else class="edu-quiz-area">
        <div class="edu-question-card">
          <div class="edu-question-text">
            {{ currentQuestion.num1 }}
            <span class="operator">{{ currentQuestion.operator }}</span>
            {{ currentQuestion.num2 }}
            <span class="equals">=</span>
            <span class="answer-slot">?</span>
          </div>
        </div>
        <div class="edu-options-grid">
          <button
              v-for="(opt, i) in currentOptions"
              :key="i"
              class="edu-option-btn"
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
import GamePage from '@/components/GamePage.vue'
import {randInt, shuffle} from '@/utils/helpers.js'
import mathIcon from '@/assets/icons/math.svg'

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
.equal-width-action {
  min-width: 80px;
  justify-content: center;
  text-align: center;
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
</style>
