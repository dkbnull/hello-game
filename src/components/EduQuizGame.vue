<template>
  <GamePage :title="title">
    <template #actions>
      <span class="score-display">得分：{{ score }}</span>
      <span class="progress-display">{{ currentIndex + 1 }} / {{ effectiveRounds }}</span>
      <span class="timer-display">⏱ {{ formattedTime }}</span>
      <button class="btn btn-primary btn-sm" @click="startGame">重新开始</button>
    </template>
    <div class="edu-wrapper">
      <div v-if="!started" class="start-screen">
        <div class="start-emoji">{{ icon }}</div>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>

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
          <slot name="diff-select"></slot>
        </div>

        <div class="custom-section">
          <div class="custom-header" @click="showCustom = !showCustom">
            <span>自由出题</span>
            <span class="toggle-icon">{{ showCustom ? '▲' : '▼' }}</span>
          </div>
          <div v-if="showCustom" class="custom-body">
            <div class="search-row">
              <input
                  v-model="searchText"
                  class="search-input"
                  placeholder="搜索题库..."
                  @input="onSearch"
              />
            </div>
            <div class="search-results" v-if="filteredBank.length > 0">
              <div
                  v-for="(item, idx) in filteredBank"
                  :key="idx"
                  class="search-item"
                  :class="{ added: isCustomAdded(item) }"
                  @click="toggleCustomItem(item)"
              >
                <slot name="search-item" :item="item">
                  <span>{{ item[answerKey] }}</span>
                </slot>
                <span class="add-tag">{{ isCustomAdded(item) ? '已添加' : '添加' }}</span>
              </div>
            </div>
            <div v-else-if="searchText" class="no-result">未找到匹配项</div>
            <div v-if="customItems.length > 0" class="custom-summary">
              已添加 {{ customItems.length }} 道自定义题目
            </div>
          </div>
        </div>

        <button class="btn btn-primary btn-lg" @click="startGame">开始学习</button>
      </div>
      <div v-else-if="finished" class="result-screen">
        <div class="result-emoji">🌟</div>
        <h2>学习完成！</h2>
        <p>正确率：{{ correctCount }} / {{ effectiveRounds }}</p>
        <p>用时：{{ formattedTime }}</p>
        <slot name="result-extra" :score="score"></slot>
        <button class="btn btn-primary btn-lg" @click="startGame">再来一轮</button>
      </div>
      <div v-else class="quiz-area">
        <div class="question-card">
          <slot name="question" :question="currentQuestion"></slot>
        </div>
        <div class="options-grid">
          <button
              v-for="(opt, i) in currentOptions"
              :key="i"
              class="option-btn"
              :class="optionClass(i)"
              @click="selectOption(i)"
              :disabled="answered"
          >
            <slot name="option" :option="opt">{{ opt }}</slot>
          </button>
        </div>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
import {computed, onUnmounted, ref} from 'vue'
import GamePage from './GamePage.vue'

const ROUND_OPTIONS = [5, 10, 15, 20, 30]

const props = defineProps({
  title: {type: String, required: true},
  icon: {type: String, default: '📚'},
  description: {type: String, default: ''},
  totalRounds: {type: Number, default: 10},
  wordBank: {type: Array, required: true},
  answerKey: {type: String, required: true},
})

const started = ref(false)
const finished = ref(false)
const score = ref(0)
const correctCount = ref(0)
const currentIndex = ref(0)
const questions = ref([])
const currentOptions = ref([])
const answered = ref(false)
const selectedIdx = ref(-1)

const selectedRounds = ref(10)
const showCustom = ref(false)
const searchText = ref('')
const customItems = ref([])

const timerSeconds = ref(0)
let timerInterval = null

const effectiveRounds = computed(() => selectedRounds.value)

