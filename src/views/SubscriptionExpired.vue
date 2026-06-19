<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <b-card class="mb-0 text-center">
        <div class="subscription-icon mx-auto mb-2">
          <feather-icon icon="ClockIcon" size="42" />
        </div>

        <b-card-title class="mb-1">
          {{ $t('subscriptionExpired.title') }}
        </b-card-title>

        <b-card-text class="mb-2">
          {{ $t('subscriptionExpired.message') }}
        </b-card-text>

        <b-button variant="primary" block @click="logout">
          {{ $t('subscriptionExpired.backToLogin') }}
        </b-button>
      </b-card>
    </div>
  </div>
</template>

<script>
import {
  BButton, BCard, BCardText, BCardTitle,
} from 'bootstrap-vue'

export default {
  components: {
    BButton,
    BCard,
    BCardText,
    BCardTitle,
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.replace({ name: 'login' }).catch(() => {})
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';

.subscription-icon {
  display: flex;
  width: 84px;
  height: 84px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ea5455;
  background: rgba(234, 84, 85, 0.12);
}
</style>
