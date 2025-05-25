import { ApiService } from '../../ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'

const ContentService = {
  getPublishedContents: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentEndpoints.getPublishedContents
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getDraftedContents: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentEndpoints.getDraftedContents
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getContentTypes: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentEndpoints.getContentTypes
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveAsDraft: async function (data, config) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentEndpoints.saveAsDraft,
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
  delete: async function (content_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentEndpoints.delete,
        undefined,
        { content_id: content_id }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  publish: async function (content_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentEndpoints.publish,
        undefined,
        { content_id: content_id }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getContentById: async function (content_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentEndpoints.getContentById,
        '/' + content_id
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  }
}
export { ContentService }
