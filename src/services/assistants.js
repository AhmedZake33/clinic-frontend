import apiClient from './api'

export default {
  getAssistants() {
    return apiClient.get('/assistants')
  },

  createAssistant(data) {
    return apiClient.post('/assistants', data)
  },

  updateAssistant(id, data) {
    return apiClient.put(`/assistants/${id}`, data)
  },

  deleteAssistant(id) {
    return apiClient.delete(`/assistants/${id}`)
  },
}
