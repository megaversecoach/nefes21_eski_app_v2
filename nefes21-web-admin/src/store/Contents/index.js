import getters from './getters'
import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state() {
    return {
      draftedContents: [],
      publishedContents: [],
      content_types: [],
      draftContent: null
    }
  },
  getters: getters,
  mutations: mutations,
  actions: actions
}
