import axios from '@axios'

export default {
  getAll() {
    return axios.get('/specializations')
  },
  create(data) {
    return axios.post('/specializations', data)
  },
  update(id, data) {
    return axios.put(`/specializations/${id}`, data)
  },
  delete(id) {
    return axios.delete(`/specializations/${id}`)
  },
}
