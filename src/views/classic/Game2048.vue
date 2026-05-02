<template>
  <GamePage title="">
    <template #actions>
    </template>
    <div class="game2048-wrapper">
      <div class="game-header">
        <div class="game-title-area">
          <h1 class="game-title-2048">
            <span class="title-2">2</span>
            <span class="title-0">0</span>
            <span class="title-4">4</span>
            <span class="title-8">8</span>
          </h1>
          <p class="game-subtitle">合并数字，合成 2048 方块！</p>
        </div>
        <div class="score-container">
          <div class="score-box">
            <span class="score-label">分数</span>
            <span class="score-value">{{ score }}</span>
          </div>
          <div class="score-box">
            <span class="score-label">最高</span>
            <span class="score-value">{{ bestScore }}</span>
          </div>
        </div>
      </div>
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
          <button class="btn btn-primary btn-lg overlay-btn" @click="newGame">再来一局</button>
        </div>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
import {useGameStore} from '@/stores/useGameStore.js'

const gameStore = useGameStore()

const SIZE = 4
const grid = ref([])
const score = ref(0)
const bestScore = ref(gameStore.getBestScore('game2048'))
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
    gameStore.updateScore('game2048', score.value)
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
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20px;
}

.game-title-area {
  flex: 1;
}

.game-title-2048 {
  font-size: 56px;
  font-weight: 900;
  margin: 0;
  line-height: 1;
  display: flex;
}

