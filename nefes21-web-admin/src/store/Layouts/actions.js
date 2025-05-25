import { LayoutService } from '@/api/Services/Layout/LayoutService'
import converter from '../../api/Services/Layout/converter'

export default {
  getDimensions: async function (context) {
    const data = await LayoutService.getDimensions()
    console.log(data)
    context.commit('loadDimensions', {
      dimensions: data
    })
  },
  getDimensionLayouts: async function (context) {
    const data = await LayoutService.getDimensionLayout()
    console.log(data)
    context.commit('loadDimensionLayout', {
      dimensionLayout: data
    })
  },
  getDimensionCategories: async function (context) {
    const data = await LayoutService.getDimensionCategories()
    console.log(data)
    context.commit('loadDimensionCategories', {
      dimensionCategories: data
    })
  },
  getShowcaseTypes: async function (context) {
    const data = await LayoutService.getShowcaseTypes()
    console.log(data)
    context.commit('loadShowcaseTypes', {
      showcaseTypes: data
    })
  },
  saveDimensionLayout: async function (context, payload) {
    const language = context.rootGetters.getCurrentLanguage
    const convertedData = converter.convertDimensionLayout(
      payload.data,
      language
    )
    console.log(convertedData)
    const data = await LayoutService.saveDimensionLayout(
      convertedData,
      payload.dimension_id,
      language
    )
    return data.success
  },
  saveMoodLayout: async function (context, payload) {
    context.rootState.uploadingState = true
    const language = context.rootGetters.getCurrentLanguage
    const data = await LayoutService.saveMoodLayout(
      payload.data,
      payload.mood_id,
      language
    )
    if (data.success) {
      context.rootState.uploadingState = false
    }
    return data.success
  },
  saveQuickStartLayout: async function (context, payload) {
    context.rootState.uploadingState = true
    const language = context.rootGetters.getCurrentLanguage
    const data = await LayoutService.saveQuickStartLayout(
      payload.data,
      payload.qs_category_id,
      language
    )
    if (data.success) {
      context.rootState.uploadingState = false
    }
    return data.success
  },
  saveDimensionCategories: async function (context, payload) {
    context.rootState.uploadingState = true
    const language = context.rootGetters.getCurrentLanguage
    const convertedData = converter.convertDimensionCategories(
      payload.data,
      language
    )
    const data = await LayoutService.saveDimensionCategories(
      convertedData,
      payload.dimension_id,
      language
    )
    if (data.success) {
      context.rootState.uploadingState = false
    }
    return data.success
  },
  reOrderDimensionLayout: function (context, payload) {
    context.commit('reOrderDimensionLayout', payload)
  },
  reOrderQsLayout: function (context, payload) {
    context.commit('reOrderQsLayout', payload)
  },
  reOrderDimensionCategories: function (context, payload) {
    context.commit('reOrderDimensionCategories', payload)
  },
  addContentToDimensionLayout: function (context, payload) {
    context.commit('addContentToDimensionLayout', payload)
  },
  addCategoryToFilteredCategory: function (context, payload) {
    context.commit('addCategoryToFilteredCategory', payload)
  },
  addContentToQsLayout: function (context, payload) {
    context.commit('addContentToQsLayout', payload)
  },
  addContentToMoodLayout: function (context, payload) {
    context.commit('addContentToMoodLayout', payload)
  },
  updateCategory: function (context, payload) {
    context.commit('updateCategory', payload)
  },
  deleteContentFromDimensionLayout: function (context, payload) {
    context.commit('deleteContentFromDimensionLayout', payload)
  },
  deleteContentFromQsLayout: function (context, payload) {
    context.commit('deleteContentFromQsLayout', payload)
  },
  deleteCategoryFromFilteredCategories: function (context, payload) {
    context.commit('deleteCategoryFromFilteredCategories', payload)
  },
  deleteContentFromMoodLayout: function (context, payload) {
    context.commit('deleteContentFromMoodLayout', payload)
  },
  clearFilteredQuickstartLayout: function (context) {
    context.commit('clearFilteredQuickstartLayout')
  },
  clearFilteredDimensionLayout: function (context) {
    context.commit('clearFilteredDimensionLayout')
  },
  clearFilteredMoodLayout: function (context) {
    context.commit('clearFilteredMoodCheckInLayout')
  },
  clearFilteredDimensionCategories: function (context) {
    context.commit('clearFilteredDimensionCategories')
  },
  filterDimensionLayoutByDimension: function (context, payload) {
    context.commit('filterDimensionLayoutByDimension', payload)
  },
  filterQsLayoutByQsCategory: function (context, payload) {
    context.commit('filteredQsLayoutByQsCategory', payload)
  },
  filterMoodLayoutByMood: function (context, payload) {
    context.commit('filteredMoodLayouts', payload)
  },
  filterDimensionCategories: function (context, payload) {
    context.commit('filteredDimensionCategories', payload)
  },
  getQuickStartCategories: async function (context) {
    const data = await LayoutService.getQuickStartCategories()
    context.commit('loadQuickStartCategories', {
      quickStartCategories: data
    })
  },
  getQuickStartLayout: async function (context) {
    const data = await LayoutService.getQuickStartLayout()
    context.commit('loadQuickstartLayout', {
      quickStartLayout: data
    })
  },
  getMoodLayouts: async function (context) {
    const data = await LayoutService.getMoodCheckInLayout()
    context.commit('loadMoodCheckInLayout', {
      moodLayouts: data
    })
  }
}
