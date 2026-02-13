<template>
  <div
    id="app"
    class="h-100"
    :class="[skinClasses, { 'rtl': isRTL }]"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <component :is="layout">
      <router-view :key="$route.fullPath" />
    </component>

    <scroll-to-top v-if="enableScrollToTop" />
  </div>
</template>



<script>
import ScrollToTop from '@core/components/scroll-to-top/ScrollToTop.vue'

// This will be populated in `beforeCreate` hook
import { $themeColors, $themeBreakpoints, $themeConfig } from '@themeConfig'
import { provideToast } from 'vue-toastification/composition'
import { watch, computed } from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'

import { useWindowSize, useCssVar } from '@vueuse/core'

import store from '@/store'

const LayoutVertical = () => import('@/layouts/vertical/LayoutVertical.vue')
const LayoutHorizontal = () => import('@/layouts/horizontal/LayoutHorizontal.vue')
const LayoutFull = () => import('@/layouts/full/LayoutFull.vue')

export default {
  components: {

    // Layouts
    LayoutHorizontal,
    LayoutVertical,
    LayoutFull,

    ScrollToTop,
  },
  // ! We can move this computed: layout & contentLayoutType once we get to use Vue 3
  // Currently, router.currentRoute is not reactive and doesn't trigger any change
  computed: {
    layout() {
      if (this.$route.meta.layout === 'full') return 'layout-full'
      return `layout-${this.contentLayoutType}`
    },
    contentLayoutType() {
      return this.$store.state.appConfig.layout.type
    },
    isRTL() {
      return this.$store.getters['language/isRTL']
    },
    currentLocale() {
      return this.$store.getters['language/currentLocale']
    },
  },
  watch: {
    currentLocale: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          // Update document direction and language
          const html = document.documentElement
          const isRTL = newVal === 'ar'
          
          html.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
          html.setAttribute('lang', newVal)
          
          // Update body classes
          document.body.classList.remove('rtl', 'ltr')
          document.body.classList.add(isRTL ? 'rtl' : 'ltr')
          
          // Sync Vuexy appConfig RTL state
          this.$store.commit('appConfig/SET_RTL', isRTL)
        }
      },
      immediate: true
    }
  },
  beforeCreate() {
    // Set colors in theme
    const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = colors.length; i < len; i++) {
      $themeColors[colors[i]] = useCssVar(`--${colors[i]}`, document.documentElement).value.trim()
    }

    // Set Theme Breakpoints
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = breakpoints.length; i < len; i++) {
      $themeBreakpoints[breakpoints[i]] = Number(useCssVar(`--breakpoint-${breakpoints[i]}`, document.documentElement).value.slice(0, -2))
    }

    // Set RTL based on stored locale
    const storedLocale = localStorage.getItem('locale') || 'en'
    const isRTL = storedLocale === 'ar'
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', storedLocale)
    document.body.classList.remove('rtl', 'ltr')
    document.body.classList.add(isRTL ? 'rtl' : 'ltr')
    
    // Sync appConfig RTL state at startup
    store.commit('appConfig/SET_RTL', isRTL)
  },
  setup() {
    const { skin, skinClasses } = useAppConfig()
    const { enableScrollToTop } = $themeConfig.layout

    // If skin is dark when initialized => Add class to body
    if (skin.value === 'dark') document.body.classList.add('dark-layout')

    // Provide toast for Composition API usage
    // This for those apps/components which uses composition API
    // Demos will still use Options API for ease
    provideToast({
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      icon: false,
      timeout: 3000,
      transition: 'Vue-Toastification__fade',
    })

    // Set Window Width in store
    store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth)
    const { width: windowWidth } = useWindowSize()
    watch(windowWidth, val => {
      store.commit('app/UPDATE_WINDOW_WIDTH', val)
    })

    // Ensure sidebar is visible on login
    const isLoggedIn = computed(() => store.getters['auth/isLoggedIn'])
    watch(isLoggedIn, (newVal) => {
      if (newVal) {
        // Force sidebar to be visible on login
        setTimeout(() => {
          store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth)
        }, 100)
      }
    })

    return {
      skinClasses,
      enableScrollToTop,
    }
  },
}
</script>
