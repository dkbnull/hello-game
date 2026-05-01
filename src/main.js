import {createApp} from 'vue'
import {createPinia} from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import seoAnalytics from './plugins/seoAnalytics.js'

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .use(seoAnalytics, {router, siteUrl: 'https://game.wbnull.cn'})
    .mount('#app')
