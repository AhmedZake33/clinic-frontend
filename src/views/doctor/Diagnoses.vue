<template>
  <div>
    <b-card>
      <b-row class="mb-2">
        <b-col cols="12" md="4">
          <h4>{{ $t('diagnoses.title') }}</h4>
        </b-col>
        <b-col cols="12" md="8" class="text-right">
          <b-button v-if="canManageDiagnoses" variant="primary" @click="openAddModal">
            <feather-icon icon="PlusIcon" class="mr-50" />
            {{ $t('diagnoses.addDiagnosis') }}
          </b-button>
        </b-col>
      </b-row>

      <b-row v-if="isAssistant" class="mb-2">
        <b-col cols="12" md="4">
          <b-form-select
            v-model="selectedDoctorId"
            :options="doctorOptions"
            :disabled="loadingDoctors"
            @change="fetchDiagnoses"
          />
        </b-col>
      </b-row>

      <b-table
        :items="diagnoses"
        :fields="fields"
        :busy="loading"
        responsive
        striped
        hover
        show-empty
        :empty-text="$t('diagnoses.noDiagnoses')"
      >
        <template #cell(name)="data">
          <div>
            <strong>{{ data.item.name }}</strong>
            <div v-if="data.item.name_en" class="text-muted small">{{ data.item.name_en }}</div>
          </div>
        </template>

        <template #cell(is_active)="data">
          <b-badge :variant="data.value ? 'success' : 'secondary'">
            {{ data.value ? $t('diagnoses.active') : $t('diagnoses.inactive') }}
          </b-badge>
        </template>

        <template #cell(actions)="data">
          <b-button v-if="canManageDiagnoses" size="sm" variant="flat-primary" class="btn-icon mr-25" @click="editDiagnosis(data.item)">
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button v-if="canManageDiagnoses" size="sm" variant="flat-danger" class="btn-icon" @click="confirmDelete(data.item)">
            <feather-icon icon="TrashIcon" />
          </b-button>
        </template>

        <template #table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle" />
          </div>
        </template>
      </b-table>
    </b-card>

    <b-modal
      v-model="showModal"
      :title="isEditing ? $t('diagnoses.editDiagnosis') : $t('diagnoses.addDiagnosis')"
      no-close-on-backdrop
      @hidden="resetForm"
    >
      <b-form @submit.prevent="saveDiagnosis">
        <b-form-group :label="$t('diagnoses.nameAr')" label-for="diagnosis-name">
          <b-form-input id="diagnosis-name" v-model="form.name" required :placeholder="$t('diagnoses.nameArPlaceholder')" />
        </b-form-group>

        <b-form-group :label="$t('diagnoses.nameEn')" label-for="diagnosis-name-en">
          <b-form-input id="diagnosis-name-en" v-model="form.name_en" :placeholder="$t('diagnoses.nameEnPlaceholder')" />
        </b-form-group>

        <b-form-group :label="$t('diagnoses.description')" label-for="diagnosis-desc">
          <b-form-textarea id="diagnosis-desc" v-model="form.description" rows="3" :placeholder="$t('diagnoses.descriptionPlaceholder')" />
        </b-form-group>

        <b-form-checkbox v-model="form.is_active" class="mt-1">
          {{ $t('diagnoses.isActive') }}
        </b-form-checkbox>
      </b-form>

      <template #modal-footer>
        <b-button variant="secondary" @click="showModal = false">{{ $t('actions.cancel') }}</b-button>
        <b-button variant="primary" :disabled="saving" @click="saveDiagnosis">
          <b-spinner v-if="saving" small class="mr-50" />
          {{ isEditing ? $t('actions.save') : $t('actions.add') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {
  BBadge,
  BButton,
  BCard,
  BCol,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BFormTextarea,
  BModal,
  BRow,
  BSpinner,
  BTable,
} from 'bootstrap-vue'
import diagnosesApi from '@/services/doctorDiagnoses'
import reservationsApi from '@/services/reservations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

const emptyForm = () => ({
  name: '',
  name_en: '',
  description: '',
  is_active: true,
})

export default {
  components: {
    BBadge,
    BButton,
    BCard,
    BCol,
    BForm,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormTextarea,
    BModal,
    BRow,
    BSpinner,
    BTable,
  },
  data() {
    return {
      diagnoses: [],
      doctors: [],
      selectedDoctorId: '',
      loading: false,
      loadingDoctors: false,
      saving: false,
      showModal: false,
      isEditing: false,
      selectedDiagnosis: null,
      form: emptyForm(),
    }
  },
  computed: {
    fields() {
      return [
        { key: 'name', label: this.$t('diagnoses.name') },
        { key: 'description', label: this.$t('diagnoses.description') },
        { key: 'is_active', label: this.$t('diagnoses.status') },
        { key: 'actions', label: this.$t('table.actions') },
      ]
    },
    user() {
      return JSON.parse(localStorage.getItem('user') || 'null') || {}
    },
    isAssistant() {
      return this.user.role === 'assistant'
    },
    canManageDiagnoses() {
      return !this.isAssistant
    },
    doctorOptions() {
      return [
        { value: '', text: this.$t('reservation.selectDoctor') },
        ...this.doctors.map(doctor => ({
          value: doctor.id,
          text: doctor.name,
        })),
      ]
    },
  },
  async mounted() {
    if (this.isAssistant) {
      await this.fetchDoctors()
      return
    }

    this.fetchDiagnoses()
  },
  methods: {
    async fetchDoctors() {
      this.loadingDoctors = true
      try {
        const { data } = await reservationsApi.getDoctors()
        this.doctors = data
      } catch {
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.error'), text: this.$t('messages.loadError'), variant: 'danger' } })
      } finally {
        this.loadingDoctors = false
      }
    },
    async fetchDiagnoses() {
      if (this.isAssistant && !this.selectedDoctorId) {
        this.diagnoses = []
        return
      }

      this.loading = true
      try {
        const { data } = this.isAssistant
          ? await diagnosesApi.getAllForDoctor(this.selectedDoctorId)
          : await diagnosesApi.getAll()
        this.diagnoses = data
      } catch {
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.error'), text: this.$t('diagnoses.loadError'), variant: 'danger' } })
      } finally {
        this.loading = false
      }
    },
    openAddModal() {
      this.resetForm()
      this.showModal = true
    },
    editDiagnosis(diagnosis) {
      this.form = {
        name: diagnosis.name,
        name_en: diagnosis.name_en || '',
        description: diagnosis.description || '',
        is_active: diagnosis.is_active,
      }
      this.isEditing = true
      this.selectedDiagnosis = diagnosis
      this.showModal = true
    },
    async saveDiagnosis() {
      this.saving = true
      try {
        if (this.isEditing) {
          const { data } = await diagnosesApi.update(this.selectedDiagnosis.id, this.form)
          const idx = this.diagnoses.findIndex(item => item.id === this.selectedDiagnosis.id)
          if (idx !== -1) this.$set(this.diagnoses, idx, data)
          this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('diagnoses.updated'), variant: 'success' } })
        } else {
          const { data } = await diagnosesApi.create(this.form)
          this.diagnoses.push(data)
          this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('diagnoses.created'), variant: 'success' } })
        }
        this.showModal = false
        this.resetForm()
      } catch (error) {
        const errors = error.response?.data?.errors
        const text = errors ? Object.values(errors).flat().join('\n') : (error.response?.data?.message || this.$t('diagnoses.saveError'))
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.error'), text, variant: 'danger' } })
      } finally {
        this.saving = false
      }
    },
    confirmDelete(diagnosis) {
      this.$swal({
        title: this.$t('actions.confirm'),
        text: this.$t('diagnoses.deleteConfirm', { name: diagnosis.name }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('actions.delete'),
        cancelButtonText: this.$t('actions.cancel'),
        customClass: { confirmButton: 'btn btn-danger', cancelButton: 'btn btn-outline-secondary ml-1' },
        buttonsStyling: false,
      }).then(result => { if (result.value) this.deleteDiagnosis(diagnosis) })
    },
    async deleteDiagnosis(diagnosis) {
      try {
        await diagnosesApi.delete(diagnosis.id)
        this.diagnoses = this.diagnoses.filter(item => item.id !== diagnosis.id)
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('diagnoses.deleted'), variant: 'success' } })
      } catch {
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.error'), text: this.$t('diagnoses.deleteError'), variant: 'danger' } })
      }
    },
    resetForm() {
      this.form = emptyForm()
      this.isEditing = false
      this.selectedDiagnosis = null
    },
  },
}
</script>
