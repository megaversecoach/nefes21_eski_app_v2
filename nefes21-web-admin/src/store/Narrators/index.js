import getters from './getters.js'
import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state() {
    return {
      draftedNarrators: [],
      publishedNarrators: []
    }
  },
  getters: getters,
  mutations: mutations,
  actions: actions
}
