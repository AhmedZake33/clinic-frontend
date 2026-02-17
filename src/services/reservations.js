import apiClient from './api'

export default {
  getReservations(params = {}) {
    return apiClient.get('/reservations', { params })
  },
  
  getReservation(id) {
    return apiClient.get(`/reservations/${id}`)
  },
  
  createReservation(reservationData) {
    return apiClient.post('/reservations', reservationData)
  },
  
  updateReservation(id, reservationData) {
    return apiClient.put(`/reservations/${id}`, reservationData)
  },
  
  completeReservation(id, data) {
    return apiClient.post(`/reservations/${id}/complete`, data)
  },

  confirmReservation(id) {
    return apiClient.post(`/reservations/${id}/confirm`)
  },
  
  generatePrescription(id) {
    return apiClient.get(`/reservations/${id}/prescription`, {
      responseType: 'blob'
    })
  },
  
  deleteReservation(id) {
    return apiClient.delete(`/reservations/${id}`)
  },
  
  getDoctors() {
    return apiClient.get('/doctors')
  }
}
