<template>
  <div>
    <!-- Summary Cards -->
    <b-row v-if="summary" class="mb-2">
      <b-col cols="4">
        <b-card class="text-center mb-0">
          <h3 class="mb-0">{{ summary.total_visits }}</h3>
          <small class="text-muted">{{ $t('timeline.totalVisits') }}</small>
        </b-card>
      </b-col>
      <b-col cols="4">
        <b-card class="text-center mb-0">
          <h3 class="mb-0 text-success">{{ summary.total_completed }}</h3>
          <small class="text-muted">{{ $t('timeline.completed') }}</small>
        </b-card>
      </b-col>
      <b-col cols="4">
        <b-card class="text-center mb-0">
          <h3 class="mb-0">{{ summary.last_visit ? formatDate(summary.last_visit) : $t('reservation.na') }}</h3>
          <small class="text-muted">{{ $t('timeline.lastVisit') }}</small>
        </b-card>
      </b-col>
    </b-row>

    <!-- Filters -->
    <b-card class="mb-2">
      <b-row>
        <b-col cols="12" md="4">
          <b-form-group :label="$t('reservation.status')">
            <b-form-select v-model="filters.status" :options="statusOptions" @change="fetchTimeline" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="3">
          <b-form-group :label="$t('reservation.from')">
            <b-form-input type="date" v-model="filters.date_from" @change="fetchTimeline" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="3">
          <b-form-group :label="$t('reservation.to')">
            <b-form-input type="date" v-model="filters.date_to" @change="fetchTimeline" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="2" class="d-flex align-items-end">
          <b-button variant="outline-secondary" block class="mb-1" @click="resetFilters">
            {{ $t('client.reset') }}
          </b-button>
        </b-col>
      </b-row>
    </b-card>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-3">
      <b-spinner variant="primary" />
    </div>

    <!-- Empty State -->
    <b-card v-else-if="!timeline.length" class="text-center py-3">
      <feather-icon icon="ClockIcon" size="48" class="text-muted mb-1" />
      <p class="text-muted mb-0">{{ $t('timeline.noVisits') }}</p>
    </b-card>

    <!-- Timeline -->
    <b-card v-else>
      <app-timeline>
        <app-timeline-item
          v-for="item in timeline"
          :key="item.id"
          :variant="getVariant(item.status)"
          :icon="getIcon(item.status)"
        >
          <div class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0">
            <h6 class="mb-0">
              <b-badge :variant="getVariant(item.status)" class="mr-50">
                {{ $t('reservation.' + item.status) }}
              </b-badge>
              <span v-if="item.doctor">{{ $t('reservation.doctor') }}: {{ item.doctor.name }}</span>
            </h6>
            <small class="text-nowrap text-muted">
              {{ formatDateTime(item.appointment_date) }}
            </small>
          </div>

          <!-- Completed visit details -->
          <div v-if="item.status === 'completed'" class="mt-1">
            <div v-if="item.diagnosis" class="mb-50">
              <strong>{{ $t('reservation.diagnosis') }}:</strong>
              <p class="mb-0 text-muted">{{ item.diagnosis }}</p>
            </div>
            <div v-if="item.treatment" class="mb-50">
              <strong>{{ $t('reservation.treatment') }}:</strong>
              <p class="mb-0 text-muted">{{ item.treatment }}</p>
            </div>

            <!-- Xray / Lab badges -->
            <div v-if="item.requires_xray || item.requires_lab" class="mb-50">
              <b-badge v-if="item.requires_xray" variant="light-warning" class="mr-50">
                {{ $t('reservation.xray') }}
              </b-badge>
              <b-badge v-if="item.requires_lab" variant="light-info" class="mr-50">
                {{ $t('reservation.lab') }}
              </b-badge>
            </div>

            <!-- Financial info -->
            <div v-if="item.financial" class="mt-50">
              <small class="text-muted">
                {{ $t('financial.amount') }}: {{ item.financial.amount }} |
                {{ $t('financial.paid') }}: {{ item.financial.paid }} |
                {{ $t('financial.remaining') }}: {{ item.financial.remaining }}
              </small>
            </div>
          </div>

          <!-- Notes for non-completed -->
          <div v-else-if="item.notes" class="mt-50">
            <small class="text-muted">{{ item.notes }}</small>
          </div>
        </app-timeline-item>
      </app-timeline>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BBadge,
  BButton,
  BSpinner,
  BFormGroup,
  BFormSelect,
  BFormInput,
} from 'bootstrap-vue'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import clientsService from '@/services/clients'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BBadge,
    BButton,
    BSpinner,
    BFormGroup,
    BFormSelect,
    BFormInput,
    AppTimeline,
    AppTimelineItem,
  },
  props: {
    clientId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      timeline: [],
      summary: null,
      filters: {
        status: '',
        date_from: '',
        date_to: '',
      },
    }
  },
  computed: {
    statusOptions() {
      return [
        { value: '', text: this.$t('filters.all') },
        { value: 'completed', text: this.$t('reservation.completed') },
        { value: 'confirmed', text: this.$t('reservation.confirmed') },
        { value: 'pending', text: this.$t('reservation.pending') },
        { value: 'cancelled', text: this.$t('reservation.cancelled') },
      ]
    },
  },
  mounted() {
    this.fetchTimeline()
  },
  methods: {
    async fetchTimeline() {
      this.loading = true
      try {
        const params = {}
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.date_from) params.date_from = this.filters.date_from
        if (this.filters.date_to) params.date_to = this.filters.date_to

        const { data } = await clientsService.getClientTimeline(this.clientId, params)
        this.timeline = data.timeline
        this.summary = data.summary
      } catch {
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.error'),
            text: this.$t('messages.loadError'),
            variant: 'danger',
          },
        })
      } finally {
        this.loading = false
      }
    },
    resetFilters() {
      this.filters = { status: '', date_from: '', date_to: '' }
      this.fetchTimeline()
    },
    getVariant(status) {
      const map = {
        completed: 'success',
        confirmed: 'primary',
        pending: 'warning',
        cancelled: 'danger',
      }
      return map[status] || 'secondary'
    },
    getIcon(status) {
      const map = {
        completed: 'CheckCircleIcon',
        confirmed: 'CalendarIcon',
        pending: 'ClockIcon',
        cancelled: 'XCircleIcon',
      }
      return map[status] || 'CircleIcon'
    },
    formatDate(value) {
      if (!value) return null
      return new Date(value).toLocaleDateString()
    },
    formatDateTime(value) {
      if (!value) return null
      return new Date(value).toLocaleString()
    },
  },
}
</script>
