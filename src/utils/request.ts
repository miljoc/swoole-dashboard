import axios from 'axios'
import { Message } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { getAdminServer, getAdminServerToken } from '@/utils/cookies'

const service = axios.create({
  baseURL: getAdminServer(),
  timeout: 5000
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['X-Access-Token'] = UserModule.token
    }
    if (getAdminServerToken() !== '') {
      config.headers['X-Admin-Server-Access-Token'] = getAdminServerToken()
    }
    if (!/^http:\/\/|^https:\/\//i.test(config.url as string)) {
      if (getAdminServer() !== config.baseURL) {
        if (config.url?.indexOf('/') === 0) {
          config.url = getAdminServer() + config.url.substr(1)
        } else {
          config.url = getAdminServer() + config.url
        }
      }
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.data || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.data.error || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
