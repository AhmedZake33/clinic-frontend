<template>
  <b-card :dir="isArabic ? 'rtl' : 'ltr'">
    <h4 class="mb-2">
      {{ t('title') }}
    </h4>
    <b-alert
      v-if="error"
      show
      variant="danger"
    >
      {{ error }}
    </b-alert>
    <b-alert
      v-if="success"
      show
      variant="success"
    >
      {{ success }}
    </b-alert>

    <b-form @submit.prevent="save">
      <b-form-group
        :label="t('uniqueName')"
        label-for="booking_slug"
      >
        <b-form-input
          id="booking_slug"
          v-model="bookingSlug"
          :placeholder="t('slugPlaceholder')"
          required
        />
        <small class="text-muted">{{ t('slugHelp') }}</small>
      </b-form-group>

      <b-form-group
        :label="t('bookingUrl')"
        label-for="booking_url"
      >
        <b-input-group>
          <b-form-input
            id="booking_url"
            :value="bookingUrl"
            readonly
          />
          <b-input-group-append>
            <b-button
              variant="outline-primary"
              type="button"
              :disabled="!bookingUrl"
              @click="copyUrl"
            >
              {{ t('copy') }}
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-form-group
        :label="t('clinicName')"
        label-for="clinic_name"
      >
        <b-form-input
          id="clinic_name"
          v-model="clinicName"
          :placeholder="t('clinicNamePlaceholder')"
        />
      </b-form-group>

      <b-form-group
        :label="t('clinicHeader')"
        label-for="clinic_header"
      >
        <b-form-textarea
          id="clinic_header"
          v-model="clinicHeader"
          rows="3"
          :placeholder="t('clinicHeaderPlaceholder')"
        />
      </b-form-group>

      <b-form-group
        :label="t('clinicPhone')"
        label-for="clinic_phone"
      >
        <b-form-input
          id="clinic_phone"
          v-model="clinicPhone"
          :placeholder="t('clinicPhonePlaceholder')"
        />
      </b-form-group>

      <b-form-group
        :label="t('position')"
        label-for="clinic_position"
      >
        <b-form-select
          id="clinic_position"
          v-model="clinicPosition"
          :options="positionOptions"
        />
      </b-form-group>

      <b-form-group
        :label="t('color')"
        label-for="clinic_primary_color"
      >
        <b-input-group>
          <b-form-input
            id="clinic_primary_color_picker"
            v-model="clinicPrimaryColor"
            type="color"
            class="online-booking-color-input"
          />
          <b-form-input
            id="clinic_primary_color"
            v-model="clinicPrimaryColor"
            maxlength="7"
          />
        </b-input-group>
      </b-form-group>

      <div class="online-booking-preview mb-2">
        <div class="text-muted small mb-50">
          {{ t('preview') }}
        </div>
        <div
          class="online-booking-preview__card"
          :class="positionClass"
          :style="{ borderColor: safeColor }"
        >
          <h3
            class="mb-50"
            :style="{ color: safeColor }"
          >
            {{ previewClinicName }}
          </h3>
          <p
            v-if="clinicHeader"
            class="mb-0 text-muted white-space-pre-line"
          >
            {{ clinicHeader }}
          </p>
          <p
            v-if="clinicPhone"
            class="mb-0 mt-50 online-booking-preview__phone"
            dir="ltr"
            :style="{ color: safeColor }"
          >
            {{ clinicPhone }}
          </p>
        </div>
      </div>

      <b-button
        type="submit"
        variant="primary"
        :disabled="saving"
      >
        <b-spinner
          v-if="saving"
          small
          class="mr-50"
        />
        {{ t('save') }}
      </b-button>
    </b-form>
  </b-card>
</template>

<script>
import {
  BAlert, BButton, BCard, BForm, BFormGroup, BFormInput, BFormSelect, BFormTextarea, BInputGroup, BInputGroupAppend, BSpinner,
} from 'bootstrap-vue'
import onlineBooking from '@/services/onlineBooking'

