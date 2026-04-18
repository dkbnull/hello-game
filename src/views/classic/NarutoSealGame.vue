<template>
  <GamePage title="忍者结印">
    <template #actions>
      <button class="btn-action naruto-action-btn" @click="toggleCamera">
        {{ cameraActive ? '关闭摄像头' : '开启摄像头' }}
      </button>
      <button v-if="cameraActive" class="btn-secondary-action naruto-action-btn" @click="resetJutsu">
        清除忍术
      </button>
    </template>
    <div class="naruto-container">
      <div v-if="!cameraActive" class="camera-prompt">
        <img :src="narutoIcon" alt="忍者结印" class="prompt-svg"/>
        <p class="prompt-text">点击「开启摄像头」开始结印修炼</p>
        <div class="seal-guide">
          <h3>结印手势指南</h3>
          <div class="guide-list">
            <div class="guide-item" v-for="jutsu in JUTSU_LIST" :key="jutsu.name">
              <span class="guide-emoji">{{ jutsu.emoji }}</span>
              <div class="guide-info">
                <strong>{{ jutsu.name }}</strong>
                <p>{{ jutsu.gesture }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="camera-area">
        <div class="video-wrapper">
          <video ref="videoRef" class="camera-video" playsinline></video>
          <canvas ref="canvasRef" class="landmark-canvas"></canvas>
          <div v-if="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p>正在加载手势识别模型...</p>
          </div>
        </div>
        <div class="jutsu-panel">
          <div class="current-jutsu" :class="{ active: currentJutsu }">
            <span class="jutsu-emoji">{{ currentJutsu ? currentJutsu.emoji : '❓' }}</span>
            <span class="jutsu-name">{{ currentJutsu ? currentJutsu.name : '等待结印...' }}</span>
          </div>
          <div class="finger-states" v-if="fingerStates">
            <span class="finger-label">手指：</span>
            <span class="finger" :class="{ extended: fingerStates.thumb }">👍</span>
            <span class="finger" :class="{ extended: fingerStates.index }">☝️</span>
            <span class="finger" :class="{ extended: fingerStates.middle }">🖕</span>
            <span class="finger" :class="{ extended: fingerStates.ring }">💍</span>
            <span class="finger" :class="{ extended: fingerStates.pinky }">🤙</span>
          </div>
        </div>
      </div>
      <div v-if="activeEffect" class="effect-layer">
        <div v-if="activeEffect === 'shadow-clone'" class="shadow-clone-effect">
          <div class="clone clone-original">
            <canvas ref="cloneCanvasRef" class="clone-canvas"></canvas>
          </div>
          <div class="clone clone-1">
            <canvas class="clone-canvas-copy"></canvas>
          </div>
          <div class="clone clone-2">
            <canvas class="clone-canvas-copy"></canvas>
          </div>
          <div class="clone clone-3">
            <canvas class="clone-canvas-copy"></canvas>
          </div>
          <div class="smoke-particle" v-for="i in 12" :key="'s'+i" :style="smokeStyle(i)"></div>
        </div>
        <div v-if="activeEffect === 'rasengan'" class="rasengan-effect">
          <div class="rasengan-ball">
            <div class="rasengan-core"></div>
            <div class="rasengan-ring ring-1"></div>
            <div class="rasengan-ring ring-2"></div>
            <div class="rasengan-ring ring-3"></div>
            <div class="rasengan-glow"></div>
          </div>
          <div class="rasengan-particle" v-for="i in 20" :key="'r'+i" :style="rasenganParticleStyle(i)"></div>
        </div>
        <div v-if="activeEffect === 'fire-release'" class="fire-effect">
          <div class="fire-core"></div>
          <div class="fire-particle" v-for="i in 30" :key="'f'+i" :style="fireParticleStyle(i)"></div>
        </div>
        <div v-if="activeEffect === 'chidori'" class="chidori-effect">
          <div class="chidori-core"></div>
          <div class="lightning-bolt" v-for="i in 8" :key="'l'+i" :style="lightningStyle(i)"></div>
          <div class="chidori-spark" v-for="i in 15" :key="'c'+i" :style="sparkStyle(i)"></div>
        </div>
        <div class="jutsu-announce">
          <span class="announce-text">{{ currentJutsu?.announce || '' }}</span>
        </div>
      </div>
    </div>
  </GamePage>
</template>

<script setup>
import {nextTick, onUnmounted, ref} from 'vue'
import GamePage from '@/components/GamePage.vue'
import narutoIcon from '@/assets/icons/naruto.svg'

const JUTSU_LIST = [
  {
    name: '影分身之术',
    emoji: '👥',
    effect: 'shadow-clone',
    gesture: '双手比V字（食指+中指伸出）',
    announce: '影分身之术！',
    audioSrc: '/audio/shadow-clone.mp3',
  },
  {
    name: '螺旋丸',
    emoji: '🌀',
    effect: 'rasengan',
    gesture: '双手合拢（所有手指弯曲）',
    announce: '螺旋丸！',
    audioSrc: '/audio/rasengan.mp3',
  },
  {
    name: '火遁·豪火球',
    emoji: '🔥',
    effect: 'fire-release',
    gesture: '单手OK手势（拇指+食指成圈）',
    announce: '火遁·豪火球之术！',
    audioSrc: '/audio/fire-release.mp3',
  },
  {
    name: '千鸟',
    emoji: '⚡',
    effect: 'chidori',
    gesture: '单手五指张开',
    announce: '千鸟！',
    audioSrc: '/audio/chidori.mp3',
  },
]

const HAND_CONNECTIONS_DATA = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
]

