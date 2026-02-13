// src/store/modules/auth.js
import { updateEchoAuth, leaveAllChannels } from '@/libs/echo'

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  },
  getters: {
    isLoggedIn: state => !!state.token,
    userRole: state => {
      // prefer Vuex state, fallback to localStorage
      if (state.user && state.user.role) return state.user.role
      try {
        const u = JSON.parse(localStorage.getItem('user') || 'null')
        return u?.role || ''
      } catch (e) {
        return ''
      }
    },
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    LOGOUT(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
  actions: {
    login({ commit }, { token, user }) {
      commit('SET_TOKEN', token)
      commit('SET_USER', user)
      // Update Echo auth headers so WebSocket channels can authenticate
      updateEchoAuth()
    },
    logout({ commit }) {
      // Disconnect all WebSocket channels before clearing credentials
      leaveAllChannels()
      commit('LOGOUT')
    },
  },
}
