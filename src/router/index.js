import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/minesweeper',
        name: 'Minesweeper',
        component: () => import('../views/classic/MinesweeperGame.vue'),
        meta: {title: '扫雷', category: 'classic'},
    },
    {
        path: '/sudoku',
        name: 'Sudoku',
        component: () => import('../views/classic/SudokuGame.vue'),
        meta: {title: '数独', category: 'classic'},
    },
    {
        path: '/game2048',
        name: 'Game2048',
        component: () => import('../views/classic/Game2048.vue'),
        meta: {title: '2048', category: 'classic'},
    },
    {
        path: '/literacy',
        name: 'Literacy',
        component: () => import('../views/edu/LiteracyGame.vue'),
        meta: {title: '识字达人', category: 'edu'},
    },
    {
        path: '/pinyin',
        name: 'Pinyin',
        component: () => import('../views/edu/PinyinGame.vue'),
        meta: {title: '拼音学习', category: 'edu'},
    },
    {
        path: '/english',
        name: 'English',
        component: () => import('../views/edu/EnglishGame.vue'),
        meta: {title: '英语启蒙', category: 'edu'},
    },
    {
        path: '/math',
        name: 'Math',
        component: () => import('../views/edu/MathGame.vue'),
        meta: {title: '加减乐园', category: 'edu'},
    },
    {
        path: '/match',
        name: 'Match',
        component: () => import('../views/classic/MatchGame.vue'),
        meta: {title: '消消乐', category: 'classic'},
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const title = to.meta.title
    document.title = title ? `${title} - Hello Game` : 'Hello Game - 寓教于乐游戏平台'
})

export default router
