import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import seoAnalytics from './plugins/seoAnalytics.js'

createApp(App)
    .use(router)
    .use(seoAnalytics, {router, siteUrl: 'https://game.wbnull.cn'})
    .mount('#app')
