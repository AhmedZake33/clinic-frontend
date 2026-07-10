<template>
  <b-card :dir="isArabic ? 'rtl' : 'ltr'">
    <h4 class="mb-2">{{ t('title') }}</h4>
    <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
    <b-alert v-if="success" show variant="success">{{ success }}</b-alert>

    <b-form @submit.prevent="save">
      <b-form-group :label="t('uniqueName')" label-for="booking_slug">
        <b-form-input id="booking_slug" v-model="bookingSlug" :placeholder="t('slugPlaceholder')" required />
        <small class="text-muted">{{ t('slugHelp') }}</small>
      </b-form-group>

      <b-form-group :label="t('bookingUrl')" label-for="booking_url">
        <b-input-group>
          <b-form-input id="booking_url" :value="bookingUrl" readonly />
          <b-input-group-append>
            <b-button variant="outline-primary" type="button" :disabled="!bookingUrl" @click="copyUrl">{{ t('copy') }}</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-button type="submit" variant="primary" :disabled="saving">
        <b-spinner v-if="saving" small class="mr-50" />
        {{ t('save') }}
      </b-button>
    </b-form>
  </b-card>
</template>

<script>
import {
  BAlert, BButton, BCard, BForm, BFormGroup, BFormInput, BInputGroup, BInputGroupAppend, BSpinner,
} from 'bootstrap-vue'
import onlineBooking from '@/services/onlineBooking'

const translations = {
  en: {
    title: 'Online booking link',
    uniqueName: 'Unique name',
    slugPlaceholder: 'example: dr-ahmed',
    slugHelp: 'Use lowercase letters, numbers, and hyphens only. Example URL: /dr-ahmed',
    bookingUrl: 'Booking URL',
    copy: 'Copy',
    save: 'Save',
    saved: 'Online booking link saved.',
    saveError: 'Failed to save online booking link.',
    copied: 'Copied.',
  },
  ar: {
    title: 'رابط الحجز الأونلاين',
    uniqueName: 'الاسم المميز',
    slugPlaceholder: 'مثال: dr-ahmed',
    slugHelp: 'استخدم حروف إنجليزية صغيرة وأرقام وشرطة فقط. مثال للرابط: /dr-ahmed',
    bookingUrl: 'رابط الحجز',
    copy: 'نسخ',
    save: 'حفظ',
    saved: 'تم حفظ رابط الحجز الأونلاين.',
    saveError: 'فشل حفظ رابط الحجز الأونلاين.',
    copied: 'تم النسخ.',
  },
}

export default {
  components: {
    BAlert, BButton, BCard, BForm, BFormGroup, BFormInput, BInputGroup, BInputGroupAppend, BSpinner,
  },
  data() {
    return {
      bookingSlug: '',
      bookingUrl: '',
      saving: false,
      error: '',
      success: '',
    }
  },
  mounted() {
    this.fetchSettings()
  },
  computed: {
    locale() {
      return this.$i18n && this.$i18n.locale === 'ar' ? 'ar' : 'en'
    },
    isArabic() {
      return this.locale === 'ar'
    },
  },
  methods: {
    t(key) {
      return translations[this.locale]?.[key] || translations.en[key] || key
    },
    async fetchSettings() {
      const { data } = await onlineBooking.getSettings()
      this.bookingSlug = data.booking_slug || ''
      this.bookingUrl = data.booking_url || ''
    },
    async save() {
      this.saving = true
      this.error = ''
      this.success = ''
      try {
        const { data } = await onlineBooking.updateSettings({ booking_slug: this.bookingSlug })
        this.bookingSlug = data.booking_slug
        this.bookingUrl = data.booking_url
        this.success = this.t('saved')
      } catch (error) {
        const errors = error.response?.data?.errors
        this.error = errors ? Object.values(errors).flat().join('\n') : (error.response?.data?.message || this.t('saveError'))
      } finally {
        this.saving = false
      }
    },
    async copyUrl() {
      await navigator.clipboard.writeText(this.bookingUrl)
      this.success = this.t('copied')
    },
  },
}
</script>
