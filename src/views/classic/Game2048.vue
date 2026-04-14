<template>
  <GamePage title="2048">
    <template #actions>
      <span class="score-display">分数：{{ score }}</span>
      <span class="best-display">最高：{{ bestScore }}</span>
      <button class="btn btn-primary btn-sm" @click="newGame">重新开始</button>
    </template>
    <div class="game2048-wrapper">
      <div class="game-board" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <div v-for="(cell, index) in grid" :key="index" class="grid-cell">
          <transition name="tile" mode="out-in">
            <div
                v-if="cell !== 0"
                :key="cell"
                class="tile"
                :class="'tile-' + cell"
            >
              {{ cell }}
            </div>
          </transition>
        </div>
      </div>
      <div class="game-tip">
        <p>使用 <kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> 方向键或滑动操作</p>
      </div>
      <div v-if="gameOver" class="game-overlay">
        <div class="overlay-content">
          <div class="overlay-emoji">{{ won ? '🎉' : '😢' }}</div>
          <div class="overlay-text">{{ won ? '恭喜达到 2048！' : '游戏结束！' }}</div>
          <div class="overlay-score">得分：{{ score }}</div>
          <button class="btn btn-primary" @click="newGame">再来一局</button>
        </div>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'
import GamePage from '../../components/GamePage.vue'

const SIZE = 4
const grid = ref([])
const score = ref(0)
const bestScore = ref(parseInt(localStorage.getItem('game2048_best') || '0'))
const gameOver = ref(false)
const won = ref(false)
let touchStartX = 0
let touchStartY = 0

function createEmptyGrid() {
  return new Array(SIZE * SIZE).fill(0)
}

function addRandomTile() {
  const empty = []
  for (let i = 0; i < grid.value.length; i++) {
    if (grid.value[i] === 0) empty.push(i)
  }
  if (empty.length === 0) return
  const idx = empty[Math.floor(Math.random() * empty.length)]
  grid.value[idx] = Math.random() < 0.9 ? 2 : 4
}

function getRow(r) {
  return grid.value.slice(r * SIZE, r * SIZE + SIZE)
}

function setRow(r, row) {
  for (let c = 0; c < SIZE; c++) {
    grid.value[r * SIZE + c] = row[c]
  }
}

function getCol(c) {
  const col = []
  for (let r = 0; r < SIZE; r++) {
    col.push(grid.value[r * SIZE + c])
  }
  return col
}

function setCol(c, col) {
  for (let r = 0; r < SIZE; r++) {
    grid.value[r * SIZE + c] = col[r]
  }
}

function slideLine(line) {
  let arr = line.filter(v => v !== 0)
  let addedScore = 0
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2
      addedScore += arr[i]
      arr.splice(i + 1, 1)
    }
  }
  while (arr.length < SIZE) arr.push(0)
  return {result: arr, score: addedScore}
}

function move(direction) {
  if (gameOver.value) return

  const oldGrid = [...grid.value]
  let totalScore = 0

  if (direction === 'left') {
    for (let r = 0; r < SIZE; r++) {
      const {result, score: s} = slideLine(getRow(r))
      setRow(r, result)
      totalScore += s
    }
  } else if (direction === 'right') {
    for (let r = 0; r < SIZE; r++) {
      const {result, score: s} = slideLine(getRow(r).reverse())
      setRow(r, result.reverse())
      totalScore += s
    }
  } else if (direction === 'up') {
    for (let c = 0; c < SIZE; c++) {
      const {result, score: s} = slideLine(getCol(c))
      setCol(c, result)
      totalScore += s
    }
  } else if (direction === 'down') {
    for (let c = 0; c < SIZE; c++) {
      const {result, score: s} = slideLine(getCol(c).reverse())
      setCol(c, result.reverse())
      totalScore += s
    }
  }

  const changed = oldGrid.some((v, i) => v !== grid.value[i])
  if (changed) {
    score.value += totalScore
    if (score.value > bestScore.value) {
      bestScore.value = score.value
      localStorage.setItem('game2048_best', String(bestScore.value))
    }
    addRandomTile()
    checkGameState()
  }
}

