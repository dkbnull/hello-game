import {computed, onUnmounted, ref} from 'vue'

export function useTimer() {
    const timerSeconds = ref(0)
    let timerInterval = null

    const formattedTime = computed(() => {
        const m = Math.floor(timerSeconds.value / 60)
        const s = timerSeconds.value % 60
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    })

    function startTimer() {
        stopTimer()
        timerSeconds.value = 0
        timerInterval = setInterval(() => {
            timerSeconds.value++
        }, 1000)
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = null
        }
    }

    onUnmounted(() => {
        stopTimer()
    })

    return {timerSeconds, formattedTime, startTimer, stopTimer}
}
