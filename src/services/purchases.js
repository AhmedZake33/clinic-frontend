import apiClient from './api'

export default {
  getPurchases(params = {}) {
    return apiClient.get('/purchases', { params })
  },

  getPurchase(id) {
    return apiClient.get(`/purchases/${id}`)
  },

  createPurchase(data) {
    return apiClient.post('/purchases', data)
  },

  updatePurchase(id, data) {
    return apiClient.put(`/purchases/${id}`, data)
  },

  deletePurchase(id) {
    return apiClient.delete(`/purchases/${id}`)
  },
  // stats
  getDailyTotal(params = {}) {
    return apiClient.get('/purchases/stats', { params })
  },

  // POST version: send payload in request body for more complex filters / ranges
  stats(payload = {}) {
    console.log('Fetching stats with payload:', payload)
    return apiClient.post('/purchases/stats', payload)
  },

  getMonthlyTotal(params = {}) {
    return apiClient.get('/purchases/stats', { params })
  },

  getTotalsByCategory(params = {}) {
    return apiClient.get('/purchases/stats', { params })
  },
}
