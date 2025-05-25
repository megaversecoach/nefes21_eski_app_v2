import getters from './getters'
import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state() {
    return {
      draftedTracks: null,
      publishedTracks: null
    }
  },
  getters: getters,
  mutations: mutations,
  actions: actions
}
