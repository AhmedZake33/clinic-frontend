<template>
  <div>
    <!-- Onboarding Welcome Banner for Doctors -->
    <b-row v-if="showOnboardingBanner">
      <b-col cols="12">
        <div class="onboarding-welcome-alert p-2 p-md-3 bg-light-primary rounded border border-primary d-flex flex-wrap align-items-center justify-content-between mb-2 shadow-sm">
          <div class="d-flex align-items-center mb-1 mb-md-0">
            <div class="bg-primary text-white p-2 rounded mr-2 ml-2 shadow-xs flex-shrink-0">
              <feather-icon
                icon="CompassIcon"
                size="24"
              />
            </div>
            <div>
              <h5 class="font-weight-bolder text-primary mb-25">
                {{ $t('onboarding.bannerTitle') }}
              </h5>
              <p class="text-muted small mb-0">
                {{ $t('onboarding.bannerText') }}
              </p>
            </div>
          </div>
          <div class="d-flex align-items-center flex-wrap">
            <b-button
              variant="primary"
              size="sm"
              class="font-weight-bold mr-1 ml-1 shadow-sm"
              @click="showTourModal = true"
            >
              <feather-icon
                icon="PlayIcon"
                size="14"
                class="mr-25 ml-25"
              />
              <span>{{ $t('onboarding.startTour') }}</span>
            </b-button>
            <b-button
              variant="outline-secondary"
              size="sm"
              class="font-weight-bold"
              @click="dismissOnboardingBanner"
            >
              {{ $t('onboarding.dismiss') }}
            </b-button>
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- Welcome Card -->
    <b-row>
      <b-col cols="12">
        <b-card>
          <b-row>
            <b-col
              cols="12"
              md="6"
            >
              <h2>{{ $t('dashboard.welcomeBack') }}, {{ user ? user.name : $t('reservation.doctor') }}!</h2>
              <p class="mb-2">
                {{ $t('dashboard.doctorOverview') }}
              </p>
              <b-badge
                v-if="user && user.specialization"
                variant="light-primary"
              >
                {{ $t('admin.specialization') }}: {{ specializationLabel(user.specialization) }}
              </b-badge>
            </b-col>
            <b-col
              cols="12"
              md="6"
              class="text-md-right mt-1 mt-md-0 d-flex align-items-center justify-content-md-end flex-wrap"
            >
              <!-- Interactive Tour Trigger Button -->
              <b-button
                variant="primary"
                size="sm"
                class="mr-1 ml-1 font-weight-bold mb-1 mb-sm-0 shadow-sm"
                @click="showTourModal = true"
              >
                <feather-icon
                  icon="CompassIcon"
                  size="15"
                  class="mr-50 ml-50"
                />
                <span>{{ isRtl ? 'الجولة التفاعلية (7 أقسام)' : 'Interactive Tour (7 Tabs)' }}</span>
              </b-button>

              <b-button
                variant="outline-primary"
                size="sm"
                class="mr-1 ml-1 font-weight-bold mb-1 mb-sm-0"
                :to="{ name: 'doctor-help' }"
              >
                <feather-icon
                  icon="HelpCircleIcon"
                  size="14"
                  class="mr-50 ml-50"
                />
                <span>{{ $t('menu.help') }}</span>
              </b-button>

              <b-button
                variant="primary"
                size="sm"
                class="font-weight-bold"
                :to="{ name: 'doctor-reservations' }"
              >
                <feather-icon
                  icon="CalendarIcon"
                  class="mr-50 ml-50"
                />
                <span>{{ $t('actions.viewAllReservations') }}</span>
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- Statistics Cards -->
    <b-row class="match-height">
      <b-col
        cols="12"
        sm="6"
        lg="4"
      >
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
            {{ $t('dashboard.totalAppointments') }}
          </p>
        </b-card>
      </b-col>

      <b-col
        cols="12"
        sm="6"
        lg="4"
      >
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
            {{ $t('dashboard.pendingCount') }}
          </p>
        </b-card>
      </b-col>

      <b-col
        cols="12"
        sm="6"
        lg="4"
      >
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
            {{ $t('dashboard.completedCount') }}
          </p>
        </b-card>
      </b-col>
    </b-row>

    <!-- Today's Appointments -->
    <b-row>
      <b-col cols="12">
        <b-card :title="`${$t('dashboard.todayAppointments')} (${stats.currentReservations})`">
          <b-table
            :items="todayReservations"
            :fields="fields"
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
                v-if="canCompleteReservation(data.item)"
                v-b-tooltip.hover
                :title="$t('reservation.completeReservation')"
                variant="success"
                size="sm"
                :to="{ name: 'doctor-reservations' }"
              >
                <feather-icon
                  icon="CheckIcon"
                  size="14"
                />
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

    <!-- Recent Activity -->
    <b-row>
      <b-col cols="12">
        <b-card :title="$t('dashboard.recentCompleted')">
          <b-table
            :items="completedReservations"
            :fields="completedFields"
            responsive
            striped
            hover
            show-empty
            :empty-text="$t('dashboard.noCompletedYet')"
          >
            <template #cell(completed_at)="data">
              {{ formatDateTime(data.value) }}
            </template>
          </b-table>
        </b-card>
      </b-col>
    </b-row>

    <!-- Interactive System Tour Modal (Doctor Onboarding Guide) -->
    <b-modal
      v-model="showTourModal"
      size="xl"
      hide-footer
      centered
      body-class="p-2 p-md-3"
      header-bg-variant="primary"
      header-text-variant="white"
      :title="isRtl ? 'الجولة التفاعلية ودليل استخدام النظام (7 أقسام)' : 'Interactive System Tour & Guide (7 Tabs)'"
    >
      <doctor-onboarding-guide />
    </b-modal>
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
  BModal,
  VBTooltip,
} from 'bootstrap-vue'
import reservationsService from '@/services/reservations'
import subDoctorsApi from '@/services/subDoctors'
import authService from '@/services/auth'
import DoctorOnboardingGuide from '@/views/doctor/DoctorOnboardingGuide.vue'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BCard,
    BRow,
    BCol,
    BAvatar,
    BButton,
    BTable,
    BBadge,
    BSpinner,
    BModal,
    DoctorOnboardingGuide,
  },
  data() {
    return {
      user: null,
      loading: false,
      showOnboardingBanner: false,
      showTourModal: false,
      stats: {
        totalReservations: 0,
        pendingReservations: 0,
        completedReservations: 0,
        currentReservations: 0,
      },
      todayReservations: [],
      completedReservations: [],
      specializations: [],
      fields: [],
      completedFields: [],
    }
  },
  computed: {
    isRtl() {
      const activeLocale = this.$store?.state?.language?.currentLocale || this.$i18n?.locale || 'en'
      return activeLocale === 'ar'
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null')
    this.showOnboardingBanner = localStorage.getItem('doctor_onboarding_completed') !== 'true'
    // Set translated table fields
    this.fields = [
      { key: 'client.name', label: this.$t('client.name'), sortable: true },
      { key: 'appointment_date', label: this.$t('reservation.time'), formatter: this.formatTime },
      { key: 'status', label: this.$t('reservation.status') },
      { key: 'actions', label: this.$t('actions.actions') },
    ]
    this.completedFields = [
      { key: 'client.name', label: this.$t('client.name') },
      { key: 'diagnosis', label: this.$t('reservation.diagnosis') },
      { key: 'completed_at', label: this.$t('reservation.completedAt') },
    ]
    this.fetchStats()
    this.fetchTodayReservations()
    this.fetchCompletedReservations()
    this.fetchSpecializations()
    this.fetchCurrentUser()

    // Watch broadcast events for real-time updates
    this.$watch('$store.state.broadcast.eventCounter', () => {
      this.fetchStats()
      this.fetchTodayReservations()
      this.fetchCompletedReservations()
    })
  },
  methods: {
    dismissOnboardingBanner() {
      this.showOnboardingBanner = false
      localStorage.setItem('doctor_onboarding_completed', 'true')
    },
    async fetchCurrentUser() {
      try {
        const { data } = await authService.getUser()
        this.user = data.user || data
        if (this.user) {
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      } catch {
        this.user = JSON.parse(localStorage.getItem('user') || 'null')
      }
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
      if (!value) return ''

      const locale = (localStorage.getItem('locale') || this.$i18n?.locale || 'en').substring(0, 2)
      const specialization = this.specializations.find(item => {
        const itemValue = typeof item === 'string' ? item : item.value
        return itemValue === value
      })

      if (!specialization || typeof specialization === 'string') {
        return value
      }

      return specialization.labels?.[locale] || specialization.labels?.en || value
    },
    async fetchStats() {
      try {
        const [pendingRes, confirmedRes, completedRes] = await Promise.all([
          reservationsService.getReservations({ status: 'pending', own_only: 1 }),
          reservationsService.getReservations({ status: 'confirmed', own_only: 1 }),
          reservationsService.getReservations({ status: 'completed', own_only: 1 }),
        ])

        const pending = pendingRes.data.total || 0
        const confirmed = confirmedRes.data.total || 0
        const completed = completedRes.data.total || 0
        this.stats.totalReservations = pending + confirmed + completed
        this.stats.pendingReservations = pending + confirmed
        this.stats.completedReservations = completed
      } catch (error) {
        console.error('Failed to fetch stats', error)
      }
    },
    async fetchTodayReservations() {
      this.loading = true
      try {
        const today = this.getTodayDate()
        const response = await reservationsService.getReservations({ date_from: today, date_to: today, own_only: 1 })
        this.todayReservations = response.data.data || []
        this.stats.currentReservations = response.data.total || this.todayReservations.length
      } catch (error) {
        console.error('Failed to fetch today reservations', error)
        this.stats.currentReservations = 0
      } finally {
        this.loading = false
      }
    },
    getTodayDate() {
      const d = new Date()
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    async fetchCompletedReservations() {
      try {
        const response = await reservationsService.getReservations({ status: 'completed', own_only: 1 })
        this.completedReservations = (response.data.data || []).slice(0, 5)
      } catch (error) {
        console.error('Failed to fetch completed reservations', error)
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
    canCompleteReservation(reservation) {
      return reservation && !['completed', 'cancelled'].includes(reservation.status)
    },
    formatDateTime(value) {
      if (!value) return 'N/A'
      // Parse as local time since backend returns Y-m-d H:i:s format
      const date = new Date(value + (value.includes(' ') ? '' : ''))
      return date.toLocaleString()
    },
    formatTime(value) {
      if (!value) return 'N/A'
      // Parse as local time since backend returns Y-m-d H:i:s format
      const date = new Date(value + (value.includes(' ') ? '' : ''))
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  },
}
</script>
