export const questions = [
    {
        id: 1,
        text: '早上闹钟响了，你的第一反应是？',
        options: [
            {label: '弹射起床，打工魂燃烧！', value: 'A'},
            {label: '再睡5分钟，就5分钟...', value: 'B'},
            {label: '在床上思考人生30分钟', value: 'C'}
        ],
        scores: {L: 1, M: -1, O: -1}
    },
    {
        id: 2,
        text: '老板说"今晚加个班"，你会？',
        options: [
            {label: '好的老板！我马上来！', value: 'A'},
            {label: '内心崩溃但嘴上说好', value: 'B'},
            {label: '假装没看到消息', value: 'C'}
        ],
        scores: {N: 1, S: -1, R: -1, T: 1}
    },
    {
        id: 3,
        text: '你正在摸鱼，领导突然出现在身后，你的反应？',
        options: [
            {label: '0.1秒切屏，面不改色继续工作', value: 'A'},
            {label: '手忙脚乱，鼠标飞出去', value: 'B'},
            {label: '我从不摸鱼，所以不存在这种情况', value: 'C'}
        ],
        scores: {M: 1, L: -1, R: 1, T: -1}
    },
    {
        id: 4,
        text: '午饭时间到了，你通常？',
        options: [
            {label: '边吃边工作，效率第一', value: 'A'},
            {label: '和同事一起吃，聊八卦', value: 'B'},
            {label: '一个人安静地吃，刷手机', value: 'C'}
        ],
        scores: {N: 1, S: -1, R: 1, T: -1}
    },
    {
        id: 5,
        text: '面对一个不可能的deadline，你？',
        options: [
            {label: '通宵也要干完！', value: 'A'},
            {label: '先发个朋友圈吐槽', value: 'B'},
            {label: '默默焦虑，然后开始做', value: 'C'}
        ],
        scores: {I: 1, O: -1, R: 1, T: -1}
    },
    {
        id: 6,
        text: '开会时你通常在做什么？',
        options: [
            {label: '认真做笔记，积极发言', value: 'A'},
            {label: '偷偷摸鱼刷手机', value: 'B'},
            {label: '神游太虚，想晚上吃什么', value: 'C'}
        ],
        scores: {L: 1, M: -1, R: 1, T: -1}
    },
    {
        id: 7,
        text: '收到工作群消息"收到请回复"，你？',
        options: [
            {label: '秒回"收到"', value: 'A'},
            {label: '等别人先回我再回', value: 'B'},
            {label: '看到了但假装没看到', value: 'C'}
        ],
        scores: {N: 1, S: -1, R: 1, T: -1}
    },
    {
        id: 8,
        text: '下班时间到了，但同事都没走，你？',
        options: [
            {label: '继续加班，反正也没事', value: 'A'},
            {label: '等有人先走我就走', value: 'B'},
            {label: '直接走，下班就是下班', value: 'C'}
        ],
        scores: {N: 1, S: -1, I: 1, O: -1}
    },
    {
        id: 9,
        text: '同事请你帮忙，但你很忙，你？',
        options: [
            {label: '放下手头的事先帮', value: 'A'},
            {label: '嘴上答应但拖着', value: 'B'},
            {label: '委婉拒绝', value: 'C'}
        ],
        scores: {N: 1, S: -1, R: 1, T: -1}
    },
    {
        id: 10,
        text: '你的工位是什么样的？',
        options: [
            {label: '整整齐齐，一尘不染', value: 'A'},
            {label: '堆满零食和手办', value: 'B'},
            {label: '乱但我知道东西在哪', value: 'C'}
        ],
        scores: {L: 1, M: -1, I: 1, O: -1}
    },
    {
        id: 11,
        text: '团建活动你通常？',
        options: [
            {label: '积极组织，气氛担当', value: 'A'},
            {label: '被迫参加但玩得还行', value: 'B'},
            {label: '找借口不去', value: 'C'}
        ],
        scores: {R: 1, T: -1, L: 1, M: -1}
    },
    {
        id: 12,
        text: '你的微信工作群有几个？',
        options: [
            {label: '20个以上，每个都很活跃', value: 'A'},
            {label: '10个左右，偶尔冒泡', value: 'B'},
            {label: '太多已数不清，全部免打扰', value: 'C'}
        ],
        scores: {N: 1, S: -1, R: 1, T: -1}
    },
    {
        id: 13,
        text: '领导表扬你时，你？',
        options: [
            {label: '更加努力工作！', value: 'A'},
            {label: '开心地告诉所有人', value: 'B'},
            {label: '表面淡定内心窃喜', value: 'C'}
        ],
        scores: {N: 1, S: -1, R: 1, T: -1}
    },
    {
        id: 14,
        text: '你对"996"的看法？',
        options: [
            {label: '年轻人就该拼！', value: 'A'},
            {label: '给够钱就行', value: 'B'},
            {label: '坚决反对，生活第一', value: 'C'}
        ],
        scores: {I: 1, O: -1, N: 1, S: -1}
    },
    {
        id: 15,
        text: '项目出了bug，你的反应？',
        options: [
            {label: '马上排查修复，不睡觉也要搞定', value: 'A'},
            {label: '先甩锅再说', value: 'B'},
            {label: '默默修好，不告诉任何人', value: 'C'}
        ],
        scores: {I: 1, O: -1, R: 1, T: -1}
    },
    {
        id: 16,
        text: '你的电脑桌面？',
        options: [
            {label: '文件夹分类清晰，壁纸励志', value: 'A'},
            {label: '满屏文件，找不到东西', value: 'B'},
            {label: '默认壁纸，几个快捷方式', value: 'C'}
        ],
        scores: {L: 1, M: -1, I: 1, O: -1}
    },
    {
        id: 17,
        text: '你发朋友圈的频率？',
        options: [
            {label: '几乎不发，太忙了', value: 'A'},
            {label: '一天三条起步', value: 'B'},
            {label: '偶尔发一条，三天可见', value: 'C'}
        ],
        scores: {N: 1, S: -1, R: 1, T: -1}
    },
    {
        id: 18,
        text: '面对内卷，你的策略？',
        options: [
            {label: '卷死他们！我才是最卷的', value: 'A'},
            {label: '假装卷，实际摸鱼', value: 'B'},
            {label: '躺平任嘲，佛系人生', value: 'C'}
        ],
        scores: {I: 1, O: -1, M: 1, L: -1}
    },
    {
        id: 19,
        text: '你加班时的晚餐？',
        options: [
            {label: '泡面，快速解决继续干', value: 'A'},
            {label: '点最贵的外卖犒劳自己', value: 'B'},
            {label: '忘了吃...', value: 'C'}
        ],
        scores: {N: 1, S: -1, I: 1, O: -1}
    },
    {
        id: 20,
        text: '你的年假使用情况？',
        options: [
            {label: '从来没用完过', value: 'A'},
            {label: '用完还要请事假', value: 'B'},
            {label: '攒着不用，怕回来活更多', value: 'C'}
        ],
        scores: {N: 1, S: -1, I: 1, O: -1}
    },
    {
        id: 21,
        text: '你的工资到手第一件事？',
        options: [
            {label: '存起来，以备不时之需', value: 'A'},
            {label: '犒劳自己，买买买', value: 'B'},
            {label: '还花呗信用卡', value: 'C'}
        ],
        scores: {L: 1, M: -1, O: 1, I: -1}
    },
    {
        id: 22,
        text: '你的通勤路上做什么？',
        options: [
            {label: '听有声书/课程充电', value: 'A'},
            {label: '刷短视频/社交软件', value: 'B'},
            {label: '发呆/睡觉', value: 'C'}
        ],
        scores: {I: 1, O: -1, R: 1, T: -1}
    },
    {
        id: 23,
        text: '你换工作的频率？',
        options: [
            {label: '从不换，忠诚度拉满', value: 'A'},
            {label: '三年一换，看看世界', value: 'B'},
            {label: '想换但懒得找', value: 'C'}
        ],
        scores: {N: 1, S: -1, O: 1, I: -1}
    },
    {
        id: 24,
        text: '你对KPI的态度？',
        options: [
            {label: '必须超额完成！', value: 'A'},
            {label: '及格就行，别太卷', value: 'B'},
            {label: 'KPI是什么？能吃吗？', value: 'C'}
        ],
        scores: {I: 1, O: -1, N: 1, S: -1}
    },
    {
        id: 25,
        text: '你在公司最常用的表情包是？',
        options: [
            {label: '👍 收到/没问题', value: 'A'},
            {label: '😂 哈哈哈哈', value: 'B'},
            {label: '😑 无语/冷漠', value: 'C'}
        ],
        scores: {N: 1, S: -1, R: 1, T: -1}
    },
    {
        id: 26,
        text: '周五下午5点，你的状态？',
        options: [
            {label: '还在认真工作', value: 'A'},
            {label: '已经开始规划周末了', value: 'B'},
            {label: '灵魂已经下班了', value: 'C'}
        ],
        scores: {L: 1, M: -1, O: 1, I: -1}
    },
    {
        id: 27,
        text: '你的职场座右铭？',
        options: [
            {label: '只要干不死，就往死里干', value: 'A'},
            {label: '摸鱼一时爽，一直摸一直爽', value: 'B'},
            {label: '活着就好', value: 'C'}
        ],
        scores: {I: 1, O: -1, M: 1, L: -1}
    },
    {
        id: 28,
        text: '如果可以选，你最想成为？',
        options: [
            {label: '永动机，不需要休息', value: 'A'},
            {label: '猫，吃了睡睡了吃', value: 'B'},
            {label: '隐身人，没人找得到我', value: 'C'}
        ],
        scores: {I: 1, O: -1, R: 1, T: -1}
    },
    {
        id: 29,
        text: '你的年度目标完成情况？',
        options: [
            {label: '超额完成！明年加码', value: 'A'},
            {label: '目标？什么目标？', value: 'B'},
            {label: '完成了一半吧...', value: 'C'}
        ],
        scores: {I: 1, O: -1, L: 1, M: -1}
    },
    {
        id: 30,
        text: '你的咖啡/茶杯状态？',
        options: [
            {label: '永远是满的，续命专用', value: 'A'},
            {label: '经常忘了喝，凉了倒掉', value: 'B'},
            {label: '用保温杯，养生第一', value: 'C'}
        ],
        scores: {N: 1, S: -1, I: 1, O: -1}
    },
    {
        id: 31,
        text: '如果用一句话总结你的职场状态？',
        options: [
            {label: '燃烧自己，照亮公司', value: 'A'},
            {label: '假装燃烧，实际摸鱼', value: 'B'},
            {label: '连假装都懒得假装了', value: 'C'}
        ],
        scores: {L: 1, M: -1, I: 1, O: -1}
    }
]

