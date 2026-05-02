<template>
  <GamePage title="消消乐">
    <template #actions>
      <div class="action-group">
        <select v-model="mode" class="action-select equal-width-action" @change="newGame">
          <option value="chinese">语文模式</option>
          <option value="math">数学模式</option>
          <option value="english">英语模式</option>
        </select>
        <select v-model="gridCols" class="action-select equal-width-action" @change="newGame">
          <option :value="4">4列</option>
          <option :value="6">6列</option>
          <option :value="8">8列</option>
        </select>
      </div>
      <div class="action-group">
        <button class="btn-action equal-width-action" @click="newGame">重新开始</button>
      </div>
    </template>
    <template #actionsBottom>
      <div class="action-group">
        <span class="stat-badge equal-width-action"><span class="stat-icon">⭐</span> {{ score }}</span>
        <span class="stat-badge equal-width-action"><span class="stat-icon">🎯</span> {{ remaining }}</span>
        <span class="stat-badge equal-width-action"><span class="stat-icon">⏱</span> {{ elapsedTime }}s</span>
      </div>
    </template>
    <div class="match-wrapper">
      <div
          class="match-board"
          :style="boardStyle"
      >
        <div
            v-for="(tile, index) in tiles"
            :key="index"
            class="match-tile"
            :class="{
            selected: selectedIndex === index,
            matched: tile.matched,
            hint: hintPair.includes(index),
          }"
            @click="selectTile(index)"
        >
          <template v-if="!tile.matched">
            <div class="tile-icon">
              <img v-if="tile.image" :src="tile.image" :alt="tile.label" class="tile-icon-image"/>
              <template v-else>{{ tile.icon }}</template>
            </div>
            <div class="tile-label">{{ tile.label }}</div>
          </template>
          <div v-if="tile.matched" class="tile-match-effect">✨</div>
        </div>
      </div>
      <div v-if="gameOver" class="game-overlay">
        <div class="overlay-content">
          <div class="overlay-emoji">🎉</div>
          <div class="overlay-text">恭喜通关！</div>
          <div class="overlay-score">得分：{{ score }} | 用时：{{ elapsedTime }}s</div>
          <button class="btn btn-primary btn-lg overlay-btn" @click="newGame">再来一局</button>
        </div>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
import {GRADE1_CHARS} from '@/data/grade1Chars.js'
import {GRADE1_ENGLISH} from '@/data/grade1English.js'
import {shuffle} from '@/utils/helpers.js'

const mode = ref('chinese')
const gridCols = ref(6)
const tiles = ref([])
const selectedIndex = ref(-1)
const score = ref(0)
const remaining = ref(0)
const gameOver = ref(false)
const hintPair = ref([])
const elapsedTime = ref(0)
let timer = null

const gridRows = computed(() => {
  const total = gridCols.value * gridCols.value
  return gridCols.value
})

const boardStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridCols.value}, 1fr)`,
}))

function generatePairs() {
  const total = gridCols.value * gridCols.value
  const pairCount = total / 2
  let pairs = []

  if (mode.value === 'chinese') {
    const chars = shuffle(GRADE1_CHARS).slice(0, pairCount)
    pairs = chars.map(c => [
      {icon: c.emoji, image: c.image || null, label: c.char, pairId: c.char},
      {icon: c.emoji, image: c.image || null, label: c.pinyin, pairId: c.char},
    ])
  } else if (mode.value === 'math') {
    const mathPairs = []
    const usedResults = new Set()
    for (let i = 0; i < pairCount; i++) {
      const a = Math.floor(Math.random() * 9) + 1
      const b = Math.floor(Math.random() * 9) + 1
      const result = a + b
      const id = `math_${result}`
      usedResults.add(result)
      mathPairs.push([
        {icon: '🧮', label: `${a}+${b}`, pairId: id, type: 'expr'},
        {icon: '🔢', label: `${result}`, pairId: id, type: 'result'},
      ])
    }
    pairs = mathPairs
  } else {
    const words = shuffle(GRADE1_ENGLISH).slice(0, pairCount)
    pairs = words.map((w, i) => [
      {icon: w.emoji, image: w.image || null, label: w.word, pairId: `en_${i}`},
      {icon: w.emoji, image: w.image || null, label: w.chinese, pairId: `en_${i}`},
    ])
  }

  return pairs
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

function newGame() {
  stopTimer()
  const pairs = generatePairs()
  const allTiles = shuffle(pairs.flat())

  tiles.value = allTiles.map(t => ({
    ...t,
    matched: false,
  }))

  selectedIndex.value = -1
  score.value = 0
  remaining.value = tiles.value.length
  gameOver.value = false
  hintPair.value = []
  startTimer()
}

function selectTile(index) {
  if (gameOver.value) return
  if (tiles.value[index].matched) return
  if (selectedIndex.value === index) {
    selectedIndex.value = -1
    return
  }

  if (selectedIndex.value < 0) {
    selectedIndex.value = index
    return
  }

  const first = tiles.value[selectedIndex.value]
  const second = tiles.value[index]

  const samePair = first.pairId === second.pairId
  const sameType = first.type && second.type && first.type === second.type
  const isMatch = samePair && !sameType

  if (isMatch) {
    first.matched = true
    second.matched = true
    score.value += 10
    remaining.value -= 2
    selectedIndex.value = -1
    hintPair.value = []

    if (remaining.value <= 0) {
      gameOver.value = true
      stopTimer()
    }
  } else {
    hintPair.value = [selectedIndex.value, index]
    selectedIndex.value = -1
    setTimeout(() => {
      hintPair.value = []
    }, 600)
  }
}

onMounted(() => {
  newGame()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.equal-width-action {
  min-width: 80px;
  justify-content: center;
  text-align: center;
}

.action-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.match-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: auto;
}

.match-board {
  display: grid;
  gap: 8px;
  padding: 14px;
  background: linear-gradient(135deg, #f8f8f8, #f0f0f0);
  border-radius: 16px;
  border: 2px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.match-tile {
  width: 72px;
  height: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border: 2px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  position: relative;
  overflow: hidden;
}

.match-tile::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.08), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.match-tile:hover {
  border-color: rgba(108, 92, 231, 0.35);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 20px rgba(108, 92, 231, 0.12);
}

.match-tile:hover::before {
  opacity: 1;
}

.match-tile.selected {
  border-color: #6c5ce7;
  background: linear-gradient(145deg, #ede8ff, #ddd5ff);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2), 0 4px 16px rgba(108, 92, 231, 0.15);
  transform: translateY(-2px) scale(1.05);
  animation: matchSelected 0.8s ease-in-out infinite alternate;
}

@keyframes matchSelected {
  from {
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2), 0 4px 16px rgba(108, 92, 231, 0.15);
  }
  to {
    box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.3), 0 4px 24px rgba(108, 92, 231, 0.22);
  }
}

.match-tile.matched {
  opacity: 0;
  pointer-events: none;
  transform: scale(0.5) rotate(10deg);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tile-match-effect {
  position: absolute;
  font-size: 28px;
  animation: matchPop 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes matchPop {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.match-tile.hint {
  border-color: #e74c3c;
  animation: matchShake 0.4s ease-in-out;
  box-shadow: 0 0 12px rgba(231, 76, 60, 0.2);
}

@keyframes matchShake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.tile-icon {
  font-size: 24px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.tile-icon-image {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.tile-label {
  font-size: 15px;
  font-weight: 700;
  color: #2a2a48;
  margin-top: 3px;
  text-align: center;
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(108, 92, 231, 0.06);
}

.game-overlay {
  position: absolute;
  inset: 0;
  background: rgba(240, 236, 247, 0.88);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  z-index: 10;
  animation: matchOverlayIn 0.4s ease;
}

@keyframes matchOverlayIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.overlay-content {
  text-align: center;
  color: #2a2a48;
  animation: matchContentIn 0.5s ease 0.1s both;
}

@keyframes matchContentIn {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.overlay-emoji {
  font-size: 64px;
  margin-bottom: 12px;
  animation: matchEmojiBounce 0.6s ease 0.3s both;
}

@keyframes matchEmojiBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.overlay-text {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #6c5ce7, #fd79a8, #00cec9);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: matchGradientShift 3s ease infinite;
}

@keyframes matchGradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.overlay-score {
  font-size: 16px;
  margin-bottom: 20px;
  color: rgba(42, 42, 72, 0.7);
}

.overlay-btn {
  background: linear-gradient(135deg, #6c5ce7, #a855f7) !important;
  box-shadow: 0 4px 20px rgba(108, 92, 231, 0.4) !important;
}

.overlay-btn:hover {
  box-shadow: 0 6px 28px rgba(108, 92, 231, 0.55) !important;
  transform: translateY(-2px) !important;
}

@media (max-width: 768px) {
  .match-tile {
    width: 64px;
    height: 64px;
  }

  .tile-icon {
    font-size: 22px;
  }

  .tile-label {
    font-size: 13px;
  }

  .match-board {
    gap: 6px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .match-tile {
    width: 52px;
    height: 52px;
    border-radius: 10px;
  }

  .tile-icon {
    font-size: 18px;
  }

  .tile-label {
    font-size: 11px;
    max-width: 48px;
  }

  .match-board {
    gap: 5px;
    padding: 8px;
  }

  .overlay-emoji {
    font-size: 48px;
  }

  .overlay-text {
    font-size: 22px;
  }
}
</style>
