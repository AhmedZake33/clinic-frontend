<template>
  <div>
    <b-card class="mb-2">
      <b-row>
        <b-col cols="12" md="8">
          <h4 class="mb-1">{{ $t('client.clientDetails') }}</h4>
          <p class="mb-0"><strong>{{ $t('client.name') }}:</strong> {{ client.name }}</p>
          <p class="mb-0"><strong>{{ $t('clinic.email') }}:</strong> {{ client.email }}</p>
          <p class="mb-0"><strong>{{ $t('client.phone') }}:</strong> {{ client.phone }}</p>
          <p class="mb-0"><strong>{{ $t('client.whatsappNumber') }}:</strong> {{ client.whatsapp_number || $t('reservation.na') }}</p>
          <p class="mb-0"><strong>{{ $t('client.dateOfBirth') }}:</strong> {{ client.date_of_birth ? formatDate(client.date_of_birth) : $t('reservation.na') }}</p>
          <p class="mb-0"><strong>{{ $t('client.age') }}:</strong> {{ calculateAge(client.date_of_birth) }}</p>
          <p class="mb-0"><strong>{{ $t('client.height') }}:</strong> {{ client.height ? client.height + ' cm' : $t('reservation.na') }}</p>
          <p class="mb-0"><strong>{{ $t('client.weight') }}:</strong> {{ client.weight ? client.weight + ' kg' : $t('reservation.na') }}</p>
          <p class="mb-0"><strong>{{ $t('client.address') }}:</strong> {{ client.address || $t('reservation.na') }}</p>
          <p class="mb-0"><strong>{{ $t('client.job') }}:</strong> {{ client.job || $t('reservation.na') }}</p>
          <p class="mb-0"><strong>{{ $t('client.chronicIllnesses') }}:</strong> {{ formatClientChronicIllnesses(client.chronic_illnesses) }}</p>
          <p class="mb-0"><strong>{{ $t('client.medicalHistory') }}:</strong> {{ client.medical_history || $t('reservation.na') }}</p>
        </b-col>
        <b-col cols="12" md="4" class="text-right">
          <b-button
            variant="warning"
            class="mb-1 d-block ml-auto"
            @click="openEditModal"
          >
            <feather-icon icon="EditIcon" class="mr-50" />
            {{ $t('actions.edit') }}
          </b-button>
          <b-button
            v-if="lastPrescriptionReservation"
            variant="primary"
            class="mb-1 d-block ml-auto"
            @click="printPrescription(lastPrescriptionReservation)"
          >
            <feather-icon icon="PrinterIcon" class="mr-50" />
            {{ $t('reservation.printLastPrescription') }}
          </b-button>
          <b-button variant="outline-secondary" @click="$router.push({ name: backRouteName })">
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
          <b-button size="sm" variant="info" class="mr-50" @click="viewReservation(item)">
            <feather-icon icon="EyeIcon" />
          </b-button>
          <b-button
            v-if="item.status === 'completed' && item.treatment"
            size="sm"
            variant="primary"
            @click="printPrescription(item)"
          >
            <feather-icon icon="PrinterIcon" />
          </b-button>
        </template>

        <template #empty>
          <div class="text-center py-2">{{ $t('messages.noData') }}</div>
        </template>
      </b-table>
    </b-card>

    <!-- Reservation Details Modal -->
    <b-modal v-model="reservationModal" :title="$t('reservation.reservationDetails')" size="lg">
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
      <template #modal-footer="{ ok }">
        <b-button
          v-if="selectedReservation && selectedReservation.status === 'completed' && selectedReservation.treatment"
          variant="primary"
          class="mr-1"
          @click="printPrescription(selectedReservation)"
        >
          <feather-icon icon="PrinterIcon" class="mr-50" />
          {{ $t('reservation.printPrescription') }}
        </b-button>
        <b-button variant="secondary" @click="ok()">
          {{ $t('actions.close') }}
        </b-button>
      </template>
    </b-modal>

    <b-modal
      v-model="editModalShow"
      :title="$t('actions.edit') + ' ' + $t('client.clientDetails')"
      hide-footer
      size="lg"
    >
      <b-form @submit.prevent="saveClient">
        <b-form-group :label="$t('client.name')" label-for="profile-client-name">
          <b-form-input id="profile-client-name" v-model="clientForm.name" required />
        </b-form-group>

        <b-form-group :label="$t('clinic.email')" label-for="profile-client-email">
          <b-form-input id="profile-client-email" v-model="clientForm.email" type="email" />
        </b-form-group>

        <b-form-group :label="$t('client.phone')" label-for="profile-client-phone">
          <b-form-input id="profile-client-phone" v-model="clientForm.phone" required />
        </b-form-group>

        <b-form-group :label="$t('client.whatsappNumber')" label-for="profile-client-whatsapp-number">
          <b-form-input id="profile-client-whatsapp-number" v-model="clientForm.whatsapp_number" :placeholder="$t('client.whatsappPlaceholder')" />
        </b-form-group>

        <b-form-group :label="$t('client.dateOfBirth')" label-for="profile-client-date-of-birth">
          <b-form-input id="profile-client-date-of-birth" v-model="clientForm.date_of_birth" type="date" />
        </b-form-group>

        <b-row>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('client.height')" label-for="profile-client-height">
              <b-form-input id="profile-client-height" v-model="clientForm.height" type="number" step="0.01" min="0" max="300" :placeholder="$t('client.heightPlaceholder')" />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group :label="$t('client.weight')" label-for="profile-client-weight">
              <b-form-input id="profile-client-weight" v-model="clientForm.weight" type="number" step="0.01" min="0" max="500" :placeholder="$t('client.weightPlaceholder')" />
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group :label="$t('client.address')" label-for="profile-client-address">
          <b-form-textarea id="profile-client-address" v-model="clientForm.address" rows="2" />
        </b-form-group>

        <b-form-group :label="$t('client.job')" label-for="profile-client-job">
          <b-form-input id="profile-client-job" v-model="clientForm.job" :placeholder="$t('client.jobPlaceholder')" />
        </b-form-group>

        <b-form-group :label="$t('client.medicalHistory')" label-for="profile-client-history">
          <b-form-textarea id="profile-client-history" v-model="clientForm.medical_history" rows="3" />
        </b-form-group>

        <b-form-group :label="$t('client.chronicIllnesses')" label-for="profile-client-chronic-illnesses">
          <b-form-checkbox-group
            id="profile-client-chronic-illnesses"
            v-model="clientForm.chronic_illnesses"
            :options="chronicIllnessOptions"
            stacked
          />
          <small class="text-muted d-block mt-50">{{ $t('client.selectChronicIllnesses') }}</small>
        </b-form-group>

        <div class="text-right">
          <b-button variant="secondary" class="mr-1" @click="editModalShow = false">
            {{ $t('actions.close') }}
          </b-button>
          <b-button type="submit" variant="primary" :disabled="savingClient">
            <b-spinner v-if="savingClient" small class="mr-1" />
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
  BBadge,
  BTable,
  BModal,
  BForm,
  BFormGroup,
  BFormCheckboxGroup,
  BFormInput,
  BFormTextarea,
  BSpinner,
} from 'bootstrap-vue'
import clientsService from '@/services/clients'
import reservationsService from '@/services/reservations'
import { buildChronicIllnessOptions, formatChronicIllnesses } from '@/utils/clientChronicIllnesses'
import { formatAgeFromBirthDate } from '@/utils/clientAge'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BButton,
    BBadge,
    BTable,
    BModal,
    BForm,
    BFormGroup,
    BFormCheckboxGroup,
    BFormInput,
    BFormTextarea,
    BSpinner,
  },
  computed: {
    lastPrescriptionReservation() {
      const reservations = this.client.reservations || []
      return reservations.find(r => r.status === 'completed' && r.treatment) || null
    },
    backRouteName() {
      return this.$route.name === 'doctor-client-profile' ? 'doctor-clients' : 'assistant-clients'
    },
    chronicIllnessOptions() {
      return buildChronicIllnessOptions(this.chronicIllnessOptionValues, key => this.$t(key))
    },
  },
  data() {
    return {
      client: {},
      clientForm: {
        name: '',
        email: '',
        phone: '',
        whatsapp_number: '',
        date_of_birth: '',
        height: '',
        weight: '',
        address: '',
        job: '',
        medical_history: '',
        chronic_illnesses: [],
      },
      chronicIllnessOptionValues: [],
      fields: [
        { key: 'appointment_date', label: this.$t('reservation.appointmentDate') },
        { key: 'doctor', label: this.$t('reservation.doctor') },
        { key: 'status', label: this.$t('reservation.status') },
        { key: 'diagnosis', label: this.$t('reservation.diagnosis') },
        { key: 'treatment', label: this.$t('reservation.treatment') },
        { key: 'actions', label: this.$t('table.actions') },
      ],
      editModalShow: false,
      savingClient: false,
      reservationModal: false,
      selectedReservation: null,
    }
  },
  mounted() {
    this.fetchClient()
    this.fetchClientOptions()
  },
  methods: {
    async fetchClientOptions() {
      try {
        const response = await clientsService.getClientOptions()
        this.chronicIllnessOptionValues = response.data.chronic_illnesses || []
      } catch (error) {
        this.chronicIllnessOptionValues = []
      }
    },
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
    openEditModal() {
      this.clientForm = {
        name: this.client.name || '',
        email: this.client.email || '',
        phone: this.client.phone || '',
        whatsapp_number: this.client.whatsapp_number || '',
        date_of_birth: this.client.date_of_birth ? this.client.date_of_birth.substring(0, 10) : '',
        height: this.client.height || '',
        weight: this.client.weight || '',
        address: this.client.address || '',
        job: this.client.job || '',
        medical_history: this.client.medical_history || '',
        chronic_illnesses: [...(this.client.chronic_illnesses || [])],
      }
      this.editModalShow = true
    },
    async saveClient() {
      this.savingClient = true
      try {
        const { data } = await clientsService.updateClient(this.client.id, this.clientForm)
        this.client = {
          ...this.client,
          ...data,
          reservations: this.client.reservations || [],
        }
        this.editModalShow = false
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.success'),
            text: this.$t('messages.updateSuccess'),
            variant: 'success',
          },
        })
      } catch (error) {
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.error'),
            text: error.response?.data?.message || this.$t('messages.saveError'),
            variant: 'danger',
          },
        })
      } finally {
        this.savingClient = false
      }
    },
    getDoctorName(item) {
      if (!item || !item.doctor || !item.doctor.name) {
        return this.$t('reservation.na')
      }
      return item.doctor.name
    },
    formatClientChronicIllnesses(values) {
      return formatChronicIllnesses(values, key => this.$t(key), this.$t('reservation.na'))
    },
    formatDate(value) {
      if (!value) return null
      return new Date(value).toLocaleDateString()
    },
    calculateAge(value) {
      return formatAgeFromBirthDate(value, key => this.$t(key), this.$t('reservation.na'))
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
    async printPrescription(reservation) {
      try {
        const response = await reservationsService.generatePrescription(reservation.id)
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
  },
}
</script>

<style scoped>
.icon-directional {
  display: inline-block;
}
</style>


