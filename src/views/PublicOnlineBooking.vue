<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div
      class="auth-inner py-2 online-booking-page"
      :dir="isArabic ? 'rtl' : 'ltr'"
    >
      <b-card>
        <div class="d-flex justify-content-end mb-1">
          <b-form-select
            v-model="language"
            :options="languageOptions"
            class="language-select"
          />
        </div>

        <div
          v-if="loading"
          class="text-center py-2"
        >
          <b-spinner />
        </div>

        <div v-else-if="loadError">
          <b-alert
            show
            variant="danger"
          >
            {{ loadError }}
          </b-alert>
        </div>

        <div v-else>
          <div
            class="online-booking-header mb-2"
            :class="clinicPositionClass"
            :style="{ borderColor: clinicPrimaryColor }"
          >
            <h3
              v-if="clinic.name"
              class="mb-50"
              :style="{ color: clinicPrimaryColor }"
            >
              {{ clinic.name }}
            </h3>
            <p
              v-if="clinic.header"
              class="text-muted mb-50 online-booking-header__text"
            >
              {{ clinic.header }}
            </p>
            <p
              v-if="clinic.phone"
              class="mb-0 online-booking-header__phone"
              dir="ltr"
              :style="{ color: clinicPrimaryColor }"
            >
              {{ clinic.phone }}
            </p>
          </div>
          <p
            v-if="clinic.address"
            class="text-muted mb-2"
            :class="clinicPositionClass"
          >
            {{ clinic.address }}
          </p>

          <b-alert
            v-if="successMessage"
            show
            variant="success"
          >
            {{ successMessage }}
          </b-alert>
          <b-alert
            v-if="errorMessage"
            show
            variant="danger"
          >
            {{ errorMessage }}
          </b-alert>

          <b-form @submit.prevent="submitBooking">
            <b-form-group label-for="doctor_id">
              <template #label>
                {{ t('doctor') }} <span class="required-star">*</span>
              </template>
              <b-form-select
                id="doctor_id"
                v-model="form.doctor_id"
                :options="doctorOptions"
                required
                @change="fetchTimes"
              />
            </b-form-group>

            <b-form-group label-for="appointment_date">
              <template #label>
                {{ t('date') }} <span class="required-star">*</span>
              </template>
              <b-form-input
                id="appointment_date"
                v-model="form.appointment_date"
                type="date"
                :min="today"
                required
                @change="fetchTimes"
              />
            </b-form-group>

            <b-form-group label-for="appointment_time">
              <template #label>
                {{ t('time') }} <span class="required-star">*</span>
              </template>
              <b-form-select
                id="appointment_time"
                v-model="form.appointment_time"
                :options="timeOptions"
                :disabled="timesLoading || !form.doctor_id || !form.appointment_date"
                required
              >
                <template #first>
                  <b-form-select-option
                    :value="null"
                    disabled
                  >
                    {{ timesLoading ? t('loadingTimes') : t('selectTime') }}
                  </b-form-select-option>
                </template>
              </b-form-select>
              <small
                v-if="!timesLoading && form.doctor_id && form.appointment_date && timeOptions.length === 0"
                class="text-danger"
              >
                {{ t('noTimes') }}
              </small>
            </b-form-group>

            <b-form-group label-for="name">
              <template #label>
                {{ t('name') }} <span class="required-star">*</span>
              </template>
              <b-form-input
                id="name"
                v-model="form.name"
                required
              />
            </b-form-group>

            <b-form-group label-for="phone">
              <template #label>
                {{ t('phone') }} <span class="required-star">*</span>
              </template>
              <div class="phone-combined-control">
                <div class="country-col">
                  <b-form-select
                    id="phone_country_code"
                    v-model="form.phone_country_code"
                    :options="countrySelectOptions"
                    required
                  />
                </div>
                <div class="number-col">
                  <b-form-input
                    id="phone"
                    v-model="form.phone"
                    required
                  />
                </div>
              </div>
            </b-form-group>

            <b-form-group
              :label="t('whatsapp')"
              label-for="whatsapp_number"
            >
              <div class="phone-combined-control">
                <div class="country-col">
                  <b-form-select
                    id="whatsapp_country_code"
                    v-model="form.whatsapp_country_code"
                    :options="countrySelectOptions"
                    :disabled="!form.whatsapp_number"
                  />
                </div>
                <div class="number-col">
                  <b-form-input
                    id="whatsapp_number"
                    v-model="form.whatsapp_number"
                    :placeholder="t('optional')"
                  />
                </div>
              </div>
            </b-form-group>

            <b-form-group
              :label="t('email')"
              label-for="email"
            >
              <b-form-input
                id="email"
                v-model="form.email"
                type="email"
              />
            </b-form-group>

            <b-form-group
              :label="t('notes')"
              label-for="notes"
            >
              <b-form-textarea
                id="notes"
                v-model="form.notes"
                rows="3"
              />
            </b-form-group>

            <b-button
              type="submit"
              variant="primary"
              block
              :disabled="submitting"
            >
              <b-spinner
                v-if="submitting"
                small
                class="mr-50"
              />
              {{ t('submit') }}
            </b-button>
          </b-form>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import {
  BAlert, BButton, BCard, BForm, BFormGroup, BFormInput, BFormSelect,
  BFormSelectOption, BFormTextarea, BSpinner,
} from 'bootstrap-vue'
import onlineBooking from '@/services/onlineBooking'
import countryList from '@/utils/countries'
import { preparePhonePayload } from '@/utils/phoneNumbers'

