<template>
  <GamePage hero>
    <div class="salary-wrapper">
      <div v-if="!isRunning" class="input-screen">
        <div class="gold-icon-wrapper">
          <div class="gold-icon">💰</div>
          <div class="gold-ring"></div>
        </div>
        <h2 class="gold-title">实时工资计算器</h2>
        <p class="gold-subtitle">看看你每秒赚多少钱</p>

        <div class="form-section">
          <div class="form-group">
            <label class="form-label gold-label">计算模式</label>
            <div class="mode-grid">
              <button
                  class="mode-btn"
                  :class="{ active: counterMode === 'smart' }"
                  @click="counterMode = 'smart'"
              >
                <span class="mode-icon">🧠</span>
                <span class="mode-name">智能模式</span>
                <span class="mode-desc">按系统时间实时计算</span>
              </button>
              <button
                  class="mode-btn"
                  :class="{ active: counterMode === 'free' }"
                  @click="counterMode = 'free'"
              >
                <span class="mode-icon">🚀</span>
                <span class="mode-name">自由模式</span>
                <span class="mode-desc">从0开始计时计算</span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label gold-label">月薪（元）</label>
            <input
                v-model.number="monthlySalary"
                class="form-input gold-input salary-input"
                type="number"
                placeholder="请输入月薪"
                min="0"
            />
          </div>

          <div class="form-group">
            <label class="form-label gold-label">上班时间</label>
            <div class="time-row">
              <input
                  v-model="workStartTime"
                  class="form-input gold-input time-input"
                  type="time"
              />
              <span class="time-separator">至</span>
              <input
                  v-model="workEndTime"
                  class="form-input gold-input time-input"
                  type="time"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label gold-label">每月工作天数</label>
            <div class="days-grid">
              <button
                  v-for="preset in WORK_DAY_PRESETS"
                  :key="preset.value"
                  class="days-btn"
                  :class="{ active: workDays === preset.value }"
                  @click="workDays = preset.value"
              >
                <span class="days-label">{{ preset.label }}</span>
                <span class="days-value">{{ preset.value }}天</span>
              </button>
            </div>
            <div class="custom-days">
              <input
                  v-model.number="workDays"
                  class="form-input gold-input custom-days-input"
                  type="number"
                  placeholder="自定义天数"
                  min="1"
                  max="31"
              />
              <span class="custom-days-unit">天/月</span>
            </div>
          </div>
        </div>

        <button
            class="btn btn-gold btn-lg"
            :disabled="!canStart"
            @click="startCounter"
        >
          开始赚钱 💸
        </button>
      </div>

      <div v-else class="counter-screen">
        <h2 class="gold-title counter-gold-title">实时工资</h2>
        <div class="coin-canvas" ref="coinCanvasRef"></div>

        <div v-if="counterMode === 'smart'" class="work-status-bar" :class="workStatusClass">
          <span class="work-status-dot"></span>
          <span class="work-status-text">{{ workStatusText }}</span>
        </div>

        <div class="counter-main">
          <div class="earning-label">{{ counterMode === 'smart' ? '今日已赚取' : '已赚取' }}</div>
          <div class="earning-amount">
            <span class="currency-sign">¥</span>
            <span class="amount-integer">{{ earnedInteger }}</span>
            <span class="amount-dot">.</span>
            <span class="amount-decimal">{{ earnedDecimal }}</span>
          </div>
          <div class="earning-rate">
            每秒 <span class="rate-value">¥{{ perSecondRate }}</span>
          </div>
        </div>

        <div class="counter-stats">
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <div class="stat-value">¥{{ todayEarnings }}</div>
              <div class="stat-label">今日已赚</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-info">
              <div class="stat-value">{{ workedTime }}</div>
              <div class="stat-label">{{ counterMode === 'smart' ? '今日工时' : '已计时' }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-info">
              <div class="stat-value">¥{{ dailySalary }}</div>
              <div class="stat-label">日薪</div>
            </div>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-header">
            <span>{{ counterMode === 'smart' ? '今日进度' : '工作进度' }}</span>
            <span>{{ workProgress }}%</span>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar" :style="{ width: workProgress + '%' }">
              <div class="progress-shine"></div>
            </div>
          </div>
        </div>

        <div class="milestone-section">
          <div class="milestone-label">下一个里程碑</div>
          <div class="milestone-value">¥{{ nextMilestone }}</div>
          <div class="milestone-progress-wrapper">
            <div
                class="milestone-progress"
                :style="{ width: milestoneProgress + '%' }"
            ></div>
          </div>
        </div>

        <button class="btn-reset" @click="stopCounter">
          <span class="btn-reset-icon">↺</span>
          重新设置
        </button>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
const WORK_DAY_PRESETS = [
  {label: '法定', value: 21.75},
  {label: '大小周', value: 24},
  {label: '单休', value: 26},
  {label: '月休4天', value: 26},
  {label: '无休', value: 30},
]

const counterMode = ref('smart')
const monthlySalary = ref(null)
const workStartTime = ref('09:00')
const workEndTime = ref('18:00')
const workDays = ref(21.75)

const isRunning = ref(false)
const startTime = ref(null)
const earned = ref(0)
const tick = ref(0)
const timer = ref(null)
const coinCanvasRef = ref(null)
const coins = ref([])
const lastMilestone = ref(0)
const coinAnimFrame = ref(null)

const canStart = computed(() => {
  return monthlySalary.value > 0 && workDays.value > 0 && workStartTime.value && workEndTime.value
})

const dailyWorkSeconds = computed(() => {
  const [sh, sm] = workStartTime.value.split(':').map(Number)
  const [eh, em] = workEndTime.value.split(':').map(Number)
  const startSec = sh * 3600 + sm * 60
  const endSec = eh * 3600 + em * 60
  return Math.max(0, endSec - startSec)
})

const perSecondRate = computed(() => {
  if (!monthlySalary.value || !workDays.value || !dailyWorkSeconds.value) return '0.000000'
  const rate = monthlySalary.value / (workDays.value * dailyWorkSeconds.value)
  return rate.toFixed(6)
})

const perSecondRateNum = computed(() => {
  if (!monthlySalary.value || !workDays.value || !dailyWorkSeconds.value) return 0
  return monthlySalary.value / (workDays.value * dailyWorkSeconds.value)
})

const dailySalary = computed(() => {
  if (!monthlySalary.value || !workDays.value) return '0.00'
  return (monthlySalary.value / workDays.value).toFixed(2)
})

const earnedInteger = computed(() => {
  const val = earned.value
  return Math.floor(val).toLocaleString()
})

const earnedDecimal = computed(() => {
  const val = earned.value
  const dec = (val % 1).toFixed(6).substring(2)
  return dec
})

const todayEarnings = computed(() => {
  return earned.value.toFixed(2)
})

function getCurrentWorkSeconds() {
  const now = new Date()
  const [sh, sm] = workStartTime.value.split(':').map(Number)
  const [eh, em] = workEndTime.value.split(':').map(Number)
  const startSec = sh * 3600 + sm * 60
  const endSec = eh * 3600 + em * 60
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  if (nowSec < startSec) return 0
  if (nowSec >= endSec) return endSec - startSec
  return nowSec - startSec
}

function isCurrentlyWorking() {
  const now = new Date()
  const [sh, sm] = workStartTime.value.split(':').map(Number)
  const [eh, em] = workEndTime.value.split(':').map(Number)
  const startSec = sh * 3600 + sm * 60
  const endSec = eh * 3600 + em * 60
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  return nowSec >= startSec && nowSec < endSec
}

function isBeforeWork() {
  const now = new Date()
  const [sh, sm] = workStartTime.value.split(':').map(Number)
  const startSec = sh * 3600 + sm * 60
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  return nowSec < startSec
}

function getTimeToWork() {
  const now = new Date()
  const [sh, sm] = workStartTime.value.split(':').map(Number)
  const startSec = sh * 3600 + sm * 60
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  const diff = startSec - nowSec
  if (diff <= 0) return ''
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60
  if (h > 0) return `${h}时${m}分后上班`
  if (m > 0) return `${m}分${s}秒后上班`
  return `${s}秒后上班`
}

const workedTime = computed(() => {
  tick.value
  if (counterMode.value === 'smart') {
    const seconds = getCurrentWorkSeconds()
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${h}时${m}分${s}秒`
  }
  if (!startTime.value) return '0时0分0秒'
  const elapsed = (Date.now() - startTime.value) / 1000
  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = Math.floor(elapsed % 60)
  return `${h}时${m}分${s}秒`
})

const workProgress = computed(() => {
  tick.value
  if (!dailyWorkSeconds.value) return 0
  if (counterMode.value === 'smart') {
    const worked = getCurrentWorkSeconds()
    return Math.min(100, (worked / dailyWorkSeconds.value) * 100).toFixed(1)
  }
  if (!startTime.value) return 0
  const elapsed = (Date.now() - startTime.value) / 1000
  return Math.min(100, (elapsed / dailyWorkSeconds.value) * 100).toFixed(1)
})

const workStatusText = computed(() => {
  tick.value
  if (isBeforeWork()) return `未到上班时间 · ${getTimeToWork()}`
  if (isCurrentlyWorking()) return '工作中 · 实时计薪中'
  return '已下班 · 今日工资已结算'
})

const workStatusClass = computed(() => {
  tick.value
  if (isBeforeWork()) return 'status-before'
  if (isCurrentlyWorking()) return 'status-working'
  return 'status-off'
})

const nextMilestone = computed(() => {
  const current = earned.value
  const milestone = (Math.floor(current / 10) + 1) * 10
  return milestone.toFixed(0)
})

const milestoneProgress = computed(() => {
  const current = earned.value
  const currentMilestone = Math.floor(current / 10) * 10
  const progress = ((current - currentMilestone) / 10) * 100
  return Math.min(100, progress).toFixed(1)
})

function startCounter() {
  if (!canStart.value) return
  lastMilestone.value = 0

  if (counterMode.value === 'smart') {
    earned.value = getCurrentWorkSeconds() * perSecondRateNum.value
  } else {
    earned.value = 0
    startTime.value = Date.now()
  }

  lastMilestone.value = Math.floor(earned.value / 10) * 10
  isRunning.value = true

  nextTick(() => {
    initCoinCanvas()
  })

  timer.value = setInterval(() => {
    tick.value++

    if (counterMode.value === 'smart') {
      if (isCurrentlyWorking()) {
        earned.value = getCurrentWorkSeconds() * perSecondRateNum.value
      } else if (isBeforeWork()) {
        earned.value = 0
      } else {
        earned.value = dailyWorkSeconds.value * perSecondRateNum.value
      }
    } else {
      const elapsed = (Date.now() - startTime.value) / 1000
      earned.value = elapsed * perSecondRateNum.value
    }

    const currentMilestone = Math.floor(earned.value / 10) * 10
    if (currentMilestone > lastMilestone.value && currentMilestone > 0) {
      lastMilestone.value = currentMilestone
      spawnCoinBurst()
    }
  }, 50)
}

function stopCounter() {
  isRunning.value = false
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  if (coinAnimFrame.value) {
    cancelAnimationFrame(coinAnimFrame.value)
    coinAnimFrame.value = null
  }
  coins.value = []
  earned.value = 0
  lastMilestone.value = 0
  startTime.value = null
}

let coinCtx = null
let coinCanvasWidth = 0
let coinCanvasHeight = 0

function initCoinCanvas() {
  const container = coinCanvasRef.value
  if (!container) return

  const canvas = document.createElement('canvas')
  canvas.width = container.clientWidth * 2
  canvas.height = container.clientHeight * 2
  canvas.style.width = container.clientWidth + 'px'
  canvas.style.height = container.clientHeight + 'px'
  container.innerHTML = ''
  container.appendChild(canvas)

  coinCtx = canvas.getContext('2d')
  coinCanvasWidth = canvas.width
  coinCanvasHeight = canvas.height

  animateCoins()
}

function spawnCoinBurst() {
  const count = 8 + Math.floor(Math.random() * 6)
  for (let i = 0; i < count; i++) {
    coins.value.push({
      x: Math.random() * coinCanvasWidth,
      y: -40 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 2 + 2,
      size: 20 + Math.random() * 20,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      phase: Math.random() * Math.PI * 2,
    })
  }
}

function animateCoins() {
  if (!coinCtx) return

  coinCtx.clearRect(0, 0, coinCanvasWidth, coinCanvasHeight)

  const now = Date.now() / 1000

  coins.value = coins.value.filter(coin => {
    coin.x += coin.vx
    coin.vy += 0.15
    coin.y += coin.vy
    coin.rotation += coin.rotationSpeed
    coin.phase += 0.05

    if (coin.y > coinCanvasHeight + 50) {
      return false
    }

    if (coin.y > coinCanvasHeight * 0.7) {
      coin.opacity = Math.max(0, 1 - (coin.y - coinCanvasHeight * 0.7) / (coinCanvasHeight * 0.3))
    }

    drawCoin(coinCtx, coin, now)
    return true
  })

  coinAnimFrame.value = requestAnimationFrame(animateCoins)
}

function drawCoin(ctx, coin, time) {
  ctx.save()
  ctx.globalAlpha = coin.opacity
  ctx.translate(coin.x, coin.y)
  ctx.rotate(coin.rotation)

  const scaleX = Math.cos(time * 3 + coin.phase)
  ctx.scale(scaleX, 1)

  const r = coin.size

  const gradient = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r)
  gradient.addColorStop(0, '#fff7a0')
  gradient.addColorStop(0.3, '#ffd700')
  gradient.addColorStop(0.7, '#daa520')
  gradient.addColorStop(1, '#b8860b')

  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.strokeStyle = '#b8860b'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  if (Math.abs(scaleX) > 0.3) {
    ctx.fillStyle = 'rgba(139, 90, 0, 0.6)'
    ctx.font = `bold ${r * 0.8}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('¥', 0, 0)
  }

  ctx.restore()
}

onUnmounted(() => {
  stopCounter()
})
</script>

<style scoped>
.salary-wrapper {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px 0;
}

.gold-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gold-icon {
  font-size: 48px;
  z-index: 1;
  animation: goldPulse 2s ease-in-out infinite;
}

.gold-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 3px solid #ffd700;
  animation: ringExpand 2s ease-in-out infinite;
}

@keyframes goldPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes ringExpand {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
}

.gold-title {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd700, #ffaa00, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}

.gold-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.form-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gold-label {
  color: #8b6914;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
}

.gold-input {
  border: 2px solid #e8d5a0 !important;
  background: linear-gradient(135deg, #fffdf0, #fff8e0) !important;
  padding: 14px 16px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #5a3e00 !important;
  border-radius: var(--radius) !important;
  transition: all 0.3s ease !important;
  height: auto !important;
}

.gold-input::placeholder {
  color: #c9a84c !important;
  font-weight: 400 !important;
}

.gold-input:focus {
  border-color: #ffd700 !important;
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.15), 0 4px 16px rgba(255, 215, 0, 0.1) !important;
  background: linear-gradient(135deg, #fffef5, #fffbf0) !important;
}

.gold-input:hover:not(:focus) {
  border-color: #daa520 !important;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1) !important;
}

.salary-input {
  width: 100% !important;
  display: block !important;
}

.salary-input::-webkit-inner-spin-button,
.salary-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.salary-input {
  -moz-appearance: textfield;
}

.mode-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 10px;
  border-radius: var(--radius);
  border: 2px solid #e8d5a0;
  background: linear-gradient(135deg, #fffdf0, #fff8e0);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-btn:hover {
  border-color: #ffd700;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
}

.mode-btn.active {
  border-color: #ffd700;
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
}

.mode-btn.active .mode-name,
.mode-btn.active .mode-desc {
  color: #5a3e00;
}

.mode-icon {
  font-size: 24px;
}

.mode-name {
  font-size: 15px;
  font-weight: 700;
  color: #8b6914;
}

.mode-desc {
  font-size: 11px;
  color: #b8860b;
}

.time-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-input {
  flex: 1;
}

.time-separator {
  color: var(--text-secondary);
  font-size: 14px;
  flex-shrink: 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.days-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  border-radius: var(--radius-sm);
  border: 2px solid #e8d5a0;
  background: linear-gradient(135deg, #fffdf0, #fff8e0);
  cursor: pointer;
  transition: all 0.3s ease;
}

.days-btn:hover {
  border-color: #ffd700;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
}

.days-btn.active {
  border-color: #ffd700;
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
}

.days-btn.active .days-label,
.days-btn.active .days-value {
  color: #fff;
}

.days-label {
  font-size: 13px;
  font-weight: 600;
  color: #8b6914;
}

.days-value {
  font-size: 11px;
  color: #b8860b;
  margin-top: 2px;
}

.custom-days {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-days-input {
  flex: 1;
}

.custom-days-unit {
  color: var(--text-secondary);
  font-size: 14px;
  flex-shrink: 0;
}

.btn-gold {
  background: linear-gradient(135deg, #ffd700, #ffaa00) !important;
  color: #5a3e00 !important;
  border: none !important;
  font-weight: 700 !important;
  font-size: 18px !important;
  padding: 14px 40px !important;
  border-radius: var(--radius) !important;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
  position: relative;
  overflow: hidden;
}

.btn-gold::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 70%
  );
  animation: btnShine 3s ease-in-out infinite;
}

@keyframes btnShine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.btn-gold:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(255, 215, 0, 0.5);
}

.btn-gold:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #ffd700;
  border: 1.5px solid rgba(255, 215, 0, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.btn-reset:hover {
  background: linear-gradient(135deg, #1a1a2e, #1c2a4a);
  border-color: #ffd700;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.25);
  transform: translateY(-1px);
}

.btn-reset:active {
  transform: scale(0.97);
}

.btn-reset-icon {
  display: inline-flex;
  font-size: 16px;
  animation: resetSpin 3s linear infinite;
}

@keyframes resetSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.counter-screen {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
  position: relative;
}

.coin-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.work-status-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  width: 100%;
  justify-content: center;
}

.work-status-bar.status-before {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  color: #e65100;
  border: 1px solid rgba(230, 81, 0, 0.2);
}

.work-status-bar.status-working {
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.2);
}

.work-status-bar.status-off {
  background: linear-gradient(135deg, #f3e5f5, #e1bee7);
  color: #6a1b9a;
  border: 1px solid rgba(106, 27, 154, 0.2);
}

.work-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-before .work-status-dot {
  background: #ff9800;
  animation: dotPulse 1.5s ease-in-out infinite;
}

.status-working .work-status-dot {
  background: #4caf50;
  animation: dotPulse 1s ease-in-out infinite;
}

.status-off .work-status-dot {
  background: #9c27b0;
}

@keyframes dotPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.7);
  }
}

.counter-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: var(--radius-lg);
  width: 100%;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.counter-main::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(255, 215, 0, 0.15), transparent 70%);
  pointer-events: none;
}

