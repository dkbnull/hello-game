import {ref, onMounted, onUnmounted} from 'vue'

const isFullscreen = ref(false)

function toggleFullscreen() {
    const doc = document.documentElement
    if (!isFullscreen.value) {
        if (doc.requestFullscreen) {
            doc.requestFullscreen().catch(() => {
            })
        } else if (doc.webkitRequestFullscreen) {
            doc.webkitRequestFullscreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {
            })
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
}

function onFullscreenChange() {
    isFullscreen.value = !!(document.fullscreenElement || document.webkitFullscreenElement)
}

let listenerCount = 0

export function useFullscreen() {
    onMounted(() => {
        if (listenerCount === 0) {
            document.addEventListener('fullscreenchange', onFullscreenChange)
            document.addEventListener('webkitfullscreenchange', onFullscreenChange)
        }
        listenerCount++
    })

    onUnmounted(() => {
        listenerCount--
        if (listenerCount === 0) {
            document.removeEventListener('fullscreenchange', onFullscreenChange)
            document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
        }
    })

    return {
        isFullscreen,
        toggleFullscreen,
    }
}
