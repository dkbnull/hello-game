<template>
  <GamePage title="消消乐">
    <template #actions>
      <select v-model="mode" class="mode-select" @change="newGame">
        <option value="chinese">语文模式</option>
        <option value="math">数学模式</option>
        <option value="english">英语模式</option>
      </select>
      <select v-model="gridCols" class="mode-select" @change="newGame">
        <option :value="4">4列</option>
        <option :value="6">6列</option>
        <option :value="8">8列</option>
      </select>
      <button class="btn btn-primary btn-sm" @click="newGame">新游戏</button>
      <span class="score-display">得分：{{ score }}</span>
      <span class="score-display">剩余：{{ remaining }}</span>
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
            <div class="tile-icon">{{ tile.icon }}</div>
            <div class="tile-label">{{ tile.label }}</div>
          </template>
        </div>
      </div>
      <div v-if="gameOver" class="game-overlay">
        <div class="overlay-content">
          <div class="overlay-emoji">🎉</div>
          <div class="overlay-text">恭喜通关！得分：{{ score }}</div>
          <button class="btn btn-primary" @click="newGame">再来一局</button>
        </div>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
import {computed, ref} from 'vue'
import GamePage from '../../components/GamePage.vue'
import {GRADE1_CHARS} from '../../data/grade1Chars.js'
import {GRADE1_ENGLISH} from '../../data/grade1English.js'

const mode = ref('chinese')
const gridCols = ref(6)
const tiles = ref([])
const selectedIndex = ref(-1)
const score = ref(0)
const remaining = ref(0)
const gameOver = ref(false)
const hintPair = ref([])

const gridRows = computed(() => {
  const total = gridCols.value * gridCols.value
  return gridCols.value
})

const boardStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridCols.value}, 1fr)`,
}))

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generatePairs() {
  const total = gridCols.value * gridCols.value
  const pairCount = total / 2
  let pairs = []

  if (mode.value === 'chinese') {
    const chars = shuffle(GRADE1_CHARS).slice(0, pairCount)
    pairs = chars.map(c => [
      {icon: c.emoji, label: c.char, pairId: c.char},
      {icon: c.emoji, label: c.pinyin, pairId: c.char},
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
      {icon: w.emoji, label: w.word, pairId: `en_${i}`},
      {icon: w.emoji, label: w.chinese, pairId: `en_${i}`},
    ])
  }

  return pairs
}

function newGame() {
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
    }
  } else {
    hintPair.value = [selectedIndex.value, index]
    selectedIndex.value = -1
    setTimeout(() => {
      hintPair.value = []
    }, 600)
  }
}

newGame()
</script>

<style scoped>
.match-wrapper {
  position: relative;
  display: inline-block;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: auto;
}

.mode-select {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-card);
  cursor: pointer;
  outline: none;
}

.mode-select:focus {
  border-color: var(--primary);
}

.score-display {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-left: 8px;
}

.match-board {
  display: grid;
  gap: 6px;
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  border: 3px solid var(--border);
}

.match-tile {
  width: 72px;
  height: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.match-tile:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.match-tile.selected {
  border-color: var(--primary);
  background: #ede9fe;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}

.match-tile.matched {
  opacity: 0;
  pointer-events: none;
  transform: scale(0.8);
}

.match-tile.hint {
  border-color: var(--danger);
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

.tile-icon {
  font-size: 24px;
  line-height: 1;
}

.tile-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 3px;
  text-align: center;
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .mode-select {
    padding: 4px 8px;
    font-size: 13px;
  }

  .score-display {
    font-size: 14px;
  }

  .match-tile {
    width: 60px;
    height: 60px;
  }

  .tile-icon {
    font-size: 20px;
  }

  .tile-label {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .match-tile {
    width: 48px;
    height: 48px;
  }

  .tile-icon {
    font-size: 16px;
  }

  .tile-label {
    font-size: 9px;
    max-width: 44px;
  }

  .match-board {
    gap: 4px;
    padding: 6px;
  }

  .score-display {
    font-size: 12px;
    margin-left: 4px;
  }

  .overlay-emoji {
    font-size: 36px;
  }

  .overlay-text {
    font-size: 16px;
  }
}
</style>
