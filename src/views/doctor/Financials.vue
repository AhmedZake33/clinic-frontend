<template>
  <div>
    <!-- Summary Cards -->
    <b-row class="mb-2">
      <b-col md="3">
        <b-card class="text-center">
          <b-card-text class="text-muted small mb-0">{{ $t('financial.totalAmount') }}</b-card-text>
          <h3 class="mb-0 text-primary">{{ formatCurrency(summary.total_amount) }}</h3>
        </b-card>
      </b-col>
      <b-col md="3">
        <b-card class="text-center">
          <b-card-text class="text-muted small mb-0">{{ $t('financial.totalPaid') }}</b-card-text>
          <h3 class="mb-0 text-success">{{ formatCurrency(summary.total_paid) }}</h3>
        </b-card>
      </b-col>
      <b-col md="3">
        <b-card class="text-center">
          <b-card-text class="text-muted small mb-0">{{ $t('financial.totalRemaining') }}</b-card-text>
          <h3 class="mb-0 text-danger">{{ formatCurrency(summary.total_remaining) }}</h3>
        </b-card>
      </b-col>
      <b-col md="3">
        <b-card class="text-center">
          <b-card-text class="text-muted small mb-0">{{ $t('financial.totalRecords') }}</b-card-text>
          <h3 class="mb-0 text-info">{{ summary.total_records }}</h3>
        </b-card>
      </b-col>
    </b-row>

    <!-- Payment Status Statistics -->
    <b-row class="mb-2">
      <b-col md="4">
        <b-card class="text-center border-success">
          <b-card-text class="text-muted small mb-0">{{ $t('financial.paidCount') }}</b-card-text>
          <h3 class="mb-0 text-success">{{ summary.paid_count || 0 }}</h3>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card class="text-center border-warning">
          <b-card-text class="text-muted small mb-0">{{ $t('financial.partialCount') }}</b-card-text>
          <h3 class="mb-0 text-warning">{{ summary.partial_count || 0 }}</h3>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card class="text-center border-danger">
          <b-card-text class="text-muted small mb-0">{{ $t('financial.unpaidCount') }}</b-card-text>
          <h3 class="mb-0 text-danger">{{ summary.unpaid_count || 0 }}</h3>
        </b-card>
      </b-col>
    </b-row>

    <!-- Financials Table -->
    <b-card>
      <b-row class="mb-2">
        <b-col cols="12" md="4">
          <h4>{{ $t('financial.myFinancials') }}</h4>
        </b-col>
      </b-row>

      <b-form @submit.prevent="applyFilters" class="mb-2">
        <b-row>
          <b-col cols="12" md="3" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.search" :placeholder="$t('financial.searchByClient')" />
          </b-col>
          <b-col cols="6" md="2" class="mb-1 mb-md-0">
            <b-form-select v-model="filters.payment_status" :options="paymentStatusOptions" />
          </b-col>
          <b-col cols="6" md="2" class="mb-1 mb-md-0">
            <b-form-select v-model="filters.payment_method" :options="paymentMethodOptions" />
          </b-col>
          <b-col cols="6" md="3" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.date" type="date" />
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
        :items="financials"
        :fields="fields"
        responsive
        striped
        hover
        :busy="loading"
        show-empty
      >
        <template #cell(amount)="data">
          <strong>{{ formatCurrency(data.value) }}</strong>
        </template>
        <template #cell(paid)="data">
          <span class="text-success">{{ formatCurrency(data.value) }}</span>
        </template>
        <template #cell(remaining)="data">
          <span :class="parseFloat(data.value) > 0 ? 'text-danger' : 'text-success'">
            {{ formatCurrency(data.value) }}
          </span>
        </template>
        <template #cell(payment_status)="data">
          <b-badge :variant="getStatusVariant(data.value)">
            {{ $t('financial.' + data.value) }}
          </b-badge>
        </template>
        <template #cell(payment_method)="data">
          {{ $t('financial.' + data.value) }}
        </template>
        <template #cell(actions)="data">
          <b-button variant="info" size="sm" @click="viewFinancial(data.item)">
            <feather-icon icon="EyeIcon" />
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

    <!-- View Modal -->
    <b-modal
      v-model="viewModalShow"
      :title="$t('financial.financialDetails')"
      ok-only
      size="lg"
    >
      <div v-if="selectedFinancial">
        <b-row>
          <b-col md="6">
            <p v-if="selectedFinancial.client">
              <strong>{{ $t('table.client') }}:</strong> {{ selectedFinancial.client.name }}
            </p>
            <p v-if="selectedFinancial.reservation">
              <strong>{{ $t('reservation.appointment') }}:</strong> {{ formatDateTime(selectedFinancial.reservation.appointment_date) }}
            </p>
            <p>
              <strong>{{ $t('financial.paymentMethod') }}:</strong> {{ $t('financial.' + selectedFinancial.payment_method) }}
            </p>
          </b-col>
          <b-col md="6">
            <p><strong>{{ $t('financial.amount') }}:</strong> {{ formatCurrency(selectedFinancial.amount) }}</p>
            <p><strong>{{ $t('financial.paid') }}:</strong> <span class="text-success">{{ formatCurrency(selectedFinancial.paid) }}</span></p>
            <p><strong>{{ $t('financial.remaining') }}:</strong>
              <span :class="parseFloat(selectedFinancial.remaining) > 0 ? 'text-danger' : 'text-success'">
                {{ formatCurrency(selectedFinancial.remaining) }}
              </span>
            </p>
            <p><strong>{{ $t('financial.paymentStatus') }}:</strong>
              <b-badge :variant="getStatusVariant(selectedFinancial.payment_status)">
                {{ $t('financial.' + selectedFinancial.payment_status) }}
              </b-badge>
            </p>
          </b-col>
        </b-row>
        <hr>
        <p><strong>{{ $t('reservation.notes') }}:</strong></p>
        <p>{{ selectedFinancial.notes || $t('reservation.na') }}</p>
        <p v-if="selectedFinancial.creator">
          <strong>{{ $t('financial.createdBy') }}:</strong> {{ selectedFinancial.creator.name }}
        </p>
        <p><strong>{{ $t('reservation.created') }}:</strong> {{ formatDateTime(selectedFinancial.created_at) }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BCardText,
  BRow,
  BCol,
  BButton,
  BTable,
  BPagination,
  BModal,
  BForm,
  BFormInput,
  BFormSelect,
  BSpinner,
  BBadge,
} from 'bootstrap-vue'
import financialsService from '@/services/financials'

