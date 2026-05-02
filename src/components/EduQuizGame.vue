<template>
  <GamePage hero>
    <template #actions>
      <template v-if="started">
        <h2 class="edu-hero-title quiz-hero-title">{{ title }}</h2>
        <span class="stat-badge equal-width-action"><span class="stat-icon">⭐</span> {{ score }}</span>
        <span class="stat-badge equal-width-action"><span class="stat-icon">📝</span>
          {{ currentIndex + 1 }} / {{ effectiveRounds }}
        </span>
        <span class="stat-badge equal-width-action"><span class="stat-icon">⏱</span> {{ formattedTime }}</span>
        <button class="btn-action equal-width-action" @click="backToStart">重新开始</button>
      </template>
    </template>
    <div class="edu-game-wrapper">
      <div v-if="!started" class="edu-start-screen">
        <div class="edu-hero">
          <img :src="icon" :alt="title" class="edu-start-svg"/>
          <div class="edu-hero-ring"></div>
        </div>
        <h2 class="edu-hero-title">{{ title }}</h2>
        <p class="edu-hero-desc">{{ description }}</p>

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

        <button class="btn btn-primary btn-lg edu-start-btn" @click="startGame">
          <span class="edu-start-btn-icon">🚀</span>
          开始学习
        </button>
      </div>
      <div v-else-if="finished" class="edu-result-screen">
        <div class="edu-result-emoji">🌟</div>
        <h2>学习完成！</h2>
        <p>正确率：{{ correctCount }} / {{ effectiveRounds }}</p>
        <p>用时：{{ formattedTime }}</p>
        <slot name="result-extra" :score="score"></slot>
        <button class="btn btn-primary btn-lg" @click="backToStart">再来一轮</button>
      </div>
      <div v-else class="edu-quiz-area">
        <div class="edu-question-card">
          <slot name="question" :question="currentQuestion"></slot>
        </div>
        <div class="edu-options-grid">
          <button
              v-for="(opt, i) in currentOptions"
              :key="opt"
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
import {shuffle} from '@/utils/helpers'
import {useTimer} from '@/composables/useTimer'

const ROUND_OPTIONS = [5, 10, 15, 20, 30]
const ANSWER_DELAY = 800
const MAX_SEARCH_RESULTS = 30
const DEFAULT_SEARCH_LIMIT = 20

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

const {formattedTime, startTimer, stopTimer} = useTimer()

const effectiveRounds = computed(() => selectedRounds.value)

const currentQuestion = computed(() => questions.value[currentIndex.value] || {})

const filteredBank = computed(() => {
  if (!searchText.value.trim()) return props.wordBank.slice(0, DEFAULT_SEARCH_LIMIT)
  const keyword = searchText.value.trim().toLowerCase()
  return props.wordBank.filter(item => {
    const val = String(item[props.answerKey]).toLowerCase()
    const hint = item.hint || item.chinese || ''
    return val.includes(keyword) || hint.toLowerCase().includes(keyword)
  }).slice(0, MAX_SEARCH_RESULTS)
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
  }, ANSWER_DELAY)
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

.edu-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
  margin-bottom: 12px;
}

.edu-hero-ring {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 3px solid rgba(108, 92, 231, 0.2);
  animation: eduRingPulse 2.5s ease-in-out infinite;
}

@keyframes eduRingPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.2;
  }
}

.edu-hero-title {
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(135deg, #6c5ce7, #fd79a8, #00cec9);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: eduGradientShift 4s ease infinite;
  margin-bottom: 6px;
}

@keyframes eduGradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.edu-hero-desc {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 16px;
}

.quiz-hero-title {
  text-align: center;
  margin-bottom: 4px;
  width: 100%;
}

.edu-start-btn {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe) !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(108, 92, 231, 0.35) !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
}

.edu-start-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation: eduBtnShine 3s ease-in-out infinite;
}

@keyframes eduBtnShine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.edu-start-btn:hover {
  box-shadow: 0 6px 24px rgba(108, 92, 231, 0.45) !important;
  transform: translateY(-2px) !important;
}

.edu-start-btn-icon {
  font-size: 18px;
}

.custom-section {
  margin-bottom: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  width: 100%;
  transition: border-color 0.3s;
}

.custom-section:hover {
  border-color: rgba(108, 92, 231, 0.3);
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, var(--bg-game), var(--bg-card));
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  transition: all 0.3s;
}

.custom-header:hover {
  background: linear-gradient(135deg, var(--bg-card), var(--bg-game));
}

.toggle-icon {
  font-size: 12px;
  color: var(--text-secondary);
  transition: transform 0.3s;
}

.custom-body {
  padding: 10px 14px;
  overflow-x: hidden;
}

.search-row {
  margin-bottom: 6px;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  outline: none;
  background: var(--bg-card);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
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
  padding: 8px 10px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.search-item:hover {
  background: rgba(108, 92, 231, 0.05);
}

.search-item.added {
  background: linear-gradient(135deg, #f0edff, #e8e4ff);
}

.add-tag {
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(108, 92, 231, 0.08);
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
