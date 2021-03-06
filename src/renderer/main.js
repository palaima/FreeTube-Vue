// import the styles
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'material-design-icons/iconfont/material-icons.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueI18n from 'vue-i18n'
import yaml from 'js-yaml'
import fs from 'fs'

const isDev = process.env.NODE_ENV === 'development'

Vue.config.devtools = isDev
Vue.config.performance = isDev
Vue.config.productionTip = isDev

library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueI18n)

// List of locales approved for use
const activeLocales = ['en-US', 'de-DE', 'es-MX', 'fi', 'fr-FR', 'ja', 'pt-BR', 'pt-PT', 'ru', 'vi', 'zh-CN', 'zh-TW']
const messages = {}
const fileLocation = isDev ? 'static/locales/' : `${__dirname}/static/locales/`

// Take active locales and load respective YAML file
activeLocales.forEach((locale) => {
  try {
    // File location when running in dev
    const doc = yaml.safeLoad(fs.readFileSync(`${fileLocation}${locale}.yaml`))
    messages[locale] = doc
  } catch (e) {
    console.log(e)
  }
})

const i18n = new VueI18n({
  locale: 'en-US', // set locale
  fallbackLocale: {
    default: 'en-US'
  },
  messages // set locale messages
})

/* eslint-disable-next-line */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

// to avoild accesing electorn api from web app build
if (window && window.process && window.process.type === 'renderer') {
  const { ipcRenderer } = require('electron')

  // handle menu event updates from main script
  ipcRenderer.on('change-view', (event, data) => {
    if (data.route) {
      router.push(data.route)
    }
  })
}
