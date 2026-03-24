<template>
  <div>
    <b-card class="mb-2">
      <b-row>
        <b-col cols="12" md="8">
          <h4 class="mb-1">{{ $t('client.clientDetails') }}</h4>
          <p class="mb-0"><strong>{{ $t('client.name') }}:</strong> {{ client.name }}</p>
          <p class="mb-0"><strong>{{ $t('clinic.email') }}:</strong> {{ client.email }}</p>
          <p class="mb-0"><strong>{{ $t('client.phone') }}:</strong> {{ client.phone }}</p>
          <p class="mb-0"><strong>{{ $t('client.dateOfBirth') }}:</strong> {{ client.date_of_birth ? formatDate(client.date_of_birth) : $t('reservation.na') }}</p>
          <p class="mb-0"><strong>{{ $t('client.height') }}:</strong> {{ client.height ? client.height + ' cm' : $t('reservation.na') }}</p>
          <p class="mb-0"><strong>{{ $t('client.weight') }}:</strong> {{ client.weight ? client.weight + ' kg' : $t('reservation.na') }}</p>
          <p class="mb-0"><strong>{{ $t('client.address') }}:</strong> {{ client.address || $t('reservation.na') }}</p>
          <p class="mb-0"><strong>{{ $t('client.medicalHistory') }}:</strong> {{ client.medical_history || $t('reservation.na') }}</p>
        </b-col>
        <b-col cols="12" md="4" class="text-right">
          <b-button variant="outline-secondary" @click="$router.push({ name: 'assistant-clients' })">
            <feather-icon icon="ChevronLeftIcon" class="mr-50 icon-directional" />
            {{ $t('navigation.patients') }}
          </b-button>
        </b-col>
      </b-row>
    </b-card>

    <b-card>
      <div class="d-flex justify-content-between align-items-center mb-1">
        <h4 class="mb-0">{{ $t('reservation.medicalHistory') }}</h4>
        <b-badge variant="primary" pill>
          {{ (client.reservations || []).length }}
        </b-badge>
      </div>

      <b-table
        :items="client.reservations"
        :fields="fields"
        responsive
        striped
        hover
        show-empty
      >
        <template #cell(appointment_date)="{ item }">
          {{ formatDateTime(item.appointment_date) }}
        </template>

        <template #cell(doctor)="{ item }">
          {{ getDoctorName(item) }}
        </template>

        <template #cell(status)="{ item }">
          <b-badge :variant="getStatusVariant(item.status)">{{ item.status }}</b-badge>
        </template>

        <template #cell(actions)="{ item }">
          <b-button size="sm" variant="info" @click="viewReservation(item)">
            <feather-icon icon="EyeIcon" />
          </b-button>
        </template>

        <template #empty>
          <div class="text-center py-2">{{ $t('messages.noData') }}</div>
        </template>
      </b-table>
    </b-card>

    <!-- Reservation Details Modal -->
    <b-modal v-model="reservationModal" :title="$t('reservation.reservationDetails')" ok-only size="lg">
      <div v-if="selectedReservation">
        <b-row>
          <b-col cols="12" md="6">
            <p><strong>{{ $t('reservation.appointment') }}:</strong> {{ formatDateTime(selectedReservation.appointment_date) }}</p>
            <p><strong>{{ $t('reservation.status') }}:</strong> {{ selectedReservation.status }}</p>
            <p><strong>{{ $t('reservation.notes') }}:</strong> {{ selectedReservation.notes || $t('reservation.na') }}</p>
          </b-col>
          <b-col cols="12" md="6">
            <p><strong>{{ $t('reservation.diagnosis') }}:</strong> {{ selectedReservation.diagnosis || $t('reservation.na') }}</p>
            <p><strong>{{ $t('reservation.treatment') }}:</strong> {{ selectedReservation.treatment || $t('reservation.na') }}</p>
            <p><strong>{{ $t('reservation.completedAt') }}:</strong> {{ formatDateTime(selectedReservation.completed_at) || $t('reservation.na') }}</p>
          </b-col>
        </b-row>
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
  BBadge,
  BTable,
  BModal,
} from 'bootstrap-vue'
import clientsService from '@/services/clients'

export default {
  components: { BCard, BRow, BCol, BButton, BBadge, BTable, BModal },
  data() {
    return {
      client: {},
      fields: [
        { key: 'appointment_date', label: this.$t('reservation.appointmentDate') },
        { key: 'doctor', label: this.$t('reservation.doctor') },
        { key: 'status', label: this.$t('reservation.status') },
        { key: 'diagnosis', label: this.$t('reservation.diagnosis') },
        { key: 'treatment', label: this.$t('reservation.treatment') },
        { key: 'actions', label: this.$t('table.actions') },
      ],
      reservationModal: false,
      selectedReservation: null,
    }
  },
  mounted() {
    this.fetchClient()
  },
  methods: {
    async fetchClient() {
      const id = this.$route.params.id
      try {
        const { data } = await clientsService.getClient(id)
        this.client = data
      } catch (error) {
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.error'),
            text: this.$t('messages.loadError'),
            variant: 'danger',
          },
        })
      }
    },
    getDoctorName(item) {
      if (!item || !item.doctor || !item.doctor.name) {
        return this.$t('reservation.na')
      }
      return item.doctor.name
    },
    formatDate(value) {
      if (!value) return null
      return new Date(value).toLocaleDateString()
    },
    formatDateTime(value) {
      if (!value) return null
      const d = new Date(value)
      return d.toLocaleString()
    },
    getStatusVariant(status) {
      switch (status) {
        case 'completed': return 'success'
        case 'cancelled': return 'danger'
        case 'confirmed': return 'primary'
        default: return 'warning'
      }
    },
    viewReservation(item) {
      this.selectedReservation = item
      this.reservationModal = true
    },
  },
}
</script>

<style scoped>
.icon-directional {
  display: inline-block;
}
</style>


