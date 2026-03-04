<template>
  <div class="navbar-container d-flex content align-items-center custom-navbar">

    <!-- Left: Menu toggle (in LTR) / Right: Menu toggle (in RTL) -->
    <ul class="nav navbar-nav d-xl-none" :class="$store.getters['language/isRTL'] ? 'ml-auto' : ''">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <b-navbar-nav :class="$store.getters['language/isRTL'] ? 'nav align-items-center ml-0 mr-0' : 'nav align-items-center ml-auto'">
      <call-assistant-dropdown />
      <locale />
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav,
} from 'bootstrap-vue'
import Bookmarks from './components/Bookmarks.vue'
import Locale from './components/Locale.vue'
import SearchBar from './components/SearchBar.vue'
import DarkToggler from './components/DarkToggler.vue'
import CartDropdown from './components/CartDropdown.vue'
import NotificationDropdown from './components/NotificationDropdown.vue'
import UserDropdown from './components/UserDropdown.vue'
import CallAssistantDropdown from './components/CallAssistantDropdown.vue'

export default {
  components: {
    BLink,

    // Navbar Components
    BNavbarNav,
    Bookmarks,
    Locale,
    SearchBar,
    DarkToggler,
    CartDropdown,
    NotificationDropdown,
    UserDropdown,
    CallAssistantDropdown,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    isRTL() {
      return this.$store.getters['language/isRTL']
    },
  },
}
</script>
