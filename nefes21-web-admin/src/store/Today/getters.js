export default {
  starters: function (state) {
    return state.starters
  },
  nonPersonalizedShowcases: function (state) {
    return state.nonPersonalizedShowcases
  },
  filteredSeriesPool: function (state) {
    return state.filteredSeriesPool
  },
  filteredPersonalizedShowcasePool: function (state) {
    return state.filteredPersonalizedShowcasePool
  },
  nonPersonalizedShowcasesById: (state) => (showcase_id) => {
    return state.nonPersonalizedShowcases.find(
      (item) => item.showcase_id === showcase_id
    )
  }
}
