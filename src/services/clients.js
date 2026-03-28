import apiClient from './api'

export default {
  getClientOptions() {
    return apiClient.get('/clients/options')
  },

  getClients(params = {}) {
    return apiClient.get('/clients', { params })
  },
  
  getClient(id) {
    return apiClient.get(`/clients/${id}`)
  },
  
  createClient(clientData) {
    return apiClient.post('/clients', clientData)
  },
  
  updateClient(id, clientData) {
    return apiClient.put(`/clients/${id}`, clientData)
  },
  
  deleteClient(id) {
    return apiClient.delete(`/clients/${id}`)
  }
}
