<template>
  <v-app>
    <div class="main">
      <div class="child">
        <h1 style="text-align:center;color:#10a29b">
          تسجيل الدخول
        </h1>

        <v-form style="direction:rtl">
          <v-text-field
            solo
            placeholder="البريد الالكتروني"
          />

          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            auto-complete="new password"
            solo
            placeholder="كلمه السر"
            @click:append="showPassword = !showPassword"
          />
          <div>
            <div style="float:right">
              <v-checkbox
                v-model="checkbox"
                label="تذكرني"
              />
            </div>
            <div style="float:left">
              <a
                style="color:#10a29b;font-weight:bold"
                href="#"
              >هل نسيت كلمه المرور</a>
            </div>

          </div>
          <h6 style="text-align:center">
            <v-btn
              block
              rounded
              color="#10a29b"
              x-large
              dark
              @click="login"
            >
              تسجيل الدخول
            </v-btn>
          </h6>
        </v-form>
      </div>
    </div>
  </v-app>
</template>

<script>
import EventBus from '../plugins/event-bus'

export default {
  data() {
    return {
      email: null,
      password: null,
      showPassword: false,
      checkbox: null,
      loggedIn: false,
    }
  },

  computed: {

  },

  methods: {
    login() {
      localStorage.setItem('loggedIn', true)
      EventBus.$emit('login', true)
      if (localStorage.getItem('loggedIn')) {
        this.$router.push('/dashboard')
      }
    },
  },

}
</script>

<style scoped>
.main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}
.main .child {
    width: 100%;
    max-width: 31.25rem;
}

</style>
