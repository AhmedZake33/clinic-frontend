<template>
  <div>
    <!-- Stats Cards -->
    <b-row class="mb-2">
      <b-col lg="3" sm="6">
        <statistic-card-vertical
          icon="UsersIcon"
          :statistic="stats.total_doctors"
          statistic-title="Total Doctors"
          color="primary"
        />
      </b-col>
      <b-col lg="3" sm="6">
        <statistic-card-vertical
          icon="CheckCircleIcon"
          :statistic="stats.active_subscriptions"
          statistic-title="Active Subscriptions"
          color="success"
        />
      </b-col>
      <b-col lg="3" sm="6">
        <statistic-card-vertical
          icon="XCircleIcon"
          :statistic="stats.expired_subscriptions"
          statistic-title="Expired Subscriptions"
          color="danger"
        />
      </b-col>
      <b-col lg="3" sm="6">
        <statistic-card-vertical
          icon="DollarSignIcon"
          :statistic="`$${stats.total_revenue}`"
          statistic-title="Total Revenue"
          color="warning"
        />
      </b-col>
    </b-row>

    <!-- Doctors Table -->
    <b-card>
      <b-card-header>
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mb-0">{{ $t('admin.doctorsManagement') }}</h4>
          <b-button
            variant="primary"
            @click="openAddModal()"
          >
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
        <template #cell(subscription_status)="data">
          <b-badge
            :variant="getStatusVariant(data.value)"
          >
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
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item @click="viewDoctor(data.item)">
              <feather-icon icon="EyeIcon" class="mr-50" />
              {{ $t('actions.view') }}
            </b-dropdown-item>
            <b-dropdown-item @click="editDoctor(data.item)">
              <feather-icon icon="EditIcon" class="mr-50" />
              {{ $t('actions.edit') }}
            </b-dropdown-item>
            <b-dropdown-item
              variant="danger"
              @click="confirmDelete(data.item)"
            >
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
          <b-col md="6">
            <b-form-group :label="$t('client.name')" label-for="name">
              <b-form-input
                id="name"
                v-model="form.name"
                required
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group :label="$t('clinic.email')" label-for="email">
              <b-form-input
                id="email"
                v-model="form.email"
                type="email"
                required
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row v-if="!isEditing">
          <b-col md="6">
            <b-form-group :label="$t('clinic.password')" label-for="password">
              <b-form-input
                id="password"
                v-model="form.password"
                type="password"
                required
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
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
          <b-col md="6">
            <b-form-group :label="$t('admin.subscriptionPlan')" label-for="subscription_plan">
              <b-form-input
                id="subscription_plan"
                v-model="form.subscription_plan"
                :placeholder="$t('admin.subscriptionPlanPlaceholder')"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
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
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group :label="$t('admin.subscriptionStart')" label-for="subscription_start">
              <b-form-input
                id="subscription_start"
                v-model="form.subscription_start"
                type="date"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group :label="$t('admin.subscriptionEnd')" label-for="subscription_end">
              <b-form-input
                id="subscription_end"
                v-model="form.subscription_end"
                type="date"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group :label="$t('admin.notes')" label-for="notes">
          <b-form-textarea
            id="notes"
            v-model="form.notes"
            rows="3"
          />
        </b-form-group>

        <b-form-checkbox
          v-model="form.is_active"
          class="mb-1"
        >
          {{ $t('admin.isActive') }}
        </b-form-checkbox>
      </b-form>

      <template #modal-footer>
        <b-button variant="secondary" @click="closeModal">
          {{ $t('actions.cancel') }}
        </b-button>
        <b-button
          variant="primary"
          :disabled="saving"
          @click="saveDoctor"
        >
          <b-spinner v-if="saving" small class="mr-50" />
          {{ isEditing ? $t('actions.save') : $t('actions.add') }}
        </b-button>
      </template>
    </b-modal>

    <!-- View Doctor Modal -->
    <b-modal
      v-model="showViewModal"
      :title="$t('admin.doctorDetails')"
      size="lg"
      ok-only
    >
      <div v-if="selectedDoctor">
        <b-row class="mb-2">
          <b-col md="6">
            <strong>{{ $t('client.name') }}:</strong> {{ selectedDoctor.name }}
          </b-col>
          <b-col md="6">
            <strong>{{ $t('clinic.email') }}:</strong> {{ selectedDoctor.email }}
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col md="6">
            <strong>{{ $t('admin.subscriptionStatus') }}:</strong>
            <b-badge :variant="getStatusVariant(selectedDoctor.subscription_status)" class="ml-50">
              {{ $t(`admin.status.${selectedDoctor.subscription_status}`) }}
            </b-badge>
          </b-col>
          <b-col md="6">
            <strong>{{ $t('admin.subscriptionPlan') }}:</strong> {{ selectedDoctor.subscription_plan || 'N/A' }}
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col md="6">
            <strong>{{ $t('admin.subscriptionStart') }}:</strong> {{ selectedDoctor.subscription_start || 'N/A' }}
          </b-col>
          <b-col md="6">
            <strong>{{ $t('admin.subscriptionEnd') }}:</strong> {{ selectedDoctor.subscription_end || 'N/A' }}
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col md="6">
            <strong>{{ $t('admin.subscriptionAmount') }}:</strong> ${{ selectedDoctor.subscription_amount || 0 }}
          </b-col>
          <b-col md="6">
            <strong>{{ $t('admin.isActive') }}:</strong>
            <b-badge :variant="selectedDoctor.is_active ? 'success' : 'danger'">
              {{ selectedDoctor.is_active ? $t('admin.active') : $t('admin.inactive') }}
            </b-badge>
          </b-col>
        </b-row>

        <div v-if="selectedDoctor.stats" class="mb-2">
          <strong>{{ $t('admin.stats') }}:</strong>
          <ul class="mt-50">
            <li>{{ $t('admin.assistantsCount') }}: {{ selectedDoctor.stats.assistants_count }}</li>
            <li>{{ $t('admin.clientsCount') }}: {{ selectedDoctor.stats.clients_count }}</li>
            <li>{{ $t('admin.reservationsCount') }}: {{ selectedDoctor.stats.reservations_count }}</li>
          </ul>
        </div>
        <div v-else class="mb-2">
          <strong>{{ $t('admin.stats') }}:</strong>
          <ul class="mt-50">
            <li>{{ $t('admin.assistantsCount') }}: {{ selectedDoctor.assistants_count || 0 }}</li>
            <li>{{ $t('admin.clientsCount') }}: {{ selectedDoctor.clients_count || 0 }}</li>
            <li>{{ $t('admin.reservationsCount') }}: {{ selectedDoctor.reservations_count || 0 }}</li>
          </ul>
        </div>

        <div v-if="selectedDoctor.notes">
          <strong>{{ $t('admin.notes') }}:</strong>
          <p class="mt-50">{{ selectedDoctor.notes }}</p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard, BCardHeader, BTable, BButton, BModal, BForm, BFormGroup,
  BFormInput, BFormTextarea, BFormCheckbox, BRow, BCol, BDropdown,
  BDropdownItem, BBadge, BSpinner,
} from 'bootstrap-vue'
import StatisticCardVertical from '@core/components/statistics-cards/StatisticCardVertical.vue'
import adminService from '@/services/admin'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BCard,
    BCardHeader,
    BTable,
    BButton,
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BFormCheckbox,
    BRow,
    BCol,
    BDropdown,
    BDropdownItem,
    BBadge,
    BSpinner,
    StatisticCardVertical,
  },
  data() {
    return {
      doctors: [],
      stats: {
        total_doctors: 0,
        active_subscriptions: 0,
        expired_subscriptions: 0,
        no_subscription: 0,
        total_revenue: 0,
      },
      loading: false,
      saving: false,
      showViewModal: false,
      showAddModal: false,
      isEditing: false,
      selectedDoctor: null,
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        subscription_plan: '',
        subscription_amount: '',
        subscription_start: '',
        subscription_end: '',
        is_active: true,
        notes: '',
      },
      fields: [
        { key: 'name', label: this.$t('client.name'), sortable: true },
        { key: 'email', label: this.$t('clinic.email'), sortable: true },
        { key: 'subscription_status', label: this.$t('admin.subscriptionStatus') },
        { key: 'subscription_plan', label: this.$t('admin.subscriptionPlan') },
        { key: 'assistants_count', label: this.$t('admin.assistants'), sortable: true },
        { key: 'clients_count', label: this.$t('admin.clients'), sortable: true },
        { key: 'created_at', label: this.$t('admin.createdAt'), sortable: true, formatter: this.formatDate },
        { key: 'actions', label: this.$t('table.actions') },
      ],
    }
  },
  computed: {
    showModal: {
      get() {
        return this.showAddModal || this.isEditing
      },
      set(value) {
        if (!value) {
          this.showAddModal = false
          this.isEditing = false
        }
      },
    },
  },
  async mounted() {
    await this.fetchDoctors()
    await this.fetchStats()
  },
  methods: {
    async fetchDoctors() {
      this.loading = true
      try {
        const response = await adminService.getDoctors()
        this.doctors = response.data
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: this.$t('admin.loadDoctorsError'),
            variant: 'danger',
          },
        })
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

    openAddModal() {
      this.resetForm()
      this.showAddModal = true
    },

    formatDateForInput(dateStr) {
      if (!dateStr) return ''
      // Handle ISO datetime strings like "2026-02-26T00:00:00.000000Z"
      return dateStr.substring(0, 10)
    },

    editDoctor(doctor) {
      this.form = {
        name: doctor.name,
        email: doctor.email,
        password: '',
        password_confirmation: '',
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
      } catch (error) {
        this.selectedDoctor = doctor
      }
      this.showViewModal = true
    },

    async saveDoctor() {
      this.saving = true
      try {
        if (this.isEditing) {
          await adminService.updateDoctor(this.selectedDoctor.id, this.form)
          this.$toast({
            component: ToastificationContent,
            props: {
              title: this.$t('messages.success'),
              text: this.$t('admin.doctorUpdated'),
              variant: 'success',
            },
          })
        } else {
          await adminService.createDoctor(this.form)
          this.$toast({
            component: ToastificationContent,
            props: {
              title: this.$t('messages.success'),
              text: this.$t('admin.doctorCreated'),
              variant: 'success',
            },
          })
        }
        this.closeModal()
        await this.fetchDoctors()
        await this.fetchStats()
      } catch (error) {
        const errors = error.response?.data?.errors
        let errorText = error.response?.data?.message || this.$t('admin.saveDoctorError')
        if (errors) {
          errorText = Object.values(errors).flat().join('\n')
        }
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: errorText,
            variant: 'danger',
          },
        })
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
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-secondary ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.deleteDoctor(doctor)
        }
      })
    },

    async deleteDoctor(doctor) {
      try {
        await adminService.deleteDoctor(doctor.id)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.success'),
            text: this.$t('admin.doctorDeleted'),
            variant: 'success',
          },
        })
        await this.fetchDoctors()
        await this.fetchStats()
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.error || error.response?.data?.message || this.$t('admin.deleteDoctorError'),
            variant: 'danger',
          },
        })
      }
    },

    closeModal() {
      this.showModal = false
      this.resetForm()
    },

    resetForm() {
      this.form = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        subscription_plan: '',
        subscription_amount: '',
        subscription_start: '',
        subscription_end: '',
        is_active: true,
        notes: '',
      }
      this.selectedDoctor = null
    },

    getStatusVariant(status) {
      switch (status) {
        case 'active': return 'success'
        case 'expired': return 'danger'
        case 'inactive': return 'warning'
        default: return 'secondary'
      }
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