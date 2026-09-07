<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <h2 class="brand-text text-primary ml-1">
            {{ $t('clinic.brandText') }}
          </h2>
        </b-link>

        <b-card-title class="mb-1">
          {{ $t('auth.resetPassword') }}
        </b-card-title>
        <b-card-text class="mb-2">
          {{ $t('auth.resetPasswordDesc') }}
        </b-card-text>

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

        <b-form
          class="auth-login-form mt-2"
          @submit.prevent="handleSubmit"
        >
          <b-form-group
            :label="$t('clinic.email')"
            label-for="email"
          >
            <b-form-input
              id="email"
              v-model="form.email"
              type="email"
              :placeholder="$t('clinic.email')"
              required
            />
          </b-form-group>

          <b-form-group
            :label="$t('auth.newPassword')"
            label-for="password"
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
              id="password"
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
            block
            :disabled="loading"
          >
            <b-spinner
              v-if="loading"
              small
              class="mr-1"
            />
            {{ $t('auth.resetPassword') }}
          </b-button>
        </b-form>

        <p class="text-center mt-2">
          <b-link :to="{ name: 'login' }">
            <feather-icon icon="ChevronLeftIcon" /> {{ $t('auth.backToLogin') }}
          </b-link>
        </p>
      </b-card>
    </div>
  </div>
</template>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>

<script>
import {
  BCard,
  BCardTitle,
  BCardText,
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
  BLink,
  BAlert,
  BSpinner,
} from 'bootstrap-vue'
import authService from '@/services/auth'
import { validatePasswordStrength, generateStrongPassword } from '@/utils/password'

export default {
  components: {
    BCard,
    BCardTitle,
    BCardText,
    BForm,
    BFormGroup,
    BFormInput,
    BButton,
    BLink,
    BAlert,
    BSpinner,
  },
  data() {
    return {
      form: {
        token: '',
        email: '',
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
  created() {
    this.form.token = this.$route.query.token || ''
    this.form.email = this.$route.query.email || ''
  },
  methods: {
    fillGeneratedPassword() {
      const generated = generateStrongPassword(14)
      this.form.password = generated
      this.form.password_confirmation = generated
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
        await authService.resetPassword(this.form)
        this.success = this.$t('auth.passwordResetSuccess')
        setTimeout(() => this.$router.push({ name: 'login' }), 2000)
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
