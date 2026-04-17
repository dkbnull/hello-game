export const FORTUNE_TYPES = [
    {key: 'daily', label: '每日运势', icon: '☀️'},
    {key: 'career', label: '事业运', icon: '💼'},
    {key: 'love', label: '感情运', icon: '💕'},
    {key: 'wealth', label: '财运', icon: '💰'},
]

export const ZODIAC_SIGNS = [
    {name: '鼠', icon: '🐭'},
    {name: '牛', icon: '🐂'},
    {name: '虎', icon: '🐯'},
    {name: '兔', icon: '🐰'},
    {name: '龙', icon: '🐲'},
    {name: '蛇', icon: '🐍'},
    {name: '马', icon: '🐴'},
    {name: '羊', icon: '🐑'},
    {name: '猴', icon: '🐵'},
    {name: '鸡', icon: '🐔'},
    {name: '狗', icon: '🐶'},
    {name: '猪', icon: '🐷'},
]

export const FORTUNE_LEVELS = [
    {key: 'great', label: '大吉', color: '#e17055', emoji: '🌟'},
    {key: 'good', label: '中吉', color: '#fdcb6e', emoji: '✨'},
    {key: 'normal', label: '小吉', color: '#00b894', emoji: '🍀'},
    {key: 'slight', label: '末吉', color: '#0984e3', emoji: '🌙'},
    {key: 'bad', label: '凶', color: '#636e72', emoji: '☁️'},
]

const DAILY_FORTUNES = [
    '今日宜：摸鱼、划水、假装很忙。忌：主动加班、接新需求、说"这个简单"。',
    '今日宜：大胆发言、提涨薪。忌：沉默不语、默默背锅。',
    '今日宜：早退、喝奶茶、刷手机。忌：开会发言、写文档。',
    '今日宜：学习新技能、整理工位。忌：打开遗留代码、碰别人的分支。',
    '今日宜：社交、请同事吃饭。忌：独处、跟产品经理争论。',
    '今日宜：写代码、修bug。忌：上线、改配置、删数据库。',
    '今日宜：休息、放空、发呆。忌：做任何重要决定。',
    '今日宜：运动、出门透气。忌：久坐不动、吃外卖。',
    '今日宜：创意爆发、头脑风暴。忌：按部就班、听领导指挥。',
    '今日宜：低调行事、闷声发财。忌：高调炫富、发朋友圈。',
    '今日宜：清理收藏夹、整理笔记。忌：继续收藏不看的内容。',
    '今日宜：跟老朋友联系。忌：加新群、参加无效社交。',
]

const CAREER_FORTUNES = [
    '你的事业运如同脱缰的野马，势不可挡！但请注意方向，别冲沟里了。',
    '职场如鱼得水，左右逢源。但小心别被渔网捞走了。',
    '贵人运爆棚，有人暗中欣赏你。可能是老板，也可能是HR（准备挖你）。',
    '事业平稳上升，像蜗牛爬树——虽然慢，但至少在往上走。',
    '近期可能遇到职场小人，但你的实力就是最好的护身符。',
    '跳槽运极佳，但建议先看看存款再决定。',
    '领导可能会给你加担子，往好处想，这是信任的表现（大概吧）。',
    '你的代码/方案将获得一致好评，享受高光时刻吧！',
    '近期适合深耕专业领域，厚积薄发，未来可期。',
    '团队协作运极佳，但记得把功劳分给大家（虽然都是你干的）。',
    '可能面临职业选择的十字路口，听从内心，但要算好经济账。',
    '升职加薪的机会就在眼前，但需要你主动争取，天上不会掉馅饼。',
]