export default {
  components: {
    BCard,
    BCardText,
    BRow,
    BCol,
    BButton,
    BTable,
    BPagination,
    BModal,
    BForm,
    BFormInput,
    BFormSelect,
    BSpinner,
    BBadge,
  },
  data() {
    return {
      financials: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      },
      summary: {
        total_amount: 0,
        total_paid: 0,
        total_remaining: 0,
        total_records: 0,
      },
      loading: false,
      viewModalShow: false,
      selectedFinancial: null,
      filters: {
        search: '',
        payment_status: '',
        payment_method: '',
        date: '',
      },
    }
  },
  watch: {
    '$store.state.broadcast.eventCounter'() {
      this.fetchFinancials()
      this.fetchSummary()
    },
  },
  mounted() {
    this.fetchFinancials()
    this.fetchSummary()
  },
  computed: {
    fields() {
      return [
        { key: 'client.name', label: this.$t('table.client'), sortable: true },
        { key: 'reservation.appointment_date', label: this.$t('reservation.appointment'), formatter: this.formatDateTime, sortable: true },
        { key: 'amount', label: this.$t('financial.amount'), sortable: true },
        { key: 'paid', label: this.$t('financial.paid'), sortable: true },
        { key: 'remaining', label: this.$t('financial.remaining'), sortable: true },
        { key: 'payment_status', label: this.$t('financial.paymentStatus'), sortable: true },
        { key: 'payment_method', label: this.$t('financial.paymentMethod'), sortable: true },
        { key: 'actions', label: this.$t('table.actions') },
      ]
    },
    paymentStatusOptions() {
      return [
        { value: '', text: this.$t('filters.all') },
        { value: 'unpaid', text: this.$t('financial.unpaid') },
        { value: 'partial', text: this.$t('financial.partial') },
        { value: 'paid', text: this.$t('financial.paid') },
      ]
    },
    paymentMethodOptions() {
      return [
        { value: '', text: this.$t('filters.all') },
        { value: 'cash', text: this.$t('financial.cash') },
        { value: 'card', text: this.$t('financial.card') },
        { value: 'transfer', text: this.$t('financial.transfer') },
        { value: 'other', text: this.$t('financial.other') },
      ]
    },
  },
  methods: {
    async fetchFinancials() {
      this.loading = true
      try {
        const params = { page: this.pagination.current_page }
        if (this.filters.search) params.search = this.filters.search
        if (this.filters.payment_status) params.payment_status = this.filters.payment_status
        if (this.filters.payment_method) params.payment_method = this.filters.payment_method
        if (this.filters.date) {
          params.date_from = this.filters.date
          params.date_to = this.filters.date
        }
        const response = await financialsService.getFinancials(params)
        this.financials = response.data.data
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
        }
      } catch (error) {
        this.$toast({
          component: 'ToastificationContent',
          props: { title: this.$t('messages.error'), text: this.$t('financial.loadError'), variant: 'danger' },
        })
      } finally {
        this.loading = false
      }
    },
    async fetchSummary() {
      try {
        const params = {}
        if (this.filters.date) {
          params.date_from = this.filters.date
          params.date_to = this.filters.date
        }
        const response = await financialsService.getSummary(params)
        this.summary = response.data
      } catch (e) {
        // silent
      }
    },
    applyFilters() {
      this.pagination.current_page = 1
      this.fetchFinancials()
      this.fetchSummary()
    },
    resetFilters() {
      this.filters = { search: '', payment_status: '', payment_method: '', date: '' }
      this.pagination.current_page = 1
      this.fetchFinancials()
      this.fetchSummary()
    },
    onPageChange(page) {
      this.pagination.current_page = page
      this.fetchFinancials()
    },
    viewFinancial(item) {
      this.selectedFinancial = item
      this.viewModalShow = true
    },
    getStatusVariant(status) {
      const map = { paid: 'success', partial: 'warning', unpaid: 'danger' }
      return map[status] || 'secondary'
    },
    formatDateTime(value) {
      if (!value) return ''
      return new Date(value).toLocaleString()
    },
    formatCurrency(value) {
      return parseFloat(value || 0).toFixed(2)
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
