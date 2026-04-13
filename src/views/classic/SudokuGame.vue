<template>
  <GamePage title="数独">
    <template #actions>
      <select v-model="gridSize" class="diff-select" @change="onSizeChange">
        <option v-for="s in SIZES" :key="s" :value="s">{{ s }}×{{ s }}</option>
      </select>
      <select v-model="difficulty" class="diff-select" @change="newGame">
        <option value="easy">简单</option>
        <option value="medium">中等</option>
        <option value="hard">困难</option>
      </select>
      <button class="btn btn-secondary btn-sm" @click="hint">提示</button>
      <button class="btn btn-primary btn-sm" @click="newGame">新游戏</button>
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
        <div v-if="completed" class="game-overlay">
          <div class="overlay-content">
            <div class="overlay-emoji">🎉</div>
            <div class="overlay-text">恭喜完成！</div>
            <button class="btn btn-primary" @click="newGame">再来一局</button>
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
  </GamePage>
</template>

<script setup>
import {computed, ref} from 'vue'
import GamePage from '../../components/GamePage.vue'

const SIZES = [4, 5, 6, 7, 8, 9]

const gridSize = ref(9)
const difficulty = ref('easy')
const puzzle = ref([])
const selectedIndex = ref(-1)
const selectedNum = ref(0)
const completed = ref(false)

const boxSize = computed(() => {
  const s = gridSize.value
  if (s === 4) return 2
  if (s === 6) return 2
  if (s === 8) return 4
  return Math.round(Math.sqrt(s))
})

const removeRatios = {easy: 0.35, medium: 0.5, hard: 0.65}

const cellSize = computed(() => {
  if (gridSize.value <= 5) return 52
  if (gridSize.value <= 6) return 48
  if (gridSize.value <= 7) return 44
  return 40
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

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
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
  const emptyCells = puzzle.value.filter(c => !c.given && c.value !== c.solution)
  if (emptyCells.length === 0) return
  const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  cell.value = cell.solution
  checkComplete()
}

function checkComplete() {
  completed.value = puzzle.value.every(c => c.value === c.solution)
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
  generatePuzzle()
}

newGame()
</script>

<style scoped>
.sudoku-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sudoku-board-area {
  position: relative;
  display: inline-block;
}

.diff-select {
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 15px;
  color: var(--text-primary);
  background: var(--bg-card);
  cursor: pointer;
  outline: none;
}

.diff-select:focus {
  border-color: var(--primary);
}

.sudoku-board {
  display: grid;
  gap: 1px;
  background: var(--border);
  border: 3px solid var(--text-primary);
  border-radius: 4px;
  overflow: hidden;
}

.sudoku-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}

.sudoku-cell.highlighted {
  background: #f0edff;
}

.sudoku-cell.selected {
  background: #ddd6fe;
}

.sudoku-cell.error {
  background: #ffe0e0;
}

.cell-given {
  color: var(--text-primary);
}

.cell-user {
  color: var(--primary);
}

.number-pad {
  display: flex;
  gap: 6px;
  margin-top: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.num-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  font-size: 18px;
  font-weight: 600;
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border);
  transition: all 0.15s;
}

.num-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.num-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.erase-btn {
  font-size: 16px;
  color: var(--danger);
}

.erase-btn:hover {
  border-color: var(--danger);
  color: var(--danger);
}

.game-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  z-index: 10;
}

.overlay-content {
  text-align: center;
  color: #fff;
}

.overlay-emoji {
  font-size: 48px;
  margin-bottom: 12px;
}

.overlay-text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}
</style>