export const personalityTypes = {
    'NLRI': {
        code: 'HORSE',
        name: '汗血宝马',
        emoji: '🐎',
        color: '#e17055',
        shortDesc: '日行千里不知疲倦的职场战神',
        description: '你就是职场上的汗血宝马！日行千里不知疲倦，加班到凌晨依然精神抖擞。你的座右铭是"只要干不死，就往死里干"，老板最爱你的奉献精神。别人下班了你还在干，别人放假了你还在干，别人退休了你可能还在干。你的血液里流淌的不是红细胞，是浓缩咖啡。不过记得偶尔停下来喝口水，汗血宝马也是需要补水的！',
        traits: ['职场战神', '永不言弃', '效率达人', '老板最爱']
    },
    'NLRT': {
        code: 'OX',
        name: '老黄牛',
        emoji: '🐂',
        color: '#00b894',
        shortDesc: '默默耕耘，事了拂衣去',
        description: '你是默默耕耘的老黄牛！不鸣则已，一鸣惊人。你从不邀功，但活都是你干的。你是那种"事了拂衣去，深藏功与名"的存在。虽然存在感不高，但缺了你整个团队都要瘫痪。低调是你的保护色，实力是你的底气！别人在群里抢功劳时，你已经在默默修第三个bug了。',
        traits: ['默默耕耘', '事了拂衣', '低调实力派', '团队中流砥柱']
    },
    'NLOI': {
        code: 'PEACOCK',
        name: '开屏孔雀',
        emoji: '🦚',
        color: '#e11d48',
        shortDesc: '干得漂亮，更要秀得漂亮',
        description: '你是职场上的开屏孔雀！干得漂亮，更要秀得漂亮。你深谙"会干不如会秀"的真理，每完成一个项目都要让全公司知道。你的周报写得像小说，你的汇报PPT堪比发布会。有人说你爱表现，但你知道——在这个酒香也怕巷子深的时代，不秀等于没干！你的存在感拉满，你的KPI也拉满。',
        traits: ['表现达人', '存在感拉满', 'PPT之王', '团队明星']
    },
    'NLOT': {
        code: 'DONKEY',
        name: '倔驴',
        emoji: '🐴',
        color: '#78716c',
        shortDesc: '认准的事，八头牛都拉不回来',
        description: '你是职场上的倔驴！认准的事，八头牛都拉不回来。别人说"这样不行"，你偏要试试；领导说"换个方案"，你坚持己见。你的倔强有时让人头疼，但正是这股不服输的劲，让你啃下了无数硬骨头。你不是不听劝，你只是觉得——我的方案明明更好啊！',
        traits: ['执着坚持', '认准不放', '方案控', '永不言败']
    },
    'NMRI': {
        code: 'SQUID',
        name: '章鱼哥',
        emoji: '🦑',
        color: '#6366f1',
        shortDesc: '八只手同时摸八条鱼',
        description: '你是职场上的章鱼哥！八只手同时摸八条鱼，摸鱼效率无人能敌。你能在开会时偷偷网购，在写报告时追剧，在打电话时打游戏，而且每样都不耽误。你的多任务处理能力让IT部门怀疑你是不是装了双系统。你的座右铭是：摸鱼不等于不干活，只是我效率太高了而已。',
        traits: ['摸鱼大师', '多任务处理', '效率天才', '摸鱼劳模']
    },
    'NMRT': {
        code: 'CAT',
        name: '摸鱼猫',
        emoji: '🐱',
        color: '#f59e0b',
        shortDesc: '明目张胆地摸，心安理得地躺',
        description: '恭喜你获得了"摸鱼猫"称号！你是办公室里的摸鱼大师，擅长在忙碌的表象下优雅地划水。你的哲学是"能摸就摸，不能摸创造条件也要摸"。你和老板之间隔着一层薄薄的演技，而你的演技已经到了影后级别。不过你的社交能力一流，人缘极好，毕竟摸鱼也需要团队配合！',
        traits: ['摸鱼专家', '演技派', '人缘好', '划水达人']
    },
    'NMOI': {
        code: 'FOX',
        name: '精算狐狸',
        emoji: '🦊',
        color: '#8b5cf6',
        shortDesc: '每一步都经过精密计算',
        description: '你是职场上的精算狐狸！每一步都经过精密计算，绝不浪费一分力气。你的Excel比别人的命都长，你的计划精确到秒。你不是在卷，你是在用最少的力气获得最大的回报。别人在拼命，你在拼智商！你的年终总结里永远有一张别人看不懂但老板很满意的ROI分析表。',
        traits: ['精于计算', '效率至上', '数据驱动', '战略大师']
    },
    'NMOT': {
        code: 'CHAMELEON',
        name: '变色龙',
        emoji: '🦎',
        color: '#06b6d4',
        shortDesc: '什么环境变什么色，生存力拉满',
        description: '你是职场上的变色龙！什么环境变什么色，生存力拉满。领导面前你沉稳可靠，同事面前你幽默风趣，客户面前你专业干练。你像一面完美的镜子，每个人都能在你身上看到自己想看的样子。有人说你没有自我，但你觉得——能活下来的人格才是好人格！',
        traits: ['适应力强', '生存大师', '处世圆滑', '完美平衡']
    },
    'SLRI': {
        code: 'EAGLE',
        name: '职场鹰',
        emoji: '🦅',
        color: '#dc2626',
        shortDesc: '不干则已，一干惊人',
        description: '你是职场上的鹰！不干则已，一干惊人。你平时看着像个闲人，但关键时刻总能一击必中。你信奉"二八定律"——用20%的时间完成80%的工作，剩下80%的时间用来思考人生。你不是懒，你是在蓄力。当别人还在加班时，你已经用最优雅的方式完成了任务，然后潇洒下班。',
        traits: ['一击必中', '战略清晰', '效率优先', '潇洒从容']
    },
    'SLRT': {
        code: 'PANDA',
        name: '国宝熊猫',
        emoji: '🐼',
        color: '#374151',
        shortDesc: '又懒又萌，但谁也替代不了',
        description: '你是职场上的国宝熊猫！又懒又萌，但谁也替代不了。你看起来整天在吃竹子（摸鱼），但你的存在本身就是一种价值。你有一种神奇的能力——让所有人都觉得你很可爱，即使你什么都没做。你的核心竞争力不是能力，是让人不忍心开除你的萌力。',
        traits: ['萌力无限', '不可替代', '团队吉祥物', '开心果']
    },
    'SLOR': {
        code: 'PARROT',
        name: '复读鹦鹉',
        emoji: '🦜',
        color: '#10b981',
        shortDesc: '收到收到，好的好的，没问题没问题',
        description: '你是职场上的复读鹦鹉！收到收到，好的好的，没问题没问题。你的工作模式就是——领导说啥你说啥，同事说啥你附和啥。你以为你没有主见？不，你的主见就是"听别人的准没错"。你是团队里最让人安心的存在，因为你永远不会唱反调。你的职场生存法则：少说多听，多说好话。',
        traits: ['复读机', '安全牌', '老好人', '团队粘合剂']
    },
    'SLOT': {
        code: 'SLOTH',
        name: '树懒',
        emoji: '🦥',
        color: '#84cc16',
        shortDesc: '慢……慢……来……不……急……',
        description: '你是职场上的树懒！慢……慢……来……不……急……你的工作节奏让急性子同事抓狂，但你自有一套哲学——欲速则不达。别人一天干完的活，你一周干完，但质量嘛……也差不多。你的座右铭是：急什么，deadline还没到呢。你的存在让团队学会了耐心，也让项目经理学会了催促。',
        traits: ['慢条斯理', '淡定从容', '慢工出细活', '心态大师']
    },
    'SMRI': {
        code: 'MONKEY',
        name: '吗喽',
        emoji: '🐒',
        color: '#f97316',
        shortDesc: '灵魂还停留在树上荡秋千的时代',
        description: '朋友，你不是"童心未泯"，你压根就没进化。你的灵魂还停留在那个挂在树上荡秋千、看见香蕉就两眼放光的快乐时代。你在办公室里上蹿下跳，把严肃的会议室变成你的游乐场。规则偶尔是可以打破的，天花板是用来倒挂的，老板的假发是用来抢的。你的快乐感染着每一个人，虽然有时候也让人头疼。',
        traits: ['快乐源泉', '打破常规', '创意无限', '气氛担当']
    },
    'SMRT': {
        code: 'HAMSTER',
        name: '仓鼠',
        emoji: '🐹',
        color: '#ec4899',
        shortDesc: '在跑轮上拼命跑，但还在原地',
        description: '你是职场上的仓鼠！在跑轮上拼命跑，但还在原地。你每天忙忙碌碌，加班加点，但回头一看——好像也没什么实质进展。你不是不努力，你只是努力的方向……有点跑偏。你的跑轮就是你的舒适区，跑得越快，越停不下来。但别灰心，至少你的运动步数每天都是朋友圈第一。',
        traits: ['忙碌充实', '努力担当', '步数王者', '坚韧不拔']
    },
    'SMOI': {
        code: 'CROW',
        name: '乌鸦',
        emoji: '🐦‍⬛',
        color: '#1f2937',
        shortDesc: '嘴上骂骂咧咧，手上活干得最漂亮',
        description: '你是职场上的乌鸦！嘴上骂骂咧咧，手上活干得最漂亮。你一边吐槽"这什么破需求"，一边交出了全场最佳方案。你一边说"我才不加班"，一边在凌晨三点提交了代码。你的嘴和你的手住在两个平行宇宙，嘴在骂世界，手在救世界。同事都知道：乌鸦骂得越凶，交付质量越高。',
        traits: ['口嫌体正直', '嘴硬心软', '实力派', '吐槽达人']
    },
    'SMOT': {
        code: 'OSTRICH',
        name: '鸵鸟',
        emoji: '🦩',
        color: '#a78bfa',
        shortDesc: '看不见的问题就不是问题',
        description: '你是职场上的鸵鸟！看不见的问题就不是问题。你的绝招是——把头埋进沙子里，假装一切都没发生。邮件不回就是没看到，消息免打扰就是不存在，deadline推迟就是还有时间。你的座右铭是：只要我不面对，问题就不存在。但别担心，当问题真的炸了，你跑得比谁都快。',
        traits: ['逃避专家', '心态大师', '自欺欺人', '生存有道']
    }
}

