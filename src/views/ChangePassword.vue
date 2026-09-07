<template>
  <div>
    <b-card :title="$t('auth.changePassword')">
      <b-alert
        v-if="error"
        variant="danger"
        show
      >
        {{ error }}
      </b-alert>
      <b-alert
        v-if="success"
        variant="success"
        show
      >
        {{ success }}
      </b-alert>

      <b-form @submit.prevent="handleSubmit">
        <b-row>
          <b-col
            cols="12"
            md="6"
          >
            <b-form-group
              :label="$t('auth.currentPassword')"
              label-for="current_password"
            >
              <app-password-input
                id="current_password"
                v-model="form.current_password"
                :placeholder="$t('auth.currentPassword')"
                required
              />
            </b-form-group>

            <b-form-group
              :label="$t('auth.newPassword')"
              label-for="new_password"
            >
              <div class="d-flex justify-content-between align-items-center mb-50">
                <span />
                <b-button
                  size="xs"
                  variant="flat-primary"
                  class="p-0 font-weight-bold"
                  type="button"
                  @click="fillGeneratedPassword"
                >
                  <feather-icon
                    icon="KeyIcon"
                    size="12"
                    class="mr-25 ml-25"
                  />
                  {{ $t('auth.generateStrongPassword') }}
                </b-button>
              </div>
              <app-password-input
                id="new_password"
                v-model="form.password"
                :placeholder="$t('auth.newPassword')"
                required
              />
              <small class="text-muted d-block mt-50">
                {{ $t('auth.strongPasswordHelp') }}
              </small>

              <!-- Real-time Strength Meter -->
              <div
                v-if="form.password"
                class="mt-1 p-1 bg-light rounded"
              >
                <div class="d-flex justify-content-between align-items-center mb-50 font-small-2">
                  <span>{{ $t('auth.passwordStrength') }}:</span>
                  <span
                    class="font-weight-bold"
                    :class="{
                      'text-danger': passwordStats.strengthLabel === 'weak',
                      'text-warning': passwordStats.strengthLabel === 'medium',
                      'text-success': passwordStats.strengthLabel === 'strong'
                    }"
                  >
                    {{ $t(`auth.${passwordStats.strengthLabel}`) }}
                  </span>
                </div>
                <div class="d-flex flex-wrap font-small-2">
                  <span
                    class="mr-1 ml-1 mb-25"
                    :class="passwordStats.hasMinLength ? 'text-success font-weight-bold' : 'text-muted'"
                  >
                    {{ passwordStats.hasMinLength ? '✓' : '○' }} 8+ Chars
                  </span>
                  <span
                    class="mr-1 ml-1 mb-25"
                    :class="(passwordStats.hasUpper && passwordStats.hasLower) ? 'text-success font-weight-bold' : 'text-muted'"
                  >
                    {{ (passwordStats.hasUpper && passwordStats.hasLower) ? '✓' : '○' }} A-Z & a-z
                  </span>
                  <span
                    class="mr-1 ml-1 mb-25"
                    :class="passwordStats.hasNumber ? 'text-success font-weight-bold' : 'text-muted'"
                  >
                    {{ passwordStats.hasNumber ? '✓' : '○' }} 0-9
                  </span>
                  <span
                    class="mr-1 ml-1 mb-25"
                    :class="passwordStats.hasSymbol ? 'text-success font-weight-bold' : 'text-muted'"
                  >
                    {{ passwordStats.hasSymbol ? '✓' : '○' }} Special Symbol (@$!%*#?&)
                  </span>
                </div>
              </div>
            </b-form-group>

            <b-form-group
              :label="$t('auth.confirmPassword')"
              label-for="password_confirmation"
            >
              <app-password-input
                id="password_confirmation"
                v-model="form.password_confirmation"
                :placeholder="$t('auth.confirmPassword')"
                required
              />
            </b-form-group>

            <b-button
              type="submit"
              variant="primary"
              :disabled="loading"
            >
              <b-spinner
                v-if="loading"
                small
                class="mr-1"
              />
              {{ $t('auth.changePassword') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import authService from '@/services/auth'
import { validatePasswordStrength, generateStrongPassword } from '@/utils/password'

export default {
  data() {
    return {
      form: {
        current_password: '',
        password: '',
        password_confirmation: '',
      },
      error: '',
      success: '',
      loading: false,
    }
  },
  computed: {
    passwordStats() {
      return validatePasswordStrength(this.form.password)
    },
  },
  methods: {
    fillGeneratedPassword() {
      const generated = generateStrongPassword(14)
      this.form.password = generated
      this.form.password_confirmation = generated
      this.$toast({
        component: ToastificationContent,
        props: {
          title: this.$t('auth.generateStrongPassword'),
          text: generated,
          variant: 'info',
        },
      })
    },
    async handleSubmit() {
      if (!this.passwordStats.isValid) {
        this.error = this.$t('auth.strongPasswordHelp')
        return
      }
      this.loading = true
      this.error = ''
      this.success = ''
      try {
        await authService.changePassword(this.form)
        this.$toast({
          component: ToastificationContent,
          props: { title: this.$t('messages.success'), text: this.$t('auth.passwordChangedSuccess'), variant: 'success' },
        })
        this.form = { current_password: '', password: '', password_confirmation: '' }
      } catch (e) {
        const errors = e.response?.data?.errors
        this.error = errors ? Object.values(errors).flat().join('\n') : (e.response?.data?.message || this.$t('messages.saveError'))
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
