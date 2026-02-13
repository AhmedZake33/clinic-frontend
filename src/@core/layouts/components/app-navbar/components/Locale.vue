<template>
  <b-nav-item-dropdown
    id="dropdown-grouped"
    variant="link"
    class="dropdown-language"
    :right="isRTL"
    :menu-class="isRTL ? 'dropdown-menu-left' : 'dropdown-menu-right'"
  >
    <template #button-content>
      <div class="d-flex align-items-center" :class="isRTL ? 'flex-row-reverse' : ''">
        <span class="locale-flag">{{ currentLocaleObj.flag }}</span>
        <span class="text-body" :class="isRTL ? 'mr-50' : 'ml-50'">{{ currentLocaleObj.name }}</span>
      </div>
    </template>
    <b-dropdown-item
      v-for="localeObj in locales"
      :key="localeObj.locale"
      :class="{ 'active': localeObj.locale === currentLocale }"
      @click="changeLanguage(localeObj.locale)"
    >
      <div class="d-flex align-items-center" :class="isRTL ? 'flex-row-reverse' : ''">
        <span class="locale-flag">{{ localeObj.flag }}</span>
        <span :class="isRTL ? 'mr-50' : 'ml-50'">{{ localeObj.name }}</span>
      </div>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { BNavItemDropdown, BDropdownItem, BImg } from 'bootstrap-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BImg,
  },
  computed: {
    ...mapGetters('language', ['currentLocale']),
    isRTL() {
      return this.$store.getters['language/isRTL']
    },
    currentLocaleObj() {
      return this.locales.find(l => l.locale === this.currentLocale)
    },
  },
  methods: {
    ...mapActions('language', ['changeLocale']),
    changeLanguage(locale) {
      if (this.currentLocale !== locale) {
        this.changeLocale(locale)
      }
    }
  },
  setup() {
    const locales = [
      {
        locale: 'en',
        flag: '🇺🇸',
        name: 'English',
      },
      {
        locale: 'ar',
        flag: '🇸🇦',
        name: 'العربية',
      },
    ]

    return {
      locales,
    }
  },
}
</script>

<style scoped>
.locale-flag {
  font-size: 1.2rem;
  line-height: 1;
}
</style><style>

</style>
