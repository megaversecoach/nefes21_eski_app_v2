import getters from './getters.js'
import actions from './actions.js'
import mutations from './mutations.js'

export default {
  namespaced: true,

  state() {
    return {
      user: null,
      userExperience: {
        goals: [],
        mood_segments: [],
        isPushSubscribed: '',
        reminders: [],
        track_progressions: [],
        part_progressions: [],
        mood_checkins: [],
        favourites: [],
        dimension_ratings: []
      },
      sessionTokens: null,
      sessions: null,
      purchaseEvents: null
    }
  },
  getters: getters,
  actions: actions,
  mutations: mutations
}
