import {GAMES} from '@/data/games.js'

const DEFAULT_TITLE = 'Hello Game - 寓教于乐游戏平台'
const DEFAULT_DESCRIPTION = '经典益智游戏与趣味早教学习平台，包含扫雷、数独、2048、识字达人、拼音学习、英语启蒙等游戏，让小朋友在游戏中快乐成长'
const DEFAULT_KEYWORDS = '儿童游戏,益智游戏,早教游戏,识字游戏,拼音学习,英语启蒙,数学游戏,扫雷,数独,2048,Hello Game'

let _siteUrl = ''

function getOrCreateMeta(name, isProperty) {
    const attr = isProperty ? 'property' : 'name'
    let el = document.querySelector(`meta[${attr}="${name}"]`)
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
    }
    return el
}

function removeMeta(name, isProperty) {
    const attr = isProperty ? 'property' : 'name'
    const el = document.querySelector(`meta[${attr}="${name}"]`)
    if (el) el.remove()
}

function setMeta(name, content, isProperty = false) {
    getOrCreateMeta(name, isProperty).setAttribute('content', content)
}

function setCanonical(url) {
    let el = document.querySelector('link[rel="canonical"]')
    if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        document.head.appendChild(el)
    }
    el.setAttribute('href', url)
}

function updateSeo(meta = {}) {
    const {
        title = DEFAULT_TITLE,
        description = DEFAULT_DESCRIPTION,
        keywords = DEFAULT_KEYWORDS,
        url = '',
        ogType = 'website',
        ogImage = ''
    } = meta

    document.title = title
    setMeta('description', description)
    setMeta('keywords', keywords)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:type', ogType, true)
    setMeta('og:url', url, true)
    setMeta('og:site_name', 'Hello Game', true)
    setMeta('og:locale', 'zh_CN', true)

    if (ogImage) {
        setMeta('og:image', ogImage, true)
    } else {
        removeMeta('og:image', true)
    }

    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)

    if (url) setCanonical(url)
}

function injectJsonLd(schemas) {
    document.querySelectorAll('script[data-seo-jsonld]').forEach(el => el.remove())
    for (const schema of schemas) {
        const script = document.createElement('script')
        script.setAttribute('type', 'application/ld+json')
        script.setAttribute('data-seo-jsonld', '')
        script.textContent = JSON.stringify(schema)
        document.head.appendChild(script)
    }
}

function buildJsonLdSchemas(path, meta) {
    const schemas = []
    const game = GAMES.find(g => g.to === path)

    if (game) {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            name: game.title,
            description: meta.description || game.description,
            url: `${_siteUrl}${game.to}`,
            genre: game.tag,
            applicationCategory: 'Game',
            operatingSystem: 'Web Browser',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'CNY',
            },
        })

        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: '首页',
                    item: _siteUrl,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: game.title,
                    item: `${_siteUrl}${game.to}`,
                },
            ],
        })
    }

    return schemas
}

function reportPageView(url) {
    if (!window._hmt) return
    window._hmt.push(['_trackPageview', url])
}

function reportEvent(category, action, label, value) {
    if (!window._hmt) return
    window._hmt.push(['_trackEvent', category, action, label, value])
}

export default {
    install(app, {router, siteUrl = ''} = {}) {
        _siteUrl = siteUrl

        if (router) {
            router.afterEach((to) => {
                const meta = to.meta || {}

                updateSeo({
                    title: meta.title,
                    description: meta.description,
                    keywords: meta.keywords,
                    url: siteUrl + to.fullPath,
                })

                reportPageView(to.fullPath)

                const schemas = buildJsonLdSchemas(to.path, meta)
                if (schemas.length) {
                    injectJsonLd(schemas)
                }
            })
        }

        app.config.globalProperties.$track = reportEvent

        app.directive('track', {
            beforeMount(el, binding) {
                const {category = 'click', action = 'click', label = '', value} = binding.value || {}
                el._trackHandler = () => reportEvent(category, action, label, value)
                el.addEventListener('click', el._trackHandler)
            },
            unmounted(el) {
                if (el._trackHandler) {
                    el.removeEventListener('click', el._trackHandler)
                    delete el._trackHandler
                }
            },
        })
    },
}
