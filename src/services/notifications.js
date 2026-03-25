import apiClient from './api'

export default {
  getSettings() {
    return apiClient.get('/notification-settings')
  },

  updateSettings(data) {
    return apiClient.put('/notification-settings', data)
  },

  testSms(phone) {
    return apiClient.post('/notification-settings/test-sms', { phone })
  },

  testWhatsapp(phone) {
    return apiClient.post('/notification-settings/test-whatsapp', { phone })
  },

  getLogs(params = {}) {
    return apiClient.get('/notification-logs', { params })
  }
}
