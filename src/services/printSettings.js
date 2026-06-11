import apiClient from './api'

export default {
  get() {
    return apiClient.get('/print-settings')
  },

  update(settings) {
    return apiClient.put('/print-settings', settings)
  },
}
