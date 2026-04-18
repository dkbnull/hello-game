<template>
  <GamePage :title="title">
    <template #actions>
      <span class="stat-badge equal-width-action"><span class="stat-icon">⭐</span> {{ score }}</span>
      <span class="stat-badge equal-width-action"><span class="stat-icon">📝</span> {{
          currentIndex + 1
        }} / {{ effectiveRounds }}</span>
      <span class="stat-badge equal-width-action"><span class="stat-icon">⏱</span> {{ formattedTime }}</span>
      <button class="btn-action equal-width-action" @click="startGame">重新开始</button>
    </template>
    <div class="edu-game-wrapper">
      <div v-if="!started" class="edu-start-screen">
        <img :src="icon" :alt="title" class="edu-start-svg"/>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>

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
      <div v-else-if="finished" class="edu-result-screen">
        <div class="edu-result-emoji">🌟</div>
        <h2>学习完成！</h2>
        <p>正确率：{{ correctCount }} / {{ effectiveRounds }}</p>
        <p>用时：{{ formattedTime }}</p>
        <slot name="result-extra" :score="score"></slot>
        <button class="btn btn-primary btn-lg" @click="startGame">再来一轮</button>
      </div>
      <div v-else class="edu-quiz-area">
        <div class="edu-question-card">
          <slot name="question" :question="currentQuestion"></slot>
        </div>
        <div class="edu-options-grid">
          <button
              v-for="(opt, i) in currentOptions"
              :key="i"
              class="edu-option-btn"
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
import {shuffle} from '../utils/helpers'

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

function generateQuestions() {
  const customPool = [...customItems.value]
  const remaining = selectedRounds.value - customPool.length
  let randomPool = []
  if (remaining > 0) {
    const bankFiltered = props.wordBank.filter(
        b => !customPool.some(c => c[props.answerKey] === b[props.answerKey])
    )
    randomPool = shuffle(bankFiltered).slice(0, remaining)
  }
  questions.value = shuffle([...customPool, ...randomPool])
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
.equal-width-action {
  min-width: 80px;
  justify-content: center;
  text-align: center;
}

.custom-section {
  margin-bottom: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  width: 100%;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
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
  padding: 10px 14px;
}

.search-row {
  margin-bottom: 6px;
}

.search-input {
  width: 100%;
  padding: 7px 10px;
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
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.search-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 13px;
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
  padding: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  text-align: center;
}

.custom-summary {
  margin-top: 6px;
  font-size: 13px;
  color: var(--primary);
  font-weight: 600;
}
</style>
