import getters from './getters'
import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state() {
    return {
      dimensions: [],
      showcaseTypes: [],
      dimensionCategories: [],
      quickStartCategories: [],
      moodLayouts: [],
      dimensionLayout: null,
      quickStartLayout: [],
      filteredDimensionLayouts: null,
      filteredQuickStartLayouts: null,
      filteredMoodLayouts: null,
      filteredDimensionCategories: null,
      moods: [
        {
          mood_id: 'stressed',
          mood_label: 'Stressed'
        },
        {
          mood_id: 'energetic',
          mood_label: 'Energetic'
        },
        {
          mood_id: 'calm',
          mood_label: 'Calm'
        },
        {
          mood_id: 'sad',
          mood_label: 'Sad'
        }
      ]
    }
  },
  getters: getters,
  mutations: mutations,
  actions: actions
}