const videoRef = ref(null)
const canvasRef = ref(null)
const cloneCanvasRef = ref(null)
const cameraActive = ref(false)
const loading = ref(false)
const currentJutsu = ref(null)
const activeEffect = ref(null)
const fingerStates = ref(null)

let handsInstance = null
let cameraInstance = null
let jutsuTimeout = null
let lastJutsuTime = 0
let animFrameId = null

const jutsuAudioMap = {}

function preloadAudio() {
  for (const jutsu of JUTSU_LIST) {
    if (jutsu.audioSrc) {
      const audio = new Audio(jutsu.audioSrc)
      audio.preload = 'auto'
      jutsuAudioMap[jutsu.effect] = audio
    }
  }
}

function playJutsuAudio(effect) {
  const audio = jutsuAudioMap[effect]
  if (audio) {
    audio.currentTime = 0
    audio.play().catch(() => {
    })
  }
}

preloadAudio()

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.crossOrigin = 'anonymous'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function loadMediaPipe() {
  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js')
  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js')
  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')
}

function drawHandLandmarks(ctx, landmarks, w, h) {
  ctx.strokeStyle = '#00FF00'
  ctx.lineWidth = 2
  for (const [a, b] of HAND_CONNECTIONS_DATA) {
    ctx.beginPath()
    ctx.moveTo(landmarks[a].x * w, landmarks[a].y * h)
    ctx.lineTo(landmarks[b].x * w, landmarks[b].y * h)
    ctx.stroke()
  }
  ctx.fillStyle = '#FF0000'
  for (let i = 0; i < landmarks.length; i++) {
    ctx.beginPath()
    ctx.arc(landmarks[i].x * w, landmarks[i].y * h, 3, 0, 2 * Math.PI)
    ctx.fill()
  }
}

function getFingerStates(landmarks) {
  const thumb = landmarks[4].x < landmarks[3].x
  const index = landmarks[8].y < landmarks[6].y
  const middle = landmarks[12].y < landmarks[10].y
  const ring = landmarks[16].y < landmarks[14].y
  const pinky = landmarks[20].y < landmarks[18].y
  return {thumb, index, middle, ring, pinky}
}

function getDistance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function recognizeJutsu(results) {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    fingerStates.value = null
    return null
  }

  const allHands = results.multiHandLandmarks
  const firstHand = allHands[0]
  const firstFingers = getFingerStates(firstHand)

  fingerStates.value = firstFingers

  if (allHands.length >= 2) {
    const secondHand = allHands[1]
    const secondFingers = getFingerStates(secondHand)

    const palm1 = {
      x: (firstHand[0].x + firstHand[9].x) / 2,
      y: (firstHand[0].y + firstHand[9].y) / 2,
    }
    const palm2 = {
      x: (secondHand[0].x + secondHand[9].x) / 2,
      y: (secondHand[0].y + secondHand[9].y) / 2,
    }
    const palmDist = getDistance(palm1, palm2)

    const bothPeace =
        firstFingers.index &&
        firstFingers.middle &&
        !firstFingers.ring &&
        !firstFingers.pinky &&
        secondFingers.index &&
        secondFingers.middle &&
        !secondFingers.ring &&
        !secondFingers.pinky

    if (bothPeace && palmDist < 0.35) {
      return JUTSU_LIST[0]
    }

    const bothCurled =
        !firstFingers.index &&
        !firstFingers.middle &&
        !firstFingers.ring &&
        !firstFingers.pinky &&
        !secondFingers.index &&
        !secondFingers.middle &&
        !secondFingers.ring &&
        !secondFingers.pinky

    if (bothCurled && palmDist < 0.25) {
      return JUTSU_LIST[1]
    }
  }

  const thumbIndexDist = getDistance(firstHand[4], firstHand[8])
  if (
      thumbIndexDist < 0.06 &&
      firstFingers.middle &&
      firstFingers.ring &&
      firstFingers.pinky
  ) {
    return JUTSU_LIST[2]
  }

  if (
      firstFingers.thumb &&
      firstFingers.index &&
      firstFingers.middle &&
      firstFingers.ring &&
      firstFingers.pinky
  ) {
    return JUTSU_LIST[3]
  }

  return null
}