const translations = {
  en: {
    title: 'Online booking link',
    uniqueName: 'Unique name',
    slugPlaceholder: 'example: doctorAhmed',
    slugHelp: 'Use English letters, numbers, and hyphens only. Example URL: /doctorAhmed',
    bookingUrl: 'Booking URL',
    clinicName: 'Clinic name',
    clinicNamePlaceholder: 'Example: Smile Clinic',
    clinicHeader: 'Booking page header',
    clinicHeaderPlaceholder: 'Write a short welcome message or clinic instructions',
    clinicPhone: 'Phone under header',
    clinicPhonePlaceholder: 'Example: +20 100 000 0000',
    position: 'Header position',
    positionLeft: 'Left',
    positionCenter: 'Center',
    positionRight: 'Right',
    color: 'Header color',
    preview: 'Preview',
    defaultClinicName: 'Clinic',
    copy: 'Copy',
    save: 'Save',
    saved: 'Online booking link saved.',
    saveError: 'Failed to save online booking link.',
    copied: 'Copied.',
  },
  ar: {
    title: 'رابط الحجز الأونلاين',
    uniqueName: 'الاسم المميز',
    slugPlaceholder: 'مثال: doctorAhmed',
    slugHelp: 'استخدم حروف إنجليزية وأرقام وشرطة فقط. مثال للرابط: /doctorAhmed',
    bookingUrl: 'رابط الحجز',
    clinicName: 'اسم العيادة',
    clinicNamePlaceholder: 'مثال: عيادة سمايل',
    clinicHeader: 'Header صفحة الحجز',
    clinicHeaderPlaceholder: 'اكتب رسالة ترحيب أو تعليمات قصيرة للمرضى',
    clinicPhone: 'رقم الهاتف تحت الهيدر',
    clinicPhonePlaceholder: 'مثال: +20 100 000 0000',
    position: 'مكان الهيدر',
    positionLeft: 'شمال',
    positionCenter: 'وسط',
    positionRight: 'يمين',
    color: 'لون الهيدر',
    preview: 'معاينة',
    defaultClinicName: 'العيادة',
    copy: 'نسخ',
    save: 'حفظ',
    saved: 'تم حفظ رابط الحجز الأونلاين.',
    saveError: 'فشل حفظ رابط الحجز الأونلاين.',
    copied: 'تم النسخ.',
  },
}

export default {
  components: {
    BAlert, BButton, BCard, BForm, BFormGroup, BFormInput, BFormSelect, BFormTextarea, BInputGroup, BInputGroupAppend, BSpinner,
  },
  data() {
    return {
      bookingSlug: '',
      bookingUrl: '',
      clinicName: '',
      clinicHeader: '',
      clinicPhone: '',
      clinicPrimaryColor: '#7367f0',
      clinicPosition: 'center',
      saving: false,
      error: '',
      success: '',
    }
  },
  computed: {
    locale() {
      return this.$i18n && this.$i18n.locale === 'ar' ? 'ar' : 'en'
    },
    isArabic() {
      return this.locale === 'ar'
    },
    previewClinicName() {
      return this.clinicName || this.t('defaultClinicName')
    },
    safeColor() {
      return /^#[0-9A-Fa-f]{6}$/.test(this.clinicPrimaryColor) ? this.clinicPrimaryColor : '#7367f0'
    },
    positionClass() {
      return {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      }[this.clinicPosition] || 'text-center'
    },
    positionOptions() {
      return [
        { value: 'left', text: this.t('positionLeft') },
        { value: 'center', text: this.t('positionCenter') },
        { value: 'right', text: this.t('positionRight') },
      ]
    },
  },
  mounted() {
    this.fetchSettings()
  },
  methods: {
    t(key) {
      return translations[this.locale]?.[key] || translations.en[key] || key
    },
    async fetchSettings() {
      const { data } = await onlineBooking.getSettings()
      this.bookingSlug = data.booking_slug || ''
      this.bookingUrl = data.booking_url || ''
      this.clinicName = data.clinic_name || ''
      this.clinicHeader = data.clinic_header || ''
      this.clinicPhone = data.clinic_phone || ''
      this.clinicPrimaryColor = data.clinic_primary_color || '#7367f0'
      this.clinicPosition = data.clinic_position || 'center'
    },
    async save() {
      this.saving = true
      this.error = ''
      this.success = ''
      try {
        const { data } = await onlineBooking.updateSettings({
          booking_slug: this.bookingSlug,
          clinic_name: this.clinicName,
          clinic_header: this.clinicHeader,
          clinic_phone: this.clinicPhone,
          clinic_primary_color: this.safeColor,
          clinic_position: this.clinicPosition,
        })
        this.bookingSlug = data.booking_slug
        this.bookingUrl = data.booking_url
        this.clinicName = data.clinic_name || ''
        this.clinicHeader = data.clinic_header || ''
        this.clinicPhone = data.clinic_phone || ''
        this.clinicPrimaryColor = data.clinic_primary_color || '#7367f0'
        this.clinicPosition = data.clinic_position || 'center'
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

<style lang="scss" scoped>
.online-booking-preview__card {
  border: 2px solid #7367f0;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #fafafa;
}

.online-booking-color-input {
  max-width: 64px;
  padding: 0.25rem;
}

.online-booking-preview__phone {
  direction: ltr;
  unicode-bidi: plaintext;
  font-weight: 600;
}

.white-space-pre-line {
  white-space: pre-line;
}
</style>