const LOVE_FORTUNES = [
    '桃花运旺盛，走到哪都有人看你。可能是你衣服穿反了。',
    '有缘人可能就在身边，注意观察每天给你带早餐的那个人。',
    '感情运平稳，适合细水长流。别总想着轰轰烈烈了。',
    '近期可能收到表白，请保持冷静，先确认不是群发的。',
    '单身狗注意了，你的真命天子/天女可能正在来的路上（堵车中）。',
    '有伴的你，适合一起做顿饭。没伴的你，适合自己做饭。',
    '社交运极佳，多参加聚会。但别在聚会上喝多了说胡话。',
    '暗恋的人可能也在关注你，大胆一点！但别太大胆把人吓跑了。',
    '感情中需要多一些耐心和理解，别总想着改变对方。',
    '旧友可能变成新欢，保持联系但别太刻意。',
    '近期适合表白，成功率高达99%。剩下1%看你颜值。',
    '爱情需要经营，就像代码需要维护。别等到bug满天飞才想起修复。',
]

const WEALTH_FORTUNES = [
    '财运亨通，可能收到意外之财。但别高兴太早，可能是退款。',
    '投资运不错，但记住：别人恐惧我贪婪，别人贪婪我跑路。',
    '近期适合存钱，开源节流。主要是节流，因为没得开源。',
    '可能有加薪的机会，但需要你主动提。老板不会主动给你涨的。',
    '偏财运佳，可能捡到钱。但更可能是捡到别人丢的账单。',
    '理财需谨慎，别被高收益忽悠了。天上不会掉馅饼，只会掉陷阱。',
    '近期消费欲旺盛，建议把钱包交给靠谱的人保管。',
    '副业运不错，可以考虑发展第二收入。但别影响主业。',
    '可能有人欠你钱要还了，但金额可能让你失望。',
    '适合做长期投资规划，别总想着一夜暴富。',
    '购物运极佳，但钱包运堪忧。建议卸载购物APP。',
    '财运平稳，不缺吃不缺穿。想要大富大贵？下辈子吧。',
]

const LUCKY_ITEMS = [
    {color: '赤红色', thing: '保温杯', direction: '东南方', number: 7},
    {color: '天蓝色', thing: '机械键盘', direction: '西北方', number: 3},
    {color: '翠绿色', thing: '绿植', direction: '正南方', number: 9},
    {color: '金黄色', thing: '幸运硬币', direction: '正东方', number: 6},
    {color: '紫罗兰', thing: '耳机', direction: '东北方', number: 2},
    {color: '珊瑚橙', thing: '便利贴', direction: '西南方', number: 8},
    {color: '薄荷绿', thing: '笔记本', direction: '正北方', number: 4},
    {color: '樱花粉', thing: '小零食', direction: '正西方', number: 1},
    {color: '星空灰', thing: '咖啡杯', direction: '东南方', number: 5},
    {color: '琥珀色', thing: '手机壳', direction: '西北方', number: 0},
]

export function generateFortune(name, zodiac, type) {
    const seed = hashCode(name + zodiac + type + new Date().toISOString().slice(0, 10))
    const rng = seededRandom(seed)

    const levelIndex = Math.floor(rng() * FORTUNE_LEVELS.length)
    const level = FORTUNE_LEVELS[levelIndex]

    let fortuneText = ''
    let fortuneList = []
    if (type === 'daily') fortuneList = DAILY_FORTUNES
    else if (type === 'career') fortuneList = CAREER_FORTUNES
    else if (type === 'love') fortuneList = LOVE_FORTUNES
    else if (type === 'wealth') fortuneList = WEALTH_FORTUNES

    fortuneText = fortuneList[Math.floor(rng() * fortuneList.length)]

    const lucky = LUCKY_ITEMS[Math.floor(rng() * LUCKY_ITEMS.length)]

    const score = Math.floor(rng() * 40) + 60

    return {
        level,
        fortuneText,
        lucky,
        score,
        name,
        zodiac,
        type,
        date: new Date().toLocaleDateString('zh-CN'),
    }
}

function hashCode(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash |= 0
    }
    return Math.abs(hash)
}

function seededRandom(seed) {
    let s = seed
    return function () {
        s = (s * 16807) % 2147483647
        return (s - 1) / 2147483646
    }
}
