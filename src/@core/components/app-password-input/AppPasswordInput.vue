<template>
  <b-input-group
    class="input-group-merge"
    :class="inputGroupClasses"
  >
    <b-form-input
      :id="id"
      :value="value"
      :type="passwordFieldType"
      class="form-control-merge"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :state="state"
      :name="name"
      :autocomplete="autocomplete"
      v-bind="$attrs"
      v-on="listeners"
    />
    <b-input-group-append
      is-text
      class="cursor-pointer"
      role="button"
      tabindex="0"
      :title="passwordFieldType === 'password' ? 'Show password' : 'Hide password'"
      @click="togglePasswordVisibility"
      @keydown.enter.prevent="togglePasswordVisibility"
      @keydown.space.prevent="togglePasswordVisibility"
    >
      <feather-icon :icon="passwordToggleIcon" />
    </b-input-group-append>
  </b-input-group>
</template>

<script>
import { BInputGroup, BInputGroupAppend, BFormInput } from 'bootstrap-vue'

export default {
  name: 'AppPasswordInput',
  components: {
    BInputGroup,
    BInputGroupAppend,
    BFormInput,
  },
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    id: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    state: {
      type: Boolean,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    autocomplete: {
      type: String,
      default: null,
    },
    inputGroupClasses: {
      type: [String, Array, Object],
      default: null,
    },
  },
  data() {
    return {
      passwordFieldType: 'password',
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    listeners() {
      return {
        ...this.$listeners,
        input: val => {
          this.$emit('input', val)
        },
      }
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
  },
}
</script>
