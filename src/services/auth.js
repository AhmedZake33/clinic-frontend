import apiClient from './api'

export default {
  login(credentials) {
    return apiClient.post('/login', credentials)
  },
  
  register(userData) {
    return apiClient.post('/register', userData)
  },
  
  logout() {
    return apiClient.post('/logout')
  },
  
  getUser() {
    return apiClient.get('/me')
  },

  /**
   * Fetch the current user's Spatie roles & permissions.
   * Separate lightweight endpoint – call after login and on every page refresh.
   */
  getMyPermissions() {
    return apiClient.get('/my-permissions')
  }
}