const translations = {
  en: {
    arabic: 'Arabic',
    english: 'English',
    doctor: 'Doctor',
    date: 'Date',
    time: 'Time',
    loadingTimes: 'Loading times...',
    selectTime: 'Select time',
    noTimes: 'No available times for this date.',
    name: 'Name',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    optional: 'Optional',
    email: 'Email',
    notes: 'Notes',
    submit: 'Submit booking request',
    pageUnavailable: 'Booking page is not available.',
    successMessage: 'Booking request submitted successfully. The clinic will contact you.',
    successTitle: 'Booking request submitted',
    successText: 'The clinic will contact you to confirm your appointment.',
    ok: 'OK',
    submitError: 'Failed to submit booking request.',
  },
  ar: {
    arabic: 'العربية',
    english: 'English',
    doctor: 'الطبيب',
    date: 'التاريخ',
    time: 'الوقت',
    loadingTimes: 'جاري تحميل المواعيد...',
    selectTime: 'اختر الوقت',
    noTimes: 'لا توجد مواعيد متاحة في هذا التاريخ.',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    whatsapp: 'واتساب',
    optional: 'اختياري',
    email: 'البريد الإلكتروني',
    notes: 'ملاحظات',
    submit: 'إرسال طلب الحجز',
    pageUnavailable: 'صفحة الحجز غير متاحة.',
    successMessage: 'تم إرسال طلب الحجز بنجاح. ستتواصل معك العيادة.',
    successTitle: 'تم إرسال طلب الحجز',
    successText: 'ستتواصل معك العيادة لتأكيد الموعد.',
    ok: 'حسنًا',
    submitError: 'فشل إرسال طلب الحجز.',
  },
}

const normalizeLanguage = value => (['ar', 'en'].includes(value) ? value : 'en')