function checkGameState() {
  if (grid.value.some(v => v === 2048) && !won.value) {
    won.value = true
    gameOver.value = true
    return
  }
  const hasEmpty = grid.value.some(v => v === 0)
  if (hasEmpty) return

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 1; c++) {
      if (grid.value[r * SIZE + c] === grid.value[r * SIZE + c + 1]) return
    }
  }
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE - 1; r++) {
      if (grid.value[r * SIZE + c] === grid.value[(r + 1) * SIZE + c]) return
    }
  }

  gameOver.value = true
  won.value = false
}

function handleKeydown(e) {
  const map = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  }
  if (map[e.key]) {
    e.preventDefault()
    move(map[e.key])
  }
}

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  if (Math.max(absDx, absDy) < 30) return
  if (absDx > absDy) {
    move(dx > 0 ? 'right' : 'left')
  } else {
    move(dy > 0 ? 'down' : 'up')
  }
}

function newGame() {
  grid.value = createEmptyGrid()
  score.value = 0
  gameOver.value = false
  won.value = false
  addRandomTile()
  addRandomTile()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  newGame()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.game2048-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-height: 0;
}

.score-display,
.best-display {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-right: 10px;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(4, 72px);
  grid-template-rows: repeat(4, 72px);
  gap: 6px;
  background: #bbada0;
  padding: 6px;
  border-radius: var(--radius);
  touch-action: none;
}

.grid-cell {
  background: rgba(238, 228, 218, 0.35);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tile {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 700;
  font-size: 26px;
  transition: all 0.12s;
}

.tile-2 {
  background: #eee4da;
  color: #776e65;
}

.tile-4 {
  background: #ede0c8;
  color: #776e65;
}

.tile-8 {
  background: #f2b179;
  color: #f9f6f2;
}

.tile-16 {
  background: #f59563;
  color: #f9f6f2;
}

.tile-32 {
  background: #f67c5f;
  color: #f9f6f2;
}

.tile-64 {
  background: #f65e3b;
  color: #f9f6f2;
}

.tile-128 {
  background: #edcf72;
  color: #f9f6f2;
  font-size: 22px;
}

.tile-256 {
  background: #edcc61;
  color: #f9f6f2;
  font-size: 22px;
}

.tile-512 {
  background: #edc850;
  color: #f9f6f2;
  font-size: 22px;
}

.tile-1024 {
  background: #edc53f;
  color: #f9f6f2;
  font-size: 18px;
}

.tile-2048 {
  background: #edc22e;
  color: #f9f6f2;
  font-size: 18px;
}

.game-tip {
  margin-top: 10px;
  text-align: center;
  color: var(--text-light);
  font-size: 13px;
}

.game-tip kbd {
  display: inline-block;
  padding: 2px 6px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-card);
  font-size: 12px;
  margin: 0 2px;
}

.game-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
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
  margin-bottom: 8px;
}

.overlay-score {
  font-size: 16px;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .score-display,
  .best-display {
    font-size: 14px;
    margin-right: 6px;
  }

  .game-board {
    grid-template-columns: repeat(4, 64px);
    grid-template-rows: repeat(4, 64px);
    gap: 5px;
    padding: 5px;
  }

  .tile {
    font-size: 22px;
  }

  .tile-128,
  .tile-256,
  .tile-512 {
    font-size: 18px;
  }

  .tile-1024,
  .tile-2048 {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .score-display,
  .best-display {
    font-size: 12px;
    margin-right: 4px;
  }

  .game-board {
    grid-template-columns: repeat(4, 56px);
    grid-template-rows: repeat(4, 56px);
    gap: 4px;
    padding: 4px;
  }

  .tile {
    font-size: 18px;
  }

  .tile-128,
  .tile-256,
  .tile-512 {
    font-size: 15px;
  }

  .tile-1024,
  .tile-2048 {
    font-size: 12px;
  }

  .game-tip {
    font-size: 11px;
    margin-top: 6px;
  }

  .overlay-emoji {
    font-size: 36px;
  }

  .overlay-text {
    font-size: 16px;
  }
}
</style>
