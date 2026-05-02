<template>
  <GamePage title="数独">
    <template #actions>
      <div class="action-group">
        <select v-model="gridSize" class="action-select equal-width-action" @change="onSizeChange">
          <option v-for="s in SIZES" :key="s" :value="s">{{ s }}×{{ s }}</option>
        </select>
        <select v-model="difficulty" class="action-select equal-width-action" @change="newGame">
          <option value="easy">简单</option>
          <option value="medium">中等</option>
          <option value="hard">困难</option>
        </select>
      </div>
      <div class="action-group">
        <button class="btn-action equal-width-action" @click="newGame">重新开始</button>
        <button class="btn-action equal-width-action hint-button" @click="hint" :disabled="score <= 0">提示
        </button>
      </div>
    </template>
    <template #actionsBottom>
      <div class="action-group">
        <span class="stat-badge equal-width-action"><span class="stat-icon">⭐</span> {{ score }}</span>
        <span class="stat-badge equal-width-action"><span class="stat-icon">👑</span> {{ bestScore }}</span>
        <span class="stat-badge equal-width-action"><span class="stat-icon">⏱</span> {{ elapsedTime }}s</span>
      </div>
    </template>
    <div class="sudoku-wrapper">
      <div class="sudoku-board-area">
        <div
            class="sudoku-board"
            :style="boardStyle"
        >
          <div
              v-for="(cell, index) in puzzle"
              :key="index"
              class="sudoku-cell"
              :class="cellClass(cell, index)"
              :style="cellBorderStyle(index)"
              @click="selectCell(index)"
          >
            <span v-if="cell.given" class="cell-given">{{ cell.value }}</span>
            <span v-else-if="cell.value" class="cell-user">{{ cell.value }}</span>
          </div>
        </div>
      </div>
      <div class="number-pad">
        <button
            v-for="n in gridSize"
            :key="n"
            class="num-btn"
            :class="{ active: selectedNum === n }"
            @click="inputNumber(n)"
        >{{ n }}
        </button>
        <button class="num-btn erase-btn" @click="eraseNumber">✕</button>
      </div>
    </div>
    <template #overlay>
      <div v-if="completed" class="game-overlay">
        <div class="overlay-content">
          <div class="overlay-emoji">🎉</div>
          <div class="overlay-text">恭喜完成！</div>
          <div class="overlay-time">用时：{{ elapsedTime }}s | 得分：+{{ gainedScore }}</div>
          <button class="btn btn-primary btn-lg overlay-btn" @click="newGame">再来一局</button>
        </div>
      </div>
    </template>
  </GamePage>
</template>

<script setup>
import {shuffle} from '@/utils/helpers.js'
import {useGameStore} from '@/stores/useGameStore.js'
import {useTimer} from '@/composables/useTimer.js'

const gameStore = useGameStore()
const {timerSeconds: elapsedTime, startTimer, stopTimer} = useTimer()

const SIZES = [4, 5, 6, 7, 8, 9]

const gridSize = ref(9)
const difficulty = ref('easy')
const puzzle = ref([])
const selectedIndex = ref(-1)
const selectedNum = ref(0)
const completed = ref(false)
const score = ref(gameStore.getScore('sudoku'))
const bestScore = ref(gameStore.getBestScore('sudoku'))
const gainedScore = ref(0)

const boxSize = computed(() => {
  const s = gridSize.value
  if (s === 4) return 2
  if (s === 6) return 2
  if (s === 8) return 4
  return Math.round(Math.sqrt(s))
})

const removeRatios = {easy: 0.35, medium: 0.5, hard: 0.65}

const cellSize = computed(() => {
  const s = gridSize.value
  const w = window.innerWidth
  let base
  if (s <= 5) base = 52
  else if (s <= 6) base = 48
  else if (s <= 7) base = 44
  else base = 40
  if (w <= 480) base = Math.min(base, 32)
  else if (w <= 768) base = Math.min(base, 38)
  return base
})

const boardStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridSize.value}, ${cellSize.value}px)`,
  gridTemplateRows: `repeat(${gridSize.value}, ${cellSize.value}px)`,
}))

function cellBorderStyle(index) {
  const row = Math.floor(index / gridSize.value)
  const col = index % gridSize.value
  const bs = boxSize.value
  const s = gridSize.value
  const style = {}

  if ((col + 1) % bs === 0 && col < s - 1) {
    style.borderRight = '2px solid var(--text-primary)'
  }
  if ((row + 1) % bs === 0 && row < s - 1) {
    style.borderBottom = '2px solid var(--text-primary)'
  }

  return style
}

function isValid(board, row, col, num, size, bs) {
  for (let i = 0; i < size; i++) {
    if (board[row * size + i] === num) return false
    if (board[i * size + col] === num) return false
  }
  const br = Math.floor(row / bs) * bs
  const bc = Math.floor(col / bs) * bs
  for (let r = br; r < br + bs && r < size; r++) {
    for (let c = bc; c < bc + bs && c < size; c++) {
      if (board[r * size + c] === num) return false
    }
  }
  return true
}

function solve(board, size, bs) {
  const total = size * size
  for (let i = 0; i < total; i++) {
    if (board[i] === 0) {
      const nums = shuffle(Array.from({length: size}, (_, k) => k + 1))
      for (const num of nums) {
        const row = Math.floor(i / size)
        const col = i % size
        if (isValid(board, row, col, num, size, bs)) {
          board[i] = num
          if (solve(board, size, bs)) return true
          board[i] = 0
        }
      }
      return false
    }
  }
  return true
}

function generatePuzzle() {
  const size = gridSize.value
  const bs = boxSize.value
  const total = size * size
  const board = new Array(total).fill(0)

  solve(board, size, bs)

  const solution = [...board]
  const indices = shuffle([...Array(total).keys()])
  const removeCount = Math.floor(total * removeRatios[difficulty.value])

  for (let i = 0; i < removeCount; i++) {
    board[indices[i]] = 0
  }

  puzzle.value = board.map((val, idx) => ({
    value: val,
    given: val !== 0,
    solution: solution[idx],
    row: Math.floor(idx / size),
    col: idx % size,
  }))

  completed.value = false
  selectedIndex.value = -1
  selectedNum.value = 0
}

function selectCell(index) {
  if (puzzle.value[index].given) return
  selectedIndex.value = index
}

function inputNumber(n) {
  selectedNum.value = n
  if (selectedIndex.value < 0) return
  const cell = puzzle.value[selectedIndex.value]
  if (cell.given) return
  cell.value = n
  checkComplete()
}

function eraseNumber() {
  selectedNum.value = 0
  if (selectedIndex.value < 0) return
  const cell = puzzle.value[selectedIndex.value]
  if (cell.given) return
  cell.value = 0
}

function hint() {
  if (score.value <= 0) return
  const emptyCells = puzzle.value.filter(c => !c.given && c.value !== c.solution)
  if (emptyCells.length === 0) return
  const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  cell.value = cell.solution
  score.value--
  gameStore.updateScore('sudoku', score.value)
  checkComplete()
}

function checkComplete() {
  const wasComplete = completed.value
  completed.value = puzzle.value.every(c => c.value === c.solution)
  if (completed.value && !wasComplete) {
    const difficultyBonus = {easy: 3, medium: 5, hard: 8}
    const sizeBonus = gridSize.value >= 9 ? 2 : gridSize.value >= 6 ? 1 : 0
    const timeBonus = elapsedTime.value < 60 ? 3 : elapsedTime.value < 180 ? 2 : elapsedTime.value < 300 ? 1 : 0
    const gained = (difficultyBonus[difficulty.value] || 1) + sizeBonus + timeBonus
    gainedScore.value = gained
    score.value += gained
    gameStore.updateScore('sudoku', score.value)
    stopTimer()
  }
}

function cellClass(cell, index) {
  const size = gridSize.value
  const bs = boxSize.value
  const row = Math.floor(index / size)
  const col = index % size
  const isSelected = index === selectedIndex.value
  const isSameRow = selectedIndex.value >= 0 && row === Math.floor(selectedIndex.value / size)
  const isSameCol = selectedIndex.value >= 0 && col === selectedIndex.value % size
  const isSameBox = selectedIndex.value >= 0 &&
      Math.floor(row / bs) === Math.floor(Math.floor(selectedIndex.value / size) / bs) &&
      Math.floor(col / bs) === Math.floor((selectedIndex.value % size) / bs)
  const isError = !cell.given && cell.value !== 0 && cell.value !== cell.solution

  return {
    selected: isSelected,
    highlighted: (isSameRow || isSameCol || isSameBox) && !isSelected,
    error: isError,
  }
}

function onSizeChange() {
  newGame()
}

function newGame() {
  stopTimer()
  generatePuzzle()
  startTimer()
}

onMounted(() => {
  newGame()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.hint-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sudoku-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-height: 0;
  overflow: auto;
  position: relative;
}

.sudoku-board-area {
  position: relative;
  display: inline-block;
}

.sudoku-board {
  display: grid;
  gap: 1px;
  background: var(--border);
  border: 3px solid var(--text-primary);
  overflow: hidden;
}

.sudoku-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.sudoku-cell:hover {
  background: #e8e8e8;
}

.sudoku-cell.highlighted {
  background: #f0edff;
}

.sudoku-cell.selected {
  background: #ddd6fe;
  box-shadow: inset 0 0 0 1px #1976d2;
}

.sudoku-cell.error {
  background: #ffe0e0;
  box-shadow: inset 0 0 0 1px rgba(255, 68, 68, 0.25);
  animation: sudokuError 0.3s ease;
}

@keyframes sudokuError {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

.cell-given {
  color: #2a2a48;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(108, 92, 231, 0.06);
}

.cell-user {
  color: #6c5ce7;
  font-weight: 600;
  text-shadow: 0 0 6px rgba(108, 92, 231, 0.12);
}

.number-pad {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 500px;
}

.num-btn {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  background: #ffffff;
  color: #4a4a6a;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.num-btn:hover {
  border-color: rgba(108, 92, 231, 0.35);
  color: #6c5ce7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.12);
}

.num-btn.active {
  background: linear-gradient(135deg, #6c5ce7, #a855f7);
  color: #fff;
  border-color: #6c5ce7;
  box-shadow: 0 4px 16px rgba(108, 92, 231, 0.4);
  transform: translateY(-2px);
}

.erase-btn {
  color: #ff6b6b;
  border-color: rgba(255, 107, 107, 0.2);
}

.erase-btn:hover {
  border-color: rgba(255, 107, 107, 0.5);
  color: #ff6b6b;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
}

.game-overlay {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-radius: 0;
}

.overlay-content {
  color: #2a2a48;
}

.overlay-text {
  background: linear-gradient(135deg, #6c5ce7, #fd79a8, #00cec9);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.overlay-time {
  font-size: 16px;
  margin-bottom: 20px;
  color: rgba(42, 42, 72, 0.6);
}

@media (max-width: 768px) {
  .sudoku-cell {
    font-size: 16px;
  }

  .num-btn {
    width: 38px;
    height: 38px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .sudoku-cell {
    font-size: 14px;
  }

  .number-pad {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    margin-top: 10px;
    max-width: 340px;
  }

  .num-btn {
    width: 48px;
    height: 48px;
    aspect-ratio: 1;
    font-size: 20px;
  }

  .overlay-emoji {
    font-size: 48px;
  }

  .overlay-text {
    font-size: 20px;
  }
}
</style>
