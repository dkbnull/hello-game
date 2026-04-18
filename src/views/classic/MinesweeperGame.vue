<template>
  <GamePage title="扫雷">
    <template #actions>
      <div class="action-group">
        <select v-model="difficulty" class="action-select equal-width-action" @change="resetGame">
          <option value="easy">初级 9×9</option>
          <option value="medium">中级 16×16</option>
          <option value="hard">高级 16×30</option>
        </select>
      </div>
    </template>
    <div class="minesweeper-wrapper">
      <div class="minesweeper-header" :style="{ width: boardWidth }">
        <div class="mine-counter">
          <span class="counter-digit">{{ String(mineCount - flagCount).padStart(3, '0') }}</span>
        </div>
        <button class="face-button" @click="resetGame">
          {{ faceEmoji }}
        </button>
        <div class="time-counter">
          <span class="counter-digit">{{ String(elapsedTime).padStart(3, '0') }}</span>
        </div>
      </div>
      <div
          class="mine-board"
          :style="boardStyle"
          @contextmenu.prevent
      >
        <div
            v-for="(cell, index) in board"
            :key="index"
            class="mine-cell"
            :class="cellClass(cell)"
            @click="handleClick(cell)"
            @contextmenu.prevent="handleRightClick(cell)"
        >
          <template v-if="cell.revealed">
            <span v-if="cell.mine" class="cell-mine">💣</span>
            <span v-else-if="cell.adjacent > 0" :class="'num-' + cell.adjacent">{{ cell.adjacent }}</span>
          </template>
          <span v-else-if="cell.flagged" class="cell-flag">🚩</span>
        </div>
      </div>
      <div v-if="gameOver" class="game-overlay">
        <div class="overlay-content">
          <div class="overlay-emoji">{{ won ? '🎉' : '💥' }}</div>
          <div class="overlay-text">{{ won ? '恭喜通关！' : '踩到地雷了！' }}</div>
          <button class="btn btn-primary" @click="resetGame">再来一局</button>
        </div>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import GamePage from '@/components/GamePage.vue'

const DIFFICULTIES = {
  easy: {rows: 9, cols: 9, mines: 10},
  medium: {rows: 16, cols: 16, mines: 40},
  hard: {rows: 16, cols: 30, mines: 99},
}

const difficulty = ref('easy')
const board = ref([])
const gameOver = ref(false)
const won = ref(false)
const firstClick = ref(true)
const elapsedTime = ref(0)
const flagCount = ref(0)
let timer = null

const config = computed(() => DIFFICULTIES[difficulty.value])
const mineCount = computed(() => config.value.mines)

const faceEmoji = computed(() => {
  if (gameOver.value) {
    return won.value ? '😎' : '😵'
  }
  return '😊'
})

const cellSize = computed(() => {
  let size = 32
  if (window.innerWidth <= 480) size = 24
  else if (window.innerWidth <= 768) size = 28
  return size
})

const boardWidth = computed(() => {
  const cellWidth = cellSize.value
  const cols = config.value.cols
  const padding = 8
  const border = 8
  return `${cols * cellWidth + padding + border}px`
})

const boardStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${config.value.cols}, ${cellSize.value}px)`,
    gridTemplateRows: `repeat(${config.value.rows}, ${cellSize.value}px)`,
  }
})

function createBoard() {
  const {rows, cols} = config.value
  const cells = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        row: r,
        col: c,
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
      })
    }
  }
  return cells
}

function placeMines(safeRow, safeCol) {
  const {rows, cols, mines} = config.value
  let placed = 0
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    const idx = r * cols + c
    if (Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1) continue
    if (board.value[idx].mine) continue
    board.value[idx].mine = true
    placed++
  }
  calcAdjacent()
}

function calcAdjacent() {
  const {rows, cols} = config.value
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c
      if (board.value[idx].mine) continue
      let count = 0
      forNeighbors(r, c, (nr, nc) => {
        if (board.value[nr * cols + nc].mine) count++
      })
      board.value[idx].adjacent = count
    }
  }
}

function forNeighbors(row, col, fn) {
  const {rows, cols} = config.value
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        fn(nr, nc)
      }
    }
  }
}

function reveal(cell) {
  if (cell.revealed || cell.flagged) return
  cell.revealed = true
  if (cell.mine) {
    gameOver.value = true
    won.value = false
    stopTimer()
    revealAllMines()
    return
  }
  if (cell.adjacent === 0) {
    const {cols} = config.value
    forNeighbors(cell.row, cell.col, (nr, nc) => {
      reveal(board.value[nr * cols + nc])
    })
  }
  checkWin()
}

function revealAllMines() {
  board.value.forEach(cell => {
    if (cell.mine) cell.revealed = true
  })
}

function checkWin() {
  const {rows, cols, mines} = config.value
  const unrevealed = board.value.filter(c => !c.revealed).length
  if (unrevealed === mines) {
    gameOver.value = true
    won.value = true
    stopTimer()
  }
}

function handleClick(cell) {
  if (gameOver.value || cell.flagged) return
  if (firstClick.value) {
    firstClick.value = false
    placeMines(cell.row, cell.col)
    startTimer()
  }
  reveal(cell)
}

function handleRightClick(cell) {
  if (gameOver.value || cell.revealed) return
  cell.flagged = !cell.flagged
  flagCount.value += cell.flagged ? 1 : -1
}

function cellClass(cell) {
  return {
    revealed: cell.revealed,
    mine: cell.revealed && cell.mine,
    exploded: cell.revealed && cell.mine && gameOver.value && !won.value,
  }
}

function startTimer() {
  elapsedTime.value = 0
  timer = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function resetGame() {
  stopTimer()
  board.value = createBoard()
  gameOver.value = false
  won.value = false
  firstClick.value = true
  elapsedTime.value = 0
  flagCount.value = 0
}

onMounted(() => {
  resetGame()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.equal-width-action {
  min-width: 100px;
  justify-content: center;
  text-align: center;
}

.action-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.minesweeper-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: auto;
}

.minesweeper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  min-width: 200px;
  background: #c0c0c0;
  border: 4px solid #808080;
  padding: 8px 4px;
  margin-bottom: 0;
}

.mine-counter,
.time-counter {
  background: #000;
  padding: 4px 8px;
  border-top: 2px solid #808080;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  border-left: 2px solid #808080;
  min-width: 70px;
  width: 70px;
  text-align: center;
}

.counter-digit {
  font-family: 'Courier New', monospace;
  font-size: 24px;
  font-weight: bold;
  color: #ff0000;
  letter-spacing: 2px;
}

.face-button {
  background: #c0c0c0;
  border-top: 3px solid #ffffff;
  border-right: 3px solid #808080;
  border-bottom: 3px solid #808080;
  border-left: 3px solid #ffffff;
  padding: 4px 10px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  width: 70px;
  min-height: 44px;
}

.face-button:active {
  border-top: 3px solid #808080;
  border-right: 3px solid #ffffff;
  border-bottom: 3px solid #ffffff;
  border-left: 3px solid #808080;
}

.mine-board {
  display: grid;
  gap: 0;
  border-right: 4px solid #808080;
  border-bottom: 4px solid #808080;
  border-left: 4px solid #808080;
  background: #c0c0c0;
  padding: 4px;
  user-select: none;
  overflow: hidden;
}

.mine-cell {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c0c0c0;
  border-top: 3px solid #ffffff;
  border-right: 3px solid #808080;
  border-bottom: 3px solid #808080;
  border-left: 3px solid #ffffff;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: none;
  font-family: 'Arial', sans-serif;
}

.mine-cell:not(.revealed):active {
  border-color: #808080 #ffffff #ffffff #808080;
  border-style: inset;
}

.mine-cell.revealed {
  background: #c0c0c0;
  border: 1px solid #808080;
  cursor: default;
}

.mine-cell.exploded {
  background: #ff0000;
}

.cell-mine {
  font-size: 18px;
}

.cell-flag {
  font-size: 16px;
}

.num-1 {
  color: #0000ff;
}

.num-2 {
  color: #008000;
}

.num-3 {
  color: #ff0000;
}

.num-4 {
  color: #000080;
}

.num-5 {
  color: #800000;
}

.num-6 {
  color: #008080;
}

.num-7 {
  color: #000000;
}

.num-8 {
  color: #808080;
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

@media (max-width: 768px) {
  .mine-info {
    gap: 8px;
    margin-right: 8px;
  }

  .info-item {
    font-size: 14px;
    min-width: 40px;
  }

  .difficulty-select {
    padding: 4px 8px;
    font-size: 13px;
  }

  .mine-cell {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .mine-info {
    gap: 4px;
    margin-right: 4px;
  }

  .info-item {
    font-size: 12px;
    min-width: 32px;
  }

  .mine-cell {
    width: 24px;
    height: 24px;
    font-size: 14px;
    border-width: 2px;
  }

  .cell-mine {
    font-size: 14px;
  }

  .cell-flag {
    font-size: 12px;
  }

  .overlay-emoji {
    font-size: 36px;
  }

  .overlay-text {
    font-size: 16px;
  }
}
</style>
