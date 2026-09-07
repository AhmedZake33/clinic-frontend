import Vue from 'vue'
import FeatherIcon from '@core/components/feather-icon/FeatherIcon.vue'
import AppPasswordInput from '@core/components/app-password-input/AppPasswordInput.vue'

Vue.component(FeatherIcon.name, FeatherIcon)
Vue.component('AppPasswordInput', AppPasswordInput)
Vue.component('PasswordInput', AppPasswordInput)
