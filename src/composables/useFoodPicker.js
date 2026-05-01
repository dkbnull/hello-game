import {DEFAULT_FOODS} from '@/data/foodPicker.js'

const STORAGE_KEY = 'hello-game-food-picker'

function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return {customFoods: []}
        return JSON.parse(raw)
    } catch {
        return {customFoods: []}
    }
}

function saveToStorage(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
        // ignore
    }
}

export function useFoodPicker() {
    const stored = loadFromStorage()
    const customFoods = ref(stored.customFoods || [])

    const allFoods = computed(() => {
        return [...DEFAULT_FOODS, ...customFoods.value]
    })

    function addCustomFood(food) {
        const newFood = {
            ...food,
            id: 'custom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        }
        customFoods.value.push(newFood)
        saveToStorage({customFoods: customFoods.value})
    }

    function removeCustomFood(id) {
        customFoods.value = customFoods.value.filter(f => f.id !== id)
        saveToStorage({customFoods: customFoods.value})
    }

    function updateCustomFood(id, updates) {
        const idx = customFoods.value.findIndex(f => f.id === id)
        if (idx !== -1) {
            customFoods.value[idx] = {...customFoods.value[idx], ...updates}
            saveToStorage({customFoods: customFoods.value})
        }
    }

    return {
        allFoods,
        customFoods,
        addCustomFood,
        removeCustomFood,
        updateCustomFood,
    }
}
