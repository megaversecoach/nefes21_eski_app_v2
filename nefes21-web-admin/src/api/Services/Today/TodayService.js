import { ApiService } from '../../ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'

const TodayService = {
  getStarters: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TodayEndpoints.getStarters
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveStarters: async function (data) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TodayEndpoints.saveStarters,
        undefined,
        {
          starters: data
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getSeriesPool: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TodayEndpoints.getSeriesPool
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveSeriesPool: async function (data, dimension_id, language) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TodayEndpoints.saveSeriesPool,
        '/' + dimension_id + '?lang=' + language,
        {
          series: data
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getNonPersonalizedShowcases: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TodayEndpoints.getNonPersonalizedShowcases
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getPersonalizedShowcasePool: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TodayEndpoints.getPersonalizedShowcasePool
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  savePersonalizedShowcasePool: async function (data, dimension_id, language) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TodayEndpoints.savePersonalizedShowcasePool,
        '/' + dimension_id + '?lang=' + language,
        {
          personalized_showcases: data
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveNonPersonalized: async function (data) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TodayEndpoints.saveNonPersonalized,
        undefined,
        data,
        { 'Content-Type': 'multipart/form-data' }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  deleteNonPersonalized: async function (showcase_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.TodayEndpoints.deleteNonPersonalized,
        undefined,
        {
          showcase_id: showcase_id
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  }
}

export { TodayService }
