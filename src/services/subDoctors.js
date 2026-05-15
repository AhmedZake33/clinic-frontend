import api from '@/services/api'

export default {
  getAll() {
    return api.get('/doctor/sub-doctors')
  },
  create(payload) {
    return api.post('/doctor/sub-doctors', payload)
  },
  update(id, payload) {
    return api.put(`/doctor/sub-doctors/${id}`, payload)
  },
  delete(id) {
    return api.delete(`/doctor/sub-doctors/${id}`)
  },
  // permissions for sub-doctors are managed by admin
}
