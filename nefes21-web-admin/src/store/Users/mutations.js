export default {
  user: function (state, payload) {
    state.user = payload
  },
  userExperience: function (state, payload) {
    state.userExperience = payload
  },
  sessionTokens: function (state, payload) {
    state.sessionTokens = payload
  },
  sessions: function (state, payload) {
    state.sessions = payload
  },
  clearSessions: function (state) {
    state.sessions = null
  },
  purchaseEvents: function (state, payload) {
    state.purchaseEvents = payload
  },
  clearPurchaseEvents: function (state) {
    state.purchaseEvents = null
  }
}
