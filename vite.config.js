import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {fileURLToPath, URL} from 'node:url'
import vitePluginSeoAnalytics from './plugins/vite-plugin-seo-analytics'

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [
            vue(),
            VueDevTools(),
            AutoImport({
                imports: ['vue', 'vue-router', 'pinia'],
                dts: 'src/auto-imports.d.ts',
                vueTemplate: true,
            }),
            Components({
                dirs: ['src/components'],
                dts: 'src/components.d.ts',
            }),
            vitePluginSeoAnalytics({
                siteName: 'Hello Game',
                siteUrl: 'https://game.wbnull.cn',
                siteDesc: 'Hello Game 是一个寓教于乐游戏平台，集合益智、休闲、早教与互动体验，包含扫雷、2048、数独、消消乐、识字达人、拼音学习、英语启蒙、加减乐园、忍者结印、今天吃什么等游戏，发现乐趣尽在游戏',
                keywords: '趣味游戏,益智游戏,休闲游戏,早教游戏,互动游戏,在线游戏,扫雷,2048,数独,消消乐,识字游戏,拼音学习,英语启蒙,数学游戏,忍者结印,今天吃什么,Hello Game',
                ogImage: 'https://game.wbnull.cn/favicon.svg',
                baId: env.VITE_BA_ID || '',
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            proxy: {},
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules/vue/') || id.includes('node_modules/vue-router/')) {
                            return 'vue'
                        }
                    },
                },
            },
        },
    }
})