export const specialPersonalityTypes = {
    'WATER': {
        code: 'WATER',
        name: '水豚',
        emoji: '🦛',
        color: '#94a3b8',
        shortDesc: '精神状态领先人类五百年',
        description: '恭喜你测出了最佛系的人格——水豚！你的精神状态领先人类五百年，对一切事物都保持着"哦，好的"的淡定态度。老板骂你？哦，好的。同事甩锅？哦，好的。项目延期？哦，好的。你不是不在乎，你是真的——不在乎。你活在这个内卷的世界里，就像一只水豚混在鳄鱼堆里，谁也不惹你，你也不惹谁。你的存在证明了：只要心态够好，哪里都是度假村。',
        traits: ['佛系大师', '心态王者', '岁月静好', '云淡风轻']
    },
    'ROBOT': {
        code: 'ROBOT',
        name: '打工人',
        emoji: '🤖',
        color: '#64748b',
        shortDesc: '不是在打工，就是在去打工的路上',
        description: '恭喜你测出了最经典的人格——打工人！你不是在打工，就是在去打工的路上。你的生物钟和打卡机同步，你的心跳频率和KPI共振。你像一台精密的打工机器，准时上班，准时加班，准时疲惫，准时崩溃，然后准时第二天继续上班。打工人的世界里没有诗和远方，只有地铁和打卡。但你知道——打工可能不致富，但不打工一定饿死。',
        traits: ['打工魂', '准时准点', '坚韧不拔', '打工人永不为奴']
    },
    'GHOST': {
        code: 'GHOST',
        name: '隐形人',
        emoji: '👻',
        color: '#c084fc',
        shortDesc: '存在感约等于空气',
        description: '恭喜你测出了最透明的人格——隐形人！你的存在感约等于空气，但和空气一样——缺了你谁都活不了。你从不主动发言，从不抢功，从不参加团建，但每次团队出问题，都是你在背后默默收拾烂摊子。你像职场的暗物质，看不见摸不着，但维系着整个团队的引力。你的座右铭是：低调做人，高调做事，然后继续低调做人。',
        traits: ['隐形专家', '默默奉献', '低调行事', '暗物质存在']
    },
    'SALMON': {
        code: 'SALMON',
        name: '逆流鲑鱼',
        emoji: '🐟',
        color: '#ef4444',
        shortDesc: '别人往东你往西，别人躺平你站起',
        description: '恭喜你测出了最叛逆的人格——逆流鲑鱼！别人往东你往西，别人躺平你站起。当全公司都在摸鱼时，你在加班；当全公司都在加班时，你在摸鱼。你永远和主流反着来，不是因为你有意为之，而是你的DNA里就刻着"逆流而上"四个字。你的存在让领导又爱又恨——爱你的冲劲，恨你的不可控。',
        traits: ['逆流而上', '特立独行', '叛逆先锋', '不走寻常路']
    },
    'SPONGE': {
        code: 'SPONGE',
        name: '海绵宝宝',
        emoji: '🧽',
        color: '#fbbf24',
        shortDesc: '吸收一切负能量，挤出正能量',
        description: '恭喜你测出了最乐观的人格——海绵宝宝！你是职场上的开心果，无论环境多么恶劣，你都能挤出微笑。老板骂你？你在学习！同事甩锅？你在锻炼！项目炸了？你在成长！你的乐观让周围人怀疑你是不是没有痛觉，但只有你知道——海绵吸满了水也会沉的。不过没关系，挤一挤，又是一条好汉！',
        traits: ['乐观达人', '开心果', '正能量源泉', '打不死的小强']
    },
    'MOLE': {
        code: 'MOLE',
        name: '鼹鼠',
        emoji: '🐀',
        color: '#78716c',
        shortDesc: '在地下默默挖洞，没人知道你在干嘛',
        description: '恭喜你测出了最神秘的人格——鼹鼠！你在地下默默挖洞，没人知道你在干嘛，包括你自己。你的工作状态对所有人来说都是黑箱——输入需求，输出成果，中间过程？不知道。你的代码没人看得懂，你的方案没人知道怎么想出来的，你的工作方式让同事怀疑你是不是在用某种神秘力量完成工作。',
        traits: ['神秘大师', '地下工作者', '深不可测', '低调实力派']
    }
}

