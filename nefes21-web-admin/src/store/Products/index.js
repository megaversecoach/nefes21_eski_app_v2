import getters from './getters.js'
import actions from './actions.js'
import mutations from './mutations.js'

export default {
  namespaced: true,

  state() {
    return {
      suppliers: [],
      products: [],
      prepaidCodes: [],
      promoCodes: []
    }
  },
  getters: getters,
  actions: actions,
  mutations: mutations
}
