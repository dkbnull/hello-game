import sectionClassicIcon from '@/assets/icons/section-classic.svg'
import sectionEduIcon from '@/assets/icons/section-edu.svg'
import sectionNinjaIcon from '@/assets/icons/section-ninja.svg'
import sectionFunIcon from '@/assets/icons/section-fun.svg'
import minesweeperIcon from '@/assets/icons/minesweeper.svg'
import sudokuIcon from '@/assets/icons/sudoku.svg'
import game2048Icon from '@/assets/icons/game2048.svg'
import matchIcon from '@/assets/icons/match.svg'
import literacyIcon from '@/assets/icons/literacy.svg'
import pinyinIcon from '@/assets/icons/pinyin.svg'
import englishIcon from '@/assets/icons/english.svg'
import mathIcon from '@/assets/icons/math.svg'
import narutoIcon from '@/assets/icons/naruto.svg'
import nmtiIcon from '@/assets/icons/nmti.svg'
import fortuneIcon from '@/assets/icons/fortune.svg'

export const GAME_SECTIONS = [
    {
        key: 'classic',
        title: '经典益智',
        icon: sectionClassicIcon,
    },
    {
        key: 'edu',
        title: '趣味早教',
        icon: sectionEduIcon,
    },
    {
        key: 'ninja',
        title: '火影忍者',
        icon: sectionNinjaIcon,
    },
    {
        key: 'fun',
        title: '趣味测试',
        icon: sectionFunIcon,
    },
]

export const GAMES = [
    {
        to: '/minesweeper',
        icon: minesweeperIcon,
        iconBg: 'rgba(108, 92, 231, 0.1)',
        title: '扫雷',
        pinyin: 'saolei',
        description: '经典扫雷游戏，锻炼逻辑推理能力',
        category: 'classic',
        tag: '经典',
    },
    {
        to: '/sudoku',
        icon: sudokuIcon,
        iconBg: 'rgba(0, 184, 148, 0.1)',
        title: '数独',
        pinyin: 'shudu',
        description: '填入数字，每行每列每宫不重复',
        category: 'classic',
        tag: '经典',
    },
    {
        to: '/game2048',
        icon: game2048Icon,
        iconBg: 'rgba(253, 203, 110, 0.1)',
        title: '2048',
        pinyin: '2048',
        description: '滑动合并数字，挑战最高分',
        category: 'classic',
        tag: '经典',
    },
    {
        to: '/match',
        icon: matchIcon,
        iconBg: 'rgba(108, 92, 231, 0.1)',
        title: '消消乐',
        pinyin: 'xiaoxiaole',
        description: '配对消除，语文数学英语三种模式',
        category: 'classic',
        tag: '经典',
    },
    {
        to: '/literacy',
        icon: literacyIcon,
        iconBg: 'rgba(225, 112, 85, 0.1)',
        title: '识字达人',
        pinyin: 'shizidaren',
        description: '看图识字，轻松认识常用汉字',
        category: 'edu',
        tag: '早教',
    },
    {
        to: '/pinyin',
        icon: pinyinIcon,
        iconBg: 'rgba(0, 206, 201, 0.1)',
        title: '拼音学习',
        pinyin: 'pinyinxuexi',
        description: '声母韵母趣味学习，打好拼音基础',
        category: 'edu',
        tag: '早教',
    },
    {
        to: '/english',
        icon: englishIcon,
        iconBg: 'rgba(9, 132, 227, 0.1)',
        title: '英语启蒙',
        pinyin: 'yingyuqimeng',
        description: '趣味英语单词学习，轻松入门',
        category: 'edu',
        tag: '早教',
    },
    {
        to: '/math',
        icon: mathIcon,
        iconBg: 'rgba(253, 121, 168, 0.1)',
        title: '加减乐园',
        pinyin: 'jiajianleyuan',
        description: '趣味加减法练习，提升数学能力',
        category: 'edu',
        tag: '早教',
    },
    {
        to: '/naruto-seal',
        icon: narutoIcon,
        iconBg: 'rgba(225, 112, 85, 0.1)',
        title: '忍者结印',
        pinyin: 'renzhejieyin',
        description: '摄像头手势识别，体验火影结印忍术',
        category: 'ninja',
        tag: '忍者',
    },
    {
        to: '/nmti',
        icon: nmtiIcon,
        iconBg: 'rgba(108, 92, 231, 0.1)',
        title: '牛马测试',
        pinyin: 'niumaceshi',
        description: '测测你的牛马人格，打工魂燃烧吧',
        category: 'fun',
        tag: '趣味',
    },
    {
        to: '/fortune',
        icon: fortuneIcon,
        iconBg: 'rgba(253, 203, 110, 0.1)',
        title: '算命运势',
        pinyin: 'suanmingyushi',
        description: '输入信息，测算你的命运与运势',
        category: 'fun',
        tag: '趣味',
    },
]
