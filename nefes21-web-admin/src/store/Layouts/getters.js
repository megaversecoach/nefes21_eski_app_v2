export default {
  isDimensionsLoaded(state) {
    return state.dimensions.length > 0
  },
  isDimensionLayoutLoaded(state) {
    return state.dimensionLayout != null
  },
  filteredDimensionLayouts(state) {
    return state.filteredDimensionLayouts
  },
  dimensions(state) {
    return state.dimensions
  },
  dimensionByDimensionId: (state) => (dimension_id) => {
    return state.dimensions.find(
      (dimension) => dimension.dimension_id === dimension_id
    )
  },
  dimensionLayout(state) {
    return state.dimensionLayout
  },
  showcaseTypes(state) {
    return state.showcaseTypes
  },
  dimensionCategories(state) {
    return state.dimensionCategories
  },
  moods(state) {
    return state.moods
  },
  quickStartCategories(state) {
    return state.quickStartCategories
  },
  quickStartLayout(state) {
    return state.quickStartLayout
  },
  moodLayouts(state) {
    return state.moodLayouts
  },
  filteredQuickStartLayouts(state) {
    return state.filteredQuickStartLayouts
  },
  filteredMoodLayouts(state) {
    return state.filteredMoodLayouts
  },
  filteredDimensionCategories(state) {
    return state.filteredDimensionCategories
  }
}
