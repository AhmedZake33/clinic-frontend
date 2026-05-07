<template>
  <div>
    <!-- Stats Cards -->
    <b-row class="mb-2">
      <b-col cols="12" sm="6" lg="3">
        <statistic-card-vertical
          icon="UsersIcon"
          :statistic="stats.total_doctors"
          statistic-title="Total Doctors"
          color="primary"
        />
      </b-col>
      <b-col cols="12" sm="6" lg="3">
        <statistic-card-vertical
          icon="CheckCircleIcon"
          :statistic="stats.active_subscriptions"
          statistic-title="Active Subscriptions"
          color="success"
        />
      </b-col>
      <b-col cols="12" sm="6" lg="3">
        <statistic-card-vertical
          icon="XCircleIcon"
          :statistic="stats.expired_subscriptions"
          statistic-title="Expired Subscriptions"
          color="danger"
        />
      </b-col>
      <b-col cols="12" sm="6" lg="3">
        <statistic-card-vertical
          icon="DollarSignIcon"
          :statistic="`$${stats.total_revenue}`"
          statistic-title="Total Revenue"
          color="warning"
        />
      </b-col>
    </b-row>

    <!-- Specializations Management -->
    <b-card class="mb-2">
      <b-card-header>
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mb-0">{{ $t('admin.specializations') }}</h4>
          <b-button variant="outline-primary" size="sm" @click="openSpecModal()">
            <feather-icon icon="PlusIcon" class="mr-50" />
            {{ $t('admin.addSpecialization') }}
          </b-button>
        </div>
      </b-card-header>

      <b-table
        :items="specializations"
        :fields="specFields"
        :busy="loadingSpecs"
        responsive
        striped
        hover
        small
      >
        <template #cell(name)="data">
          <b-badge :variant="data.item.color || 'primary'">{{ data.item.name }}</b-badge>
          <span v-if="data.item.name_en" class="text-muted ml-50 small">{{ data.item.name_en }}</span>
        </template>

        <template #cell(features)="data">
          <span v-if="data.item.features && data.item.features.length">
            <b-badge
              v-for="fKey in data.item.features"
              :key="fKey"
              variant="light-secondary"
              class="mr-25"
            >{{ getFeatureName(fKey) }}</b-badge>
          </span>
          <span v-else class="text-muted">{{ $t('admin.allFeatures') }}</span>
        </template>

        <template #cell(actions)="data">
          <b-button size="sm" variant="flat-primary" class="btn-icon mr-25" @click="editSpec(data.item)">
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button size="sm" variant="flat-danger" class="btn-icon" @click="confirmDeleteSpec(data.item)">
            <feather-icon icon="TrashIcon" />
          </b-button>
        </template>
      </b-table>
    </b-card>

    <!-- Doctors Table -->
    <b-card>
      <b-card-header>
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mb-0">{{ $t('admin.doctorsManagement') }}</h4>
          <b-button variant="primary" @click="openAddModal()">
            <feather-icon icon="PlusIcon" class="mr-50" />
            {{ $t('admin.addDoctor') }}
          </b-button>
        </div>
      </b-card-header>

      <b-table
        :items="doctors"
        :fields="fields"
        :busy="loading"
        responsive
        striped
        hover
      >
        <template #cell(specialization)="data">
          <b-badge
            v-if="data.item.specialization"
            :variant="data.item.specialization.color || 'primary'"
          >
            {{ data.item.specialization.name }}
          </b-badge>
          <span v-else class="text-muted">—</span>
        </template>

        <template #cell(subscription_status)="data">
          <b-badge :variant="getStatusVariant(data.value)">
            {{ $t(`admin.status.${data.value}`) }}
          </b-badge>
        </template>

        <template #cell(actions)="data">
          <b-dropdown
            variant="link"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >
            <template #button-content>
              <feather-icon icon="MoreVerticalIcon" size="16" class="align-middle text-body" />
            </template>
            <b-dropdown-item @click="viewDoctor(data.item)">
              <feather-icon icon="EyeIcon" class="mr-50" />
              {{ $t('actions.view') }}
            </b-dropdown-item>
            <b-dropdown-item @click="editDoctor(data.item)">
              <feather-icon icon="EditIcon" class="mr-50" />
              {{ $t('actions.edit') }}
            </b-dropdown-item>
            <b-dropdown-item variant="danger" @click="confirmDelete(data.item)">
              <feather-icon icon="TrashIcon" class="mr-50" />
              {{ $t('actions.delete') }}
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>
    </b-card>

    <!-- Add/Edit Doctor Modal -->
    <b-modal
      v-model="showModal"
      :title="isEditing ? $t('admin.editDoctor') : $t('admin.addDoctor')"
      size="lg"
      no-close-on-backdrop
    >
      <b-form @submit.prevent="saveDoctor">
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('client.name')" label-for="name">
              <b-form-input id="name" v-model="form.name" required />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('clinic.email')" label-for="email">
              <b-form-input id="email" v-model="form.email" type="email" required />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row v-if="!isEditing">
          <b-col cols="12" md="6">
            <b-form-group :label="$t('clinic.password')" label-for="password">
              <b-form-input id="password" v-model="form.password" type="password" required />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('validation.confirmPassword')" label-for="password_confirmation">
              <b-form-input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                required
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('admin.specialization')" label-for="specialization_id">
              <b-form-select
                id="specialization_id"
                v-model="form.specialization_id"
                :options="specializationOptions"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('admin.subscriptionPlan')" label-for="subscription_plan">
              <b-form-input
                id="subscription_plan"
                v-model="form.subscription_plan"
                :placeholder="$t('admin.subscriptionPlanPlaceholder')"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('admin.subscriptionAmount')" label-for="subscription_amount">
              <b-form-input
                id="subscription_amount"
                v-model="form.subscription_amount"
                type="number"
                step="0.01"
                min="0"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('admin.subscriptionStart')" label-for="subscription_start">
              <b-form-input id="subscription_start" v-model="form.subscription_start" type="date" />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('admin.subscriptionEnd')" label-for="subscription_end">
              <b-form-input id="subscription_end" v-model="form.subscription_end" type="date" />
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group :label="$t('admin.notes')" label-for="notes">
          <b-form-textarea id="notes" v-model="form.notes" rows="3" />
        </b-form-group>

        <b-form-checkbox v-model="form.is_active" class="mb-1">
          {{ $t('admin.isActive') }}
        </b-form-checkbox>
      </b-form>

      <template #modal-footer>
        <b-button variant="secondary" @click="closeModal">{{ $t('actions.cancel') }}</b-button>
        <b-button variant="primary" :disabled="saving" @click="saveDoctor">
          <b-spinner v-if="saving" small class="mr-50" />
          {{ isEditing ? $t('actions.save') : $t('actions.add') }}
        </b-button>
      </template>
    </b-modal>

    <!-- View Doctor Modal -->
    <b-modal v-model="showViewModal" :title="$t('admin.doctorDetails')" size="lg" ok-only>
      <div v-if="selectedDoctor">
        <b-row class="mb-2">
          <b-col cols="12" md="6">
            <strong>{{ $t('client.name') }}:</strong> {{ selectedDoctor.name }}
          </b-col>
          <b-col cols="12" md="6">
            <strong>{{ $t('clinic.email') }}:</strong> {{ selectedDoctor.email }}
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col cols="12" md="6">
            <strong>{{ $t('admin.specialization') }}:</strong>
            <b-badge
              v-if="selectedDoctor.specialization"
              :variant="selectedDoctor.specialization.color || 'primary'"
              class="ml-50"
            >
              {{ selectedDoctor.specialization.name }}
              <span v-if="selectedDoctor.specialization.name_en"> / {{ selectedDoctor.specialization.name_en }}</span>
            </b-badge>
            <span v-else class="text-muted ml-50">—</span>
          </b-col>
          <b-col cols="12" md="6">
            <strong>{{ $t('admin.subscriptionStatus') }}:</strong>
            <b-badge :variant="getStatusVariant(selectedDoctor.subscription_status)" class="ml-50">
              {{ $t(`admin.status.${selectedDoctor.subscription_status}`) }}
            </b-badge>
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col cols="12" md="6">
            <strong>{{ $t('admin.subscriptionPlan') }}:</strong> {{ selectedDoctor.subscription_plan || 'N/A' }}
          </b-col>
          <b-col cols="12" md="6">
            <strong>{{ $t('admin.subscriptionStart') }}:</strong> {{ selectedDoctor.subscription_start || 'N/A' }}
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col cols="12" md="6">
            <strong>{{ $t('admin.subscriptionEnd') }}:</strong> {{ selectedDoctor.subscription_end || 'N/A' }}
          </b-col>
          <b-col cols="12" md="6">
            <strong>{{ $t('admin.subscriptionAmount') }}:</strong> ${{ selectedDoctor.subscription_amount || 0 }}
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col cols="12" md="6">
            <strong>{{ $t('admin.isActive') }}:</strong>
            <b-badge :variant="selectedDoctor.is_active ? 'success' : 'danger'" class="ml-50">
              {{ selectedDoctor.is_active ? $t('admin.active') : $t('admin.inactive') }}
            </b-badge>
          </b-col>
        </b-row>

        <div class="mb-2">
          <strong>{{ $t('admin.stats') }}:</strong>
          <ul class="mt-50">
            <li>{{ $t('admin.assistantsCount') }}: {{ (selectedDoctor.stats || selectedDoctor).assistants_count || 0 }}</li>
            <li>{{ $t('admin.clientsCount') }}: {{ (selectedDoctor.stats || selectedDoctor).clients_count || 0 }}</li>
            <li>{{ $t('admin.reservationsCount') }}: {{ (selectedDoctor.stats || selectedDoctor).reservations_count || 0 }}</li>
          </ul>
        </div>

        <div v-if="selectedDoctor.notes">
          <strong>{{ $t('admin.notes') }}:</strong>
          <p class="mt-50">{{ selectedDoctor.notes }}</p>
        </div>
      </div>
    </b-modal>

    <!-- Add/Edit Specialization Modal -->
    <b-modal
      v-model="showSpecModal"
      :title="isEditingSpec ? $t('admin.editSpecialization') : $t('admin.addSpecialization')"
      size="md"
      no-close-on-backdrop
    >
      <b-form @submit.prevent="saveSpec">
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('admin.specNameAr')" label-for="spec-name">
              <b-form-input id="spec-name" v-model="specForm.name" required />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('admin.specNameEn')" label-for="spec-name-en">
              <b-form-input id="spec-name-en" v-model="specForm.name_en" />
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group :label="$t('admin.specColor')" label-for="spec-color">
          <b-form-select id="spec-color" v-model="specForm.color" :options="colorOptions" />
        </b-form-group>

        <b-form-group :label="$t('admin.specFeatures')">
          <div v-if="loadingFeatures" class="text-muted small">{{ $t('messages.loading') }}...</div>
          <div v-else class="d-flex flex-wrap">
            <b-form-checkbox
              v-for="feat in availableFeatures"
              :key="feat.key"
              v-model="specForm.features"
              :value="feat.key"
              class="mr-2 mb-1"
            >
              {{ feat.name }}<span v-if="feat.name_en" class="text-muted ml-25 small">/ {{ feat.name_en }}</span>
            </b-form-checkbox>
          </div>
          <small class="text-muted">{{ $t('admin.specFeaturesHint') }}</small>
        </b-form-group>
      </b-form>

      <template #modal-footer>
        <b-button variant="secondary" @click="closeSpecModal">{{ $t('actions.cancel') }}</b-button>
        <b-button variant="primary" :disabled="savingSpec" @click="saveSpec">
          <b-spinner v-if="savingSpec" small class="mr-50" />
          {{ isEditingSpec ? $t('actions.save') : $t('actions.add') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard, BCardHeader, BTable, BButton, BModal, BForm, BFormGroup,
  BFormInput, BFormTextarea, BFormCheckbox, BFormSelect, BRow, BCol,
  BDropdown, BDropdownItem, BBadge, BSpinner,
} from 'bootstrap-vue'
import StatisticCardVertical from '@core/components/statistics-cards/StatisticCardVertical.vue'
import adminService from '@/services/admin'
import specializationsService from '@/services/specializations'
import featuresService from '@/services/features'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BCard, BCardHeader, BTable, BButton, BModal, BForm, BFormGroup,
    BFormInput, BFormTextarea, BFormCheckbox, BFormSelect, BRow, BCol,
    BDropdown, BDropdownItem, BBadge, BSpinner, StatisticCardVertical,
  },
  data() {
    return {
      // Doctors
      doctors: [],
      stats: { total_doctors: 0, active_subscriptions: 0, expired_subscriptions: 0, no_subscription: 0, total_revenue: 0 },
      loading: false,
      saving: false,
      showViewModal: false,
      showAddModal: false,
      isEditing: false,
      selectedDoctor: null,
      form: {
        name: '', email: '', password: '', password_confirmation: '',
        specialization_id: null, subscription_plan: '', subscription_amount: '',
        subscription_start: '', subscription_end: '', is_active: true, notes: '',
      },

      // Specializations
      specializations: [],
      loadingSpecs: false,
      showSpecModal: false,
      isEditingSpec: false,
      savingSpec: false,
      selectedSpec: null,
      specForm: { name: '', name_en: '', color: 'primary', features: [] },

      // Features (loaded from DB)
      availableFeatures: [],
      loadingFeatures: false,
    }
  },
  computed: {
    showModal: {
      get() { return this.showAddModal || this.isEditing },
      set(value) { if (!value) { this.showAddModal = false; this.isEditing = false } },
    },
    fields() {
      return [
        { key: 'name', label: this.$t('client.name'), sortable: true },
        { key: 'email', label: this.$t('clinic.email'), sortable: true },
        { key: 'specialization', label: this.$t('admin.specialization') },
        { key: 'subscription_status', label: this.$t('admin.subscriptionStatus') },
        { key: 'subscription_plan', label: this.$t('admin.subscriptionPlan') },
        { key: 'assistants_count', label: this.$t('admin.assistants'), sortable: true },
        { key: 'clients_count', label: this.$t('admin.clients'), sortable: true },
        { key: 'created_at', label: this.$t('admin.createdAt'), sortable: true, formatter: this.formatDate },
        { key: 'actions', label: this.$t('table.actions') },
      ]
    },
    specFields() {
      return [
        { key: 'name', label: this.$t('admin.specNameAr') },
        { key: 'features', label: this.$t('admin.specFeatures') },
        { key: 'actions', label: this.$t('table.actions') },
      ]
    },
    specializationOptions() {
      return [
        { value: null, text: `— ${this.$t('admin.noSpecialization')} —` },
        ...this.specializations.map(s => ({ value: s.id, text: s.name + (s.name_en ? ` / ${s.name_en}` : '') })),
      ]
    },
    colorOptions() {
      return [
        { value: 'primary', text: this.$t('admin.colorPrimary') },
        { value: 'success', text: this.$t('admin.colorSuccess') },
        { value: 'danger', text: this.$t('admin.colorDanger') },
        { value: 'warning', text: this.$t('admin.colorWarning') },
        { value: 'info', text: this.$t('admin.colorInfo') },
        { value: 'secondary', text: this.$t('admin.colorSecondary') },
      ]
    },
  },
  async mounted() {
    await Promise.all([this.fetchDoctors(), this.fetchStats(), this.fetchSpecs(), this.fetchFeatures()])
  },
  methods: {
    // ── Doctors ──────────────────────────────────────────────
    async fetchDoctors() {
      this.loading = true
      try {
        const response = await adminService.getDoctors()
        this.doctors = response.data
      } catch {
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.error'), text: this.$t('admin.loadDoctorsError'), variant: 'danger' } })
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      try {
        const response = await adminService.getSubscriptionStats()
        this.stats = response.data
      } catch (error) {
        console.error('Failed to load stats', error)
      }
    },

    openAddModal() { this.resetForm(); this.showAddModal = true },

    formatDateForInput(dateStr) {
      if (!dateStr) return ''
      return dateStr.substring(0, 10)
    },

    editDoctor(doctor) {
      this.form = {
        name: doctor.name,
        email: doctor.email,
        password: '',
        password_confirmation: '',
        specialization_id: doctor.specialization_id || null,
        subscription_plan: doctor.subscription_plan || '',
        subscription_amount: doctor.subscription_amount || '',
        subscription_start: this.formatDateForInput(doctor.subscription_start),
        subscription_end: this.formatDateForInput(doctor.subscription_end),
        is_active: doctor.is_active,
        notes: doctor.notes || '',
      }
      this.isEditing = true
      this.selectedDoctor = doctor
    },

    async viewDoctor(doctor) {
      try {
        const response = await adminService.getDoctor(doctor.id)
        this.selectedDoctor = response.data
      } catch {
        this.selectedDoctor = doctor
      }
      this.showViewModal = true
    },

    async saveDoctor() {
      this.saving = true
      try {
        if (this.isEditing) {
          await adminService.updateDoctor(this.selectedDoctor.id, this.form)
          this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('admin.doctorUpdated'), variant: 'success' } })
        } else {
          await adminService.createDoctor(this.form)
          this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('admin.doctorCreated'), variant: 'success' } })
        }
        this.closeModal()
        await this.fetchDoctors()
        await this.fetchStats()
      } catch (error) {
        const errors = error.response?.data?.errors
        let errorText = error.response?.data?.message || this.$t('admin.saveDoctorError')
        if (errors) errorText = Object.values(errors).flat().join('\n')
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.error'), text: errorText, variant: 'danger' } })
      } finally {
        this.saving = false
      }
    },

    confirmDelete(doctor) {
      this.$swal({
        title: this.$t('actions.confirm'),
        text: this.$t('admin.deleteDoctorConfirm', { name: doctor.name }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('actions.delete'),
        cancelButtonText: this.$t('actions.cancel'),
        customClass: { confirmButton: 'btn btn-danger', cancelButton: 'btn btn-outline-secondary ml-1' },
        buttonsStyling: false,
      }).then(result => { if (result.value) this.deleteDoctor(doctor) })
    },

    async deleteDoctor(doctor) {
      try {
        await adminService.deleteDoctor(doctor.id)
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('admin.doctorDeleted'), variant: 'success' } })
        await this.fetchDoctors()
        await this.fetchStats()
      } catch (error) {
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.error'), text: error.response?.data?.error || error.response?.data?.message || this.$t('admin.deleteDoctorError'), variant: 'danger' } })
      }
    },

    closeModal() { this.showModal = false; this.resetForm() },

    resetForm() {
      this.form = {
        name: '', email: '', password: '', password_confirmation: '',
        specialization_id: null, subscription_plan: '', subscription_amount: '',
        subscription_start: '', subscription_end: '', is_active: true, notes: '',
      }
      this.selectedDoctor = null
    },

    // ── Specializations ──────────────────────────────────────
    async fetchSpecs() {
      this.loadingSpecs = true
      try {
        const response = await specializationsService.getAll()
        this.specializations = response.data
      } catch (error) {
        console.error('Failed to load specializations', error)
      } finally {
        this.loadingSpecs = false
      }
    },

    openSpecModal() { this.resetSpecForm(); this.showSpecModal = true },

    editSpec(spec) {
      this.specForm = {
        name: spec.name,
        name_en: spec.name_en || '',
        color: spec.color || 'primary',
        features: spec.features ? [...spec.features] : [],
      }
      this.isEditingSpec = true
      this.selectedSpec = spec
      this.showSpecModal = true
    },

    async saveSpec() {
      this.savingSpec = true
      try {
        if (this.isEditingSpec) {
          await specializationsService.update(this.selectedSpec.id, this.specForm)
          this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('admin.specUpdated'), variant: 'success' } })
        } else {
          await specializationsService.create(this.specForm)
          this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('admin.specCreated'), variant: 'success' } })
        }
        this.closeSpecModal()
        await this.fetchSpecs()
      } catch (error) {
        const errors = error.response?.data?.errors
        let errorText = error.response?.data?.message || this.$t('admin.specSaveError')
        if (errors) errorText = Object.values(errors).flat().join('\n')
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.error'), text: errorText, variant: 'danger' } })
      } finally {
        this.savingSpec = false
      }
    },

    confirmDeleteSpec(spec) {
      this.$swal({
        title: this.$t('actions.confirm'),
        text: this.$t('admin.deleteSpecConfirm', { name: spec.name }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('actions.delete'),
        cancelButtonText: this.$t('actions.cancel'),
        customClass: { confirmButton: 'btn btn-danger', cancelButton: 'btn btn-outline-secondary ml-1' },
        buttonsStyling: false,
      }).then(result => { if (result.value) this.deleteSpec(spec) })
    },

    async deleteSpec(spec) {
      try {
        await specializationsService.delete(spec.id)
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.success'), text: this.$t('admin.specDeleted'), variant: 'success' } })
        await this.fetchSpecs()
        await this.fetchDoctors()
      } catch (error) {
        this.$toast({ component: ToastificationContent, props: { title: this.$t('messages.error'), text: error.response?.data?.message || this.$t('admin.specDeleteError'), variant: 'danger' } })
      }
    },

    closeSpecModal() {
      this.showSpecModal = false
      this.isEditingSpec = false
      this.selectedSpec = null
      this.resetSpecForm()
    },

    resetSpecForm() { this.specForm = { name: '', name_en: '', color: 'primary', features: [] } },

    // ── Features ─────────────────────────────────────────────
    async fetchFeatures() {
      this.loadingFeatures = true
      try {
        const response = await featuresService.getAll()
        this.availableFeatures = response.data
      } catch (error) {
        console.error('Failed to load features', error)
      } finally {
        this.loadingFeatures = false
      }
    },

    // ── Helpers ──────────────────────────────────────────────
    getFeatureName(key) {
      const feat = this.availableFeatures.find(f => f.key === key)
      return feat ? feat.name : key
    },
    getStatusVariant(status) {
      const map = { active: 'success', expired: 'danger', inactive: 'warning' }
      return map[status] || 'secondary'
    },

    formatDate(value) {
      if (!value) return ''
      return new Date(value).toLocaleDateString()
    },
  },
}
</script>

<style scoped>
</style>
