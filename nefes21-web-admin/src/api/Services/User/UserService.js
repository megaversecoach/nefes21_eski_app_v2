import { ApiService } from '../../ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'
const UserService = {
  getPurchaseEvents: async function (params) {
    const response = await ApiService.requestToServer(
      Endpoints.UserEndpoints.getPurchaseEvents,
      '/' + params.userId
    )
    return response.data
  },
  getSessions: async function (params) {
    const response = await ApiService.requestToServer(
      Endpoints.UserEndpoints.getSessions,
      '/' + params.session_id + '?page=' + params.page + '&limit=10'
    )
    return response.data
  },
  getSessionTokens: async function (params) {
    const response = await ApiService.requestToServer(
      Endpoints.UserEndpoints.getSessionTokens,
      '/' + params.userId
    )
    return response.data
  },
  getUserExperience: async function (params) {
    const response = await ApiService.requestToServer(
      Endpoints.UserEndpoints.getUserExperience,
      '/' + params.userId
    )
    return response.data
  },
  searchTransaction: async function (params) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.UserEndpoints.searchTransaction,
        '?' + params.type + '=' + params.value
      )
      return response.data
    } catch (err) {
      throw new err()
    }
  },
  searchUser: async function (params) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.UserEndpoints.searchUser,
        '?' + params.type + '=' + params.value
      )
      return response.data
    } catch (err) {
      throw new err()
    }
  }
}

export { UserService }
