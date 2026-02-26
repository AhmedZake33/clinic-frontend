<template>
  <div>
    <b-card>
      <b-row class="mb-2">
        <b-col cols="12" md="6">
          <h4 class="mb-0">
            <feather-icon icon="UsersIcon" class="mr-50" />
            {{ $t('assistant.title') }}
          </h4>
        </b-col>
        <b-col cols="12" md="6" class="text-right">
          <b-button variant="primary" @click="showAddModal">
            <feather-icon icon="PlusIcon" class="mr-50" />
            {{ $t('assistant.addAssistant') }}
          </b-button>
        </b-col>
      </b-row>

      <b-table
        :items="assistants"
        :fields="fields"
        responsive
        striped
        hover
        :busy="loading"
        show-empty
      >
        <template #cell(created_at)="data">
          {{ formatDate(data.item.created_at) }}
        </template>

        <template #cell(actions)="data">
          <b-button
            variant="warning"
            size="sm"
            class="mr-1"
            @click="showEditModal(data.item)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button
            variant="danger"
            size="sm"
            @click="deleteAssistant(data.item)"
          >
            <feather-icon icon="TrashIcon" />
          </b-button>
        </template>

        <template #table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle" />
          </div>
        </template>

        <template #empty>
          <div class="text-center text-muted py-2">
            {{ $t('assistant.noAssistants') }}
          </div>
        </template>
      </b-table>
    </b-card>

    <!-- Add Modal -->
    <b-modal
      v-model="showAdd"
      :title="$t('assistant.addAssistant')"
      @ok.prevent="saveAssistant"
      :ok-title="$t('actions.save')"
      :cancel-title="$t('actions.cancel')"
    >
      <b-form @submit.prevent="saveAssistant">
        <b-form-group :label="$t('assistant.name')" label-for="add-name">
          <b-form-input id="add-name" v-model="form.name" required />
        </b-form-group>
        <b-form-group :label="$t('assistant.email')" label-for="add-email">
          <b-form-input id="add-email" v-model="form.email" type="email" required />
        </b-form-group>
        <b-form-group :label="$t('assistant.password')" label-for="add-password">
          <b-form-input id="add-password" v-model="form.password" type="password" required />
        </b-form-group>
        <b-form-group :label="$t('assistant.confirmPassword')" label-for="add-password-confirm">
          <b-form-input id="add-password-confirm" v-model="form.password_confirmation" type="password" required />
        </b-form-group>
      </b-form>
    </b-modal>

    <!-- Edit Modal -->
    <b-modal
      v-model="showEdit"
      :title="$t('assistant.editAssistant')"
      @ok.prevent="updateAssistant"
      :ok-title="$t('actions.save')"
      :cancel-title="$t('actions.cancel')"
    >
      <b-form @submit.prevent="updateAssistant">
        <b-form-group :label="$t('assistant.name')" label-for="edit-name">
          <b-form-input id="edit-name" v-model="editForm.name" required />
        </b-form-group>
        <b-form-group :label="$t('assistant.email')" label-for="edit-email">
          <b-form-input id="edit-email" v-model="editForm.email" type="email" required />
        </b-form-group>
        <b-form-group :label="$t('assistant.newPassword')" label-for="edit-password">
          <b-form-input id="edit-password" v-model="editForm.password" type="password" :placeholder="$t('assistant.leaveBlank')" />
        </b-form-group>
        <b-form-group :label="$t('assistant.confirmPassword')" label-for="edit-password-confirm">
          <b-form-input id="edit-password-confirm" v-model="editForm.password_confirmation" type="password" />
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard, BRow, BCol, BButton, BTable, BSpinner,
  BModal, BForm, BFormGroup, BFormInput,
} from 'bootstrap-vue'
import assistantsService from '@/services/assistants'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BCard, BRow, BCol, BButton, BTable, BSpinner,
    BModal, BForm, BFormGroup, BFormInput,
  },
  data() {
    return {
      loading: false,
      assistants: [],
      showAdd: false,
      showEdit: false,
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      editForm: {
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
    }
  },
  computed: {
    fields() {
      return [
        { key: 'name', label: this.$t('assistant.name'), sortable: true },
        { key: 'email', label: this.$t('assistant.email'), sortable: true },
        { key: 'created_at', label: this.$t('assistant.createdAt'), sortable: true },
        { key: 'actions', label: this.$t('assistant.actions') },
      ]
    },
  },
  mounted() {
    this.fetchAssistants()
  },
  methods: {
    async fetchAssistants() {
      this.loading = true
      try {
        const response = await assistantsService.getAssistants()
        this.assistants = response.data
      } catch (error) {
        this.assistants = []
      } finally {
        this.loading = false
      }
    },

    showAddModal() {
      this.form = { name: '', email: '', password: '', password_confirmation: '' }
      this.showAdd = true
    },

    async saveAssistant() {
      try {
        await assistantsService.createAssistant(this.form)
        this.showAdd = false
        this.fetchAssistants()
        this.$toast({
          component: ToastificationContent,
          props: { title: this.$t('assistant.created'), icon: 'CheckIcon', variant: 'success' },
        })
      } catch (error) {
        const msg = error.response?.data?.message || error.response?.data?.error || this.$t('assistant.createError')
        this.$toast({
          component: ToastificationContent,
          props: { title: msg, icon: 'AlertTriangleIcon', variant: 'danger' },
        })
      }
    },

    showEditModal(assistant) {
      this.editForm = {
        id: assistant.id,
        name: assistant.name,
        email: assistant.email,
        password: '',
        password_confirmation: '',
      }
      this.showEdit = true
    },

    async updateAssistant() {
      try {
        const data = { name: this.editForm.name, email: this.editForm.email }
        if (this.editForm.password) {
          data.password = this.editForm.password
          data.password_confirmation = this.editForm.password_confirmation
        }
        await assistantsService.updateAssistant(this.editForm.id, data)
        this.showEdit = false
        this.fetchAssistants()
        this.$toast({
          component: ToastificationContent,
          props: { title: this.$t('assistant.updated'), icon: 'CheckIcon', variant: 'success' },
        })
      } catch (error) {
        const msg = error.response?.data?.message || error.response?.data?.error || this.$t('assistant.updateError')
        this.$toast({
          component: ToastificationContent,
          props: { title: msg, icon: 'AlertTriangleIcon', variant: 'danger' },
        })
      }
    },

    async deleteAssistant(assistant) {
      const result = await this.$swal({
        title: this.$t('assistant.deleteConfirm'),
        text: this.$t('assistant.deleteText', { name: assistant.name }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('actions.delete'),
        cancelButtonText: this.$t('actions.cancel'),
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-secondary ml-1',
        },
        buttonsStyling: false,
      })

      if (result.isConfirmed) {
        try {
          await assistantsService.deleteAssistant(assistant.id)
          this.fetchAssistants()
          this.$toast({
            component: ToastificationContent,
            props: { title: this.$t('assistant.deleted'), icon: 'CheckIcon', variant: 'success' },
          })
        } catch (error) {
          this.$toast({
            component: ToastificationContent,
            props: { title: this.$t('assistant.deleteError'), icon: 'AlertTriangleIcon', variant: 'danger' },
          })
        }
      }
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString()
    },
  },
}
</script>