export const dimensionLabels = [
    {key: 'workEthic', name: '工作热情', emoji: '🔥'},
    {key: 'fishSkill', name: '摸鱼技术', emoji: '🐟'},
    {key: 'socialPower', name: '社交能力', emoji: '🗣️'},
    {key: 'stealthLevel', name: '隐身等级', emoji: '👤'},
    {key: 'loyalty', name: '忠诚度', emoji: '❤️'},
    {key: 'creativity', name: '创造力', emoji: '💡'},
    {key: 'stressResist', name: '抗压能力', emoji: '🛡️'},
    {key: 'overtimeIndex', name: '加班指数', emoji: '🌙'},
    {key: 'coffeeDep', name: '咖啡依赖', emoji: '☕'},
    {key: 'salarySatis', name: '薪资满意度', emoji: '💰'},
    {key: 'meetingSurvival', name: '开会存活率', emoji: '😴'},
    {key: 'excuseSkill', name: '借口技术', emoji: '🤷'},
    {key: 'internalFriction', name: '内耗指数', emoji: '⚡'},
    {key: 'lyingFlat', name: '躺平指数', emoji: '🛋️'},
    {key: 'crazyIndex', name: '发疯指数', emoji: '🤪'}
]

export const axisLabels = {
    N: {name: '牛马打工', fullName: 'Niuma'},
    S: {name: '撒手不管', fullName: 'Slacker'},
    M: {name: '摸鱼大师', fullName: 'Moyu'},
    L: {name: '劳模标兵', fullName: 'Laomo'},
    R: {name: '社牛显眼', fullName: 'Renren'},
    T: {name: '社恐隐身', fullName: 'Touming'},
    I: {name: '内卷狂魔', fullName: 'Involution'},
    O: {name: '佛系躺平', fullName: 'Outian'}
}

