import { ApiService } from '../../ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'

const LayoutService = {
  getDimensions: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.LayoutEndpoints.DimensionLayout.getDimensions
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getDimensionLayout: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.LayoutEndpoints.DimensionLayout.getDimensionLayout
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getShowcaseTypes: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.LayoutEndpoints.DimensionLayout.getShowcaseType
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getDimensionCategories: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.LayoutEndpoints.DimensionLayout.getDimensionCategories
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveDimensionLayout: async function (data, dimension_id, language) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.LayoutEndpoints.DimensionLayout.save,
        '/' + dimension_id + '?lang=' + language,
        {
          dimension_layouts: data
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveDimensionCategories: async function (data, dimension_id, language) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.LayoutEndpoints.DimensionLayout.saveDimensionCategories,
        '/' + dimension_id + '?lang=' + language,
        {
          categories: data
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getQuickStartCategories: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.LayoutEndpoints.QuickstartLayout.getQuickStartCategories
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getQuickStartLayout: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.LayoutEndpoints.QuickstartLayout.getQuickStartLayout
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  //
  saveQuickStartLayout: async function (data, qs_category_id, language) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.LayoutEndpoints.QuickstartLayout.save,
        '/' + qs_category_id + '?lang=' + language,
        {
          qs_layout: data
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getMoodCheckInLayout: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.LayoutEndpoints.MooCheckInLayout.getMoodCheckInLayout
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveMoodLayout: async function (data, mood_id, language) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.LayoutEndpoints.MooCheckInLayout.save,
        '/' + mood_id + '?lang=' + language,
        {
          mood_checkin_layout: data
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  }
}

export { LayoutService }
