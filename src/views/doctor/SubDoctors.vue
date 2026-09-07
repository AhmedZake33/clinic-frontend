<template>
  <div>
    <b-card>
      <!-- <b-card-header>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t('subDoctors.title') }}</h4>
            <small v-if="maxAllowed > 0" class="text-muted">
              {{ $t('subDoctors.usage', { current: subs.length, max: maxAllowed }) }}
            </small>
            <small v-else class="text-danger">
              {{ $t('subDoctors.notAllowed') }}
            </small>
          </div>
          <b-button variant="primary" :disabled="maxAllowed <= 0 || subs.length >= maxAllowed" @click="openAdd">
            <feather-icon icon="PlusIcon" class="mr-50" />
            {{ $t('subDoctors.add') }}
          </b-button>
        </div>
      </b-card-header> -->

      <b-row class="mb-2">
        <b-col
          cols="12"
          md="4"
        >
          <h4>
            <small
              v-if="maxAllowed > 0"
              class="text-muted"
            >
              {{ $t('subDoctors.usage', { current: subs.length, max: maxAllowed }) }}
            </small>
          </h4>
        </b-col>
        <b-col
          cols="12"
          md="8"
          class="text-right"
        >
          <b-button
            variant="primary"
            :disabled="maxAllowed <= 0 || subs.length >= maxAllowed"
            @click="openAdd"
          >
            <feather-icon
              icon="PlusIcon"
              class="mr-50"
            />
            {{ $t('subDoctors.add') }}
          </b-button>
        </b-col>
      </b-row>

      <b-table
        :key="`sub-doctors-${currentLocale}`"
        :items="subs"
        :fields="fields"
        :busy="loading"
        responsive
      >
        <template #cell(permissions)="data">
          <div class="small text-muted">
            <div
              v-for="p in data.item.permissions"
              :key="p"
            >
              {{ p }}
            </div>
          </div>
        </template>

        <template #cell(actions)="data">
          <responsive-table-actions>
            <b-button
              size="sm"
              variant="flat-primary"
              class="mr-25"
              @click="edit(data.item)"
            >
              <feather-icon icon="EditIcon" />
            </b-button>
            <b-button
              size="sm"
              variant="flat-danger"
              @click="remove(data.item)"
            >
              <feather-icon icon="TrashIcon" />
            </b-button>
          </responsive-table-actions>
        </template>
      </b-table>
    </b-card>

    <b-modal
      v-model="showModal"
      :title="isEditing ? $t('subDoctors.edit') : $t('subDoctors.add')"
      @hidden="reset"
    >
      <b-form @submit.prevent="save">
        <b-form-group :label="$t('subDoctors.name')">
          <b-form-input
            v-model="form.name"
            required
          />
        </b-form-group>
        <b-form-group :label="$t('subDoctors.nameEn')">
          <b-form-input v-model="form.name_en" />
        </b-form-group>
        <b-form-group :label="$t('subDoctors.email')">
          <b-form-input
            v-model="form.email"
            type="email"
            :required="!isEditing"
          />
        </b-form-group>
        <b-form-group :label="$t('client.phone')">
          <div
            class="phone-combined-control"
            :class="{ 'phone-combined-control--rtl': $store.state.appConfig.isRTL }"
          >
            <div class="country-col">
              <b-form-select
                v-model="form.phone_country_code"
                class="phone-country-select"
                :options="countrySelectOptions"
                :required="!!form.phone"
              />
            </div>
            <div class="number-col">
              <b-form-input
                v-model="form.phone"
                class="phone-number-input"
                :placeholder="$t('client.phone')"
              />
            </div>
          </div>
        </b-form-group>
        <b-form-group :label="$t('client.whatsappNumber')">
          <b-form-checkbox
            v-model="form.useSameMobile"
            class="mb-50"
            @change="handleUseSameMobileChange"
          >
            {{ $t('client.useSameMobile') }}
          </b-form-checkbox>
          <div
            class="phone-combined-control"
            :class="{ 'phone-combined-control--rtl': $store.state.appConfig.isRTL }"
          >
            <div class="country-col">
              <b-form-select
                v-model="form.whatsapp_country_code"
                class="phone-country-select"
                :options="countrySelectOptions"
                :disabled="form.useSameMobile"
                :required="!!form.whatsapp_number && !form.useSameMobile"
              />
            </div>
            <div class="number-col">
              <b-form-input
                v-model="form.whatsapp_number"
                class="phone-number-input"
                :placeholder="$t('client.whatsappPlaceholder')"
                :disabled="form.useSameMobile"
              />
            </div>
          </div>
        </b-form-group>
        <b-form-group :label="$t('admin.specialization')">
          <b-form-select
            v-model="form.specialization"
            :options="specializationOptions"
          >
            <template #first>
              <b-form-select-option value="">
                {{ $t('admin.specializationPlaceholder') }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
        <b-form-group :label="$t('subDoctors.password')">
          <div class="d-flex justify-content-between align-items-center mb-50">
            <span />
            <b-button
              size="xs"
              variant="flat-primary"
              class="p-0 font-weight-bold"
              type="button"
              @click="generateSubDoctorPassword"
            >
              <feather-icon
                icon="KeyIcon"
                size="12"
                class="mr-25 ml-25"
              />
              {{ $t('auth.generateStrongPassword') }}
            </b-button>
          </div>
          <app-password-input
            v-model="form.password"
            :placeholder="isEditing ? $t('assistant.leaveBlank') : ''"
          />
          <small class="text-muted d-block mt-50">
            {{ $t('auth.strongPasswordHelp') }}
          </small>

          <!-- Real-time Strength Meter -->
          <div
            v-if="form.password"
            class="mt-1 p-1 bg-light rounded"
          >
            <div class="d-flex justify-content-between align-items-center mb-50 font-small-2">
              <span>{{ $t('auth.passwordStrength') }}:</span>
              <span
                class="font-weight-bold"
                :class="{
                  'text-danger': passwordStats.strengthLabel === 'weak',
                  'text-warning': passwordStats.strengthLabel === 'medium',
                  'text-success': passwordStats.strengthLabel === 'strong'
                }"
              >
                {{ $t(`auth.${passwordStats.strengthLabel}`) }}
              </span>
            </div>
            <div class="d-flex flex-wrap font-small-2">
              <span
                class="mr-1 ml-1 mb-25"
                :class="passwordStats.hasMinLength ? 'text-success font-weight-bold' : 'text-muted'"
              >
                {{ passwordStats.hasMinLength ? '✓' : '○' }} 8+ Chars
              </span>
              <span
                class="mr-1 ml-1 mb-25"
                :class="(passwordStats.hasUpper && passwordStats.hasLower) ? 'text-success font-weight-bold' : 'text-muted'"
              >
                {{ (passwordStats.hasUpper && passwordStats.hasLower) ? '✓' : '○' }} A-Z & a-z
              </span>
              <span
                class="mr-1 ml-1 mb-25"
                :class="passwordStats.hasNumber ? 'text-success font-weight-bold' : 'text-muted'"
              >
                {{ passwordStats.hasNumber ? '✓' : '○' }} 0-9
              </span>
              <span
                class="mr-1 ml-1 mb-25"
                :class="passwordStats.hasSymbol ? 'text-success font-weight-bold' : 'text-muted'"
              >
                {{ passwordStats.hasSymbol ? '✓' : '○' }} Special Symbol (@$!%*#?&)
              </span>
            </div>
          </div>
        </b-form-group>
      </b-form>

      <template #modal-footer>
        <b-button
          variant="secondary"
          @click="showModal = false"
        >
          {{ $t('actions.cancel') }}
        </b-button>
        <b-button
          variant="primary"
          @click="save"
        >
          {{ isEditing ? $t('actions.save') : $t('actions.add') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import subDoctorsApi from '@/services/subDoctors'
import countryList from '@/utils/countries'
import { hasMissingPhoneCountryCode, splitPhoneNumber } from '@/utils/phoneNumbers'
import { validatePasswordStrength, generateStrongPassword } from '@/utils/password'
import ResponsiveTableActions from '@/components/ResponsiveTableActions.vue'

export default {
  components: {
    ResponsiveTableActions,
  },
  data() {
    return {
      subs: [],
      maxAllowed: 0,
      loading: false,
      showModal: false,
      isEditing: false,
      selected: null,
      specializations: [],
      form: {
        name: '',
        email: '',
        phone: '',
        phone_country_code: '',
        whatsapp_number: '',
        whatsapp_country_code: '',
        useSameMobile: false,
        specialization: '',
        password: '',
      },
    }
  },
  computed: {
    countrySelectOptions() {
      return [{ value: '', text: this.$t('client.selectCountryCode') }].concat(countryList.map(country => ({ value: country.value, text: country.label })))
    },
    currentLocale() {
      return (this.$i18n?.locale || localStorage.getItem('locale') || 'en').substring(0, 2)
    },
    specializationOptions() {
      return this.specializations.map(specialization => ({
        value: typeof specialization === 'string' ? specialization : specialization.value,
        text: typeof specialization === 'string' ? specialization : (specialization.labels?.[this.currentLocale] || specialization.labels?.en || specialization.value),
      }))
    },
    fields() {
      return [
        { key: 'name', label: this.$t('subDoctors.name') },
        { key: 'email', label: this.$t('subDoctors.email') },
        { key: 'phone', label: this.$t('client.phone') },
        { key: 'whatsapp_number', label: this.$t('client.whatsappNumber') },
        { key: 'specialization', label: this.$t('admin.specialization'), formatter: this.specializationLabel },
        { key: 'actions', label: this.$t('table.actions') },
      ]
    },
    passwordStats() {
      return validatePasswordStrength(this.form.password)
    },
  },
  mounted() {
    this.fetch()
    this.fetchSpecializations()
  },
  methods: {
    generateSubDoctorPassword() {
      const generated = generateStrongPassword(14)
      this.form.password = generated
      this.$toast({
        component: ToastificationContent,
        props: {
          title: this.$t('auth.generateStrongPassword'),
          text: generated,
          variant: 'info',
        },
      })
    },
    async fetchSpecializations() {
      try {
        const { data } = await subDoctorsApi.getSpecializations()
        this.specializations = data || []
      } catch {
        this.specializations = []
      }
    },
    specializationLabel(value) {
      if (!value) return 'N/A'
      const specialization = this.specializations.find(item => {
        const itemValue = typeof item === 'string' ? item : item.value
        return itemValue === value
      })
      if (!specialization || typeof specialization === 'string') return value
      return specialization.labels?.[this.currentLocale] || specialization.labels?.en || value
    },
    async fetch() {
      this.loading = true
      try {
        const { data } = await subDoctorsApi.getAll()
        this.subs = data.sub_doctors || data
        this.maxAllowed = data.max_sub_doctors ?? 0
      } finally { this.loading = false }
    },
    openAdd() { this.reset(); this.showModal = true },
    edit(item) {
      const phone = splitPhoneNumber(item.phone)
      const whatsapp = splitPhoneNumber(item.whatsapp_number)
      this.selected = item
      this.isEditing = true
      this.form = {
        name: item.name,
        email: item.email,
        phone: phone.number,
        phone_country_code: phone.prefix,
        whatsapp_number: whatsapp.number,
        whatsapp_country_code: whatsapp.prefix,
        useSameMobile: item.phone && item.phone === item.whatsapp_number,
        specialization: item.specialization || '',
        password: '',
      }
      this.showModal = true
    },
    async save() {
      if (this.hasMissingPhoneCountryCode(this.form)) return
      if (this.form.password) {
        const stats = validatePasswordStrength(this.form.password)
        if (!stats.isValid) {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: this.$t('messages.error'),
              text: this.$t('auth.strongPasswordHelp'),
              variant: 'danger',
            },
          })
          return
        }
      }
      try {
        if (this.isEditing) {
          await subDoctorsApi.update(this.selected.id, this.form)
          this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('messages.updateSuccess'), variant: 'success' } })
        } else {
          const { data } = await subDoctorsApi.create(this.form)
          // show generated or provided password so doctor can share it
          if (data.plain_password) {
            this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('subDoctors.createdWithPassword', { password: data.plain_password }), variant: 'success' } })
          } else {
            this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('messages.addSuccess'), variant: 'success' } })
          }
        }
        this.showModal = false
        this.fetch()
      } catch (e) {
        const msg = e.response?.data?.message || this.$t('messages.saveError')
        this.$swal({ title: this.$t('messages.error'), text: msg, icon: 'error' })
      }
    },
    async remove(item) {
      const result = await this.$swal({
        title: this.$t('messages.deleteConfirm'),
        text: item.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('actions.confirm'),
        cancelButtonText: this.$t('actions.cancel'),
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-secondary ml-1',
        },
        buttonsStyling: false,
      })
      if (!result.isConfirmed) return
      try {
        await subDoctorsApi.delete(item.id)
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('messages.deleteSuccess'), variant: 'success' } })
        this.fetch()
      } catch (e) {
        const msg = e.response?.data?.message || this.$t('messages.saveError')
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.error'), text: msg, variant: 'danger' } })
      }
    },
    reset() { this.isEditing = false; this.selected = null; this.form = this.emptyForm() },
    emptyForm() {
      return {
        name: '',
        email: '',
        phone: '',
        phone_country_code: '',
        whatsapp_number: '',
        whatsapp_country_code: '',
        useSameMobile: false,
        specialization: '',
        password: '',
      }
    },
    handleUseSameMobileChange() {
      if (this.form.useSameMobile) {
        this.form.whatsapp_number = this.form.phone
        this.form.whatsapp_country_code = this.form.phone_country_code
      }
    },
    hasMissingPhoneCountryCode(form) {
      if (!hasMissingPhoneCountryCode(form)) return false
      this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.error'), text: this.$t('client.selectCountryCode'), variant: 'danger' } })
      return true
    },
  },
}
</script>

<style scoped>
.phone-combined-control {
  display: flex;
  width: 100%;
}

.country-col {
  flex: 0 0 150px;
  max-width: 150px;
}

.number-col {
  flex: 1;
  min-width: 0;
}

::v-deep .phone-country-select.custom-select {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.phone-number-input {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.phone-combined-control--rtl ::v-deep .phone-country-select.custom-select {
  border-radius: 0 0.357rem 0.357rem 0;
}

.phone-combined-control--rtl .phone-number-input {
  border-radius: 0.357rem 0 0 0.357rem;
}
</style>
