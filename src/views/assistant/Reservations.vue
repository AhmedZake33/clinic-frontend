<template>
  <div>
    <b-card>
      <b-row class="mb-2">
        <b-col cols="12" md="4">
          <h4>{{ $t('reservation.reservationsList') }}</h4>
        </b-col>
        <b-col cols="12" md="8" class="text-right">
          <b-button variant="primary" @click="showAddModal">
            <feather-icon icon="PlusIcon" class="mr-50" />
            {{ $t('actions.newReservation') }}
          </b-button>
        </b-col>
      </b-row>

      <b-form @submit.prevent="applyFilters" class="mb-2">
        <b-row>
          <b-col cols="12" md="3" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.search" :placeholder="$t('reservation.searchByClientOrNotes')" />
          </b-col>
          <b-col cols="6" md="2" class="mb-1 mb-md-0">
            <b-form-select v-model="filters.status" :options="statusOptions" />
          </b-col>
          <b-col cols="6" md="3" class="mb-1 mb-md-0">
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
        :fields="translatedFields"
        responsive
        striped
        hover
        :busy="loading"
        show-empty
      >
        <template #cell(status)="data">
          <b-badge :variant="getStatusVariant(data.value)">
            {{ $t('reservation.' + data.value) }}
          </b-badge>
          <b-badge v-if="data.item.checked_in_at" variant="success" pill class="ml-50">
            <feather-icon icon="LogInIcon" size="12" class="mr-25" />
            #{{ data.item.waiting_number }}
          </b-badge>
        </template>

        <template #cell(requirements)="data">
          <span v-if="!data.item.requires_xray && !data.item.requires_lab" class="text-muted">—</span>
          <span v-else>
            <b-badge v-if="data.item.requires_xray" variant="warning" class="mr-50">
              <feather-icon icon="ImageIcon" size="12" class="mr-25" />
              {{ $t('reservation.xray') }}
            </b-badge>
            <b-badge v-if="data.item.requires_lab" variant="info">
              <feather-icon icon="ActivityIcon" size="12" class="mr-25" />
              {{ $t('reservation.lab') }}
            </b-badge>
          </span>
        </template>

        <template #cell(actions)="data">
          <b-button
            v-b-tooltip.hover
            :title="$t('actions.view')"
            variant="info"
            size="sm"
            class="mr-1"
            @click="viewReservation(data.item)"
          >
            <feather-icon icon="EyeIcon" />
          </b-button>
          <b-button
            v-if="!data.item.checked_in_at && (data.item.status === 'pending' || data.item.status === 'confirmed')"
            v-b-tooltip.hover
            :title="$t('queue.checkIn')"
            variant="primary"
            size="sm"
            class="mr-1"
            @click="checkInPatient(data.item)"
          >
            <feather-icon icon="LogInIcon" />
          </b-button>
          <b-button
            v-if="data.item.status === 'pending'"
            v-b-tooltip.hover
            :title="$t('actions.confirm')"
            variant="success"
            size="sm"
            class="mr-1"
            @click="confirmReservation(data.item)"
          >
            <feather-icon icon="CheckCircleIcon" />
          </b-button>
          <b-button
            v-if="data.item.status !== 'completed' && data.item.status !== 'cancelled'"
            v-b-tooltip.hover
            :title="$t('actions.edit')"
            variant="warning"
            size="sm"
            class="mr-1"
            @click="showEditModal(data.item)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button
            v-if="data.item.status !== 'completed' && data.item.status !== 'cancelled'"
            v-b-tooltip.hover
            :title="$t('actions.cancel')"
            variant="danger"
            size="sm"
            @click="cancelReservation(data.item)"
          >
            <feather-icon icon="XCircleIcon" />
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

    <!-- Add Reservation Modal -->
    <b-modal
      v-model="modalShow"
      :title="$t('actions.newReservation')"
      hide-footer
      size="lg"
    >
      <b-form @submit.prevent="saveReservation">
        <b-form-group :label="$t('table.client')" label-for="client">
          <b-form-input
            id="client-search"
            v-model="clientSearch"
            :placeholder="$t('client.searchPlaceholder')"
            autocomplete="off"
            @focus="clientDropdownOpen = true"
            @input="clientDropdownOpen = true"
          />
          <div v-if="clientDropdownOpen && filteredClients.length" class="client-search-dropdown">
            <div
              v-for="client in filteredClients"
              :key="client.id"
              class="client-search-item"
              @mousedown.prevent="selectClient(client)"
            >
              <strong>{{ client.name }}</strong>
              <small class="text-muted d-block">{{ client.phone }}</small>
            </div>
          </div>
          <div v-if="clientDropdownOpen && clientSearch && !filteredClients.length" class="client-search-dropdown">
            <div class="client-search-item text-muted">{{ $t('messages.noData') }}</div>
          </div>
          <small v-if="form.client_id && selectedClientDisplay" class="text-success">
            {{ $t('reservation.selected') }}: {{ selectedClientDisplay }}
          </small>
        </b-form-group>

        <b-form-group :label="$t('table.doctor')" label-for="doctor">
          <b-form-select
            id="doctor"
            v-model="form.doctor_id"
            :options="doctorOptions"
            required
          >
            <template #first>
              <b-form-select-option :value="null" disabled>
                {{ $t('reservation.selectDoctor') }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>

        <b-row>
          <b-col md="6">
            <b-form-group :label="$t('reservation.appointmentDate')" label-for="appointment-date">
              <b-form-input
                id="appointment-date"
                v-model="form.appointment_date_only"
                type="date"
                required
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group :label="$t('reservation.appointmentTime')" label-for="appointment-time">
              <b-form-select
                id="appointment-time"
                v-model="form.selected_time"
                :options="availableTimeOptions"
                :disabled="!form.doctor_id || !form.appointment_date_only || availabilityLoading"
                required
              >
                <template #first>
                  <b-form-select-option :value="null" disabled>
                    {{ availabilityLoading ? $t('messages.loading') : (availableTimeSlots.length === 0 && form.doctor_id && form.appointment_date_only ? $t('reservation.noAvailableTimes') : $t('reservation.selectTime')) }}
                  </b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <div class="mb-1">
          <b-alert v-if="availabilityLoading" show variant="info">{{ $t('reservation.loadingAvailableTimes') }}</b-alert>
          <b-alert v-else-if="timeSlotsMessage" :variant="timeSlotsMessageVariant" show>
            {{ timeSlotsMessage }}
          </b-alert>
        </div>

        <b-form-group :label="$t('reservation.notes')" label-for="notes">
          <b-form-textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            :placeholder="$t('reservation.notes')"
          />
        </b-form-group>

        <hr>
        <h6 class="mb-1">{{ $t('financial.financial') }}</h6>

        <b-row>
          <b-col md="4">
            <b-form-group :label="$t('financial.amount')" label-for="amount">
              <b-form-input
                id="amount"
                v-model.number="form.amount"
                type="number"
                min="0"
                step="0.01"
                required
              />
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group :label="$t('financial.paid')" label-for="paid">
              <b-form-input
                id="paid"
                v-model.number="form.paid"
                type="number"
                min="0"
                step="0.01"
              />
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group :label="$t('financial.paymentMethod')" label-for="payment_method">
              <b-form-select
                id="payment_method"
                v-model="form.payment_method"
                :options="paymentMethodOptions"
                required
              />
            </b-form-group>
          </b-col>
        </b-row>

        <div class="text-right">
          <b-button variant="secondary" class="mr-1" @click="modalShow = false">
            {{ $t('actions.cancel') }}
          </b-button>
          <b-button type="submit" variant="primary" :disabled="saving">
            <b-spinner v-if="saving" small class="mr-1" />
            {{ $t('actions.createReservation') }}
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
        <!-- Client Details -->
        <b-card v-if="selectedReservation.client" class="mb-2" no-body>
          <b-card-header>
            <h6 class="mb-0">{{ $t('client.clientDetails') }}</h6>
          </b-card-header>
          <b-card-body>
            <b-row>
              <b-col md="6">
                <p class="mb-50"><strong>{{ $t('client.name') }}:</strong> {{ selectedReservation.client.name }}</p>
                <p class="mb-50"><strong>{{ $t('client.phone') }}:</strong> {{ selectedReservation.client.phone }}</p>
                <p class="mb-50"><strong>{{ $t('client.dateOfBirth') }}:</strong> {{ selectedReservation.client.date_of_birth || $t('reservation.na') }}</p>
              </b-col>
              <b-col md="6">
                <p class="mb-50"><strong>{{ $t('client.height') }}:</strong> {{ selectedReservation.client.height ? selectedReservation.client.height + ' cm' : $t('reservation.na') }}</p>
                <p class="mb-50"><strong>{{ $t('client.weight') }}:</strong> {{ selectedReservation.client.weight ? selectedReservation.client.weight + ' kg' : $t('reservation.na') }}</p>
                <p class="mb-50"><strong>{{ $t('client.address') }}:</strong> {{ selectedReservation.client.address || $t('reservation.na') }}</p>
              </b-col>
            </b-row>
            <div v-if="selectedReservation.client.medical_history" class="mt-50">
              <p class="mb-25"><strong>{{ $t('client.medicalHistory') }}:</strong></p>
              <b-alert variant="warning" show class="mb-0">{{ selectedReservation.client.medical_history }}</b-alert>
            </div>
          </b-card-body>
        </b-card>

        <b-row>
          <b-col md="6">
            <p v-if="selectedReservation.doctor"><strong>{{ $t('table.doctor') }}:</strong> {{ selectedReservation.doctor.name }}</p>
            <p><strong>{{ $t('table.status') }}:</strong> 
              <b-badge :variant="getStatusVariant(selectedReservation.status)">
                {{ $t('reservation.' + selectedReservation.status) }}
              </b-badge>
            </p>
          </b-col>
          <b-col md="6">
            <p><strong>{{ $t('table.appointment') }}:</strong> {{ formatDateTime(selectedReservation.appointment_date) }}</p>
            <p><strong>{{ $t('table.created') }}:</strong> {{ formatDateTime(selectedReservation.created_at) }}</p>
            <p v-if="selectedReservation.completed_at">
              <strong>{{ $t('table.completed') }}:</strong> {{ formatDateTime(selectedReservation.completed_at) }}
            </p>
            <p v-if="selectedReservation.checked_in_at">
              <strong>{{ $t('queue.checkedInAt') }}:</strong> {{ formatDateTime(selectedReservation.checked_in_at) }}
              <b-badge variant="success" pill class="ml-50">
                {{ $t('queue.waitingNumber') }}: #{{ selectedReservation.waiting_number }}
              </b-badge>
            </p>
          </b-col>
        </b-row>
        <hr>
        <p><strong>{{ $t('reservation.notes') }}:</strong></p>
        <p>{{ selectedReservation.notes || $t('reservation.na') }}</p>
        <div v-if="selectedReservation.diagnosis">
          <p><strong>{{ $t('reservation.diagnosis') }}:</strong></p>
          <p>{{ selectedReservation.diagnosis }}</p>
        </div>
        <div v-if="selectedReservation.treatment">
          <p><strong>{{ $t('reservation.treatment') }}:</strong></p>
          <p>{{ selectedReservation.treatment }}</p>
        </div>

        <div v-if="selectedReservation.requires_xray || selectedReservation.requires_lab">
          <hr>
          <h6>{{ $t('reservation.additionalRequirements') }}</h6>
          <div v-if="selectedReservation.requires_xray" class="mb-1">
            <b-badge variant="warning" class="mr-1">
              <feather-icon icon="ImageIcon" size="12" class="mr-25" />
              {{ $t('reservation.requiresXray') }}
            </b-badge>
            <p v-if="selectedReservation.xray_notes" class="mt-50 text-muted small">{{ selectedReservation.xray_notes }}</p>
          </div>
          <div v-if="selectedReservation.requires_lab">
            <b-badge variant="info" class="mr-1">
              <feather-icon icon="ActivityIcon" size="12" class="mr-25" />
              {{ $t('reservation.requiresLab') }}
            </b-badge>
            <p v-if="selectedReservation.lab_notes" class="mt-50 text-muted small">{{ selectedReservation.lab_notes }}</p>
          </div>
        </div>
      </div>
    </b-modal>

    <!-- Edit Reservation Modal -->
    <b-modal
      v-model="editModalShow"
      :title="$t('actions.editReservation')"
      hide-footer
      size="lg"
    >
      <b-form @submit.prevent="updateSelectedReservation">
        <b-form-group :label="$t('table.client')" label-for="edit-client">
          <b-form-select
            id="edit-client"
            v-model="editForm.client_id"
            :options="clientOptions"
            required
          />
        </b-form-group>

        <b-form-group :label="$t('table.doctor')" label-for="edit-doctor">
          <b-form-select
            id="edit-doctor"
            v-model="editForm.doctor_id"
            :options="doctorOptions"
            required
          />
        </b-form-group>

        <b-form-group :label="$t('reservation.appointmentDate')" label-for="edit-datetime">
          <b-form-input
            id="edit-datetime"
            v-model="editForm.appointment_date"
            type="datetime-local"
            required
          />
        </b-form-group>

        <b-form-group :label="$t('table.status')" label-for="edit-status">
          <b-form-select
            id="edit-status"
            v-model="editForm.status"
            :options="editStatusOptions"
            required
          />
        </b-form-group>

        <b-form-group :label="$t('reservation.notes')" label-for="edit-notes">
          <b-form-textarea
            id="edit-notes"
            v-model="editForm.notes"
            rows="3"
            :placeholder="$t('reservation.notes')"
          />
        </b-form-group>

        <div class="text-right">
          <b-button variant="secondary" class="mr-1" @click="editModalShow = false">
            {{ $t('actions.cancel') }}
          </b-button>
          <b-button type="submit" variant="primary" :disabled="updating">
            <b-spinner v-if="updating" small class="mr-1" />
            {{ $t('actions.save') }}
          </b-button>
        </div>
      </b-form>
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
  BFormTextarea,
  BFormSelect,
  BFormSelectOption,
  BSpinner,
  BBadge,
  BAlert,
  VBTooltip,
} from 'bootstrap-vue'
import reservationsService from '@/services/reservations'
import clientsService from '@/services/clients'
import scheduleService from '@/services/schedule'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

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
    BFormTextarea,
    BFormSelect,
    BFormSelectOption,
    BSpinner,
    BBadge,
    BAlert,
    BCardHeader: () => import('bootstrap-vue').then(m => m.BCardHeader),
    BCardBody: () => import('bootstrap-vue').then(m => m.BCardBody),
  },
  directives: {
    'b-tooltip': VBTooltip,
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
      clients: [],
      doctors: [],
      loading: false,
      modalShow: false,
      viewModalShow: false,
      editModalShow: false,
      saving: false,
      updating: false,
      selectedReservation: null,
      clientSearch: '',
      clientDropdownOpen: false,
      availabilityLoading: false,
      availableTimeSlots: [],
      timeSlotsMessage: '',
      timeSlotsMessageVariant: 'warning',
      filters: {
        search: '',
        status: '',
        date_from: '',
        date_to: '',
      },
      form: {
        client_id: null,
        doctor_id: null,
        appointment_date_only: '',
        selected_time: null,
        notes: '',
        amount: 0,
        paid: 0,
        payment_method: 'cash',
      },
      editForm: {
        id: null,
        client_id: null,
        doctor_id: null,
        appointment_date: '',
        status: '',
        notes: '',
      },
      fields: [
        { key: 'client.name', label: 'table.client', sortable: true },
        { key: 'doctor.name', label: 'table.doctor', sortable: true },
        { key: 'appointment_date', label: 'table.appointment', formatter: this.formatDateTime, sortable: true },
        { key: 'status', label: 'table.status', sortable: true },
        { key: 'requirements', label: 'reservation.requirements' },
        { key: 'actions', label: 'table.actions' },
      ],
    }
  },
  watch: {
    'form.doctor_id': function () {
      this.fetchAvailableTimes()
    },
    'form.appointment_date_only': function () {
      this.fetchAvailableTimes()
    },
    '$store.state.broadcast.eventCounter'() {
      this.fetchReservations()
    },
  },
  computed: {
    translatedFields() {
      return this.fields.map(field => ({
        ...field,
        label: this.$t(field.label),
      }))
    },
    clientOptions() {
      return this.clients.map(client => ({
        value: client.id,
        text: `${client.name} - ${client.phone}`,
      }))
    },
    filteredClients() {
      if (!this.clientSearch) return this.clients
      const q = this.clientSearch.toLowerCase()
      return this.clients.filter(c =>
        c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q))
      )
    },
    selectedClientDisplay() {
      const c = this.clients.find(cl => cl.id === this.form.client_id)
      return c ? `${c.name} - ${c.phone}` : ''
    },
    doctorOptions() {
      return this.doctors.map(doctor => ({
        value: doctor.id,
        text: doctor.name,
      }))
    },
    statusOptions() {
      return [
        { value: '', text: this.$t('filters.all') + ' ' + this.$t('table.status') },
        { value: 'pending', text: this.$t('reservation.pending') },
        { value: 'confirmed', text: this.$t('reservation.confirmed') },
        { value: 'completed', text: this.$t('reservation.completed') },
        { value: 'cancelled', text: this.$t('reservation.cancelled') },
      ]
    },
    editStatusOptions() {
      const current = this.editForm.status
      const transitions = {
        pending: ['pending', 'confirmed', 'cancelled'],
        confirmed: ['confirmed', 'cancelled'],
        completed: ['completed'],
        cancelled: ['cancelled'],
      }
      const allowed = transitions[current] || [current]
      return allowed.map(s => ({ value: s, text: this.$t('reservation.' + s) }))
    },
    paymentMethodOptions() {
      return [
        { value: 'cash', text: this.$t('financial.cash') },
        { value: 'card', text: this.$t('financial.card') },
        { value: 'transfer', text: this.$t('financial.transfer') },
        { value: 'other', text: this.$t('financial.other') },
      ]
    },
    availableTimeOptions() {
      return this.availableTimeSlots
        .filter(s => !s.booked)
        .map(s => ({
          value: s.time,
          text: s.label,
        }))
    },
  },
  mounted() {
    this.fetchReservations()
    this.fetchClients()
    this.fetchDoctors()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handleClickOutside(e) {
      const el = document.getElementById('client-search')
      if (el && !el.contains(e.target)) {
        this.clientDropdownOpen = false
      }
    },
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
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: this.$t('messages.loadReservationsError'),
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
      this.filters = { search: '', status: '', date_from: '', date_to: '' }
      this.pagination.current_page = 1
      this.fetchReservations()
    },
    onPageChange(page) {
      this.pagination.current_page = page
      this.fetchReservations()
    },
    selectClient(client) {
      this.form.client_id = client.id
      this.clientSearch = `${client.name} - ${client.phone}`
      this.clientDropdownOpen = false
    },
    async fetchClients() {
      try {
        const response = await clientsService.getClients()
        // Handle both paginated and non-paginated responses
        this.clients = Array.isArray(response.data) ? response.data : (response.data.data || [])
      } catch (error) {
        console.error('Failed to load clients', error)
      }
    },
    async fetchDoctors() {
      try {
        const response = await reservationsService.getDoctors()
        this.doctors = response.data
      } catch (error) {
        console.error('Failed to load doctors', error)
      }
    },
    async fetchAvailableTimes() {
      this.form.selected_time = null
      this.availableTimeSlots = []
      this.timeSlotsMessage = ''
      this.timeSlotsMessageVariant = 'warning'
      if (!this.form.doctor_id || !this.form.appointment_date_only) return
      this.availabilityLoading = true
      try {
        const res = await scheduleService.getAvailableTimes(this.form.doctor_id, this.form.appointment_date_only)
        if (res.data.available === false) {
          this.timeSlotsMessage = res.data.message || this.$t('reservation.noAvailabilityOnDate')
          this.timeSlotsMessageVariant = 'warning'
          this.availableTimeSlots = []
        } else {
          const freeSlots = res.data.slots.filter(s => !s.booked)
          this.availableTimeSlots = res.data.slots
          if (freeSlots.length === 0) {
            this.timeSlotsMessage = this.$t('reservation.allTimeSlotsBooked')
            this.timeSlotsMessageVariant = 'danger'
          } else {
            this.timeSlotsMessage = this.$t('reservation.timeSlotsAvailable', { count: freeSlots.length })
            this.timeSlotsMessageVariant = 'success'
          }
        }
      } catch (e) {
        this.timeSlotsMessage = e.response?.data?.message || e.response?.data?.error || this.$t('reservation.failedLoadTimes')
        this.timeSlotsMessageVariant = 'danger'
        this.availableTimeSlots = []
      } finally {
        this.availabilityLoading = false
      }
    },
    getTodayDate() {
      const d = new Date()
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    showAddModal() {
      this.form = {
        client_id: null,
        doctor_id: null,
        appointment_date_only: this.getTodayDate(),
        selected_time: null,
        notes: '',
        amount: 0,
        paid: 0,
        payment_method: 'cash',
      }
      this.availableTimeSlots = []
      this.timeSlotsMessage = ''
      this.timeSlotsMessageVariant = 'warning'
      this.clientSearch = ''
      this.clientDropdownOpen = false
      this.modalShow = true
    },
    showEditModal(reservation) {
      this.selectedReservation = reservation
      this.editForm = {
        id: reservation.id,
        client_id: reservation.client?.id || reservation.client_id,
        doctor_id: reservation.doctor?.id || reservation.doctor_id,
        appointment_date: reservation.appointment_date && reservation.appointment_date.substring(0, 16),
        status: reservation.status,
        notes: reservation.notes || '',
      }
      this.editModalShow = true
    },
    viewReservation(reservation) {
      this.selectedReservation = reservation
      this.viewModalShow = true
    },
    async updateSelectedReservation() {
      this.updating = true
      try {
        const payload = {
          client_id: this.editForm.client_id,
          doctor_id: this.editForm.doctor_id,
          appointment_date: this.editForm.appointment_date,
          status: this.editForm.status || 'pending',
          notes: this.editForm.notes,
        }
        await reservationsService.updateReservation(this.editForm.id, payload)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.success'),
            text: this.$t('messages.reservationUpdated'),
            variant: 'success',
          },
        })
        this.editModalShow = false
        this.fetchReservations()
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.message || this.$t('messages.updateReservationError'),
            variant: 'danger',
          },
        })
      } finally {
        this.updating = false
      }
    },
    async saveReservation() {
      this.saving = true
      try {
        const payload = {
          ...this.form,
          appointment_date: `${this.form.appointment_date_only} ${this.form.selected_time}`,
        }
        delete payload.appointment_date_only
        delete payload.selected_time
        const res = await reservationsService.createReservation(payload)
        const queuePosition = res.data.queue_position || '?'
        const reservationsBefore = res.data.reservations_before || 0
        this.modalShow = false
        this.fetchReservations()
        this.$swal({
          icon: 'success',
          title: this.$t('messages.reservationCreated'),
          html: `<div style="font-size:1.1em">
            <p><strong>${this.$t('reservation.queuePosition')}:</strong> #${queuePosition}</p>
            <p><strong>${this.$t('reservation.reservationsBefore')}:</strong> ${reservationsBefore}</p>
          </div>`,
          confirmButtonText: this.$t('actions.ok'),
          customClass: {
            confirmButton: 'btn btn-success',
          },
          buttonsStyling: false,
        })
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.message || error.response?.data?.error || this.$t('messages.saveReservationError'),
            variant: 'danger',
          },
        })
      } finally {
        this.saving = false
      }
    },
    async checkInPatient(reservation) {
      const result = await this.$swal({
        title: this.$t('queue.checkInConfirm', { name: reservation.client?.name || '' }),
        text: this.$t('queue.checkInConfirmText'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: this.$t('queue.checkIn'),
        cancelButtonText: this.$t('actions.cancel'),
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-secondary ml-1',
        },
        buttonsStyling: false,
      })
      if (!result.isConfirmed) return

      try {
        const response = await reservationsService.checkIn(reservation.id)
        const waitingNumber = response.data.waiting_number
        this.$swal({
          icon: 'success',
          title: this.$t('queue.checkInSuccess'),
          html: `<div style="font-size:1.5em; margin:10px 0"><strong>${this.$t('queue.waitingNumber')}: <span class="text-primary">#${waitingNumber}</span></strong></div>`,
          confirmButtonText: this.$t('actions.ok'),
          customClass: { confirmButton: 'btn btn-success' },
          buttonsStyling: false,
        })
        this.fetchReservations()
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.error || this.$t('queue.checkInError'),
            variant: 'danger',
          },
        })
      }
    },
    async confirmReservation(reservation) {
      const result = await this.$swal({
        title: this.$t('messages.confirmReservationTitle'),
        text: this.$t('messages.confirmReservationText', { client: reservation.client?.name || '' }),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: this.$t('actions.confirm'),
        cancelButtonText: this.$t('actions.cancel'),
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-outline-secondary ml-1',
        },
        buttonsStyling: false,
      })
      if (!result.isConfirmed) return

      try {
        await reservationsService.confirmReservation(reservation.id)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.success'),
            text: this.$t('messages.reservationConfirmed'),
            variant: 'success',
          },
        })
        this.fetchReservations()
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.message || error.response?.data?.error || this.$t('messages.confirmReservationError'),
            variant: 'danger',
          },
        })
      }
    },
    async cancelReservation(reservation) {
      const result = await this.$swal({
        title: this.$t('messages.cancelReservationConfirm'),
        text: this.$t('messages.cancelReservationWarning', { client: reservation.client?.name || '' }),
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
        const payload = {
          client_id: reservation.client?.id || reservation.client_id,
          doctor_id: reservation.doctor?.id || reservation.doctor_id,
          appointment_date: reservation.appointment_date,
          status: 'cancelled',
          notes: reservation.notes,
        }
        await reservationsService.updateReservation(reservation.id, payload)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.success'),
            text: this.$t('messages.reservationCancelled'),
            variant: 'success',
          },
        })
        this.fetchReservations()
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: this.$t('messages.error'),
            text: this.$t('messages.cancelReservationError'),
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
      // Parse as local time since backend returns Y-m-d H:i:s format
      const date = new Date(value + (value.includes(' ') ? '' : ''))
      return date.toLocaleString()
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

<style scoped>
.client-search-dropdown {
  position: absolute;
  z-index: 1050;
  width: calc(100% - 2rem);
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #d8d6de;
  border-radius: 0.357rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 2px;
}
.client-search-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}
.client-search-item:hover {
  background-color: #f8f8f8;
}
</style>