export default {
  components: {
    BAlert,
    BButton,
    BCard,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormSelectOption,
    BFormTextarea,
    BSpinner,
  },
  data() {
    return {
      loading: false,
      language: normalizeLanguage(this.$i18n?.locale || localStorage.getItem('locale') || 'en'),
      timesLoading: false,
      submitting: false,
      loadError: '',
      errorMessage: '',
      successMessage: '',
      clinic: {},
      doctors: [],
      form: {
        doctor_id: null,
        appointment_date: '',
        appointment_time: null,
        name: '',
        phone_country_code: '+20',
        phone: '',
        whatsapp_country_code: '+20',
        whatsapp_number: '',
        email: '',
        notes: '',
      },
      slots: [],
    }
  },
  computed: {
    isArabic() {
      return this.language === 'ar'
    },
    languageOptions() {
      const currentTranslations = translations[this.language] || translations.en
      return [
        { value: 'en', text: currentTranslations.english },
        { value: 'ar', text: currentTranslations.arabic },
      ]
    },
    slug() {
      return this.$route.params.bookingSlug
    },
    today() {
      const date = new Date()
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      return date.toISOString().slice(0, 10)
    },
    doctorOptions() {
      return this.doctors.map(doctor => ({ value: doctor.id, text: doctor.specialization ? `${doctor.name} - ${doctor.specialization}` : doctor.name }))
    },
    countrySelectOptions() {
      return countryList.map(country => ({ value: country.value, text: country.label }))
    },
    timeOptions() {
      return this.slots.map(slot => ({ value: slot.time, text: slot.label }))
    },
    clinicPrimaryColor() {
      return /^#[0-9A-Fa-f]{6}$/.test(this.clinic.primary_color || '') ? this.clinic.primary_color : '#7367f0'
    },
    clinicPositionClass() {
      return {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      }[this.clinic.position] || 'text-center'
    },
  },
  watch: {
    language(value) {
      const normalizedLanguage = normalizeLanguage(value)
      if (this.language !== normalizedLanguage) {
        this.language = normalizedLanguage
        return
      }

      if (this.$i18n && this.$i18n.locale !== normalizedLanguage) {
        this.$i18n.locale = normalizedLanguage
      }

      this.$store?.commit('appConfig/SET_RTL', normalizedLanguage === 'ar')
      localStorage.setItem('locale', normalizedLanguage)
    },
    '$i18n.locale': {
      handler(value) {
        this.language = normalizeLanguage(value)
      },
    },
  },
  mounted() {
    this.form.appointment_date = this.today
    this.fetchPage()
  },
  methods: {
    t(key) {
      return translations[this.language]?.[key] || translations.en[key] || key
    },
    async fetchPage() {
      this.loading = true
      this.loadError = ''
      try {
        const { data } = await onlineBooking.getPublic(this.slug)
        this.clinic = data.clinic || {}
        this.doctors = data.doctors || []
        if (this.doctors.length) {
          this.form.doctor_id = this.doctors[0].id
          await this.fetchTimes()
        }
      } catch (error) {
        this.loadError = error.response?.data?.message || this.t('pageUnavailable')
      } finally {
        this.loading = false
      }
    },
    async fetchTimes() {
      if (!this.form.doctor_id || !this.form.appointment_date) return
      this.timesLoading = true
      this.form.appointment_time = null
      this.slots = []
      try {
        const { data } = await onlineBooking.getAvailableTimes(this.slug, this.form.doctor_id, this.form.appointment_date)
        this.slots = data.slots || []
      } finally {
        this.timesLoading = false
      }
    },
    async submitBooking() {
      this.submitting = true
      this.errorMessage = ''
      this.successMessage = ''
      try {
        const payload = preparePhonePayload(this.form)
        await onlineBooking.submit(this.slug, payload)
        this.successMessage = this.t('successMessage')
        this.$swal({
          icon: 'success',
          title: this.t('successTitle'),
          text: this.t('successText'),
          confirmButtonText: this.t('ok'),
          customClass: {
            confirmButton: 'btn btn-success',
          },
          buttonsStyling: false,
        })
        this.form.name = ''
        this.form.phone = ''
        this.form.whatsapp_number = ''
        this.form.email = ''
        this.form.notes = ''
        await this.fetchTimes()
      } catch (error) {
        this.errorMessage = error.response?.data?.message || this.t('submitError')
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';

.online-booking-page {
  max-width: 620px;
}

.language-select {
  max-width: 160px;
}

.online-booking-header__text {
  white-space: pre-line;
}

.online-booking-header__phone {
  direction: ltr;
  unicode-bidi: plaintext;
  font-weight: 600;
}

.online-booking-header {
  border: 2px solid #7367f0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.required-star {
  color: #ea5455;
  font-weight: 700;
}

.phone-combined-control {
  display: flex;
  width: 100%;
}

.country-col {
  flex: 0 0 185px;
  max-width: 185px;
}

.number-col {
  flex: 1;
  min-width: 0;
}

.country-col .custom-select {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.number-col .form-control {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
