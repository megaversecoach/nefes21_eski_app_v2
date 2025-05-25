import { ApiService } from '../../ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'

const AuthorService = {
  getPublishedAuthors: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentCreatorsEndpoints.Authors.getPublishedAuthors
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getDraftedAuthors: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentCreatorsEndpoints.Authors.getDraftedAuthors
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveAsDraft: async function (data, config) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentCreatorsEndpoints.Authors.saveAsDraft,
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
  publish: async function (authorId) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentCreatorsEndpoints.Authors.publish,
        undefined,
        { author_id: authorId }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  delete: async function (authorId) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ContentCreatorsEndpoints.Authors.delete,
        undefined,
        { author_id: authorId }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  }
}

export { AuthorService }
