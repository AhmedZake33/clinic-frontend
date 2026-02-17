<template>
  <div>
    <!-- Statistics Cards -->
    <b-row class="match-height">
      <b-col lg="3" sm="6">
        <b-card class="text-center">
          <b-avatar
            variant="light-primary"
            size="45"
          >
            <feather-icon
              icon="UsersIcon"
              size="21"
            />
          </b-avatar>
          <h2 class="font-weight-bolder mt-1">
            {{ stats.totalClients }}
          </h2>
          <p class="card-text">
            {{ $t('dashboard.totalClients') }}
          </p>
        </b-card>
      </b-col>

      <b-col lg="3" sm="6">
        <b-card class="text-center">
          <b-avatar
            variant="light-info"
            size="45"
          >
            <feather-icon
              icon="CalendarIcon"
              size="21"
            />
          </b-avatar>
          <h2 class="font-weight-bolder mt-1">
            {{ stats.totalReservations }}
          </h2>
          <p class="card-text">
            {{ $t('dashboard.totalReservations') }}
          </p>
        </b-card>
      </b-col>

      <b-col lg="3" sm="6">
        <b-card class="text-center">
          <b-avatar
            variant="light-warning"
            size="45"
          >
            <feather-icon
              icon="ClockIcon"
              size="21"
            />
          </b-avatar>
          <h2 class="font-weight-bolder mt-1">
            {{ stats.pendingReservations }}
          </h2>
          <p class="card-text">
            Pending
          </p>
        </b-card>
      </b-col>

      <b-col lg="3" sm="6">
        <b-card class="text-center">
          <b-avatar
            variant="light-success"
            size="45"
          >
            <feather-icon
              icon="CheckCircleIcon"
              size="21"
            />
          </b-avatar>
          <h2 class="font-weight-bolder mt-1">
            {{ stats.completedReservations }}
          </h2>
          <p class="card-text">
            Completed
          </p>
        </b-card>
      </b-col>
    </b-row>

    <!-- Quick Actions -->
    <b-row>
      <b-col cols="12">
        <b-card :title="$t('dashboard.quickActions')">
          <b-button
            variant="primary"
            :to="{ name: 'assistant-clients' }"
            class="mr-1"
          >
            <feather-icon icon="UserPlusIcon" class="mr-50" />
            {{ $t('client.addClient') }}
          </b-button>
          <b-button
            variant="success"
            :to="{ name: 'assistant-reservations' }"
          >
            <feather-icon icon="PlusIcon" class="mr-50" />
            {{ $t('actions.newReservation') }}
          </b-button>
        </b-card>
      </b-col>
    </b-row>

    <!-- Today's Reservations -->
    <b-row>
      <b-col cols="12">
        <b-card :title="`${$t('dashboard.todayAppointments')} (${stats.currentReservations})`">
          <b-table
            :items="todayReservations"
            :fields="translatedFields"
            responsive
            striped
            hover
            :busy="loading"
            show-empty
            :empty-text="$t('dashboard.noAppointmentsToday')"
          >
            <template #cell(status)="data">
              <b-badge :variant="getStatusVariant(data.value)">
                {{ $t('reservation.' + data.value) }}
              </b-badge>
            </template>

            <template #cell(actions)="data">
              <b-button
                variant="primary"
                size="sm"
                :to="{ name: 'assistant-reservations' }"
              >
                {{ $t('actions.view') }}
              </b-button>
            </template>

            <template #table-busy>
              <div class="text-center my-2">
                <b-spinner class="align-middle" />
              </div>
            </template>
          </b-table>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BAvatar,
  BButton,
  BTable,
  BBadge,
  BSpinner,
} from 'bootstrap-vue'
import clientsService from '@/services/clients'
import reservationsService from '@/services/reservations'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BAvatar,
    BButton,
    BTable,
    BBadge,
    BSpinner,
  },
  data() {
    return {
      loading: false,
      stats: {
        totalClients: 0,
        totalReservations: 0,
        pendingReservations: 0,
        completedReservations: 0,
        currentReservations: 0,
      },
      todayReservations: [],
      fields: [
        { key: 'client.name', label: 'table.client', sortable: true },
        { key: 'doctor.name', label: 'table.doctor', sortable: true },
        { key: 'appointment_date', label: 'table.appointment', formatter: this.formatDateTime },
        { key: 'status', label: 'table.status' },
        { key: 'actions', label: 'table.actions' },
      ],
    }
  },
  computed: {
    translatedFields() {
      return this.fields.map(field => ({
        ...field,
        label: this.$t(field.label),
      }))
    },
  },
  watch: {
    '$store.state.broadcast.eventCounter'() {
      this.fetchStats()
      this.fetchTodayReservations()
    },
  },
  mounted() {
    this.fetchStats()
    this.fetchTodayReservations()
  },
  methods: {
    async fetchStats() {
      try {
        const [clientsRes, allRes, pendingRes, completedRes] = await Promise.all([
          clientsService.getClients(),
          reservationsService.getReservations(),
          reservationsService.getReservations({ status: 'pending' }),
          reservationsService.getReservations({ status: 'completed' }),
        ])

        this.stats.totalClients = clientsRes.data.total || 0
        this.stats.totalReservations = allRes.data.total || 0
        this.stats.pendingReservations = pendingRes.data.total || 0
        this.stats.completedReservations = completedRes.data.total || 0
      } catch (error) {
        console.error('Failed to fetch stats', error)
      }
    },
    getTodayDate() {
      const d = new Date()
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    async fetchTodayReservations() {
      this.loading = true
      try {
        const today = this.getTodayDate()
        const response = await reservationsService.getReservations({ date_from: today, date_to: today })
        this.todayReservations = response.data.data || []
        this.stats.currentReservations = response.data.total || this.todayReservations.length
      } catch (error) {
        console.error('Failed to fetch reservations', error)
        this.stats.currentReservations = 0
      } finally {
        this.loading = false
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
  },
}
</script>
