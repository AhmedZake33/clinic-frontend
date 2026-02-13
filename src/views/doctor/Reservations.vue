<template>
  <div>
    <b-card>
      <b-row class="mb-2">
        <b-col cols="12" md="4">
          <h4>{{ $t('reservation.myReservations') }}</h4>
        </b-col>
      </b-row>

      <b-form @submit.prevent="applyFilters" class="mb-2">
        <b-row>
          <b-col cols="12" md="4" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.search" :placeholder="$t('reservation.searchByClientOrNotes')" />
          </b-col>
          <b-col cols="6" md="3" class="mb-1 mb-md-0">
            <b-form-select v-model="filters.status" :options="statusOptions" />
          </b-col>
          <b-col cols="6" md="2" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.date_from" type="date" :placeholder="$t('reservation.from')" />
          </b-col>
          <b-col cols="6" md="2" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.date_to" type="date" :placeholder="$t('reservation.to')" />
          </b-col>
          <b-col cols="12" md="12" class="text-right mt-1">
            <b-button type="submit" variant="primary" class="mr-1" :disabled="loading">
              {{ $t('filters.apply') }}
            </b-button>
            <b-button variant="outline-secondary" size="sm" @click="resetFilters" :disabled="loading">
              {{ $t('filters.reset') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>

      <b-table
        :items="reservations"
        :fields="fields"
        responsive
        striped
        hover
        :busy="loading"
        show-empty
      >
        <template #cell(status)="data">
          <b-badge :variant="getStatusVariant(data.value)">
            {{ data.value }}
          </b-badge>
        </template>

        <template #cell(actions)="data">
          <b-button
            variant="info"
            size="sm"
            class="mr-1"
            @click="viewReservation(data.item)"
          >
            <feather-icon icon="EyeIcon" />
          </b-button>
          <b-button
            v-if="data.item.status !== 'completed' && data.item.status !== 'cancelled'"
            variant="success"
            size="sm"
            class="mr-1"
            @click="showCompleteModal(data.item)"
          >
            <feather-icon icon="CheckIcon" class="mr-50" />
            {{ $t('reservation.completeReservation') }}
          </b-button>
          <b-button
            v-if="data.item.status === 'completed' && data.item.treatment"
            variant="primary"
            size="sm"
            @click="printPrescription(data.item)"
          >
            <feather-icon icon="PrinterIcon" class="mr-50" />
            {{ $t('reservation.printPrescription') }}
          </b-button>
        </template>

        <template #table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle" />
          </div>
        </template>
      </b-table>

      <b-pagination
        v-model="pagination.current_page"
        :total-rows="pagination.total"
        :per-page="pagination.per_page"
        @change="onPageChange"
        class="mt-2"
        align="center"
      />
      <div class="text-center text-muted small mt-1" v-if="pagination.total">
        {{ paginationCountText(pagination) }}
      </div>
    </b-card>

    <!-- Complete Modal -->
    <b-modal
      v-model="completeModalShow"
      :title="$t('reservation.completeReservation')"
      hide-footer
      size="lg"
    >
      <b-form @submit.prevent="completeReservation">
        <b-alert variant="info" show>
          <p v-if="selectedReservation && selectedReservation.client"><strong>{{ $t('reservation.client') }}:</strong> {{ selectedReservation.client.name }}</p>
          <p v-if="selectedReservation"><strong>{{ $t('reservation.appointment') }}:</strong> {{ formatDateTime(selectedReservation.appointment_date) }}</p>
        </b-alert>

        <b-form-group :label="$t('reservation.diagnosis')" label-for="diagnosis">
          <b-form-textarea
            id="diagnosis"
            v-model="completeForm.diagnosis"
            rows="4"
            :placeholder="$t('reservation.enterDiagnosis')"
            required
          />
        </b-form-group>

        <b-form-group :label="$t('reservation.treatment')" label-for="treatment">
          <b-form-textarea
            id="treatment"
            v-model="completeForm.treatment"
            rows="4"
            :placeholder="$t('reservation.enterTreatment')"
            required
          />
        </b-form-group>

        <div class="text-right">
          <b-button variant="secondary" class="mr-1" @click="completeModalShow = false">
            {{ $t('actions.cancel') }}
          </b-button>
          <b-button type="submit" variant="success" :disabled="completing">
            <b-spinner v-if="completing" small class="mr-1" />
            {{ $t('reservation.completeReservation') }}
          </b-button>
        </div>
      </b-form>
    </b-modal>

    <!-- View Modal -->
    <b-modal
      v-model="viewModalShow"
      :title="$t('reservation.reservationDetails')"
      ok-only
      size="lg"
    >
      <div v-if="selectedReservation">
        <b-row>
          <b-col md="6">
            <p v-if="selectedReservation.client"><strong>{{ $t('reservation.client') }}:</strong> {{ selectedReservation.client.name }}</p>
            <p v-if="selectedReservation.client"><strong>{{ $t('reservation.clientEmail') }}:</strong> {{ selectedReservation.client.email }}</p>
            <p v-if="selectedReservation.client"><strong>{{ $t('reservation.clientPhone') }}:</strong> {{ selectedReservation.client.phone }}</p>
            <p><strong>{{ $t('reservation.status') }}:</strong> 
              <b-badge :variant="getStatusVariant(selectedReservation.status)">
                {{ selectedReservation.status }}
              </b-badge>
            </p>
          </b-col>
          <b-col md="6">
            <p><strong>{{ $t('reservation.appointment') }}:</strong> {{ formatDateTime(selectedReservation.appointment_date) }}</p>
            <p><strong>{{ $t('reservation.created') }}:</strong> {{ formatDateTime(selectedReservation.created_at) }}</p>
            <p v-if="selectedReservation.completed_at">
              <strong>{{ $t('reservation.completedAt') }}:</strong> {{ formatDateTime(selectedReservation.completed_at) }}
            </p>
          </b-col>
        </b-row>
        <hr>
        <p><strong>{{ $t('reservation.notes') }}:</strong></p>
        <p>{{ selectedReservation.notes || $t('reservation.na') }}</p>
        
        <div v-if="selectedReservation.client && selectedReservation.client.medical_history">
          <p><strong>{{ $t('reservation.medicalHistory') }}:</strong></p>
          <b-alert variant="warning" show>
            {{ selectedReservation.client.medical_history }}
          </b-alert>
        </div>

        <div v-if="selectedReservation.diagnosis">
          <hr>
          <p><strong>{{ $t('reservation.diagnosis') }}:</strong></p>
          <p>{{ selectedReservation.diagnosis }}</p>
        </div>
        <div v-if="selectedReservation.treatment">
          <p><strong>{{ $t('reservation.treatment') }}:</strong></p>
          <p>{{ selectedReservation.treatment }}</p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BButton,
  BTable,
  BPagination,
  BModal,
  BForm,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BFormTextarea,
  BSpinner,
  BBadge,
  BAlert,
} from 'bootstrap-vue'
import reservationsService from '@/services/reservations'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BButton,
    BTable,
    BPagination,
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormTextarea,
    BSpinner,
    BBadge,
    BAlert,
  },
  data() {
    return {
      reservations: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      },
      loading: false,
      completeModalShow: false,
      viewModalShow: false,
      completing: false,
      selectedReservation: null,
      completeForm: {
        diagnosis: '',
        treatment: '',
      },
      filters: {
        search: '',
        status: '',
        date_from: '',
        date_to: '',
      },
    }
  },
  mounted() {
    const today = this.getTodayDate()
    this.filters.date_from = today
    this.filters.date_to = today
    this.fetchReservations()
  },
  watch: {
    '$store.state.broadcast.eventCounter'() {
      this.fetchReservations()
    },
  },
  computed: {
    fields() {
      return [
        { key: 'client.name', label: this.$t('table.client'), sortable: true },
        { key: 'appointment_date', label: this.$t('reservation.appointment'), formatter: this.formatDateTime, sortable: true },
        { key: 'status', label: this.$t('table.status'), sortable: true },
        { key: 'actions', label: this.$t('table.actions') },
      ]
    },
    statusOptions() {
      return [
        { value: '', text: this.$t('filters.all') },
        { value: 'pending', text: this.$t('reservation.pending') },
        { value: 'confirmed', text: this.$t('reservation.confirmed') },
        { value: 'completed', text: this.$t('reservation.completed') },
        { value: 'cancelled', text: this.$t('reservation.cancelled') },
      ]
    },
  },
  methods: {
    async fetchReservations() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.current_page,
        }
        if (this.filters.search) params.search = this.filters.search
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.date_from) params.date_from = this.filters.date_from
        if (this.filters.date_to) params.date_to = this.filters.date_to
        const response = await reservationsService.getReservations(params)
        this.reservations = response.data.data
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
        }
      } catch (error) {
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: 'Error',
            text: 'Failed to load reservations',
            variant: 'danger',
          },
        })
      } finally {
        this.loading = false
      }
    },
    applyFilters() {
      this.pagination.current_page = 1
      this.fetchReservations()
    },
    resetFilters() {
      const today = this.getTodayDate()
      this.filters = { search: '', status: '', date_from: today, date_to: today }
      this.pagination.current_page = 1
      this.fetchReservations()
    },
    onPageChange(page) {
      this.pagination.current_page = page
      this.fetchReservations()
    },
    showCompleteModal(reservation) {
      this.selectedReservation = reservation
      this.completeForm = {
        diagnosis: '',
        treatment: '',
      }
      this.completeModalShow = true
    },
    viewReservation(reservation) {
      this.selectedReservation = reservation
      this.viewModalShow = true
    },
    async completeReservation() {
      this.completing = true
      try {
        await reservationsService.completeReservation(
          this.selectedReservation.id,
          this.completeForm
        )
        // this.$toast({
        //   component: 'ToastificationContent',
        //   props: {
        //     title: this.$t('messages.success'),
        //     text: this.$t('messages.reservationCompleted'),
        //     variant: 'success',
        //   },
        // })
        this.completeModalShow = false
        this.fetchReservations()
      } catch (error) {
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.message || this.$t('messages.completeReservationError'),
            variant: 'danger',
          },
        })
      } finally {
        this.completing = false
      }
    },
    async printPrescription(reservation) {
      try {
        const response = await reservationsService.generatePrescription(reservation.id)
        
        // Create blob URL and download
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `prescription_${reservation.id}_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.success'),
            text: this.$t('messages.prescriptionDownloaded'),
            variant: 'success',
          },
        })
      } catch (error) {
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.message || this.$t('messages.generatePrescriptionError'),
            variant: 'danger',
          },
        })
      }
    },
    getStatusVariant(status) {
      const variants = {
        pending: 'warning',
        confirmed: 'info',
        completed: 'success',
        cancelled: 'danger',
      }
      return variants[status] || 'secondary'
    },
    formatDateTime(value) {
      if (!value) return 'N/A'
      return new Date(value).toLocaleString()
    },
    getTodayDate() {
      const d = new Date()
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    paginationCountText(paginationState) {
      if (!paginationState?.total) return '0 / 0'
      const from = ((paginationState.current_page - 1) * paginationState.per_page) + 1
      const to = Math.min(paginationState.current_page * paginationState.per_page, paginationState.total)
      return `${from}-${to} / ${paginationState.total}`
    },
  },
}
</script>
