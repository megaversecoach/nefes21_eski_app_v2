import mutations from './mutations'
import actions from './actions'
import getters from './getters'

export default {
  namespaced: true,
  state() {
    return {
      starters: [],
      seriesPool: [],
      filteredSeriesPool: null,
      personalizedShowcasePool: [],
      filteredPersonalizedShowcasePool: null,

      nonPersonalizedShowcases: []
    }
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}
