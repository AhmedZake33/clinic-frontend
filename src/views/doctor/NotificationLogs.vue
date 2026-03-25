<template>
  <div>
    <b-card :title="$t('notifications.logsTitle')">
      <!-- Filters -->
      <b-row class="mb-2">
        <b-col cols="12" md="3">
          <b-form-group :label="$t('notifications.channel')">
            <b-form-select v-model="filters.channel" :options="channelOptions" @change="fetchLogs" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="3">
          <b-form-group :label="$t('reservation.status')">
            <b-form-select v-model="filters.status" :options="statusOptions" @change="fetchLogs" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="3">
          <b-form-group :label="$t('reservation.from')">
            <b-form-input type="date" v-model="filters.date_from" @change="fetchLogs" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="3">
          <b-form-group :label="$t('reservation.to')">
            <b-form-input type="date" v-model="filters.date_to" @change="fetchLogs" />
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Table -->
      <b-table
        :items="logs"
        :fields="fields"
        responsive
        striped
        hover
        show-empty
        :busy="loading"
      >
        <template #table-busy>
          <div class="text-center py-3">
            <b-spinner variant="primary" />
          </div>
        </template>

        <template #cell(created_at)="{ item }">
          {{ formatDateTime(item.created_at) }}
        </template>

        <template #cell(client)="{ item }">
          {{ item.client ? item.client.name : $t('reservation.na') }}
        </template>

        <template #cell(channel)="{ item }">
          <b-badge :variant="item.channel === 'whatsapp' ? 'success' : 'info'">
            {{ item.channel === 'whatsapp' ? $t('notifications.whatsapp') : $t('notifications.sms') }}
          </b-badge>
        </template>

        <template #cell(status)="{ item }">
          <b-badge :variant="getStatusVariant(item.status)">
            {{ $t('notifications.status_' + item.status) }}
          </b-badge>
        </template>

        <template #cell(error_message)="{ item }">
          <small v-if="item.error_message" class="text-danger">{{ item.error_message }}</small>
          <span v-else>-</span>
        </template>

        <template #empty>
          <div class="text-center py-2">{{ $t('messages.noData') }}</div>
        </template>
      </b-table>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="d-flex justify-content-center mt-2">
        <b-pagination
          v-model="pagination.current_page"
          :total-rows="pagination.total"
          :per-page="pagination.per_page"
          @change="onPageChange"
        />
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BBadge,
  BTable,
  BSpinner,
  BFormGroup,
  BFormSelect,
  BFormInput,
  BPagination,
} from 'bootstrap-vue'
import notificationsService from '@/services/notifications'

export default {
  components: { BCard, BRow, BCol, BBadge, BTable, BSpinner, BFormGroup, BFormSelect, BFormInput, BPagination },
  data() {
    return {
      loading: false,
      logs: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
      },
      filters: {
        channel: '',
        status: '',
        date_from: '',
        date_to: '',
      },
      fields: [
        { key: 'created_at', label: this.$t('reservation.date') },
        { key: 'client', label: this.$t('reservation.client') },
        { key: 'phone_number', label: this.$t('client.phone') },
        { key: 'channel', label: this.$t('notifications.channel') },
        { key: 'status', label: this.$t('reservation.status') },
        { key: 'error_message', label: this.$t('notifications.errorMessage') },
      ],
    }
  },
  computed: {
    channelOptions() {
      return [
        { value: '', text: this.$t('filters.all') },
        { value: 'sms', text: this.$t('notifications.sms') },
        { value: 'whatsapp', text: this.$t('notifications.whatsapp') },
      ]
    },
    statusOptions() {
      return [
        { value: '', text: this.$t('filters.all') },
        { value: 'pending', text: this.$t('notifications.status_pending') },
        { value: 'sent', text: this.$t('notifications.status_sent') },
        { value: 'delivered', text: this.$t('notifications.status_delivered') },
        { value: 'failed', text: this.$t('notifications.status_failed') },
      ]
    },
  },
  mounted() {
    this.fetchLogs()
  },
  methods: {
    async fetchLogs() {
      this.loading = true
      try {
        const params = { page: this.pagination.current_page }
        if (this.filters.channel) params.channel = this.filters.channel
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.date_from) params.date_from = this.filters.date_from
        if (this.filters.date_to) params.date_to = this.filters.date_to

        const { data } = await notificationsService.getLogs(params)
        this.logs = data.data
        this.pagination = {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
        }
      } catch {
        this.$toast({
          component: 'ToastificationContent',
          props: { title: this.$t('messages.error'), text: this.$t('messages.loadError'), variant: 'danger' },
        })
      } finally {
        this.loading = false
      }
    },
    onPageChange(page) {
      this.pagination.current_page = page
      this.fetchLogs()
    },
    getStatusVariant(status) {
      const map = { pending: 'warning', sent: 'primary', delivered: 'success', failed: 'danger' }
      return map[status] || 'secondary'
    },
    formatDateTime(value) {
      if (!value) return null
      return new Date(value).toLocaleString()
    },
  },
}
</script>
