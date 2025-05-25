import { TokenService } from './TokenService'
import axios from 'axios'
import routes from '../../router/routes'
import { buildRequest } from '@/api/URLBuilder/URLBuilder'
import { ServiceError } from '@/api/Errors'

const ApiService = {
  _Interceptor: null,

  configureHeader() {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${TokenService.getToken()}`
  },
  removeHeader() {
    axios.defaults.headers.common = {}
  },
  async requestToServer(endpoint, query, data, header, onUploadConfig) {
    const request = buildRequest(endpoint, query, data, header, onUploadConfig)
    console.log('-----Request----')
    console.log(request)
    console.log('----------')
    if (
      typeof axios.defaults.headers.common['Authorization'] === 'undefined' &&
      TokenService.getToken() !== null
    ) {
      this.configureHeader()
    }
    if (this._Interceptor === null && TokenService.getToken() !== null) {
      this.mount403Interceptor()
    }
    try {
      const response = await axios(request)
      return response
    } catch (err) {
      console.log(err)
      throw new ServiceError(err.response.status, err.response.data.detail)
    }
  },
  mount403Interceptor() {
    console.log('Interceptor')
    this._Interceptor = axios.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        if (error.request.status === 403) {
          console.log('403')
          console.log('-----')

          TokenService.removeToken()
          this.removeHeader()
          axios.interceptors.response.eject(this._Interceptor)
          await routes.replace('/login')

          throw error
        }
        throw error
      }
    )
  }
}
export { ApiService }
