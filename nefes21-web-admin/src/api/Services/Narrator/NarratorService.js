import { ApiService } from '../../ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'

const NarratorService = {
  getPublishedNarrators: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentCreatorsEndpoints.Narrators.getPublishedNarrators
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getDraftedNarrators: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentCreatorsEndpoints.Narrators.getDraftedNarrators
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveAsDraft: async function (data, config) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentCreatorsEndpoints.Narrators.saveAsDraft,
        undefined,
        data,
        { 'Content-Type': 'multipart/form-data' },
        config
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  publish: async function (narratorId) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentCreatorsEndpoints.Narrators.publish,
        undefined,
        {
          narrator_id: narratorId
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  delete: async function (narratorId) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentCreatorsEndpoints.Narrators.delete,
        undefined,
        {
          narrator_id: narratorId
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  }
}

export { NarratorService }
