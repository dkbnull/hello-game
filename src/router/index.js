import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../layouts/DefaultLayout.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('../views/Home.vue'),
                meta: {
                    title: 'Hello Game - 寓教于乐游戏平台',
                    description: 'Hello Game 是一个寓教于乐游戏平台，集合益智、休闲、早教与互动体验，包含扫雷、2048、数独、消消乐、识字达人、拼音学习、英语启蒙、加减乐园、忍者结印、今天吃什么等游戏，发现乐趣尽在游戏',
                    keywords: '趣味游戏,益智游戏,休闲游戏,早教游戏,互动游戏,在线游戏,扫雷,2048,数独,消消乐,识字游戏,拼音学习,英语启蒙,数学游戏,忍者结印,今天吃什么,Hello Game',
                },
            },
            {
                path: 'about',
                name: 'About',
                component: () => import('../views/About.vue'),
                meta: {
                    title: '关于 - Hello Game',
                    description: 'Hello Game 是一个寓教于乐游戏平台，集合益智、休闲、早教与互动体验，发现乐趣尽在游戏',
                    keywords: 'Hello Game,关于,游戏平台,趣味游戏,益智游戏,早教游戏',
                },
            },
        ],
    },
    {
        path: '/',
        component: () => import('../layouts/GameLayout.vue'),
        children: [
            {
                path: 'salary-counter',
                name: 'SalaryCounter',
                component: () => import('../views/fun/SalaryCounter.vue'),
                meta: {
                    title: '实时工资 - 每秒赚钱计算器',
                    description: '实时工资计算器，输入月薪和工作时间，按秒展示你实时赚到的钱。金币掉落特效，打工人必备！',
                    keywords: '实时工资,工资计算器,每秒赚多少,打工人,薪资计算,在线计时工资',
                    category: 'fun',
                },
            },
            {
                path: 'food-picker',
                name: 'FoodPicker',
                component: () => import('../views/fun/FoodPicker.vue'),
                meta: {
                    title: '今天吃什么 - 美食随机抽取',
                    description: '选择今天吃什么的随机抽取工具，支持早中晚餐选择、口味偏好和忌口设置，华丽动画效果帮你决定今天吃什么！',
                    keywords: '今天吃什么,吃什么,美食推荐,随机选餐,午餐推荐,晚餐推荐,美食抽取',
                    category: 'fun',
                },
            },
            {
                path: 'nmti',
                name: 'Nmti',
                component: () => import('../views/fun/NmtiGame.vue'),
                meta: {
                    title: '牛马测试 - 趣味人格测试',
                    description: '牛马人格趣味测试，测测你的牛马指数！打工魂燃烧吧，看看你是哪种类型的打工人。',
                    keywords: '牛马测试,人格测试,趣味测试,心理测试,打工人,职场测试',
                    category: 'fun',
                },
            },
            {
                path: 'fortune',
                name: 'Fortune',
                component: () => import('../views/fun/FortuneGame.vue'),
                meta: {
                    title: '算命运势 - 趣味运势测算',
                    description: '趣味算命运势测算，输入信息测算你的命运与运势。纯属娱乐，开心就好！',
                    keywords: '算命,运势,命运测试,星座运势,趣味算命,运势测算',
                    category: 'fun',
                },
            },
            {
                path: 'naruto-seal',
                name: 'NarutoSeal',
                component: () => import('../views/ninja/NarutoSealGame.vue'),
                meta: {
                    title: '忍者结印 - 火影忍者手势识别',
                    description: '火影忍者结印手势识别游戏，通过摄像头识别手势，体验火影忍者结印忍术。多种印法等你挑战！',
                    keywords: '火影忍者,忍者结印,手势识别,火影游戏,忍者游戏,结印',
                    category: 'ninja',
                },
            },
        ],
    },
    {
        path: '/',
        component: () => import('../layouts/ToolbarLayout.vue'),
        children: [
            {
                path: 'minesweeper',
                name: 'Minesweeper',
                component: () => import('../views/classic/MinesweeperGame.vue'),
                meta: {
                    title: '扫雷 - 经典扫雷游戏',
                    description: '经典扫雷游戏，锻炼逻辑推理能力。选择难度，标记地雷，挑战你的推理极限！适合儿童和成人的益智游戏。',
                    keywords: '扫雷,扫雷游戏,在线扫雷,益智游戏,逻辑推理,儿童益智',
                    category: 'classic',
                },
            },
            {
                path: 'game2048',
                name: 'Game2048',
                component: () => import('../views/classic/Game2048.vue'),
                meta: {
                    title: '2048 - 数字合并益智游戏',
                    description: '2048数字合并游戏，滑动合并相同数字，挑战最高分！简单上手，越玩越上瘾的益智游戏。',
                    keywords: '2048,2048游戏,数字合并,益智游戏,数学游戏,儿童益智',
                    category: 'classic',
                },
            },
            {
                path: 'sudoku',
                name: 'Sudoku',
                component: () => import('../views/classic/SudokuGame.vue'),
                meta: {
                    title: '数独 - 数字逻辑益智游戏',
                    description: '数独益智游戏，填入1-9数字，每行每列每宫不重复。多种难度选择，锻炼逻辑思维和数学能力。',
                    keywords: '数独,数独游戏,在线数独,数字游戏,逻辑思维,儿童数学',
                    category: 'classic',
                },
            },
            {
                path: 'match',
                name: 'Match',
                component: () => import('../views/classic/MatchGame.vue'),
                meta: {
                    title: '消消乐 - 语文数学英语配对游戏',
                    description: '消消乐配对消除游戏，支持语文、数学、英语三种模式。趣味配对学习，巩固知识提升记忆。',
                    keywords: '消消乐,配对游戏,消除游戏,语文学习,数学学习,英语学习,儿童游戏',
                    category: 'classic',
                },
            },
            {
                path: 'literacy',
                name: 'Literacy',
                component: () => import('../views/edu/LiteracyGame.vue'),
                meta: {
                    title: '识字达人 - 看图识字游戏',
                    description: '看图识字游戏，轻松认识常用汉字。通过趣味配对方式学习汉字，适合学龄前和小学低年级儿童。',
                    keywords: '识字,识字游戏,看图识字,汉字学习,儿童识字,语文启蒙',
                    category: 'edu',
                },
            },
            {
                path: 'pinyin',
                name: 'Pinyin',
                component: () => import('../views/edu/PinyinGame.vue'),
                meta: {
                    title: '拼音学习 - 声母韵母趣味学习',
                    description: '拼音趣味学习游戏，涵盖声母、韵母、整体认读音节。打好拼音基础，为阅读和写作做好准备。',
                    keywords: '拼音,拼音学习,声母,韵母,拼音游戏,汉语拼音,儿童拼音',
                    category: 'edu',
                },
            },
            {
                path: 'english',
                name: 'English',
                component: () => import('../views/edu/EnglishGame.vue'),
                meta: {
                    title: '英语启蒙 - 趣味英语单词学习',
                    description: '趣味英语单词学习游戏，轻松入门英语。通过图片和单词配对，快乐学习英语基础词汇。',
                    keywords: '英语启蒙,英语学习,英语单词,儿童英语,英语游戏,幼儿英语',
                    category: 'edu',
                },
            },
            {
                path: 'math',
                name: 'Math',
                component: () => import('../views/edu/MathGame.vue'),
                meta: {
                    title: '加减乐园 - 趣味加减法练习',
                    description: '趣味加减法练习游戏，提升数学计算能力。多种难度选择，让孩子在游戏中掌握加减法运算。',
                    keywords: '加减法,数学游戏,数学练习,儿童数学,加减乐园,算术游戏',
                    category: 'edu',
                },
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/Home.vue'),
        meta: {
            title: '页面未找到 - Hello Game',
        },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return {top: 0}
    },
})

const DEFAULT_TITLE = 'Hello Game - 寓教于乐游戏平台'

router.beforeEach((to) => {
    document.title = to.meta?.title || DEFAULT_TITLE
})

export default router
