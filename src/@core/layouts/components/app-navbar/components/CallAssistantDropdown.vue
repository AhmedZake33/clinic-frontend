<template>
  <b-nav-item-dropdown
    v-if="isDoctor"
    :right="!isRTL"
    toggle-class="d-flex align-items-center"
    menu-class="call-assistant-dropdown-menu"
    no-caret
  >
    <!-- Toggle Button -->
    <template #button-content>
      <div class="position-relative">
        <feather-icon
          icon="PhoneCallIcon"
          size="21"
          :class="activeCalls.length > 0 ? 'text-danger' : ''"
        />
        <b-badge
          v-if="activeCalls.length > 0"
          pill
          variant="danger"
          class="badge-up"
          style="font-size: 0.7rem;"
        >
          {{ activeCalls.length }}
        </b-badge>
      </div>
    </template>

    <!-- Dropdown Header -->
    <li class="dropdown-menu-header">
      <div class="dropdown-header d-flex align-items-center py-75 px-2">
        <h6 class="font-weight-bolder mb-0 mr-auto">
          {{ $t('assistantCall.callAssistant') }}
        </h6>
      </div>
    </li>

    <!-- Call Form -->
    <li class="px-2 py-75">
      <div class="d-flex align-items-center">
        <b-form-select
          v-model="selectedAssistantId"
          :options="assistantOptions"
          size="sm"
          class="flex-grow-1"
          :class="isRTL ? 'ml-50' : 'mr-50'"
        />
        <b-button
          variant="danger"
          size="sm"
          :disabled="callLoading || !selectedAssistantId"
          class="text-nowrap"
          @click="callAssistant"
        >
          <b-spinner v-if="callLoading" small />
          <feather-icon v-else icon="PhoneCallIcon" size="14" />
        </b-button>
      </div>
    </li>

    <!-- Divider -->
    <li v-if="activeCalls.length > 0">
      <b-dropdown-divider />
    </li>

    <!-- Active Calls Header -->
    <li v-if="activeCalls.length > 0" class="px-2 py-50">
      <small class="text-muted font-weight-bold">{{ $t('assistantCall.activeCalls') }}</small>
    </li>

    <!-- Active Calls List -->
    <li
      v-for="call in activeCalls"
      :key="call.id"
      class="px-2 py-50"
    >
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center" style="min-width: 0;">
          <b-avatar
            size="32"
            variant="light-danger"
            :class="isRTL ? 'ml-50' : 'mr-50'"
          >
            <feather-icon icon="UserIcon" size="14" />
          </b-avatar>
          <div style="min-width: 0;">
            <p class="mb-0 font-weight-bold text-truncate" style="max-width: 120px;">
              {{ call.assistant ? call.assistant.name : '—' }}
            </p>
            <b-badge
              :variant="call.status === 'pending' ? 'light-warning' : 'light-info'"
              pill
              class="font-small-2"
            >
              {{ $t('assistantCall.' + call.status) }}
            </b-badge>
          </div>
        </div>
        <b-button
          v-if="call.status === 'accepted'"
          variant="flat-success"
          size="sm"
          class="btn-icon p-25"
          :title="$t('assistantCall.markDone')"
          @click.stop="markCallDone(call)"
        >
          <feather-icon icon="CheckCircleIcon" size="16" />
        </b-button>
      </div>
    </li>

    <!-- Empty state -->
    <li v-if="activeCalls.length === 0" class="px-2 py-75 text-center">
      <small class="text-muted">{{ $t('assistantCall.noActiveCalls') }}</small>
    </li>
  </b-nav-item-dropdown>
</template>

<script>
import {
  BNavItemDropdown,
  BBadge,
  BButton,
  BFormSelect,
  BAvatar,
  BSpinner,
  BDropdownDivider,
} from 'bootstrap-vue'
import assistantCallsService from '@/services/assistantCalls'
import assistantsService from '@/services/assistants'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BNavItemDropdown,
    BBadge,
    BButton,
    BFormSelect,
    BAvatar,
    BSpinner,
    BDropdownDivider,
  },
  data() {
    return {
      user: null,
      callLoading: false,
      activeCalls: [],
      selectedAssistantId: null,
      assistantsList: [],
    }
  },
  computed: {
    isDoctor() {
      return this.user && this.user.role === 'doctor'
    },
    isRTL() {
      return this.$store.getters['language/isRTL']
    },
    assistantOptions() {
      const placeholder = [{ value: null, text: this.$t('assistantCall.selectAssistant'), disabled: true }]
      const options = this.assistantsList.map(a => ({ value: a.id, text: a.name }))
      return placeholder.concat(options)
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null')
    if (this.isDoctor) {
      this.fetchAssistants()
      this.fetchActiveCalls()
      this.listenForCallEvents()
    }
  },
  beforeDestroy() {
    if (this._callChannel && this.user) {
      try {
        window.Echo.leave(`clinic.${this.user.id}.assistant-calls`)
      } catch (e) { /* ignore */ }
    }
  },
  methods: {
    async callAssistant() {
      if (!this.selectedAssistantId) return
      this.callLoading = true
      try {
        await assistantCallsService.createCall({ assistant_id: this.selectedAssistantId })
        this.$toast({
          component: ToastificationContent,
          props: { title: this.$t('assistantCall.callSent'), variant: 'success', icon: 'PhoneCallIcon' },
        })
        this.fetchActiveCalls()
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: { title: this.$t('assistantCall.callFailed'), variant: 'danger', icon: 'AlertTriangleIcon' },
        })
      } finally {
        this.callLoading = false
      }
    },
    async fetchAssistants() {
      try {
        const response = await assistantsService.getAssistants()
        this.assistantsList = response.data.data || response.data || []
      } catch (e) {
        console.error('Failed to fetch assistants', e)
      }
    },
    async fetchActiveCalls() {
      try {
        const response = await assistantCallsService.getActiveCalls()
        this.activeCalls = response.data || []
      } catch (e) {
        console.error('Failed to fetch active calls', e)
      }
    },
    async markCallDone(call) {
      try {
        await assistantCallsService.completeCall(call.id)
        this.$toast({
          component: ToastificationContent,
          props: { title: this.$t('assistantCall.callCompleted'), variant: 'success', icon: 'CheckCircleIcon' },
        })
        this.fetchActiveCalls()
      } catch (e) {
        console.error('Failed to complete call', e)
      }
    },
    listenForCallEvents() {
      if (!window.Echo || !this.user) return
      try {
        this._callChannel = window.Echo.private(`clinic.${this.user.id}.assistant-calls`)
          .listen('.assistant.call', data => {
            this.fetchActiveCalls()
            if (data.action === 'accepted') {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: this.$t('assistantCall.callAccepted'),
                  text: data.call?.assistant?.name || '',
                  variant: 'info',
                  icon: 'UserCheckIcon',
                },
              })
            }
          })
      } catch (e) {
        console.error('[WS] Failed to subscribe to assistant-call channel', e)
      }
    },
  },
}
</script>

<style>
.call-assistant-dropdown-menu {
  min-width: 280px;
}
.badge-up {
  position: absolute;
  top: -8px;
  right: -8px;
}
</style>
