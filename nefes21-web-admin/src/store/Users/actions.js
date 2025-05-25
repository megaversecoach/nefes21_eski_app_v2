import { UserService } from '@/api/Services/User/UserService'
export default {
  clearSessions: async function (context) {
    context.commit('clearSessions')
  },
  clearPurchaseEvents: async function (context) {
    context.commit('clearPurchaseEvents')
  },
  getPurchaseEvents: async function (context, payload) {
    const data = await UserService.getPurchaseEvents(payload)
    context.commit('purchaseEvents', data)
  },
  getSessions: async function (context, payload) {
    const data = await UserService.getSessions(payload)
    context.commit('sessions', data)
  },
  getSessionTokens: async function (context, payload) {
    const data = await UserService.getSessionTokens(payload)
    context.commit('sessionTokens', data)
  },
  getUserExperience: async function (context, payload) {
    const data = await UserService.getUserExperience(payload)
    console.log(data)
    context.commit('userExperience', data)
  },
  searchTransaction: async function (context, payload) {
    return new Promise((resolve, reject) => {
      UserService.searchTransaction(payload)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  searchUser: async function (context, payload) {
    return new Promise((resolve, reject) => {
      UserService.searchUser(payload)
        .then((response) => {
          context.commit('user', response)
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