function onResults(results) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const video = videoRef.value

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawHandLandmarks(ctx, landmarks, canvas.width, canvas.height)
    }
  }
  ctx.restore()

  const now = Date.now()
  if (now - lastJutsuTime < 3000) return

  const jutsu = recognizeJutsu(results)
  if (jutsu) {
    currentJutsu.value = jutsu
    activeEffect.value = jutsu.effect
    lastJutsuTime = now

    playJutsuAudio(jutsu.effect)

    if (jutsu.effect === 'shadow-clone') {
      nextTick(() => captureForClone(canvas))
    }

    clearTimeout(jutsuTimeout)
    jutsuTimeout = setTimeout(() => {
      activeEffect.value = null
      currentJutsu.value = null
    }, 3000)
  }
}

function captureForClone(sourceCanvas) {
  const cloneCanvas = cloneCanvasRef.value
  if (!cloneCanvas || !sourceCanvas) return
  cloneCanvas.width = sourceCanvas.width
  cloneCanvas.height = sourceCanvas.height
  const ctx = cloneCanvas.getContext('2d')
  ctx.drawImage(sourceCanvas, 0, 0)

  document.querySelectorAll('.clone-canvas-copy').forEach((c) => {
    c.width = sourceCanvas.width
    c.height = sourceCanvas.height
    const cCtx = c.getContext('2d')
    cCtx.drawImage(sourceCanvas, 0, 0)
  })
}

async function toggleCamera() {
  if (cameraActive.value) {
    stopCamera()
    return
  }
  await startCamera()
}

async function startCamera() {
  loading.value = true
  cameraActive.value = true

  try {
    await loadMediaPipe()

    const HandsClass = window.Hands
    const CameraClass = window.Camera

    if (!HandsClass || !CameraClass) {
      throw new Error('MediaPipe 加载失败')
    }

    handsInstance = new HandsClass({
      locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    })

    handsInstance.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    })

    handsInstance.onResults(onResults)

    await nextTick()

    const video = videoRef.value
    cameraInstance = new CameraClass(video, {
      onFrame: async () => {
        if (handsInstance && video) {
          await handsInstance.send({image: video})
        }
      },
      width: 640,
      height: 480,
    })

    await cameraInstance.start()
    loading.value = false
  } catch (err) {
    console.error('摄像头启动失败:', err)
    loading.value = false
    cameraActive.value = false
    alert('摄像头启动失败，请确保已授权摄像头权限并允许加载外部脚本')
  }
}

function stopCamera() {
  if (cameraInstance) {
    cameraInstance.stop()
    cameraInstance = null
  }
  if (handsInstance) {
    handsInstance.close()
    handsInstance = null
  }
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
  cameraActive.value = false
  loading.value = false
  activeEffect.value = null
  currentJutsu.value = null
  fingerStates.value = null
}

function resetJutsu() {
  activeEffect.value = null
  currentJutsu.value = null
  lastJutsuTime = 0
}

function smokeStyle(i) {
  const angle = (i / 12) * 360
  const distance = 60 + Math.random() * 80
  const x = Math.cos((angle * Math.PI) / 180) * distance
  const y = Math.sin((angle * Math.PI) / 180) * distance
  return {
    '--dx': `${x}px`,
    '--dy': `${y}px`,
    '--delay': `${Math.random() * 0.5}s`,
    '--size': `${20 + Math.random() * 30}px`,
  }
}

