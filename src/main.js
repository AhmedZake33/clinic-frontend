import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'

// Bootstrap & BootstrapVue CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// BootstrapVue
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import i18n from '@/libs/i18n'
import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

// Register Language Switcher globally
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
Vue.component('LanguageSwitcher', LanguageSwitcher)

// 3rd party plugins
import '@axios'
import '@/libs/acl'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/tour'

// Laravel Echo / Reverb WebSocket
import '@/libs/echo'

// Global real-time broadcast notifications
import GlobalBroadcast from '@/plugins/globalBroadcast'
Vue.use(GlobalBroadcast)

// Permission directive
import '@/plugins/permission'

// Axios Mock Adapter
import '@/@fake-db/db'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

// RTL CSS for Arabic support - MUST come AFTER core.scss and style.scss
// so manual RTL overrides take precedence over postcss-rtl auto-generated rules
import '@/assets/scss/rtl.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  created() {
    // Initialize language store with current i18n locale without reloading
    this.$store.dispatch('language/initializeLocale', this.$i18n.locale)

    // On every page load / refresh, re-fetch permissions from the server
    // so admin changes are picked up immediately
    if (this.$store.getters['auth/isLoggedIn']) {
      this.$store.dispatch('auth/fetchPermissions')
    }
  },
  render: h => h(App),
}).$mount('#app')
