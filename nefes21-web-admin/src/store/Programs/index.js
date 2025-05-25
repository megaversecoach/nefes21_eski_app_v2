import getters from './getters'
import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state() {
    return {
      draftedPrograms: [],
      publishedPrograms: [],
      draftProgram: null,
      programLayout: [],
      programLabels: []
    }
  },
  getters: getters,
  mutations: mutations,
  actions: actions
}
