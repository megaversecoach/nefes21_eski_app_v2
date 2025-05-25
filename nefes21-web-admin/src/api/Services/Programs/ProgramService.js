import { ApiService } from '../../ServiceLayer/ApiService'
import { Endpoints } from '@/api/URLBuilder/Urls'

const ProgramService = {
  getPublishedPrograms: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProgramEndpoints.getPublishedPrograms
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getDraftedPrograms: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProgramEndpoints.getDraftedPrograms
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getDraftedProgramById: async function (program_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProgramEndpoints.getDraftedProgramById,
        program_id
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  publishProgram: async function (program_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProgramEndpoints.publishProgram,
        undefined,
        { program_id: program_id }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveProgramAsDraft: async function (data, config) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProgramEndpoints.saveProgramAsDraft,
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
  deleteProgramFromDrafts: async function (program_id) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProgramEndpoints.deleteProgramFromDrafts,
        undefined,
        {
          program_id: program_id
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getProgramLayout: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProgramEndpoints.getProgramLayout
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  saveProgramLayout: async function (data) {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProgramEndpoints.saveProgramLayout,
        undefined,
        {
          programLayout: data
        }
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  },
  getProgramLabels: async function () {
    try {
      const response = await ApiService.requestToServer(
        Endpoints.ProgramEndpoints.getProgramLabels
      )
      return response.data
    } catch (err) {
      console.log(err)
    }
  }
}

export { ProgramService }
