import apiClient from './api'

export default {
  getFinancials(params = {}) {
    return apiClient.get('/financials', { params })
  },

  getFinancial(id) {
    return apiClient.get(`/financials/${id}`)
  },

  getSummary(params = {}) {
    return apiClient.get('/financials/summary', { params })
  },

  createFinancial(data) {
    return apiClient.post('/financials', data)
  },

  updateFinancial(id, data) {
    return apiClient.put(`/financials/${id}`, data)
  },

  deleteFinancial(id) {
    return apiClient.delete(`/financials/${id}`)
  },
}