export function calculateResult(answers) {
    const axisScores = {N: 0, S: 0, M: 0, L: 0, R: 0, T: 0, I: 0, O: 0}
    const dimScores = {}
    dimensionLabels.forEach(d => {
        dimScores[d.key] = 0
    })

    let neutralCount = 0

    questions.forEach((q, index) => {
        const answer = answers[index]
        if (!answer) return

        if (answer === 'B' && q.options.length === 3) {
            neutralCount++
        }

        const optionIndex = q.options.findIndex(o => o.value === answer)
        const scoreMultiplier = optionIndex === 0 ? 1 : optionIndex === 1 ? 0 : -1

        Object.entries(q.scores).forEach(([key, val]) => {
            if (typeof val !== 'number') return
            const score = val * scoreMultiplier
            if (axisScores[key] !== undefined) {
                axisScores[key] += score
            }
        })
    })

    dimScores.workEthic = axisScores.L * 3 + axisScores.N * 2
    dimScores.fishSkill = axisScores.M * 3 + axisScores.S * 2
    dimScores.socialPower = axisScores.R * 3 + axisScores.N * 1
    dimScores.stealthLevel = axisScores.T * 3 + axisScores.S * 2
    dimScores.loyalty = axisScores.N * 2 + axisScores.L * 2
    dimScores.creativity = axisScores.M * 2 + axisScores.I * 1
    dimScores.stressResist = axisScores.O * 2 + axisScores.M * 1
    dimScores.overtimeIndex = axisScores.I * 3 + axisScores.N * 2
    dimScores.coffeeDep = axisScores.I * 2 + axisScores.L * 2
    dimScores.salarySatis = axisScores.O * 2 + axisScores.M * 1
    dimScores.meetingSurvival = axisScores.M * 2 + axisScores.T * 2
    dimScores.excuseSkill = axisScores.M * 3 + axisScores.S * 1
    dimScores.internalFriction = axisScores.T * 2 + axisScores.I * 1
    dimScores.lyingFlat = axisScores.O * 3 + axisScores.S * 2
    dimScores.crazyIndex = axisScores.M * 2 + axisScores.R * 2

    const nsAxis = axisScores.N >= axisScores.S ? 'N' : 'S'
    const mlAxis = axisScores.M >= axisScores.L ? 'M' : 'L'
    const rtAxis = axisScores.R >= axisScores.T ? 'R' : 'T'
    const ioAxis = axisScores.I >= axisScores.O ? 'I' : 'O'

    const axisKey = nsAxis + mlAxis + rtAxis + ioAxis

    let personality = personalityTypes[axisKey]

    if (neutralCount >= 20) {
        personality = specialPersonalityTypes['WATER']
    } else if (dimScores.lyingFlat >= 8 && dimScores.workEthic <= -4) {
        personality = specialPersonalityTypes['WATER']
    } else if (dimScores.workEthic >= 8 && dimScores.overtimeIndex >= 6 && dimScores.coffeeDep >= 4) {
        personality = specialPersonalityTypes['ROBOT']
    } else if (dimScores.stealthLevel >= 8 && dimScores.socialPower <= -4) {
        personality = specialPersonalityTypes['GHOST']
    } else if (dimScores.crazyIndex >= 6 && dimScores.creativity >= 3) {
        personality = specialPersonalityTypes['SALMON']
    } else if (dimScores.stressResist >= 6 && dimScores.socialPower >= 4) {
        personality = specialPersonalityTypes['SPONGE']
    } else if (dimScores.stealthLevel >= 6 && dimScores.creativity >= 2 && dimScores.socialPower <= -2) {
        personality = specialPersonalityTypes['MOLE']
    }

    if (!personality) {
        personality = personalityTypes['NLRI']
    }

    const normalizedDims = {}
    dimensionLabels.forEach(d => {
        const raw = dimScores[d.key]
        normalizedDims[d.key] = Math.max(5, Math.min(95, 50 + raw * 6))
    })

    return {
        personality,
        axisScores,
        axes: {ns: nsAxis, ml: mlAxis, rt: rtAxis, io: ioAxis},
        dimensions: normalizedDims
    }
}
