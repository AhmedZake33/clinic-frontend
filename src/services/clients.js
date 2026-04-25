import apiClient from './api'

function cleanPrefix(p) {
  if (!p && p !== 0) return ''
  let s = String(p).trim()
  if (!s) return ''
  // ensure starts with + and remove any non-digit/+ chars
  s = s.replace(/[^0-9+]/g, '')
  if (!s.startsWith('+')) s = '+' + s.replace(/^0+/, '')
  return s
}

function cleanNumber(n) {
  if (n === null || n === undefined) return ''
  let s = String(n).trim()
  if (!s) return ''
  // remove non-digit characters
  s = s.replace(/[^0-9]/g, '')
  // remove leading zeros so combined number doesn't have extra zeros
  s = s.replace(/^0+/, '')
  return s
}

function combineWithPrefix(prefix, number) {
  const p = cleanPrefix(prefix)
  const num = cleanNumber(number)
  if (!p && !num) return ''
  if (!p) return num
  if (!num) return p
  // if number already contains the prefix (e.g., +96650123), just return cleaned
  if (String(number).includes(p)) {
    return (p + num).replace(/\+\+/, '+')
  }
  return p + num
}

function prepareClientPayload(client = {}) {
  const payload = { ...client }

  // Combine phone country code with phone
  if ('phone' in payload) {
    const prefix = payload.phone_country_code || payload.country_code || ''
    const combined = combineWithPrefix(prefix, payload.phone)
    if (combined) payload.phone = combined
  }

  // Combine whatsapp country code with whatsapp_number
  if ('whatsapp_number' in payload) {
    const wprefix = payload.whatsapp_country_code || payload.country_code || ''
    const combined = combineWithPrefix(wprefix, payload.whatsapp_number)
    if (combined) payload.whatsapp_number = combined
  }

  return payload
}

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
    const payload = prepareClientPayload(clientData)
    return apiClient.post('/clients', payload)
  },
  
  updateClient(id, clientData) {
    const payload = prepareClientPayload(clientData)
    return apiClient.put(`/clients/${id}`, payload)
  },
  
  deleteClient(id) {
    return apiClient.delete(`/clients/${id}`)
  }
}
