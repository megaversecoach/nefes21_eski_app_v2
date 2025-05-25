import getters from './getters'
import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,

  state() {
    return {
      decks: [],
      cards: [],
      filteredCards: []
    }
  },
  getters: getters,
  mutations: mutations,
  actions: actions
}