const formattedTime = computed(() => {
  const m = Math.floor(timerSeconds.value / 60)
  const s = timerSeconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const currentQuestion = computed(() => questions.value[currentIndex.value] || {})

const filteredBank = computed(() => {
  if (!searchText.value.trim()) return props.wordBank.slice(0, 20)
  const keyword = searchText.value.trim().toLowerCase()
  return props.wordBank.filter(item => {
    const val = String(item[props.answerKey]).toLowerCase()
    const hint = item.hint || item.chinese || ''
    return val.includes(keyword) || hint.toLowerCase().includes(keyword)
  }).slice(0, 30)
})

function isCustomAdded(item) {
  return customItems.value.some(c => c[props.answerKey] === item[props.answerKey])
}

function toggleCustomItem(item) {
  if (isCustomAdded(item)) {
    customItems.value = customItems.value.filter(c => c[props.answerKey] !== item[props.answerKey])
  } else {
    customItems.value.push({...item})
  }
}

function onSearch() {
}

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

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuestions() {
  const pool = [...props.wordBank]
  if (customItems.value.length > 0) {
    const customPool = customItems.value.filter(
        c => !pool.some(p => p[props.answerKey] === c[props.answerKey])
    )
    pool.push(...customPool)
  }
  questions.value = shuffle(pool).slice(0, selectedRounds.value)
  generateOptions()
}

function generateOptions() {
  const q = currentQuestion.value
  if (!q) return
  const correctAnswer = q[props.answerKey]
  const pool = [...props.wordBank, ...customItems.value]
  const wrongItems = pool.filter(w => w[props.answerKey] !== correctAnswer)
  const wrongOptions = shuffle(wrongItems).slice(0, 3).map(w => w[props.answerKey])
  currentOptions.value = shuffle([correctAnswer, ...wrongOptions])
  answered.value = false
  selectedIdx.value = -1
}

function selectOption(idx) {
  if (answered.value) return
  answered.value = true
  selectedIdx.value = idx
  const correctAnswer = currentQuestion.value[props.answerKey]
  const isCorrect = currentOptions.value[idx] === correctAnswer
  if (isCorrect) {
    score.value += 10
    correctCount.value++
  }
  setTimeout(() => {
    if (currentIndex.value < selectedRounds.value - 1) {
      currentIndex.value++
      generateOptions()
    } else {
      finished.value = true
      stopTimer()
    }
  }, 800)
}

function optionClass(idx) {
  if (!answered.value) return {}
  const correctAnswer = currentQuestion.value[props.answerKey]
  const isCorrect = currentOptions.value[idx] === correctAnswer
  const isSelected = idx === selectedIdx.value
  return {
    correct: isCorrect,
    wrong: isSelected && !isCorrect,
  }
}

function startGame() {
  started.value = true
  finished.value = false
  score.value = 0
  correctCount.value = 0
  currentIndex.value = 0
  generateQuestions()
  startTimer()
}

defineExpose({startGame, score, correctCount})
</script>

<style scoped>
.edu-wrapper {
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
  margin-bottom: 24px;
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

.round-options {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.round-btn {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 2px solid var(--border);
  transition: all 0.2s;
}

.round-btn:hover {
  border-color: var(--primary-light);
}

.round-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.custom-section {
  margin-bottom: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: var(--bg-game);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.toggle-icon {
  font-size: 12px;
  color: var(--text-secondary);
}

.custom-body {
  padding: 12px 16px;
}

.search-row {
  margin-bottom: 8px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  outline: none;
  background: var(--bg-card);
  color: var(--text-primary);
}

.search-input:focus {
  border-color: var(--primary);
}

.search-results {
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.search-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s;
}

.search-item:hover {
  background: var(--bg-game);
}

.search-item.added {
  background: #f0edff;
}

.add-tag {
  font-size: 12px;
  color: var(--primary);
  font-weight: 500;
}

.no-result {
  padding: 12px;
  color: var(--text-secondary);
  font-size: 13px;
  text-align: center;
}

.custom-summary {
  margin-top: 8px;
  font-size: 13px;
  color: var(--primary);
  font-weight: 600;
}

.question-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32px;
  text-align: center;
  box-shadow: var(--shadow);
  margin-bottom: 24px;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.option-btn {
  padding: 20px;
  font-size: 24px;
  font-weight: 600;
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
