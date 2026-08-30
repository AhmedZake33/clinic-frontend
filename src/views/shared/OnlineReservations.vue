<template>
  <b-card :dir="isArabic ? 'rtl' : 'ltr'">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h4 class="mb-0">
        {{ t('title') }}
      </h4>
      <b-button
        variant="outline-primary"
        size="sm"
        @click="fetchReservations"
      >
        {{ t('refresh') }}
      </b-button>
    </div>

    <b-table
      :items="reservations"
      :fields="fields"
      :busy="loading"
      responsive
      striped
      hover
      show-empty
      :empty-text="t('empty')"
    >
      <template #cell(client)="data">
        <div><strong>{{ data.item.client && data.item.client.name }}</strong></div>
        <small class="text-muted">{{ data.item.client && data.item.client.phone }}</small>
      </template>
      <template #cell(doctor)="data">
        {{ data.item.doctor && data.item.doctor.name }}
      </template>
      <template #cell(appointment_date)="data">
        {{ formatDateTime(data.value) }}
      </template>
      <template #cell(status)="data">
        <b-badge :variant="statusVariant(data.value)">
          {{ statusLabel(data.value) }}
        </b-badge>
      </template>
      <template #cell(client_status)="data">
        <b-badge :variant="data.item.online_booking_existing_client ? 'success' : 'primary'">
          {{ data.item.online_booking_existing_client ? t('existingClient') : t('newClient') }}
        </b-badge>
      </template>
      <template #cell(actions)="data">
        <responsive-table-actions>
          <b-button
            v-if="data.item.status === 'pending'"
            size="sm"
            variant="success"
            class="mr-50"
            @click="confirmReservation(data.item)"
          >
            {{ t('confirm') }}
          </b-button>
          <b-button
            v-if="data.item.status !== 'cancelled' && data.item.status !== 'completed'"
            size="sm"
            variant="danger"
            @click="cancelReservation(data.item)"
          >
            {{ t('cancel') }}
          </b-button>
        </responsive-table-actions>
      </template>
    </b-table>

    <b-pagination
      v-model="pagination.current_page"
      :total-rows="pagination.total"
      :per-page="pagination.per_page"
      align="center"
      @change="fetchReservations"
    />
  </b-card>
</template>

<script>
import {
  BBadge, BButton, BCard, BPagination, BTable,
} from 'bootstrap-vue'
import onlineBooking from '@/services/onlineBooking'
import reservationsService from '@/services/reservations'
import ResponsiveTableActions from '@/components/ResponsiveTableActions.vue'

const translations = {
  en: {
    title: 'Online booking requests',
    refresh: 'Refresh',
    client: 'Client',
    doctor: 'Doctor',
    appointment: 'Appointment',
    clientStatus: 'Client Status',
    status: 'Status',
    notes: 'Notes',
    actions: 'Actions',
    existingClient: 'Existing client',
    newClient: 'New client',
    confirm: 'Confirm',
    cancel: 'Cancel',
    empty: 'There are no online booking requests',
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },
  ar: {
    title: 'طلبات الحجز الأونلاين',
    refresh: 'تحديث',
    client: 'العميل',
    doctor: 'الطبيب',
    appointment: 'الموعد',
    clientStatus: 'حالة العميل',
    status: 'الحالة',
    notes: 'ملاحظات',
    actions: 'الإجراءات',
    existingClient: 'عميل موجود',
    newClient: 'عميل جديد',
    confirm: 'موافقة',
    cancel: 'إلغاء',
    empty: 'لا توجد طلبات حجز أونلاين',
    pending: 'قيد الانتظار',
    confirmed: 'تم التأكيد',
    completed: 'مكتمل',
    cancelled: 'ملغي',
  },
}

export default {
  components: {
    BBadge, BButton, BCard, BPagination, BTable, ResponsiveTableActions,
  },
  data() {
    return {
      loading: false,
      reservations: [],
      pagination: { current_page: 1, total: 0, per_page: 15 },
    }
  },
  computed: {
    isArabic() {
      return this.locale === 'ar'
    },
    locale() {
      return this.$i18n && this.$i18n.locale === 'ar' ? 'ar' : 'en'
    },
    fields() {
      return [
        { key: 'client', label: this.t('client') },
        { key: 'doctor', label: this.t('doctor') },
        { key: 'appointment_date', label: this.t('appointment') },
        { key: 'client_status', label: this.t('clientStatus') },
        { key: 'status', label: this.t('status') },
        { key: 'notes', label: this.t('notes') },
        { key: 'actions', label: this.t('actions') },
      ]
    },
  },
  mounted() {
    this.fetchReservations()
  },
  methods: {
    t(key) {
      return translations[this.locale]?.[key] || translations.en[key] || key
    },
    async fetchReservations(page = this.pagination.current_page) {
      this.loading = true
      try {
        const { data } = await onlineBooking.getOnlineReservations({ page })
        this.reservations = data.data || []
        this.pagination = {
          current_page: data.current_page || 1,
          total: data.total || 0,
          per_page: data.per_page || 15,
        }
      } finally {
        this.loading = false
      }
    },
    async confirmReservation(reservation) {
      await reservationsService.confirmReservation(reservation.id)
      await this.fetchReservations()
    },
    async cancelReservation(reservation) {
      await reservationsService.updateReservation(reservation.id, {
        client_id: reservation.client_id,
        doctor_id: reservation.doctor_id,
        appointment_date: reservation.appointment_date,
        status: 'cancelled',
        notes: reservation.notes,
      })
      await this.fetchReservations()
    },
    formatDateTime(value) {
      return value ? new Date(value).toLocaleString(this.locale === 'ar' ? 'ar-EG' : 'en-US') : ''
    },
    statusLabel(status) {
      return this.t(status)
    },
    statusVariant(status) {
      return {
        pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'danger',
      }[status] || 'secondary'
    },
  },
}
</script>
