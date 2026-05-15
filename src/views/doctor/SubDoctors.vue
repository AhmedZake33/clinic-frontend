<template>
  <div>
    <b-card>
      <b-card-header>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t('subDoctors.title') }}</h4>
            <small v-if="maxAllowed > 0" class="text-muted">
              {{ $t('subDoctors.usage', { current: subs.length, max: maxAllowed }) }}
            </small>
            <small v-else class="text-danger">
              {{ $t('subDoctors.notAllowed') }}
            </small>
          </div>
          <b-button variant="primary" :disabled="maxAllowed <= 0 || subs.length >= maxAllowed" @click="openAdd">
            <feather-icon icon="PlusIcon" class="mr-50" />
            {{ $t('subDoctors.add') }}
          </b-button>
        </div>
      </b-card-header>

      <b-table :items="subs" :fields="fields" :busy="loading" responsive>
        <template #cell(permissions)="data">
          <div class="small text-muted">
            <div v-for="p in data.item.permissions" :key="p">{{ p }}</div>
          </div>
        </template>

        <template #cell(actions)="data">
          <b-button size="sm" variant="flat-primary" class="mr-25" @click="edit(data.item)">
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button size="sm" variant="flat-danger" @click="remove(data.item)">
            <feather-icon icon="TrashIcon" />
          </b-button>
        </template>
      </b-table>
    </b-card>

    <b-modal v-model="showModal" :title="isEditing ? $t('subDoctors.edit') : $t('subDoctors.add')" @hidden="reset">
      <b-form @submit.prevent="save">
        <b-form-group :label="$t('services.name')">
          <b-form-input v-model="form.name" required />
        </b-form-group>
        <b-form-group :label="$t('services.nameEn')">
          <b-form-input v-model="form.name_en" />
        </b-form-group>
        <b-form-group :label="$t('subDoctors.email')">
          <b-form-input v-model="form.email" type="email" :required="!isEditing" />
        </b-form-group>
        <b-form-group :label="$t('subDoctors.password')">
          <b-form-input v-model="form.password" type="password" :required="!isEditing" />
        </b-form-group>
      </b-form>

      <template #modal-footer>
        <b-button variant="secondary" @click="showModal = false">{{ $t('actions.cancel') }}</b-button>
        <b-button variant="primary" @click="save">{{ isEditing ? $t('actions.save') : $t('actions.add') }}</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import subDoctorsApi from '@/services/subDoctors'

export default {
  data() {
    return {
      subs: [],
      maxAllowed: 0,
      loading: false,
      showModal: false,
      isEditing: false,
      selected: null,
      form: { name: '', email: '', password: '' },
    }
  },
  computed: {
    fields() {
      return [
        { key: 'name', label: this.$t('services.name') },
        { key: 'email', label: this.$t('subDoctors.email') },
        { key: 'actions', label: this.$t('table.actions') },
      ]
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.loading = true
      try {
        const { data } = await subDoctorsApi.getAll()
        this.subs = data.sub_doctors || data
        this.maxAllowed = data.max_sub_doctors ?? 0
      } finally { this.loading = false }
    },
    openAdd() { this.reset(); this.showModal = true },
    edit(item) { this.selected = item; this.isEditing = true; this.form = { name: item.name, email: item.email, password: '' }; this.showModal = true },
    async save() {
      try {
        if (this.isEditing) {
          await subDoctorsApi.update(this.selected.id, this.form)
          this.$toast(this.$t('messages.updateSuccess'))
        } else {
          const { data } = await subDoctorsApi.create(this.form)
          // show generated or provided password so doctor can share it
          if (data.plain_password) {
            this.$toast({ title: this.$t('messages.success'), text: this.$t('subDoctors.createdWithPassword', { password: data.plain_password }), variant: 'success' })
          } else {
            this.$toast(this.$t('messages.addSuccess'))
          }
        }
        this.showModal = false
        this.fetch()
      } catch (e) {
        const msg = e.response?.data?.message || this.$t('messages.saveError')
        this.$swal({ title: this.$t('messages.error'), text: msg, icon: 'error' })
      }
    },
    async remove(item) {
      if (!confirm(this.$t('actions.confirm'))) return
      await subDoctorsApi.delete(item.id)
      this.fetch()
    },
    reset() { this.isEditing = false; this.selected = null; this.form = { name: '', email: '', permissions: [] } }
  }
}
</script>
