import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from 'node:url'
import vitePluginSeoAnalytics from './plugins/vite-plugin-seo-analytics'

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [
            vue(),
            vitePluginSeoAnalytics({
                siteName: 'Hello Game',
                siteUrl: 'https://game.wbnull.cn',
                siteDesc: '经典益智游戏与趣味早教学习平台，包含扫雷、数独、2048、识字达人、拼音学习、英语启蒙等游戏，让小朋友在游戏中快乐成长',
                keywords: '儿童游戏,益智游戏,早教游戏,识字游戏,拼音学习,英语启蒙,数学游戏,扫雷,数独,2048,Hello Game',
                ogImage: 'https://game.wbnull.cn/favicon.svg',
                baId: env.VITE_BA_ID || '',
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
    }
})
