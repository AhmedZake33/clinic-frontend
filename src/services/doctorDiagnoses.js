import axios from '@axios'

export default {
  getAll() {
    return axios.get('/doctor-diagnoses')
  },

  getAllForReservation(reservationId) {
    return axios.get(`/reservations/${reservationId}/doctor-diagnoses`)
  },

  getAllForDoctor(doctorId) {
    return axios.get(`/doctors/${doctorId}/doctor-diagnoses`)
  },

  create(data) {
    return axios.post('/doctor-diagnoses', data)
  },

  update(id, data) {
    return axios.put(`/doctor-diagnoses/${id}`, data)
  },

  delete(id) {
    return axios.delete(`/doctor-diagnoses/${id}`)
  },
}