function rasenganParticleStyle(i) {
  const angle = (i / 20) * 360
  const distance = 30 + Math.random() * 50
  const x = Math.cos((angle * Math.PI) / 180) * distance
  const y = Math.sin((angle * Math.PI) / 180) * distance
  return {
    '--dx': `${x}px`,
    '--dy': `${y}px`,
    '--delay': `${Math.random() * 0.3}s`,
  }
}

function fireParticleStyle(i) {
  const x = (Math.random() - 0.5) * 200
  const y = -50 - Math.random() * 200
  return {
    '--dx': `${x}px`,
    '--dy': `${y}px`,
    '--delay': `${Math.random() * 0.5}s`,
    '--size': `${8 + Math.random() * 16}px`,
  }
}

function lightningStyle(i) {
  const angle = (i / 8) * 360
  return {
    '--angle': `${angle}deg`,
    '--delay': `${Math.random() * 0.2}s`,
    '--length': `${40 + Math.random() * 60}px`,
  }
}

function sparkStyle(i) {
  const angle = (i / 15) * 360
  const distance = 40 + Math.random() * 80
  const x = Math.cos((angle * Math.PI) / 180) * distance
  const y = Math.sin((angle * Math.PI) / 180) * distance
  return {
    '--dx': `${x}px`,
    '--dy': `${y}px`,
    '--delay': `${Math.random() * 0.3}s`,
  }
}

onUnmounted(() => {
  stopCamera()
  clearTimeout(jutsuTimeout)
})
</script>

<style scoped>
.naruto-action-btn {
  min-width: 120px;
}

.smoke-particle,
.fire-particle,
.rasengan-particle,
.lightning-bolt,
.chidori-spark {
  --size: 10px;
  --delay: 0s;
  --dx: 0px;
  --dy: 0px;
  --angle: 0deg;
  --length: 40px;
}

.naruto-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 100%;
  min-height: 500px;
}

.camera-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 500px;
  gap: 16px;
}

.prompt-svg {
  width: 100px;
  height: 100px;
  margin-bottom: 12px;
}

.prompt-text {
  font-size: 16px;
  color: var(--text-secondary);
}

.seal-guide {
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 20px;
  border: 1px solid var(--border);
}

.seal-guide h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
  text-align: center;
}

.guide-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-game);
}

.guide-emoji {
  font-size: 1.5rem;
}

.guide-info strong {
  font-size: 14px;
  color: var(--text-primary);
}

.guide-info p {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.camera-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.video-wrapper {
  position: relative;
  width: 100%;
  border-radius: var(--radius);
  overflow: hidden;
  background: #000;
  aspect-ratio: 4 / 3;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}

.landmark-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  gap: 12px;
  font-size: 14px;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.jutsu-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.current-jutsu {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.current-jutsu.active {
  color: var(--primary);
}

.jutsu-emoji {
  font-size: 1.5rem;
}

.finger-states {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.finger-label {
  color: var(--text-secondary);
  margin-right: 4px;
}

.finger {
  opacity: 0.3;
  transition: all 0.2s;
  font-size: 14px;
}

.finger.extended {
  opacity: 1;
  transform: scale(1.2);
}

.effect-layer {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shadow-clone-effect {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clone {
  position: absolute;
  animation: cloneAppear 0.6s ease-out forwards;
}

.clone-original {
  z-index: 2;
}

.clone canvas {
  width: 240px;
  height: 180px;
  border-radius: var(--radius);
  border: 2px solid rgba(108, 92, 231, 0.5);
}

.clone-1 {
  transform: translate(-200px, -40px) scale(0.7);
  opacity: 0;
  animation: cloneSlide 0.6s 0.2s ease-out forwards;
}

.clone-2 {
  transform: translate(200px, -40px) scale(0.7);
  opacity: 0;
  animation: cloneSlide 0.6s 0.4s ease-out forwards;
}

.clone-3 {
  transform: translate(0, 120px) scale(0.7);
  opacity: 0;
  animation: cloneSlide 0.6s 0.6s ease-out forwards;
}

@keyframes cloneAppear {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes cloneSlide {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.8;
  }
}

.smoke-particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle, rgba(200, 200, 200, 0.8), transparent);
  border-radius: 50%;
  animation: smokeFloat 1s var(--delay) ease-out forwards;
}

@keyframes smokeFloat {
  from {
    opacity: 0.8;
    transform: translate(0, 0) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(var(--dx), var(--dy)) scale(2);
  }
}

.rasengan-effect {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rasengan-ball {
  position: relative;
  width: 120px;
  height: 120px;
  animation: rasenganPulse 0.5s ease-in-out infinite alternate;
}

.rasengan-core {
  position: absolute;
  inset: 20px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, #64b5f6 40%, #1976d2 70%, #0d47a1 100%);
  box-shadow: 0 0 30px #42a5f5, 0 0 60px #1976d2, 0 0 90px #0d47a1;
}

.rasengan-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid rgba(66, 165, 245, 0.6);
  animation: rasenganSpin 0.8s linear infinite;
}

.ring-1 {
  animation-duration: 0.8s;
  border-color: rgba(66, 165, 245, 0.8);
}

.ring-2 {
  inset: 8px;
  animation-duration: 0.6s;
  animation-direction: reverse;
  border-color: rgba(100, 181, 246, 0.6);
}

.ring-3 {
  inset: 16px;
  animation-duration: 0.4s;
  border-color: rgba(144, 202, 249, 0.4);
}

.rasengan-glow {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(66, 165, 245, 0.3), transparent 70%);
  animation: glowPulse 1s ease-in-out infinite alternate;
}

@keyframes rasenganSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes rasenganPulse {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1.05);
  }
}

