export const MEAL_TYPES = [
    {key: 'breakfast', label: '早饭', icon: '🌅', emoji: '🥐'},
    {key: 'lunch', label: '午饭', icon: '☀️', emoji: '🍱'},
    {key: 'dinner', label: '晚饭', icon: '🌙', emoji: '🍲'},
]

export const TASTE_OPTIONS = [
    {key: 'sour', label: '酸', icon: '🍋'},
    {key: 'sweet', label: '甜', icon: '🍬'},
    {key: 'bitter', label: '苦', icon: '☕'},
    {key: 'spicy', label: '辣', icon: '🌶️'},
    {key: 'salty', label: '咸', icon: '🧂'},
    {key: 'light', label: '清淡', icon: '🥬'},
]

export const DIETARY_OPTIONS = [
    {key: 'seafood', label: '海鲜', icon: '🦐'},
    {key: 'peanut', label: '花生', icon: '🥜'},
    {key: 'dairy', label: '乳制品', icon: '🥛'},
    {key: 'gluten', label: '麸质', icon: '🌾'},
    {key: 'spicy', label: '辣', icon: '🌶️'},
    {key: 'coriander', label: '香菜', icon: '🌿'},
    {key: 'celery', label: '芹菜', icon: '🥬'},
    {key: 'onion', label: '葱蒜', icon: '🧅'},
]

