<template>
  <b-dropdown
    v-if="isMobile"
    ref="actionsDropdown"
    variant="link"
    no-caret
    right
    boundary="viewport"
    class="responsive-table-actions responsive-table-actions--mobile"
    toggle-class="p-50 shadow-none text-body rounded-circle d-inline-flex align-items-center justify-content-center"
  >
    <template #button-content>
      <feather-icon
        icon="MoreVerticalIcon"
        size="20"
      />
    </template>

    <div
      class="responsive-table-actions__menu"
      @click="handleMenuClick"
    >
      <slot :is-mobile="true" />
    </div>
  </b-dropdown>

  <div
    v-else
    class="responsive-table-actions responsive-table-actions--desktop"
  >
    <slot :is-mobile="false" />
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
      isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
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
      this.isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    },
    handleMenuClick(event) {
      const clickable = event.target.closest('.btn, a, button, .dropdown-item')
      if (clickable && this.$refs.actionsDropdown) {
        this.$refs.actionsDropdown.hide(true)
      }
    },
  },
}
</script>

<style lang="scss">
.responsive-table-actions--desktop {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;

  .action-btn-text--mobile-only {
    display: none !important;
  }
}

.responsive-table-actions--mobile {
  .dropdown-toggle {
    width: 36px;
    height: 36px;
    transition: background-color 0.2s ease;

    &:hover,
    &:focus {
      background-color: rgba(115, 103, 240, 0.08);
    }
  }

  .dropdown-menu {
    min-width: 12rem;
    padding: 0.4rem;
    border-radius: 0.5rem;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(0, 0, 0, 0.08);
    z-index: 1050;
  }

  .responsive-table-actions__menu {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    > .btn,
    > a,
    > span,
    > button {
      width: 100%;
      margin: 0 !important;
      display: flex !important;
      align-items: center;
      justify-content: flex-start;
      gap: 0.65rem;
      padding: 0.55rem 0.85rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
      text-align: start;
      transition: all 0.18s ease-in-out;
      border: none;

      &.btn-info {
        background: rgba(0, 207, 232, 0.12) !important;
        color: #0096a6 !important;
        &:hover, &:active {
          background: #00cfe8 !important;
          color: #ffffff !important;
        }
      }

      &.btn-primary {
        background: rgba(115, 103, 240, 0.12) !important;
        color: #7367f0 !important;
        &:hover, &:active {
          background: #7367f0 !important;
          color: #ffffff !important;
        }
      }

      &.btn-warning {
        background: rgba(255, 159, 67, 0.12) !important;
        color: #e67e22 !important;
        &:hover, &:active {
          background: #ff9f43 !important;
          color: #ffffff !important;
        }
      }

      &.btn-danger {
        background: rgba(234, 84, 85, 0.12) !important;
        color: #ea5455 !important;
        &:hover, &:active {
          background: #ea5455 !important;
          color: #ffffff !important;
        }
      }

      &.btn-success {
        background: rgba(40, 199, 111, 0.12) !important;
        color: #28c76f !important;
        &:hover, &:active {
          background: #28c76f !important;
          color: #ffffff !important;
        }
      }

      &.btn-secondary,
      &.btn-outline-secondary {
        background: rgba(130, 134, 139, 0.1) !important;
        color: #6e6b7b !important;
        &:hover, &:active {
          background: #82868b !important;
          color: #ffffff !important;
        }
      }

      svg,
      .feather {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        margin: 0 !important;
      }

      .action-btn-text,
      span {
        flex-grow: 1;
        text-align: start;
      }
    }

    > a {
      display: flex;
      padding: 0.55rem 0.85rem;
      border-radius: 0.375rem;
    }
  }
}
</style>
