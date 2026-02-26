import axios from '@axios'

export default {
  // Get all doctors
  getDoctors() {
    return axios.get('/admin/doctors')
  },

  // Create a new doctor
  createDoctor(doctorData) {
    return axios.post('/admin/doctors', doctorData)
  },

  // Get a specific doctor
  getDoctor(doctorId) {
    return axios.get(`/admin/doctors/${doctorId}`)
  },

  // Update a doctor
  updateDoctor(doctorId, doctorData) {
    return axios.put(`/admin/doctors/${doctorId}`, doctorData)
  },

  // Delete a doctor
  deleteDoctor(doctorId) {
    return axios.delete(`/admin/doctors/${doctorId}`)
  },

  // Get subscription statistics
  getSubscriptionStats() {
    return axios.get('/admin/subscription-stats')
  },
}