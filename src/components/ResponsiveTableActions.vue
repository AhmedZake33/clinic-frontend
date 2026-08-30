<template>
  <b-dropdown
    v-if="isMobile"
    variant="link"
    no-caret
    right
    boundary="window"
    class="responsive-table-actions responsive-table-actions--mobile"
    toggle-class="p-0 shadow-none text-body"
  >
    <template #button-content>
      <feather-icon
        icon="MoreVerticalIcon"
        size="20"
      />
    </template>

    <div class="responsive-table-actions__menu">
      <slot />
    </div>
  </b-dropdown>

  <div
    v-else
    class="responsive-table-actions responsive-table-actions--desktop"
  >
    <slot />
  </div>
</template>

<script>
import { BDropdown } from 'bootstrap-vue'

export default {
  components: {
    BDropdown,
  },
  data() {
    return {
      isMobile: false,
    }
  },
  mounted() {
    this.updateIsMobile()
    window.addEventListener('resize', this.updateIsMobile)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateIsMobile)
  },
  methods: {
    updateIsMobile() {
      this.isMobile = window.innerWidth < 768
    },
  },
}
</script>

<style lang="scss">
.responsive-table-actions--desktop {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.responsive-table-actions--mobile {
  .dropdown-menu {
    min-width: 9rem;
    padding: 0.35rem;
  }

  .responsive-table-actions__menu {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    > .btn,
    > a,
    > span,
    > button {
      width: 100%;
      margin: 0 !important;
      text-align: start;
      justify-content: flex-start;
      white-space: nowrap;
    }

    > a {
      display: block;
      padding: 0.45rem 0.75rem;
      border-radius: 0.25rem;
    }
  }
}
</style>