.title-2 {
  background: linear-gradient(135deg, #eee4da, #ede0c8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titlePop 0.5s ease both;
  animation-delay: 0s;
}

.title-0 {
  background: linear-gradient(135deg, #f2b179, #f59563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titlePop 0.5s ease both;
  animation-delay: 0.1s;
}

.title-4 {
  background: linear-gradient(135deg, #f67c5f, #f65e3b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titlePop 0.5s ease both;
  animation-delay: 0.2s;
}

.title-8 {
  background: linear-gradient(135deg, #edcf72, #edc22e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titlePop 0.5s ease both;
  animation-delay: 0.3s;
}

@keyframes titlePop {
  0% {
    transform: scale(0) rotate(-10deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.15) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

.game-subtitle {
  font-size: 14px;
  color: #776e65;
  margin: 8px 0 0;
}

.score-container {
  display: flex;
  gap: 8px;
}

.score-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #bbada0, #a89588);
  padding: 8px 18px;
  border-radius: 8px;
  min-width: 65px;
  box-shadow: 0 3px 10px rgba(187, 173, 160, 0.4);
  transition: transform 0.2s;
}

.score-box:hover {
  transform: translateY(-2px);
}

.score-label {
  font-size: 11px;
  font-weight: 700;
  color: #eee4da;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.score-value {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(4, 80px);
  grid-template-rows: repeat(4, 80px);
  gap: 12px;
  background: linear-gradient(135deg, #bbada0, #a89588);
  padding: 12px;
  border-radius: 12px;
  touch-action: none;
  box-shadow: 0 8px 30px rgba(187, 173, 160, 0.3);
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
  font-weight: 800;
  font-size: 40px;
  transition: all 0.12s;
  color: #776e65;
}

.tile-2 {
  background: linear-gradient(135deg, #eee4da, #e8dcc8);
  box-shadow: 0 2px 6px rgba(238, 228, 218, 0.4);
}

.tile-4 {
  background: linear-gradient(135deg, #ede0c8, #e6d5b5);
  box-shadow: 0 2px 8px rgba(237, 224, 200, 0.4);
}

.tile-8 {
  background: linear-gradient(135deg, #f2b179, #efa065);
  color: #f9f6f2;
  box-shadow: 0 3px 10px rgba(242, 177, 121, 0.4);
}

.tile-16 {
  background: linear-gradient(135deg, #f59563, #f2834a);
  color: #f9f6f2;
  box-shadow: 0 3px 12px rgba(245, 149, 99, 0.4);
}

.tile-32 {
  background: linear-gradient(135deg, #f67c5f, #f46842);
  color: #f9f6f2;
  box-shadow: 0 3px 14px rgba(246, 124, 95, 0.45);
}

.tile-64 {
  background: linear-gradient(135deg, #f65e3b, #f44a22);
  color: #f9f6f2;
  box-shadow: 0 4px 16px rgba(246, 94, 59, 0.5);
}

.tile-128 {
  background: linear-gradient(135deg, #edcf72, #eac455);
  color: #f9f6f2;
  font-size: 32px;
  box-shadow: 0 4px 18px rgba(237, 207, 114, 0.5);
}

.tile-256 {
  background: linear-gradient(135deg, #edcc61, #eac042);
  color: #f9f6f2;
  font-size: 32px;
  box-shadow: 0 4px 20px rgba(237, 204, 97, 0.55);
}

.tile-512 {
  background: linear-gradient(135deg, #edc850, #e7bc2e);
  color: #f9f6f2;
  font-size: 32px;
  box-shadow: 0 5px 22px rgba(237, 200, 80, 0.6);
}

.tile-1024 {
  background: linear-gradient(135deg, #edc53f, #e5b91e);
  color: #f9f6f2;
  font-size: 24px;
  box-shadow: 0 5px 24px rgba(237, 197, 63, 0.65);
}

.tile-2048 {
  background: linear-gradient(135deg, #edc22e, #e0b510);
  color: #f9f6f2;
  font-size: 24px;
  box-shadow: 0 6px 28px rgba(237, 194, 46, 0.7);
  animation: tile2048Glow 1.5s ease-in-out infinite alternate;
}

@keyframes tile2048Glow {
  from {
    box-shadow: 0 6px 28px rgba(237, 194, 46, 0.7);
  }
  to {
    box-shadow: 0 6px 40px rgba(237, 194, 46, 0.9), 0 0 20px rgba(237, 194, 46, 0.4);
  }
}

.game-tip {
  margin-top: 16px;
  text-align: center;
  color: #776e65;
  font-size: 14px;
}

.game-tip kbd {
  display: inline-block;
  padding: 3px 8px;
  border: 1px solid #bbada0;
  border-radius: 6px;
  background: linear-gradient(135deg, #eee4da, #e8dcc8);
  font-size: 12px;
  margin: 0 2px;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(187, 173, 160, 0.2);
}

.game-overlay {
  background: rgba(238, 228, 218, 0.75);
  backdrop-filter: blur(6px);
  border-radius: 12px;
}

.overlay-content {
  color: #776e65;
}

.overlay-emoji {
  font-size: 56px;
}

.overlay-text {
  font-size: 24px;
}

.overlay-score {
  font-size: 18px;
  margin-bottom: 16px;
  font-weight: 600;
}

.overlay-btn {
  background: linear-gradient(135deg, #8f7a66, #7a6652) !important;
  box-shadow: 0 4px 16px rgba(143, 122, 102, 0.4) !important;
}

.overlay-btn:hover {
  box-shadow: 0 6px 24px rgba(143, 122, 102, 0.5) !important;
}

@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }

  .game-title-area {
    text-align: center;
  }

  .game-title-2048 {
    font-size: 48px;
    justify-content: center;
  }

  .game-board {
    grid-template-columns: repeat(4, 68px);
    grid-template-rows: repeat(4, 68px);
    gap: 10px;
    padding: 10px;
  }

  .tile {
    font-size: 32px;
  }

  .tile-128,
  .tile-256,
  .tile-512 {
    font-size: 26px;
  }

  .tile-1024,
  .tile-2048 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .game-board {
    grid-template-columns: repeat(4, 58px);
    grid-template-rows: repeat(4, 58px);
    gap: 8px;
    padding: 8px;
  }

  .tile {
    font-size: 26px;
  }

  .tile-128,
  .tile-256,
  .tile-512 {
    font-size: 20px;
  }

  .tile-1024,
  .tile-2048 {
    font-size: 16px;
  }

  .game-tip {
    font-size: 12px;
    margin-top: 12px;
  }

  .overlay-emoji {
    font-size: 36px;
  }

  .overlay-text {
    font-size: 18px;
  }
}
</style>