export const DEFAULT_FOODS = [
    {id: 'f001', name: '小笼包', meal: ['breakfast'], tastes: ['salty', 'light'], tags: ['面食'], emoji: '🥡'},
    {id: 'f002', name: '豆浆油条', meal: ['breakfast'], tastes: ['sweet', 'salty'], tags: ['面食', '饮品'], emoji: '🥛'},
    {id: 'f003', name: '煎饼果子', meal: ['breakfast'], tastes: ['salty', 'spicy'], tags: ['面食'], emoji: '🥞'},
    {id: 'f004', name: '白粥咸菜', meal: ['breakfast'], tastes: ['light', 'salty'], tags: ['粥类'], emoji: '🍚'},
    {id: 'f005', name: '鸡蛋灌饼', meal: ['breakfast'], tastes: ['salty'], tags: ['面食'], emoji: '🥚'},
    {
        id: 'f006',
        name: '肉夹馍',
        meal: ['breakfast', 'lunch'],
        tastes: ['salty', 'spicy'],
        tags: ['面食', '肉食'],
        emoji: '🥙'
    },
    {id: 'f007', name: '肠粉', meal: ['breakfast'], tastes: ['light', 'salty'], tags: ['粉类'], emoji: '🍜'},
    {id: 'f008', name: '包子', meal: ['breakfast'], tastes: ['salty', 'sweet'], tags: ['面食'], emoji: '🥟'},
    {id: 'f009', name: '三明治', meal: ['breakfast', 'lunch'], tastes: ['salty'], tags: ['西式'], emoji: '🥪'},
    {id: 'f010', name: '牛奶麦片', meal: ['breakfast'], tastes: ['sweet'], tags: ['饮品', '西式'], emoji: '🥣'},
    {id: 'f011', name: '烧麦', meal: ['breakfast'], tastes: ['salty'], tags: ['面食'], emoji: '🥠'},
    {
        id: 'f012',
        name: '馄饨',
        meal: ['breakfast', 'lunch'],
        tastes: ['light', 'salty'],
        tags: ['面食', '汤类'],
        emoji: '🥣'
    },

    {id: 'f013', name: '红烧肉', meal: ['lunch', 'dinner'], tastes: ['salty', 'sweet'], tags: ['肉食'], emoji: '🥩'},
    {
        id: 'f014',
        name: '宫保鸡丁',
        meal: ['lunch', 'dinner'],
        tastes: ['spicy', 'salty', 'sour'],
        tags: ['肉食', '川菜'],
        emoji: '🍗'
    },
    {
        id: 'f015',
        name: '麻婆豆腐',
        meal: ['lunch', 'dinner'],
        tastes: ['spicy', 'salty'],
        tags: ['川菜', '豆制品'],
        emoji: '🥘'
    },
    {id: 'f016', name: '糖醋排骨', meal: ['lunch', 'dinner'], tastes: ['sour', 'sweet'], tags: ['肉食'], emoji: '🍖'},
    {
        id: 'f017',
        name: '鱼香肉丝',
        meal: ['lunch', 'dinner'],
        tastes: ['spicy', 'sour', 'sweet'],
        tags: ['肉食', '川菜'],
        emoji: '🥩'
    },
    {id: 'f018', name: '番茄炒蛋', meal: ['lunch', 'dinner'], tastes: ['sour', 'sweet'], tags: ['家常'], emoji: '🍅'},
    {id: 'f019', name: '青椒肉丝', meal: ['lunch', 'dinner'], tastes: ['spicy', 'salty'], tags: ['肉食'], emoji: '🌶️'},
    {
        id: 'f020',
        name: '回锅肉',
        meal: ['lunch', 'dinner'],
        tastes: ['spicy', 'salty'],
        tags: ['肉食', '川菜'],
        emoji: '🥓'
    },
    {
        id: 'f021',
        name: '酸菜鱼',
        meal: ['lunch', 'dinner'],
        tastes: ['sour', 'spicy'],
        tags: ['海鲜', '川菜'],
        emoji: '🐟'
    },
    {id: 'f022', name: '水煮牛肉', meal: ['lunch', 'dinner'], tastes: ['spicy'], tags: ['肉食', '川菜'], emoji: '🍲'},
    {id: 'f023', name: '清蒸鲈鱼', meal: ['lunch', 'dinner'], tastes: ['light'], tags: ['海鲜'], emoji: '🐠'},
    {id: 'f024', name: '蒜蓉西兰花', meal: ['lunch', 'dinner'], tastes: ['light', 'salty'], tags: ['素菜'], emoji: '🥦'},
    {id: 'f025', name: '地三鲜', meal: ['lunch', 'dinner'], tastes: ['salty'], tags: ['素菜', '东北菜'], emoji: '🍆'},
    {
        id: 'f026',
        name: '黄焖鸡米饭',
        meal: ['lunch', 'dinner'],
        tastes: ['salty', 'spicy'],
        tags: ['肉食', '快餐'],
        emoji: '🍗'
    },
    {id: 'f027', name: '兰州拉面', meal: ['lunch'], tastes: ['salty', 'light'], tags: ['面食', '汤类'], emoji: '🍜'},
    {id: 'f028', name: '重庆小面', meal: ['lunch'], tastes: ['spicy', 'salty'], tags: ['面食', '川菜'], emoji: '🍜'},
    {id: 'f029', name: '沙县拌面', meal: ['lunch'], tastes: ['salty'], tags: ['面食'], emoji: '🍝'},
    {id: 'f030', name: '蛋炒饭', meal: ['lunch'], tastes: ['salty'], tags: ['米饭', '快餐'], emoji: '🍳'},
    {id: 'f031', name: '盖浇饭', meal: ['lunch'], tastes: ['salty'], tags: ['米饭', '快餐'], emoji: '🍛'},
    {
        id: 'f032',
        name: '麻辣香锅',
        meal: ['lunch', 'dinner'],
        tastes: ['spicy', 'salty'],
        tags: ['川菜', '火锅'],
        emoji: '🍲'
    },
    {id: 'f033', name: '炸鸡汉堡', meal: ['lunch'], tastes: ['salty'], tags: ['西式', '快餐'], emoji: '🍔'},
    {id: 'f034', name: '披萨', meal: ['lunch', 'dinner'], tastes: ['salty', 'sour'], tags: ['西式'], emoji: '🍕'},
    {id: 'f035', name: '寿司', meal: ['lunch'], tastes: ['light', 'sour'], tags: ['日式', '海鲜'], emoji: '🍣'},
    {id: 'f036', name: '螺蛳粉', meal: ['lunch'], tastes: ['spicy', 'sour'], tags: ['粉类', '广西'], emoji: '🍜'},

    {id: 'f037', name: '火锅', meal: ['dinner'], tastes: ['spicy', 'salty'], tags: ['火锅'], emoji: '🍲'},
    {id: 'f038', name: '烤鱼', meal: ['dinner'], tastes: ['spicy', 'salty'], tags: ['海鲜'], emoji: '🐟'},
    {id: 'f039', name: '烧烤', meal: ['dinner'], tastes: ['spicy', 'salty'], tags: ['肉食', '烧烤'], emoji: '🍢'},
    {id: 'f040', name: '饺子', meal: ['dinner'], tastes: ['salty', 'light'], tags: ['面食'], emoji: '🥟'},
    {id: 'f041', name: '煲仔饭', meal: ['dinner'], tastes: ['salty'], tags: ['米饭', '粤菜'], emoji: '🍚'},
    {id: 'f042', name: '烤鸭', meal: ['dinner'], tastes: ['salty'], tags: ['肉食', '京菜'], emoji: '🦆'},
    {id: 'f043', name: '麻辣烫', meal: ['dinner'], tastes: ['spicy', 'salty'], tags: ['川菜', '火锅'], emoji: '🥘'},
    {id: 'f044', name: '炒面', meal: ['dinner'], tastes: ['salty'], tags: ['面食'], emoji: '🍝'},
    {id: 'f045', name: '牛排', meal: ['dinner'], tastes: ['salty', 'bitter'], tags: ['西式', '肉食'], emoji: '🥩'},
    {id: 'f046', name: '羊肉串', meal: ['dinner'], tastes: ['spicy', 'salty'], tags: ['烧烤', '肉食'], emoji: '🍖'},
    {id: 'f047', name: '酸菜白肉', meal: ['dinner'], tastes: ['sour', 'salty'], tags: ['东北菜', '肉食'], emoji: '🥓'},
    {id: 'f048', name: '椰子鸡', meal: ['dinner'], tastes: ['light', 'sweet'], tags: ['粤菜', '汤类'], emoji: '🥥'},
    {id: 'f049', name: '日式拉面', meal: ['dinner'], tastes: ['salty', 'light'], tags: ['日式', '面食'], emoji: '🍜'},
    {id: 'f050', name: '韩式拌饭', meal: ['dinner'], tastes: ['spicy', 'salty'], tags: ['韩式', '米饭'], emoji: '🍛'},
]

export function filterFoods(foods, mealType, tastes, dietaryRestrictions) {
    let filtered = foods.filter(f => f.meal.includes(mealType))

    if (tastes && tastes.length > 0) {
        filtered = filtered.filter(f =>
            f.tastes.some(t => tastes.includes(t))
        )
    }

    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
        const restrictionTagMap = {
            seafood: '海鲜',
            peanut: '花生',
            dairy: '乳制品',
            gluten: '麸质',
            spicy: '辣',
            coriander: '香菜',
            celery: '芹菜',
            onion: '葱蒜',
        }
        const excludedTags = dietaryRestrictions
            .map(r => restrictionTagMap[r])
            .filter(Boolean)

        if (excludedTags.includes('辣')) {
            filtered = filtered.filter(f => !f.tastes.includes('spicy'))
            excludedTags.splice(excludedTags.indexOf('辣'), 1)
        }

        if (excludedTags.length > 0) {
            filtered = filtered.filter(f =>
                !f.tags.some(tag => excludedTags.includes(tag))
            )
        }
    }

    return filtered
}

export function getRandomFood(foods) {
    if (!foods || foods.length === 0) return null
    return foods[Math.floor(Math.random() * foods.length)]
}
