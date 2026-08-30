import axios from 'axios'
import router from '@/router'

const apiClient = axios.create({
  baseURL: `${process.env.VUE_APP_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Add auth token and socket ID to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  const locale = localStorage.getItem('locale') || 'en'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  config.headers['Accept-Language'] = locale

  // Send socket ID so Laravel can exclude the current user from broadcasts
  if (window.Echo && window.Echo.socketId()) {
    config.headers['X-Socket-ID'] = window.Echo.socketId()
  }

  return config
})

// Handle authentication and subscription errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.replace({ name: 'login' }).catch(() => {})
    } else if (
      error.response
      && error.response.status === 403
      && error.response.data?.code === 'subscription_expired'
      && localStorage.getItem('token')
    ) {
      router.replace({ name: 'subscription-expired' }).catch(() => {})
    }
    return Promise.reject(error)
  },
)

export default apiClient
