<template>
  <div>
    <b-card>
      <b-row class="mb-2">
        <b-col cols="12" md="4">
        </b-col>
        <b-col cols="12" md="8" class="text-end">
          <b-button variant="primary" @click="showAddModal">
            <feather-icon icon="PlusIcon" class="mr-50" />
            {{ $t('client.addClient') }}
          </b-button>
        </b-col>
      </b-row>

      <b-form @submit.prevent="applyFilters" class="mb-2">
        <b-row>
          <b-col cols="12" md="5" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.search" :placeholder="$t('client.searchPlaceholder')" />
          </b-col>
          <b-col cols="6" md="3" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.created_from" type="date" placeholder="From" />
          </b-col>
          <b-col cols="6" md="3" class="mb-1 mb-md-0">
            <b-form-input v-model="filters.created_to" type="date" placeholder="To" />
          </b-col>
          <b-col cols="12" md="1" class="text-right">
            <b-button type="submit" variant="primary" class="mr-1" :disabled="loading">
              {{ $t('client.filter') }}
            </b-button>
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col cols="12" class="text-right">
            <b-button variant="outline-secondary" size="sm" @click="resetFilters" :disabled="loading">
              {{ $t('client.reset') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>

      <b-table
        :items="clients"
        :fields="fields"
        responsive
        striped
        hover
        :busy="loading"
        show-empty
      >
        <template #cell(actions)="data">
          <b-button
            variant="info"
            size="sm"
            class="mr-1"
            @click="viewClient(data.item)"
          >
            <feather-icon icon="EyeIcon" />
          </b-button>
          <b-button
            variant="primary"
            size="sm"
            class="mr-1"
            @click="goToProfile(data.item.id)"
          >
            <feather-icon icon="UserIcon" class="mr-50" />
            Profile
          </b-button>
          <b-button
            variant="warning"
            size="sm"
            class="mr-1"
            @click="editClient(data.item)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button
            variant="danger"
            size="sm"
            @click="deleteClient(data.item.id)"
          >
            <feather-icon icon="TrashIcon" />
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

    <!-- Add/Edit Modal -->
    <b-modal
      v-model="modalShow"
      :title="editMode ? 'Edit Client' : 'Add New Client'"
      hide-footer
      size="lg"
    >
      <b-form @submit.prevent="saveClient">
        <b-form-group label="Name" label-for="name">
          <b-form-input
            id="name"
            v-model="form.name"
            required
            placeholder="Enter client name"
          />
        </b-form-group>

        <b-form-group label="Email" label-for="email">
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter email"
          />
        </b-form-group>

        <b-form-group label="Phone" label-for="phone">
          <b-form-input
            id="phone"
            v-model="form.phone"
            required
            placeholder="Enter phone number"
          />
        </b-form-group>

        <b-form-group label="Date of Birth" label-for="dob">
          <b-form-input
            id="dob"
            v-model="form.date_of_birth"
            type="date"
          />
        </b-form-group>

        <b-form-group label="Address" label-for="address">
          <b-form-textarea
            id="address"
            v-model="form.address"
            rows="2"
            placeholder="Enter address"
          />
        </b-form-group>

        <b-form-group label="Medical History" label-for="history">
          <b-form-textarea
            id="history"
            v-model="form.medical_history"
            rows="3"
            placeholder="Enter medical history"
          />
        </b-form-group>

        <div class="text-right">
          <b-button variant="secondary" class="mr-1" @click="modalShow = false">
            Cancel
          </b-button>
          <b-button type="submit" variant="primary" :disabled="saving">
            <b-spinner v-if="saving" small class="mr-1" />
            Save
          </b-button>
        </div>
      </b-form>
    </b-modal>

    <!-- View Modal -->
    <b-modal
      v-model="viewModalShow"
      title="Client Details"
      ok-only
      size="lg"
    >
      <div v-if="selectedClient">
        <b-row>
          <b-col md="6">
            <p><strong>Name:</strong> {{ selectedClient.name }}</p>
            <p><strong>Email:</strong> {{ selectedClient.email }}</p>
            <p><strong>Phone:</strong> {{ selectedClient.phone }}</p>
          </b-col>
          <b-col md="6">
            <p><strong>Date of Birth:</strong> {{ selectedClient.date_of_birth || 'N/A' }}</p>
            <p><strong>Created:</strong> {{ formatDate(selectedClient.created_at) }}</p>
          </b-col>
        </b-row>
        <hr>
        <p><strong>Address:</strong></p>
        <p>{{ selectedClient.address || 'N/A' }}</p>
        <p><strong>Medical History:</strong></p>
        <p>{{ selectedClient.medical_history || 'N/A' }}</p>
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
  BFormTextarea,
  BSpinner,
} from 'bootstrap-vue'
import clientsService from '@/services/clients'

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
    BSpinner,
  },
  data() {
    return {
      clients: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      },
      loading: false,
      modalShow: false,
      viewModalShow: false,
      editMode: false,
      saving: false,
      selectedClient: null,
      filters: {
        search: '',
        created_from: '',
        created_to: '',
      },
      form: {
        name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: '',
        medical_history: '',
      },
      fields: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Phone' },
        { key: 'created_at', label: 'Created', formatter: this.formatDate },
        { key: 'actions', label: 'Actions' },
      ],
    }
  },
  mounted() {
    this.fetchClients()
  },
  methods: {
    async fetchClients() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.current_page,
        }
        if (this.filters.search) params.search = this.filters.search
        if (this.filters.created_from) params.created_from = this.filters.created_from
        if (this.filters.created_to) params.created_to = this.filters.created_to
        const response = await clientsService.getClients(params)
        this.clients = response.data.data
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
            title: this.$t('messages.error'),
            text: this.$t('messages.loadError'),
            variant: 'danger',
          },
        })
      } finally {
        this.loading = false
      }
    },
    goToProfile(id) {
      this.$router.push({ name: 'assistant-client-profile', params: { id } })
    },
    applyFilters() {
      this.pagination.current_page = 1
      this.fetchClients()
    },
    resetFilters() {
      this.filters = { search: '', created_from: '', created_to: '' }
      this.pagination.current_page = 1
      this.fetchClients()
    },
    onPageChange(page) {
      this.pagination.current_page = page
      this.fetchClients()
    },
    showAddModal() {
      this.editMode = false
      this.form = {
        name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: '',
        medical_history: '',
      }
      this.modalShow = true
    },
    editClient(client) {
      this.editMode = true
      this.selectedClient = client
      this.form = { ...client }
      this.modalShow = true
    },
    viewClient(client) {
      this.selectedClient = client
      this.viewModalShow = true
    },
    async saveClient() {
      this.saving = true
      try {
        if (this.editMode) {
          await clientsService.updateClient(this.selectedClient.id, this.form)
          this.$toast({
            component: 'ToastificationContent',
            props: {
              title: this.$t('messages.success'),
              text: this.$t('messages.updateSuccess'),
              variant: 'success',
            },
          })
        } else {
          await clientsService.createClient(this.form)
          this.$toast({
            component: 'ToastificationContent',
            props: {
              title: this.$t('messages.success'),
              text: this.$t('messages.addSuccess'),
              variant: 'success',
            },
          })
        }
        this.modalShow = false
        this.fetchClients()
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
        this.saving = false
      }
    },
    async deleteClient(id) {
      if (!confirm(this.$t('messages.deleteConfirm'))) return

      try {
        await clientsService.deleteClient(id)
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.success'),
            text: this.$t('messages.deleteSuccess'),
            variant: 'success',
          },
        })
        this.fetchClients()
      } catch (error) {
        this.$toast({
          component: 'ToastificationContent',
          props: {
            title: this.$t('messages.error'),
            text: this.$t('messages.deleteError'),
            variant: 'danger',
          },
        })
      }
    },
    formatDate(value) {
      if (!value) return 'N/A'
      return new Date(value).toLocaleDateString()
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
