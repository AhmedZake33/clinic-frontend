<template>
  <div>
    <b-card :title="$t('notifications.settingsTitle')">
      <div v-if="loading" class="text-center py-3">
        <b-spinner variant="primary" />
      </div>

      <b-form v-else @submit.prevent="saveSettings">
        <!-- SMS Section -->
        <b-card class="border mb-2" no-body>
          <b-card-header class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ $t('notifications.sms') }}</h5>
            <b-form-checkbox v-model="settings.sms_enabled" switch />
          </b-card-header>
          <b-card-body v-if="settings.sms_enabled">
            <b-form-group :label="$t('notifications.smsTemplate')" :description="$t('notifications.templatePlaceholders')">
              <b-form-textarea
                v-model="settings.sms_template"
                rows="3"
                :placeholder="defaultTemplate"
                dir="rtl"
              />
            </b-form-group>
            <b-button variant="outline-info" size="sm" @click="showTestModal('sms')">
              <feather-icon icon="SendIcon" class="mr-50" />
              {{ $t('notifications.sendTest') }}
            </b-button>
          </b-card-body>
        </b-card>

        <!-- WhatsApp Section -->
        <b-card class="border mb-2" no-body>
          <b-card-header class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ $t('notifications.whatsapp') }}</h5>
            <b-form-checkbox v-model="settings.whatsapp_enabled" switch />
          </b-card-header>
          <b-card-body v-if="settings.whatsapp_enabled">
            <b-form-group :label="$t('notifications.whatsappTemplate')" :description="$t('notifications.whatsappTemplateDesc')">
              <b-form-input v-model="settings.whatsapp_template_name" placeholder="HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
            </b-form-group>
            <b-button variant="outline-success" size="sm" @click="showTestModal('whatsapp')">
              <feather-icon icon="SendIcon" class="mr-50" />
              {{ $t('notifications.sendTest') }}
            </b-button>
          </b-card-body>
        </b-card>

        <!-- Reminder Timing Info -->
        <b-card class="border mb-2">
          <div class="d-flex align-items-center">
            <feather-icon icon="ClockIcon" size="20" class="mr-1 text-primary" />
            <span>{{ $t('notifications.reminderTiming') }}: <strong>{{ $t('notifications.24hoursBefore') }}</strong></span>
          </div>
        </b-card>

        <b-button type="submit" variant="primary" :disabled="saving">
          <b-spinner v-if="saving" small class="mr-50" />
          {{ $t('actions.save') }}
        </b-button>
      </b-form>
    </b-card>

    <!-- Test Modal -->
    <b-modal v-model="testModal" :title="$t('notifications.sendTest')" @ok="sendTest">
      <b-form-group :label="$t('client.phone')">
        <b-form-input v-model="testPhone" type="tel" :placeholder="$t('notifications.enterPhone')" />
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BCardHeader,
  BCardBody,
  BForm,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BFormCheckbox,
  BButton,
  BSpinner,
  BModal,
} from 'bootstrap-vue'
import notificationsService from '@/services/notifications'

export default {
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BFormCheckbox,
    BButton,
    BSpinner,
    BModal,
  },
  data() {
    return {
      loading: true,
      saving: false,
      settings: {
        sms_enabled: false,
        whatsapp_enabled: false,
        sms_template: '',
        whatsapp_template_name: 'appointment_reminder',
      },
      defaultTemplate: 'مرحباً {client_name}، نذكرك بموعدك غداً في عيادة د. {doctor_name} الساعة {time}. للإلغاء أو التعديل يرجى التواصل معنا.',
      testModal: false,
      testChannel: '',
      testPhone: '',
    }
  },
  mounted() {
    this.fetchSettings()
  },
  methods: {
    async fetchSettings() {
      this.loading = true
      try {
        const { data } = await notificationsService.getSettings()
        this.settings = data
      } catch {
        this.$toast({
          component: 'ToastificationContent',
          props: { title: this.$t('messages.error'), text: this.$t('messages.loadError'), variant: 'danger' },
        })
      } finally {
        this.loading = false
      }
    },
    async saveSettings() {
      this.saving = true
      try {
        const { data } = await notificationsService.updateSettings({
          sms_enabled: this.settings.sms_enabled,
          whatsapp_enabled: this.settings.whatsapp_enabled,
          sms_template: this.settings.sms_template,
          whatsapp_template_name: this.settings.whatsapp_template_name,
        })
        this.settings = data
        this.$toast({
          component: 'ToastificationContent',
          props: { title: this.$t('messages.success'), text: this.$t('messages.saveSuccess'), variant: 'success' },
        })
      } catch {
        this.$toast({
          component: 'ToastificationContent',
          props: { title: this.$t('messages.error'), text: this.$t('messages.saveError'), variant: 'danger' },
        })
      } finally {
        this.saving = false
      }
    },
    showTestModal(channel) {
      this.testChannel = channel
      this.testPhone = ''
      this.testModal = true
    },
    async sendTest() {
      if (!this.testPhone) return
      try {
        const fn = this.testChannel === 'sms'
          ? notificationsService.testSms
          : notificationsService.testWhatsapp
        const { data } = await fn(this.testPhone)
        if (data.success) {
          this.$toast({
            component: 'ToastificationContent',
            props: { title: this.$t('messages.success'), text: this.$t('notifications.testSent'), variant: 'success' },
          })
        } else {
          this.$toast({
            component: 'ToastificationContent',
            props: { title: this.$t('messages.error'), text: data.error || this.$t('notifications.testFailed'), variant: 'danger' },
          })
        }
      } catch {
        this.$toast({
          component: 'ToastificationContent',
          props: { title: this.$t('messages.error'), text: this.$t('notifications.testFailed'), variant: 'danger' },
        })
      }
    },
  },
}
</script>
