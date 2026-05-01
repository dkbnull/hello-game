import {defineStore} from 'pinia'
import {ref} from 'vue'

const STORAGE_KEY = 'hello-game-scores'

function loadScores() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

function saveScores(scores) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

export const useGameStore = defineStore('game', () => {
    const scores = ref(loadScores())

    function getScore(gameId) {
        return scores.value[gameId]?.current ?? 0
    }

    function getBestScore(gameId) {
        return scores.value[gameId]?.best ?? 0
    }

    function updateScore(gameId, newScore) {
        const entry = scores.value[gameId] || {current: 0, best: 0}
        entry.current = newScore
        if (newScore > entry.best) {
            entry.best = newScore
        }
        scores.value[gameId] = entry
        saveScores(scores.value)
    }

    function resetScore(gameId) {
        const entry = scores.value[gameId] || {current: 0, best: 0}
        entry.current = 0
        scores.value[gameId] = entry
        saveScores(scores.value)
    }

    return {scores, getScore, getBestScore, updateScore, resetScore}
})
