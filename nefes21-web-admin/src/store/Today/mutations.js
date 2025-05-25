export default {
  loadStarters: function (state, payload) {
    payload.starters.sort((a, b) => a.orderInSection - b.orderInSection)
    state.starters = payload.starters
  },
  reOrderStarters: function (state, payload) {
    payload.data.forEach(function (item, index) {
      item.orderInSection = index + 1
    })
    state.starters = payload.data
  },
  deleteStarterItem: function (state, payload) {
    const index = state.starters.findIndex(
      (item) => item.content_id === payload.content_id
    )
    if (index !== -1) {
      state.starters.splice(index, 1)
    }
    state.starters.forEach(function (item, index) {
      item.orderInSection = index + 1
    })
  },
  addContentToStarters: function (state, payload) {
    const orderInSection = state.starters.length + 1
    const data = {
      content_id: payload.content_id,
      language: payload.language,
      orderInSection: orderInSection,
      section_id: 'starters'
    }
    state.starters.push(data)
  },
  clearFilteredSeriesPool(state) {
    state.filteredSeriesPool = null
  },
  loadSeriesPool: function (state, payload) {
    state.seriesPool = payload.seriesPool
  },
  addContentToTodaySeriesPool: function (state, payload) {
    const object = {
      content_id: payload.content_id,
      dimension_id: payload.dimension_id,
      language: payload.language,
      section_id: 'series'
    }
    state.seriesPool.push(object)
    state.filteredSeriesPool.push(object)
  },
  filterTodaySeriesPool: function (state, payload) {
    const dimension_id = payload.dimension_id
    const filtered = state.seriesPool.filter(
      (item) => item.dimension_id === dimension_id
    )
    state.filteredSeriesPool = filtered
  },
  deleteFromTodaySeriesPool: function (state, payload) {
    const content_id = payload.content_id
    const dimension_id = payload.dimension_id
    const index = state.filteredSeriesPool.findIndex(
      (item) => item.content_id === content_id
    )
    const seriesIndex = state.seriesPool.findIndex(
      (item) =>
        item.content_id === content_id && item.dimension_id === dimension_id
    )
    if (index !== -1 && seriesIndex !== -1) {
      state.seriesPool.splice(seriesIndex, 1)
      state.filteredSeriesPool.splice(index, 1)
    }
  },

  loadPersonalizedShowcasePool: function (state, payload) {
    state.personalizedShowcasePool = payload.personalizedShowcasePool
  },
  clearFilteredPersonalizedShowcasePool(state) {
    state.filteredPersonalizedShowcasePool = null
  },
  filterPersonalizedShowcasePool: function (state, payload) {
    const dimension_id = payload.dimension_id
    const filtered = state.personalizedShowcasePool.filter(
      (item) => item.dimension_id === dimension_id
    )
    state.filteredPersonalizedShowcasePool = filtered
  },
  addContentToPersonalizedShowcasePool: function (state, payload) {
    const object = {
      content_id: payload.content_id,
      dimension_id: payload.dimension_id,
      language: payload.language
    }
    state.personalizedShowcasePool.push(object)
    state.filteredPersonalizedShowcasePool.push(object)
  },
  deleteFromPersonalizedShowcasePool: function (state, payload) {
    const content_id = payload.content_id
    const dimension_id = payload.dimension_id
    const index = state.filteredPersonalizedShowcasePool.findIndex(
      (item) => item.content_id === content_id
    )
    const seriesIndex = state.personalizedShowcasePool.findIndex(
      (item) =>
        item.content_id === content_id && item.dimension_id === dimension_id
    )
    if (index !== -1 && seriesIndex !== -1) {
      state.personalizedShowcasePool.splice(seriesIndex, 1)
      state.filteredPersonalizedShowcasePool.splice(index, 1)
    }
  },

  loadNonPersonalizedShowcasePool: function (state, payload) {
    state.nonPersonalizedShowcases = payload.nonPersonalizedShowcases
  },
  deleteNonPersonalized: function (state, payload) {
    const index = state.nonPersonalizedShowcases.findIndex(
      (item) => item.showcase_id === payload.showcase_id
    )
    if (index !== -1) {
      state.nonPersonalizedShowcases.splice(index, 1)
    }
  }
}
