<template>
  <div>
    <b-card :title="$t('printSettings.title')">
      <b-form @submit.prevent="save">
        <b-row>
          <b-col
            cols="12"
            md="6"
          >
            <b-form-group :label="$t('printSettings.clinicName')">
              <b-form-input
                v-model="form.print_clinic_name"
                :placeholder="$t('clinic.name')"
              />
            </b-form-group>
          </b-col>
          <b-col
            cols="12"
            md="6"
          >
            <b-form-group :label="$t('printSettings.clinicPhone')">
              <b-form-input
                v-model="form.print_clinic_phone"
                :placeholder="$t('client.phone')"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group :label="$t('printSettings.clinicAddress')">
              <b-form-input
                v-model="form.print_clinic_address"
                :placeholder="$t('client.address')"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group :label="$t('printSettings.headerText')">
              <b-form-textarea
                v-model="form.print_header_text"
                rows="3"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group :label="$t('printSettings.footerText')">
              <b-form-textarea
                v-model="form.print_footer_text"
                rows="3"
              />
            </b-form-group>
          </b-col>
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group :label="$t('printSettings.primaryColor')">
              <b-input-group>
                <b-form-input
                  v-model="form.print_primary_color"
                  type="color"
                  class="print-color-input"
                />
                <b-form-input
                  v-model="form.print_primary_color"
                  maxlength="7"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group :label="$t('printSettings.clinicNamePosition')">
              <b-form-select
                v-model="form.print_clinic_name_position"
                :options="clinicNamePositionOptions"
              />
            </b-form-group>
          </b-col>
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group :label="$t('printSettings.patientInfoPosition')">
              <b-form-select
                v-model="form.print_patient_info_position"
                :options="patientInfoPositionOptions"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <div class="d-flex justify-content-end">
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
            {{ $t('actions.save') }}
          </b-button>
        </div>
      </b-form>
    </b-card>

    <b-card
      :title="$t('printSettings.preview')"
      class="mt-2"
    >
      <div class="print-preview">
        <div
          class="print-preview-header"
          :class="clinicNamePositionClass"
          :style="{ backgroundColor: safeColor }"
        >
          {{ form.print_clinic_name || $t('clinic.name') }}
        </div>
        <div :class="['mt-1', clinicNamePositionClass]">
          <div v-if="form.print_clinic_phone">
            {{ form.print_clinic_phone }}
          </div>
          <div v-if="form.print_clinic_address">
            {{ form.print_clinic_address }}
          </div>
          <div
            v-if="form.print_header_text"
            class="mt-50"
          >
            {{ form.print_header_text }}
          </div>
        </div>
        <hr>
        <h5 class="text-center">
          {{ $t('reservation.printPrescription') }}
        </h5>
        <div
          v-if="form.print_patient_info_position === 'top'"
          class="preview-patient-info"
        >
          <p><strong>{{ $t('client.name') }}:</strong> {{ $t('reservation.client') }}</p>
          <p><strong>{{ $t('client.phone') }}:</strong> 01000000000</p>
        </div>
        <div class="preview-doctor-info">
          <p><strong>{{ $t('reservation.doctor') }}:</strong> Dr. Name</p>
        </div>
        <div
          v-if="form.print_patient_info_position === 'after_doctor'"
          class="preview-patient-info"
        >
          <p><strong>{{ $t('client.name') }}:</strong> {{ $t('reservation.client') }}</p>
          <p><strong>{{ $t('client.phone') }}:</strong> 01000000000</p>
        </div>
        <p><strong>{{ $t('reservation.diagnosis') }}:</strong> ...</p>
        <p><strong>{{ $t('reservation.treatment') }}:</strong> ...</p>
        <div
          v-if="form.print_patient_info_position === 'bottom'"
          class="preview-patient-info"
        >
          <p><strong>{{ $t('client.name') }}:</strong> {{ $t('reservation.client') }}</p>
          <p><strong>{{ $t('client.phone') }}:</strong> 01000000000</p>
        </div>
        <div
          v-if="form.print_footer_text"
          class="text-center small text-muted mt-2"
        >
          {{ form.print_footer_text }}
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BButton,
  BCard,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BFormTextarea,
  BInputGroup,
  BRow,
  BSpinner,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import printSettingsApi from '@/services/printSettings'

const emptyForm = () => ({
  print_clinic_name: '',
  print_clinic_phone: '',
  print_clinic_address: '',
  print_header_text: '',
  print_footer_text: '',
  print_primary_color: '#2C5AA0',
  print_clinic_name_position: 'center',
  print_patient_info_position: 'top',
})

export default {
  components: {
    BButton,
    BCard,
    BCol,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormTextarea,
    BInputGroup,
    BRow,
    BSpinner,
  },
  data() {
    return {
      form: emptyForm(),
      saving: false,
    }
  },
  computed: {
    safeColor() {
      return /^#[0-9A-Fa-f]{6}$/.test(this.form.print_primary_color)
        ? this.form.print_primary_color
        : '#2C5AA0'
    },
    clinicNamePositionClass() {
      return {
        left: 'text-left',
        right: 'text-right',
        center: 'text-center',
      }[this.form.print_clinic_name_position] || 'text-center'
    },
    clinicNamePositionOptions() {
      return [
        { value: 'center', text: this.$t('printSettings.positionCenter') },
        { value: 'left', text: this.$t('printSettings.positionLeft') },
        { value: 'right', text: this.$t('printSettings.positionRight') },
      ]
    },
    patientInfoPositionOptions() {
      return [
        { value: 'top', text: this.$t('printSettings.patientTop') },
        { value: 'after_doctor', text: this.$t('printSettings.patientAfterDoctor') },
        { value: 'bottom', text: this.$t('printSettings.patientBottom') },
      ]
    },
  },
  mounted() {
    this.fetch()
  },
  methods: {
    async fetch() {
      try {
        const { data } = await printSettingsApi.get()
        this.form = { ...emptyForm(), ...data }
      } catch {
        this.form = emptyForm()
      }
    },
    async save() {
      this.saving = true
      try {
        const { data } = await printSettingsApi.update({
          ...this.form,
          print_primary_color: this.safeColor,
        })
        this.form = { ...emptyForm(), ...(data.settings || {}) }
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.success'),
            text: this.$t('printSettings.saved'),
            variant: 'success',
          },
        })
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.message || this.$t('messages.saveError'),
            variant: 'danger',
          },
        })
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
.print-color-input {
  max-width: 64px;
  padding: 0.25rem;
}

.print-preview {
  max-width: 720px;
  margin: 0 auto;
  border: 1px solid #ebe9f1;
  padding: 1.5rem;
  background: #fff;
}

.print-preview-header {
  color: #fff;
  font-weight: 700;
  text-align: center;
  padding: 0.75rem;
}
</style>
