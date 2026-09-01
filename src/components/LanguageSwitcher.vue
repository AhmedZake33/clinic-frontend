<template>
  <div class="language-switcher">
    <b-button-group>
      <b-button
        :variant="currentLocale === 'en' ? 'primary' : 'outline-primary'"
        size="sm"
        title="English"
        class="font-weight-bold"
        @click="switchLanguage('en')"
      >
        EN
      </b-button>
      <b-button
        :variant="currentLocale === 'ar' ? 'primary' : 'outline-primary'"
        size="sm"
        title="العربية"
        class="font-weight-bold"
        @click="switchLanguage('ar')"
      >
        عربي
      </b-button>
    </b-button-group>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LanguageSwitcher',
  computed: {
    ...mapGetters('language', ['currentLocale']),
  },
  methods: {
    ...mapActions('language', ['changeLocale']),
    switchLanguage(locale) {
      if (this.currentLocale !== locale) {
        this.changeLocale(locale)
        if (this.$i18n) {
          this.$i18n.locale = locale
        }
        const isRtl = locale === 'ar'
        document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', locale)
        this.$store.commit('appConfig/SET_RTL', isRtl)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.language-switcher {
  .btn-group {
    box-shadow: 0 2px 10px 0 rgba(115, 103, 240, 0.15);
    border-radius: 6px;
    overflow: hidden;

    .btn {
      border-radius: 0;
      min-width: 48px;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 0.4rem 0.65rem;

      &:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }

      &:last-child {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }
    }
  }
}
</style>