@keyframes glowPulse {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}

.rasengan-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #90caf9;
  border-radius: 50%;
  animation: rasenganParticle 0.8s var(--delay) ease-out infinite;
}

@keyframes rasenganParticle {
  from {
    opacity: 1;
    transform: translate(0, 0);
  }
  to {
    opacity: 0;
    transform: translate(var(--dx), var(--dy));
  }
}

.fire-effect {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fire-core {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, #ffeb3b 20%, #ff9800 50%, #f44336 80%, transparent 100%);
  box-shadow: 0 0 40px #ff9800, 0 0 80px #f44336, 0 0 120px rgba(244, 67, 54, 0.5);
  animation: firePulse 0.3s ease-in-out infinite alternate;
}

@keyframes firePulse {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1.1);
  }
}

.fire-particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle, #ffeb3b, #ff9800, transparent);
  border-radius: 50%;
  animation: fireRise 1s var(--delay) ease-out infinite;
}

@keyframes fireRise {
  from {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(var(--dx), var(--dy)) scale(0.3);
  }
}

.chidori-effect {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chidori-core {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, #e1f5fe 30%, #4fc3f7 60%, #0288d1 100%);
  box-shadow: 0 0 30px #4fc3f7, 0 0 60px #0288d1, 0 0 100px rgba(2, 136, 209, 0.5);
  animation: chidoriFlicker 0.15s ease-in-out infinite alternate;
}

@keyframes chidoriFlicker {
  from {
    transform: scale(0.9);
    opacity: 0.8;
  }
  to {
    transform: scale(1.1);
    opacity: 1;
  }
}

.lightning-bolt {
  position: absolute;
  width: 3px;
  height: var(--length);
  background: linear-gradient(to bottom, #fff, #4fc3f7, transparent);
  transform-origin: top center;
  transform: rotate(var(--angle));
  animation: lightningFlash 0.2s var(--delay) ease-in-out infinite alternate;
  filter: blur(1px);
}

@keyframes lightningFlash {
  from {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}

.chidori-spark {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 6px #4fc3f7, 0 0 12px #0288d1;
  animation: sparkFly 0.5s var(--delay) ease-out infinite;
}

@keyframes sparkFly {
  from {
    opacity: 1;
    transform: translate(0, 0);
  }
  to {
    opacity: 0;
    transform: translate(var(--dx), var(--dy));
  }
}

.jutsu-announce {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 101;
  animation: announceIn 0.5s ease-out forwards;
}

.announce-text {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 0 10px rgba(108, 92, 231, 0.8),
  0 0 20px rgba(108, 92, 231, 0.6),
  0 0 40px rgba(108, 92, 231, 0.4),
  2px 2px 4px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  letter-spacing: 4px;
}

@keyframes announceIn {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

@media (max-width: 768px) {
  .guide-list {
    grid-template-columns: 1fr;
  }

  .jutsu-panel {
    flex-direction: column;
    gap: 8px;
  }

  .announce-text {
    font-size: 1.5rem;
  }

  .clone canvas {
    width: 160px;
    height: 120px;
  }

  .clone-1 {
    transform: translate(-140px, -30px) scale(0.6);
  }

  .clone-2 {
    transform: translate(140px, -30px) scale(0.6);
  }

  .clone-3 {
    transform: translate(0, 80px) scale(0.6);
  }
}
</style>
