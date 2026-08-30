import api from '@/services/api'

export default {
  getPublic(slug) {
    return api.get(`/online-booking/${slug}`)
  },
  getAvailableTimes(slug, doctorId, date) {
    return api.get(`/online-booking/${slug}/doctors/${doctorId}/available-times`, { params: { date } })
  },
  submit(slug, payload) {
    return api.post(`/online-booking/${slug}/reservations`, payload)
  },
  getSettings() {
    return api.get('/doctor/online-booking-settings')
  },
  updateSettings(payload) {
    return api.put('/doctor/online-booking-settings', payload)
  },
  getOnlineReservations(params = {}) {
    return api.get('/online-reservations', { params })
  },
}