.counter-main::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
      45deg,
      transparent 40%,
      rgba(255, 215, 0, 0.05) 50%,
      transparent 60%
  );
  animation: counterShine 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes counterShine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.earning-label {
  font-size: 14px;
  color: rgba(255, 215, 0, 0.7);
  letter-spacing: 4px;
  text-transform: uppercase;
  z-index: 1;
}

.earning-amount {
  display: flex;
  align-items: baseline;
  z-index: 1;
}

.currency-sign {
  font-size: 28px;
  font-weight: 700;
  color: #ffd700;
  margin-right: 4px;
}

.amount-integer {
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(180deg, #fff7a0, #ffd700, #daa520);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--font-mono);
  line-height: 1;
}

.amount-dot {
  font-size: 36px;
  font-weight: 700;
  color: #ffd700;
}

.amount-decimal {
  font-size: 24px;
  font-weight: 600;
  color: #daa520;
  font-family: var(--font-mono);
  min-width: 72px;
}

.earning-rate {
  font-size: 14px;
  color: rgba(255, 215, 0, 0.6);
  z-index: 1;
}

.rate-value {
  color: #ffd700;
  font-weight: 700;
  font-family: var(--font-mono);
}

.counter-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  background: linear-gradient(135deg, #fffdf0, #fff8e0);
  border-radius: var(--radius);
  border: 1px solid rgba(218, 165, 32, 0.2);
}

.stat-icon {
  font-size: 20px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: 15px;
  font-weight: 700;
  color: #8b6914;
  font-family: var(--font-mono);
}

.stat-label {
  font-size: 11px;
  color: #b8860b;
}

.progress-section {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #fffdf0, #fff8e0);
  border-radius: var(--radius);
  border: 1px solid rgba(218, 165, 32, 0.2);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #8b6914;
  font-weight: 600;
  margin-bottom: 8px;
}

.progress-bar-wrapper {
  height: 10px;
  background: rgba(218, 165, 32, 0.15);
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ffaa00);
  border-radius: 5px;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
  );
  animation: progressShine 2s ease-in-out infinite;
}

@keyframes progressShine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.milestone-section {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: var(--radius);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.milestone-label {
  font-size: 12px;
  color: rgba(255, 215, 0, 0.6);
  margin-bottom: 4px;
}

.milestone-value {
  font-size: 22px;
  font-weight: 800;
  color: #ffd700;
  font-family: var(--font-mono);
  margin-bottom: 8px;
}

.milestone-progress-wrapper {
  height: 6px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.milestone-progress {
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ffaa00);
  border-radius: 3px;
  transition: width 0.3s ease;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}
</style>
