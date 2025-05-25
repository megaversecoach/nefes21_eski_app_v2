import { ApiService } from '../../ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'

const PartService = {
  getPublishedPartsByProgramId: async function (program_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.PartEndpoints.getPublishedPartsByProgramId,
        program_id
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getDraftedPartsByProgramId: async function (program_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.PartEndpoints.getDraftedPartsByProgramId,
        program_id
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  savePartAsDraft: async function (data, config) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.PartEndpoints.savePartAsDraft,
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
  deletePartFromDrafts: async function (part_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.PartEndpoints.deletePartFromDrafts,
        undefined,
        {
          part_id: part_id
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  }
}

export { PartService }
