import { TodayService } from '../../api/Services/Today/TodayService'
import converter from '../../api/Services/Today/converter'

export default {
  getTodayStarters: async function (context) {
    const data = await TodayService.getStarters()
    console.log(data)
    context.commit('loadStarters', {
      starters: data
    })
  },
  getTodaySeriesPool: async function (context) {
    const data = await TodayService.getSeriesPool()
    console.log(data)
    context.commit('loadSeriesPool', {
      seriesPool: data
    })
  },
  getPersonalizedShowcasePool: async function (context) {
    const data = await TodayService.getPersonalizedShowcasePool()
    console.log(data)
    context.commit('loadPersonalizedShowcasePool', {
      personalizedShowcasePool: data
    })
  },
  getNonPersonalizedShowcasePool: async function (context) {
    const data = await TodayService.getNonPersonalizedShowcases()
    console.log(data)
    context.commit('loadNonPersonalizedShowcasePool', {
      nonPersonalizedShowcases: data
    })
  },
  reOrderStarters: function (context, payload) {
    context.commit('reOrderStarters', payload)
  },
  deleteStarterItem: function (context, payload) {
    context.commit('deleteStarterItem', payload)
  },
  addContentToStarters: function (context, payload) {
    context.commit('addContentToStarters', payload)
  },
  saveStarters: async function (_, payload) {
    const data = await TodayService.saveStarters(payload.starters)
    return data.success
  },
  clearFilteredSeriesPool: function (context) {
    context.commit('clearFilteredSeriesPool')
  },
  filterTodaySeriesPool: function (context, payload) {
    context.commit('filterTodaySeriesPool', payload)
  },
  deleteFromTodaySeriesPool: function (context, payload) {
    context.commit('deleteFromTodaySeriesPool', payload)
  },
  addContentToTodaySeriesPool: function (context, payload) {
    context.commit('addContentToTodaySeriesPool', payload)
  },
  saveSeriesPool: async function (context, payload) {
    const language = context.rootGetters.getCurrentLanguage
    const data = await TodayService.saveSeriesPool(
      payload.data,
      payload.dimension_id,
      language
    )
    return data.success
  },

  deleteFromPersonalizedShowcasePool: function (context, payload) {
    context.commit('deleteFromPersonalizedShowcasePool', payload)
  },
  addContentToPersonalizedShowcasePool: function (context, payload) {
    context.commit('addContentToPersonalizedShowcasePool', payload)
  },
  clearFilteredPersonalizedShowcasePool: function (context) {
    context.commit('clearFilteredPersonalizedShowcasePool')
  },
  filterPersonalizedShowcasePool: function (context, payload) {
    context.commit('filterPersonalizedShowcasePool', payload)
  },
  savePersonalizedShowcasePool: async function (context, payload) {
    const language = context.rootGetters.getCurrentLanguage
    const data = await TodayService.savePersonalizedShowcasePool(
      payload.data,
      payload.dimension_id,
      language
    )
    return data.success
  },
  saveNonPersonalized: async function (context, payload) {
    const language = context.rootGetters.getCurrentLanguage
    const sendData = converter.convert(payload, language)
    const data = await TodayService.saveNonPersonalized(sendData)
    return data.success
  },
  deleteNonPersonalized: async function (context, payload) {
    const data = await TodayService.deleteNonPersonalized(payload.showcase_id)
    if (data.success) {
      context.commit('deleteNonPersonalized', payload)
    }
  }
}
