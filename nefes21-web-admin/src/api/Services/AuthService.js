import { ApiService } from '../ServiceLayer/ApiService'
import { TokenService } from '../ServiceLayer/TokenService'
import { Endpoints } from '@/api/URLBuilder/Urls'

const AuthService = {
  logOut: function () {
    localStorage.clear()
    TokenService.removeToken()
  },
  login: async function (username, password) {
    const data = {
      username: username,
      password: password
    }
    try {
      const response = await ApiService.requestToServer(
        Endpoints.AuthEndpoints.login,
        undefined,
        data
      )
      console.log(response.data)
      if (response.status === 401) {
        return {
          status: false
        }
      }
      const token = response.data.token
      const username = response.data.username
      const name = response.data.name

      TokenService.saveToken(token)
      ApiService.configureHeader()
      ApiService.mount403Interceptor()

      return {
        status: true,
        name: name,
        username: username
      }
    } catch (err) {
      console.log(err)
      return {
        status: false
      }
    }
  }
}

export { AuthService }
